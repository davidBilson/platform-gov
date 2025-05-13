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

interface MessageListProps {
  conversations: Conversation[];
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
  selectedId?: string;
}

export default function MessageList({ conversations, loading, onSelect, selectedId }: MessageListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
  };

  if (loading) {
    return (
      <div className="w-full bg-white h-full rounded-xl shadow-sm flex flex-col">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full bg-white h-full rounded-xl shadow-sm flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">No conversations found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white h-full rounded-xl overflow-hidden shadow-sm flex flex-col">
      {conversations.map((conversation) => {
        const isSelected = conversation.threadId === selectedId;
        
        return (
          <div 
            key={conversation.threadId} 
            className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
              isSelected 
                ? 'bg-blue-50 hover:bg-blue-100' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(conversation)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  conversation.threadId === 'govlink' 
                    ? 'bg-deepskyblue text-white' 
                    : isSelected
                      ? 'bg-blue-100 text-deepskyblue'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className="font-medium text-sm">
                    {conversation.threadId === 'govlink' ? 'GL' : conversation.otherUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                    {conversation.otherUser.name}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                
                {conversation.jobTitle && (
                  <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-deepskyblue' : 'text-gray-600'}`}>
                    {conversation.jobTitle}
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