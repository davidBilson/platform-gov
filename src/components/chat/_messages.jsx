// components/chat/_messages.jsx
"use client"
import React, { useEffect, useState, useRef } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import ProfilePicture from '@/components/profile/profilePicture';
import axios from 'axios';
import { io } from 'socket.io-client';
import { fetchProfilePicture } from '../../api/profile-api';
import { encryptMessage, decryptMessage } from '@/lib/crypto';

const Messages = ({ jobId, proposalId, currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUserPfp, setCurrentUserPfp] = useState(null);
  const [otherUserPfp, setOtherUserPfp] = useState(null);
  const threadId = `${jobId}-${proposalId}`;

  useEffect(() => {
    if (!currentUser?._id || !otherUser?._id) return;
    const abortController = new AbortController();
    const fetchProfilePictures = async () => {
      try {
        const [currentUserPfp, otherUserPfp] = await Promise.all([
          fetchProfilePicture(currentUser._id),
          fetchProfilePicture(otherUser._id)
        ]);
        if (!abortController.signal.aborted) {
          setCurrentUserPfp(currentUserPfp);
          setOtherUserPfp(otherUserPfp);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching profile pictures:', error);
        }
      }
    };
    fetchProfilePictures();
  
    return () => {
      abortController.abort();
    };
  }, [currentUser?._id, otherUser?._id]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        userId: currentUser._id
      }
    });
  
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !jobId || !proposalId) return;

    const loadMessages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/job/${jobId}/proposal/${proposalId}/messages`
        );
        
        // Decrypt all messages
        const decryptedMessages = await Promise.all(
          data.map(async (message) => {
            // Check if message is encrypted (has encryptedContent and iv fields)
            if (message.encryptedContent && message.iv) {
              try {
                const decryptedContent = await decryptMessage(
                  threadId,
                  message.encryptedContent,
                  message.iv
                );
                return { ...message, content: decryptedContent };
              } catch (error) {
                console.error('Failed to decrypt message:', error);
                return { ...message, content: '[Encrypted message]' };
              }
            }
            return message; // Return as-is if not encrypted
          })
        );
        
        setMessages(decryptedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    socket.emit('join-chat-room', threadId);
    loadMessages();

    socket.on('receive-message', async (message) => {
      // Decrypt incoming message if it's encrypted
      if (message.encryptedContent && message.iv) {
        try {
          const decryptedContent = await decryptMessage(
            threadId,
            message.encryptedContent,
            message.iv
          );
          message = { ...message, content: decryptedContent };
        } catch (error) {
          console.error('Failed to decrypt incoming message:', error);
          message = { ...message, content: '[Encrypted message]' };
        }
      }
      
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket, jobId, proposalId, threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageSent = (message) => {
      // Update parent component's conversations list via socket
      socket.emit('message-sent', {
        ...message,
        threadId: `${jobId}-${proposalId}`,
        sender: { _id: currentUser._id },
        recipient: { _id: otherUser._id }
      });
    };

    socket.on('message-sent', handleMessageSent);

    return () => {
      socket.off('message-sent', handleMessageSent);
    };
  }, [socket, jobId, proposalId, currentUser._id, otherUser._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Encrypt the message content
      const { ciphertext, iv } = await encryptMessage(threadId, newMessage);

      const messageData = {
        senderId: currentUser._id,
        recipientId: otherUser._id,
        content: newMessage, // Original message for client rendering
        encryptedContent: ciphertext, // Encrypted content for storage
        iv: iv // Initialization vector for decryption
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/job/${jobId}/proposal/${proposalId}/messages`,
        messageData,
        { withCredentials: true }
      );
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    // Check if the message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if the message is from yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Return formatted date (May 15, 2025)
    return messageDate.toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <section className='p-4 md:p-10 border border-lightblue rounded-lg flex flex-col justify-between h-[calc(100vh-300px)]'>
      <section className='flex flex-col space-y-4 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="w-full">
            <div className="flex justify-center my-4 ">
              <div className="bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-xs">
                {date}
              </div>
            </div>
            
            {dateMessages.map((message) => (
              <div 
                key={message._id} 
                className={`w-full   flex flex-col relative mb-4 ${message.sender._id === currentUser._id ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div className={message.sender._id === currentUser._id ? 'self-end' : 'self-start'}>
                  <ProfilePicture 
                    source={message.sender._id === currentUser._id ? currentUserPfp : message.sender._id === otherUser._id ? otherUserPfp : ""} 
                    alt={message.sender.name} 
                    dimension={40}
                  />
                </div>
                <div className={`w-fit ${message.sender._id === currentUser._id ? 'pr-10 pt-1.5' : 'pl-10 pt-1.5'}`}>
                  <p className={`p-5 rounded-3xl text-sm ${message.sender._id === currentUser._id ? 'bg-skyblue' : 'bg-lightgray'}`}>
                    {message.content}
                  </p>
                  <span className={`text-xs text-gray-500 mt-1 block ${message.sender._id === currentUser._id ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      <form onSubmit={handleSendMessage} className='mt-2 flex items-center justify-between gap-2 border border-lightblue rounded-lg px-5 pb-1.25'>
        <textarea
          name="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className='w-full pt-3.75 text-boldblue text-sm placeholder:text-boldblue resize-none outline-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        />
        <button type="submit" className='w-fit h-fit'>
          <IoSendSharp className='text-boldblue cursor-pointer text-lg md:text-xl' />
        </button>
      </form>
    </section>
  );
};

export default Messages;