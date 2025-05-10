"use client"
import React, { useEffect, useState, useRef } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import ProfilePicture from '@/components/profile/profilePicture';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messages = ({ hiringId, currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        userId: currentUser._id
      }
    });
  
    // Debug listeners
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join chat room and fetch messages
  useEffect(() => {
    if (!socket || !hiringId) return;

    const loadMessages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/hiring/${hiringId}/messages`
        );
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
        console.log('Attempted URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/hiring/${hiringId}/messages`);
      }
    };

    socket.emit('join-hiring-chat', hiringId);
    loadMessages();

    // Listen for new messages from WebSocket
    socket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket, hiringId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUser._id,
      recipientId: otherUser._id,
      content: newMessage
    };

    console.log('Sending message:', messageData);

    try {
      // Send via HTTP POST
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/hiring/${hiringId}/messages`,
        messageData,
        { withCredentials: true }
      );
      
      console.log('Message sent successfully:', response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (show user feedback)
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className='p-4 md:p-10 border border-lightblue rounded-lg flex flex-col justify-between h-[calc(100vh-300px)]'>
      <section className='flex flex-col space-y-4 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`w-full md:w-4/7 flex flex-col relative ${message.sender._id === currentUser._id ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={message.sender._id === currentUser._id ? 'self-end' : 'self-start'}>
              <ProfilePicture 
                source={message.sender.profilePicture ?? ""} 
                alt={message.sender.name} 
                dimension={60} 
                iconType='user' 
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
        <div ref={messagesEndRef} />
      </section>

      <form onSubmit={handleSendMessage} className='mt-2 flex items-center justify-between gap-2 border border-lightblue rounded-lg px-5 pb-1.25'>
        <textarea
          name="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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