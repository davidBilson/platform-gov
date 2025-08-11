export interface Conversation {
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