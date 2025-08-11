// components/Milestones/DisputeModal.tsx
import React, { useState } from 'react';

interface DisputeModalProps {
  milestone: {
    name: string;
    status: string;
  };
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DisputeModal = ({ milestone, onClose, onSubmit }: DisputeModalProps) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Please enter a reason for disputing this milestone');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='bg-white rounded-lg p-7.5 w-full max-w-108.5 flex flex-col items-start gap-7.5'>
      <h2 className='font-semibold text-xl'>Dispute Milestone</h2>
      <p className="text-sm">You are disputing milestone: <strong>{milestone.name}</strong></p>
      <p className="text-sm">Current status: <span className="capitalize">{milestone.status}</span></p>
      
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Please explain why you're disputing this milestone..."
        className='w-full py-3.5 px-5 text-boldblue resize-none border border-boldblue focus:outline focus:outline-boldblue rounded-md min-h-[150px]'
      />
      
      <div className='flex items-center justify-center gap-2.5 w-full'>
        <button 
          className='transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer bg-white border border-boldblue rounded-lg px-5 py-2.75 text-sm text-boldblue font-semibold' 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          className='transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer bg-red-500 border border-red-500 rounded-lg px-5 py-2.75 text-sm text-white font-semibold' 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
        </button>
      </div>
    </section>
  );
};

export default DisputeModal;