import useAuthStore from '@/store/useAuth';
import React from 'react';
// import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

interface ProposalModalProps {
  jobId: string;

  onClose: () => void;
}

const SignContractModal = ({ jobId, onClose }: ProposalModalProps) => {

  const { userId } = useAuthStore();

    console.log('jobId', jobId);
    console.log('userId', userId);

   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <section 
      className='fixed top-0 left-0 w-full h-screen p-6 flex items-center justify-center bg-black/50 bg-opacity-50 z-50'
      onClick={handleBackdropClick}
    >

      <div className='p-6 rounded-lg bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative'>
        <button 
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700' 
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
      </div>

    </section>
  );
};

export default SignContractModal;