// components/chat/_search.tsx
import { useState } from 'react';
import SearchInput from './_searchInput';
import { Search } from 'lucide-react';

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

interface SearchMessagesProps {
  conversations: Conversation[];
  onSearchResults?: (filteredConversations: Conversation[]) => void;
}

const SearchMessages = ({ conversations, onSearchResults }: SearchMessagesProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      onSearchResults?.(conversations);
      return;
    }

    const filtered = conversations.filter(conv => {
      // Skip GovLink in search results if not matching
      if (conv.threadId === 'govlink') {
        return conv.otherUser.name.toLowerCase().includes(query.toLowerCase());
      }

      return (
        conv.otherUser.name.toLowerCase().includes(query.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(query.toLowerCase()) ||
        (conv.jobTitle && conv.jobTitle.toLowerCase().includes(query.toLowerCase()))
      );
    });

    onSearchResults?.(filtered);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Search messages or users..."
        />
      </div>
      
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <Search size={14} /> 
          <span>{`Found ${conversations.length} result${conversations.length !== 1 ? 's' : ''}`}</span>
        </div>
      )}
    </div>
  );
};

export default SearchMessages;