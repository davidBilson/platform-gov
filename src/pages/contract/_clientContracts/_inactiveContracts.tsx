import Link from 'next/link';
import React, { useState } from 'react';
// import { format } from 'date-fns';
// import RatingStars from '@/components/ui/rating';
import RateUserModal from '../../../components/ui/rateUserModal';
import StatusTag from '@/components/ui/statusTag';

// interface ActiveProposalsProps {
//   applications: Application[];
// }

const InactiveContract
// React.FC<ActiveProposalsProps> 
= (
  // { applications = [] }
) => {

  const [showRateUserModal, setShowRateUserModal] = useState(false);

  const handleClose = () => {
    setShowRateUserModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // const truncateDescription = (text: string | undefined, maxLength = 200): string => {
  //   if (!text) return '';
  //   if (text.length <= maxLength) return text;
  //   return text.slice(0, maxLength) + '...';
  // };

  // const formatDate = (dateString: string): string => {
  //   try {
  //     return format(new Date(dateString), 'MM/dd/yyyy');
  //   } catch (error) {
  //     console.log(error)
  //     return 'Invalid date';
  //   }
  // };

  // const openProposalModal = (proposal: Application): void => {
  //   setSelectedProposal(proposal);
  // };



  return (
    <>
    <section className='pb-5 mb-12.5'>

      <h2 className='pb-5 mb-7.5 text-darkgray text-xl font-bold'>Inactive Contracts</h2>
      
      <section className='flex flex-col gap-12.5'>
        {
          Array(3).fill(null).map((_, index) => (
            <article key={index} className='flex flex-wrap md:justify-between gap-5 items-start pb-10 border-b border-b-lightblue'>
              <section className='flex flex-col items-start gap-3.75'>
                  <p className='text-xs text-boldblue font-semibold'>
                    {'10/3/2024'} - {'Present'}
                  </p>
                  <h3 className="text-xl font-semibold">
                    {/* {typeof application.jobId === 'object' ? application.jobId.jobTitle : "Job Title"} */}
                    Job Title
                  </h3>
                  <Link  href={''} className="font-semibold text-sm hover:underline">
                    Contractor Name
                  </Link>
                  <StatusTag status="inactive" />
              </section>
            </article>
          ))
        }
      </section>
      
    </section>

    {showRateUserModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <RateUserModal onClose={handleClose} userToRate={"Contractor"} />
      </div>
    )}

    </>
  );
};

export default InactiveContract;