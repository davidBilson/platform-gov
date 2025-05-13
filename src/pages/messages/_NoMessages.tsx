import React from 'react';

const NoMessages = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-10 h-10 text-deepskyblue"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">No conversation selected</h2>
      <p className="text-gray-500 text-center max-w-xs">
        Select a conversation from the list or start a new one to begin messaging.
      </p>
    </div>
  );
};

export default NoMessages;