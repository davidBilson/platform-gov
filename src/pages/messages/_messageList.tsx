import { useState, useEffect, useRef } from "react";
import { fetchProfilePicture } from "@/api/profile-api";
import ProfilePicture from "@/components/profile/profilePicture";

interface UnifiedConversation {
  userId: string;
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: {
    content: string;
    isCurrentUser: boolean;
    createdAt: string;
    jobTitle?: string;
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

interface MessageListProps {
  conversations: UnifiedConversation[];
  loading: boolean;
  onSelect: (conversation: UnifiedConversation) => void;
  selectedId?: string;
}

export default function MessageList({ conversations, loading, onSelect, selectedId }: MessageListProps) {
  const [profilePictures, setProfilePictures] = useState<Record<string, string>>({});
  const processedUserIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (conversations.length === 0) return;
    
    const loadProfilePictures = async () => {
      const newProfilePictures: Record<string, string> = {};
      
      const userIdsToLoad = conversations
        .filter(conv => conv.userId !== 'govlink') // Skip govlink
        .map(conv => conv.otherUser.id)
        .filter(userId => !processedUserIds.current.has(userId));
      
      if (userIdsToLoad.length === 0) return;
      
      for (const userId of userIdsToLoad) {
        processedUserIds.current.add(userId);
        
        try {
          const pfp = await fetchProfilePicture(userId);
          if (pfp) {
            newProfilePictures[userId] = pfp;
          }
        } catch (error) {
          console.error(`Failed to fetch profile picture for ${userId}:`, error);
        }
      }
      
      if (Object.keys(newProfilePictures).length > 0) {
        setProfilePictures(prev => ({...prev, ...newProfilePictures}));
      }
    };
    
    loadProfilePictures();
  }, [conversations]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
  };

  if (loading) {
    return (
      <div className="w-full bg-white h-full rounded-xl shadow-sm flex flex-col">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border-b border-deepskyblue animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-deepskyblue rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-deepskyblue rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full h-full rounded-xl shadow-sm flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">No conversations found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white h-full rounded-xl overflow-hidden shadow-sm flex flex-col">
      {conversations.map((conversation) => {
        const isSelected = conversation.userId === selectedId;
        const userId = conversation.otherUser.id;
        const profilePicture = profilePictures[userId];
        
        return (
          <div 
            key={conversation.userId} 
            className={`px-4 py-3 border-b border-deepskyblue cursor-pointer transition-colors duration-150 ${
              isSelected 
                ? 'bg-blue-50 hover:bg-blue-100' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(conversation)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  conversation.userId === 'govlink' 
                    ? 'bg-deepskyblue text-white' 
                    : isSelected
                      ? 'bg-blue-100 text-deepskyblue'
                      : 'bg-deepskyblue text-gray-600'
                }`}>
                  {conversation.userId === 'govlink' ? (
                    <span className="font-medium text-sm">GL</span>
                  ) : (
                    <ProfilePicture 
                      source={profilePicture || ''} 
                      alt={conversation.otherUser.name} 
                      dimension={40} 
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                    {conversation.otherUser.name}
                  </h4>

                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {conversation.userId !== 'govlink' && formatTime(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                
                {/* Show job context for unified conversations */}
                {conversation.lastMessage.jobTitle && (
                  <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-deepskyblue' : 'text-gray-600'}`}>
                    {conversation.lastMessage.jobTitle}
                    {conversation.jobThreads.length > 1 && (
                      <span className="ml-1 text-gray-400">
                        (+{conversation.jobThreads.length - 1} more)
                      </span>
                    )}
                  </p>
                )}
                
                <p className={`text-xs truncate mt-1 ${
                  isSelected 
                    ? 'text-blue-500' 
                    : 'text-gray-500'
                }`}>
                  {conversation.lastMessage.isCurrentUser && (
                    <span className="font-medium">You: </span>
                  )}
                  {conversation.lastMessage.content}
                </p>
              </div>
              
              {conversation.unreadCount > 0 && (
                <div className="ml-1 flex-shrink-0">
                  <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {conversation.unreadCount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}