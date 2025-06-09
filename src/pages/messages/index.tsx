// pages/messages/index.tsx
import { useState, useEffect } from 'react';
import SearchMessages from './_search';
import MessageList from './_messageList';
import NoMessages from './_NoMessages';
import Messages from '@/components/chat/_messages';
import useAuthStore from '@/store/useAuth';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { truncateDescription } from '@/utils/truncateDescription';

interface Conversation {
  threadId: string;
  jobId?: string;
  jobTitle?: string;
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: {
    content: string;
    isCurrentUser: boolean;
    createdAt: string;
  };
  unreadCount: number;
}

interface UnifiedConversation {
  userId: string; // The other user's ID - used as unified identifier
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: {
    content: string;
    isCurrentUser: boolean;
    createdAt: string;
    jobTitle?: string; // Include job context in last message
  };
  unreadCount: number;
  jobThreads: Array<{
    threadId: string;
    jobId: string;
    jobTitle: string;
    lastMessage: {
      content: string;
      isCurrentUser: boolean;
      createdAt: string;
    };
    unreadCount: number;
  }>;
}

export default function ChatIndex() {
  const { userId, name } = useAuthStore();
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [, setUnifiedConversations] = useState<UnifiedConversation[]>([]);
  const [displayedConversations, setDisplayedConversations] = useState<UnifiedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [selectedJobThread, setSelectedJobThread] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Function to unify conversations by user
  const unifyConversations = (conversations: Conversation[]): UnifiedConversation[] => {
    const userConversations = new Map<string, UnifiedConversation>();

    conversations.forEach(conv => {
      // Skip the special govlink conversation
      if (conv.threadId === 'govlink') {
        return;
      }

      const userId = conv.otherUser.id;
      
      if (!userConversations.has(userId)) {
        // Create new unified conversation
        userConversations.set(userId, {
          userId,
          otherUser: conv.otherUser,
          lastMessage: {
            ...conv.lastMessage,
            jobTitle: conv.jobTitle
          },
          unreadCount: conv.unreadCount,
          jobThreads: [{
            threadId: conv.threadId,
            jobId: conv.jobId!,
            jobTitle: conv.jobTitle!,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount
          }]
        });
      } else {
        // Update existing unified conversation
        const existing = userConversations.get(userId)!;
        
        // Add this job thread to the list
        existing.jobThreads.push({
          threadId: conv.threadId,
          jobId: conv.jobId!,
          jobTitle: conv.jobTitle!,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount
        });

        // Update overall unread count
        existing.unreadCount += conv.unreadCount;

        // Update last message if this conversation is more recent
        if (new Date(conv.lastMessage.createdAt) > new Date(existing.lastMessage.createdAt)) {
          existing.lastMessage = {
            ...conv.lastMessage,
            jobTitle: conv.jobTitle
          };
        }
      }
    });

    // Convert map to array and sort by most recent message
    const unified = Array.from(userConversations.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    // Add govlink conversation at the top if it exists
    const govlinkConv = conversations.find(conv => conv.threadId === 'govlink');
    if (govlinkConv) {
      unified.unshift({
        userId: 'govlink',
        otherUser: govlinkConv.otherUser,
        lastMessage: govlinkConv.lastMessage,
        unreadCount: govlinkConv.unreadCount,
        jobThreads: []
      });
    }

    return unified;
  };

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        userId
      }
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
  
    const handleConversationUpdate = (data: {
      threadId: string;
      message: {
        content: string;
        createdAt: string;
      };
      isCurrentUser: boolean;
      unreadCount?: number;
    }) => {
      setAllConversations(prevConversations => {
        const existingConvIndex = prevConversations.findIndex(
          conv => conv.threadId === data.threadId
        );
  
        if (existingConvIndex >= 0) {
          const updatedConversations = [...prevConversations];
          const existingConv = updatedConversations[existingConvIndex];
          
          const shouldIncrementUnread = 
            !data.isCurrentUser && 
            selectedJobThread !== data.threadId;
  
          updatedConversations[existingConvIndex] = {
            ...existingConv,
            lastMessage: {
              content: data.message.content,
              isCurrentUser: data.isCurrentUser,
              createdAt: data.message.createdAt
            },
            unreadCount: shouldIncrementUnread
              ? (existingConv.unreadCount || 0) + (data.unreadCount || 1)
              : existingConv.unreadCount
          };
  
          updatedConversations.sort((a, b) => 
            new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
          );
  
          return updatedConversations;
        }
  
        return prevConversations;
      });
    };
  
    socket.on('receive-message', handleConversationUpdate);
    socket.on('conversation-update', handleConversationUpdate);
  
    return () => {
      socket.off('receive-message', handleConversationUpdate);
      socket.off('conversation-update', handleConversationUpdate);
    };
  }, [socket, userId, selectedJobThread]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL
        const endpoint = process.env.NEXT_PUBLIC_FETCH_CONVERSATIONS?.replace(':id', userId)
        const { data } = await axios.get(`${baseURL}${endpoint}`);
        setAllConversations(data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchConversations();
    
    // Handle responsive layout
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      setShowSidebar(!mobile || !selectedConversation);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId]);

  // Update unified conversations when allConversations changes
  useEffect(() => {
    const unified = unifyConversations(allConversations);
    setUnifiedConversations(unified);
    setDisplayedConversations(unified);
  }, [allConversations]);

  useEffect(() => {
    if (isMobileView) {
      setShowSidebar(!selectedConversation);
    }
  }, [selectedConversation, isMobileView]);
  
  const handleSearchResults = (filteredConversations: Conversation[]) => {
    const unified = unifyConversations(filteredConversations);
    setDisplayedConversations(unified);
  };

  const handleSelectConversation = async (conversation: UnifiedConversation) => {
    setSelectedConversation(conversation);
    
    // For govlink, no specific thread selection needed
    if (conversation.userId === 'govlink') {
      setSelectedJobThread('govlink');
      if (isMobileView) {
        setShowSidebar(false);
      }
      return;
    }

    // For unified conversations, select the most recent job thread by default
    const mostRecentThread = conversation.jobThreads
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())[0];
    
    setSelectedJobThread(mostRecentThread.threadId);
    
    if (isMobileView) {
      setShowSidebar(false);
    }
    
    // Mark messages as read for the selected thread
    if (mostRecentThread.unreadCount > 0) {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endpoint = process.env.NEXT_PUBLIC_MARK_MESSAGES_READ
          ?.replace(':threadId', mostRecentThread.threadId)
          ?.replace(':userId', userId);
          
        await axios.put(`${baseURL}${endpoint}`);
        
        // Update conversations to reflect read status
        setAllConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.threadId === mostRecentThread.threadId 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleJobThreadSelect = (threadId: string) => {
    setSelectedJobThread(threadId);
    
    // Mark messages as read for the newly selected thread
    const threadConversation = allConversations.find(conv => conv.threadId === threadId);
    if (threadConversation && threadConversation.unreadCount > 0) {
      const markAsRead = async () => {
        try {
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
          const endpoint = process.env.NEXT_PUBLIC_MARK_MESSAGES_READ
            ?.replace(':threadId', threadId)
            ?.replace(':userId', userId);
            
          await axios.put(`${baseURL}${endpoint}`);
          
          setAllConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.threadId === threadId 
                ? { ...conv, unreadCount: 0 }
                : conv
            )
          );
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };
      markAsRead();
    }
  };
  
  const handleBackToList = () => {
    if (isMobileView) {
      setSelectedConversation(null);
      setSelectedJobThread(null);
      setShowSidebar(true);
    }
  };

  const getSelectedThreadDetails = () => {
    if (!selectedJobThread || selectedJobThread === 'govlink') return null;
    
    const conversation = allConversations.find(conv => conv.threadId === selectedJobThread);
    if (!conversation) return null;
    
    return {
      jobId: conversation.jobId,
      proposalId: selectedJobThread.split('-')[1],
      otherUser: conversation.otherUser
    };
  };

  const selectedThreadDetails = getSelectedThreadDetails();

  return (
    <main className="container mx-auto p-4 md:p-6 h-[calc(100vh-112px)] flex flex-col">
      <section className="mb-4 md:mb-5 w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl text-deepskyblue font-bold">Messages</h1>
          {isMobileView && selectedConversation && (
            <button 
              onClick={handleBackToList}
              className="text-deepskyblue flex items-center text-sm font-medium"
            >
              &larr; All conversations
            </button>
          )}
        </div>
        
        {(showSidebar || !isMobileView) && (
          <SearchMessages 
            conversations={allConversations} 
            onSearchResults={handleSearchResults}
          />
        )}
      </section>

      <section className="flex flex-1 gap-4 overflow-hidden h-full">
        {(showSidebar || !isMobileView) && (
          <div className="w-full md:w-80 flex-shrink-0 h-full">
            <MessageList 
              conversations={displayedConversations} 
              loading={loading}
              onSelect={handleSelectConversation}
              selectedId={selectedConversation?.userId}
            />
          </div>
        )}
        
        {(!isMobileView || !showSidebar) && (
          <div className="flex-1 h-full flex flex-col">
            {/* Job Thread Selector - Show when user has multiple job threads */}
            {selectedConversation && selectedConversation.jobThreads.length > 1 && (
              <div className="mb-4 rounded-lg">
                <p className="text-xs text-boldblue mb-2">Select a job conversation:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.jobThreads.map(thread => (
                    <button
                      key={thread.threadId}
                      onClick={() => handleJobThreadSelect(thread.threadId)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-[10px] border transition-colors ${
                        selectedJobThread === thread.threadId
                          ? 'bg-deepskyblue text-white border-deepskyblue'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-deepskyblue'
                      }`}
                    >
                      {truncateDescription(thread.jobTitle, 22)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedConversation && selectedConversation.userId === "govlink" ? (
              <div className='flex flex-col justify-center items-center h-full'>
                <h2 className='font-bold text-lightblue mb-7.5'>Private Messaging Policy</h2>
                <p className='p-6 bg-skyblue/50 rounded-lg text-mediumgray w-full max-w-150 text-sm'>To ensure safety and compliance, all communication between clients and consultants must occur within {"GovLink's"} platform until a contract is established. Sharing personal contact information (such as email addresses, phone numbers, or social media handles) before a contract begins is prohibited and may result in account restrictions. Once a contract is active, exchanging contact details is permitted within the contract workroom for necessary business purposes.</p>
              </div>
            ) : selectedConversation && selectedThreadDetails ? (
              <Messages
                jobId={selectedThreadDetails.jobId}
                proposalId={selectedThreadDetails.proposalId}
                currentUser={{
                  _id: userId,
                  name: name,
                }}
                otherUser={{
                  _id: selectedThreadDetails.otherUser.id,
                  name: selectedThreadDetails.otherUser.name,
                }}
              />
            ) : (
              <NoMessages />
            )}
          </div>
        )}
      </section>
    </main>
  );
}