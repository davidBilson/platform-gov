// pages/chat/index.tsx
import { useState, useEffect } from 'react';
import SearchMessages from './_search';
import MessageList from './_messageList';
import NoMessages from './_NoMessages';
import Messages from '@/components/chat/_messages';
import useAuthStore from '@/store/useAuth';
import axios from 'axios';

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

export default function ChatIndex() {
  const { userId, name } = useAuthStore();
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [displayedConversations, setDisplayedConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL
        const endpoint = process.env.NEXT_PUBLIC_FETCH_CONVERSATIONS?.replace(':id', userId)
        const { data } = await axios.get(`${baseURL}${endpoint}`);
        setAllConversations(data.conversations);
        setDisplayedConversations(data.conversations);
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

  useEffect(() => {
    if (isMobileView) {
      setShowSidebar(!selectedConversation);
    }
  }, [selectedConversation, isMobileView]);
  
  const handleSearchResults = (filteredConversations: Conversation[]) => {
    setDisplayedConversations(filteredConversations);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobileView) {
      setShowSidebar(false);
    }
  };
  
  const handleBackToList = () => {
    if (isMobileView) {
      setSelectedConversation(null);
      setShowSidebar(true);
    }
  };

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
              selectedId={selectedConversation?.threadId}
            />
          </div>
        )}
        
        {(!isMobileView || !showSidebar) && (
          <div className="flex-1 h-full">
            {selectedConversation && selectedConversation.threadId == "govlink" ? (
              <div className='flex flex-col justify-center items-center h-full'>
                <h2 className='font-bold text-lightblue mb-7.5'>Private Messaging Policy</h2>
                <p className='p-6 bg-skyblue/50 rounded-lg text-mediumgray w-full max-w-150 text-sm'>To ensure safety and compliance, all communication between clients and consultants must occur within {"GovLink's"} platform until a contract is established. Sharing personal contact information (such as email addresses, phone numbers, or social media handles) before a contract begins is prohibited and may result in account restrictions. Once a contract is active, exchanging contact details is permitted within the contract workroom for necessary business purposes.</p>
              </div>
            ) : selectedConversation  ? (
              <Messages
                jobId={selectedConversation.jobId}
                proposalId={selectedConversation.threadId.split('-')[1]} // Extract proposalId from threadId
                currentUser={{
                  _id: userId,
                  name: name,
                }}
                otherUser={{
                  _id: selectedConversation.otherUser.id,
                  name: selectedConversation.otherUser.name,
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