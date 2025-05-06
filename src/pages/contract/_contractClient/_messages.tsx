
import ProfilePicture from '@/components/ui/profilePicture';
import React from 'react';
import { IoSendSharp } from 'react-icons/io5';

// Mock message data
const mockMessages = [
  {
    id: 1,
    text: "Hey there! How are you doing today?",
    sender: 'recipient',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    text: "I'm doing great! Just working on some projects. How about you?",
    sender: 'sender',
    timestamp: '10:32 AM'
  },
  {
    id: 3,
    text: "Pretty good! Just finished my morning coffee. Are we still meeting later?",
    sender: 'recipient',
    timestamp: '10:33 AM'
  },
  {
    id: 4,
    text: "Yes, absolutely! 2pm at the usual cafe works for me. Yes, absolutely! 2pm at the usual cafe works for me. Yes, absolutely! 2pm at the usual cafe works for me.",
    sender: 'sender',
    timestamp: '10:35 AM'
  },
  {
    id: 5,
    text: "Perfect! I'll see you then. Don't forget to bring those documents we talked about.",
    sender: 'recipient',
    timestamp: '10:36 AM'
  },
  {
    id: 6,
    text: "Already packed them in my bag. Looking forward to it!",
    sender: 'sender',
    timestamp: '10:38 AM'
  },
  {
    id: 7,
    text: "Already packed them in my bag. Looking forward to it!",
    sender: 'sender',
    timestamp: '10:38 AM'
  },
  {
    id: 8,
    text: "Already packed them in my bag. Looking forward to it!",
    sender: 'sender',
    timestamp: '10:38 AM'
  }
];

const Messages = () => {
  return (
    <section className='p-4 md:p-10 border border-lightblue rounded-lg flex flex-col justify-between h-[600px]'>
      <section className='flex flex-col space-y-4 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {mockMessages.map((message) => (
          <div 
            key={message.id} 
            className={`w-full md:w-4/7 flex flex-col relative ${message.sender === 'sender' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={message.sender === 'sender' ? 'self-end' : 'self-start'}>
              <ProfilePicture source="" alt="" dimension={60} iconType='user' />
            </div>
            <div className={`w-fit ${message.sender === 'sender' ? 'pr-10 pt-1.5' : 'pl-10 pt-1.5'}`}>
              <p className={`p-5 rounded-3xl text-sm ${message.sender === 'sender' ? 'bg-skyblue' : 'bg-lightgray'}`}>
                {message.text}
              </p>
              <span className={`text-xs text-gray-500 mt-1 block ${message.sender === 'sender' ? 'text-right' : 'text-left'}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className='mt-2 flex items-center justify-between border border-lightblue rounded-lg px-5 pb-1.25'>
        <textarea
          name="message"
          placeholder="Type your message here..."
          className='w-full pt-3.75 text-boldblue text-sm placeholder:text-boldblue resize-none outline-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        />
        <button className='w-fit h-fit'>
          <IoSendSharp className='text-boldblue cursor-pointer text-lg md:text-xl' />
        </button>
      </section>
    </section>
  )
}

export default Messages;