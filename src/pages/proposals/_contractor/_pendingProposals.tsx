import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { format } from 'date-fns';
import ProposalModal from './_proposalModal';
import { Application } from '@/types/proposals';

interface PendingProposalsProps {
  applications: Application[];
}

const PendingProposals = ({ applications = [] }: PendingProposalsProps) => {
  const [selectedProposal, setSelectedProposal] = useState<Application | null>(null);

  const truncateDescription = (text: string | undefined, maxLength = 200): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (error) {
      console.log(error)
      return 'Invalid date';
    }
  };

  const openProposalModal = (proposal: Application): void => {
    setSelectedProposal(proposal);
  };

  const closeProposalModal = (): void => {
    setSelectedProposal(null);
  };

  return (
    <section className='w-full max-w-275 m-auto border-b border-b-skyblue pb-10 mb-7.5'>
      <h2 className='pb-5 mb-7.5 text-darkgray border-b border-b-deepskyblue'>Pending Proposals</h2>
      
      <section className='flex flex-col gap-7.5'>
      {applications.length === 0 ? (
        <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
          <p className="text-center text-gray-600">No pending proposals</p>
        </section>
      ) : (
        applications.map((application) => (
          <article key={application?._id}>
            <p className='text-xs text-boldblue font-semibold mb-5'>
              Applied {formatDate(application?.createdAt)}
            </p>
            
            <div className='mb-3.75 flex items-start justify-between gap-1'>
              <h3 className="text-xl font-semibold">
                {typeof application?.jobId === 'object' ? application?.jobId.jobTitle : "Job Title"}
              </h3>
              <small
                className={`text-[10px] text-white font-bold px-2 py-1 rounded-full ${
                  application?.status === 'pending'
                    ? 'bg-gray-400'
                    : application?.status === 'viewed'
                    ? 'bg-deepskyblue'
                    : application?.status === 'active'
                    ? 'bg-aquagreen'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {application?.status.charAt(0).toUpperCase() + application?.status?.slice(1)}
              </small>
            </div>
            
            <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
              <div className="flex items-center gap-1.25">
                {`Proposed Rate: $${application?.proposedRate}`} | Availability: {application?.availability || "Full Time"}
              </div>
              
              <div className="flex items-center gap-1.25">
                <FaLocationDot size={15} />
                {typeof application?.jobId === 'object' ? application?.jobId?.location : "Remote"}
              </div>
            </div>

            <p className="text-gray-600 mb-3.75">
              {truncateDescription(typeof application?.jobId === 'object' ? application?.jobId?.description : "No description provided")}
            </p>

            <div className='flex items-center flex-wrap gap-2.5 mb-3.75'>
              <button 
                onClick={() => openProposalModal(application)}
                className='text-boldblue border border-boldblue rounded-lg py-2.5 px-5 transition transform active:scale-95 hover:bg-boldblue hover:text-white duration-300 ease-in-out cursor-pointer'
              >
                View proposal
              </button>
             
            </div>

            <div className="flex items-center gap-5">
              <div className="w-8.75 h-8.75 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                <img 
                  src={typeof application?.jobId === 'object' ? application?.jobId?.clientLogo : ""} 
                  alt={typeof application?.jobId === 'object' ? application?.jobId?.clientName : "Client"} 
                  width={35} 
                  height={35} 
                  className="rounded-full" 
                />
              </div>
              <Link 
                href={''}
                className="font-semibold text-sm hover:underline">
                {typeof application?.jobId === 'object' ? application?.jobId?.clientName : "Client"}
              </Link>
            </div>
          </article>
        ))
      )}
      </section>
      
      {selectedProposal && (
        <ProposalModal 
          proposal={selectedProposal} 
          onClose={closeProposalModal} 
        />
      )}
    </section>
  );
};

export default PendingProposals;