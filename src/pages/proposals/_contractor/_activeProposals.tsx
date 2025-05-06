import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { format } from 'date-fns';
import ProposalModal from './_proposalModal';
import { Application } from '@/types/proposals';

interface ActiveProposalsProps {
  applications: Application[];
}

const ActiveProposals: React.FC<ActiveProposalsProps> = ({ applications = [] }) => {
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
      <h2 className='pb-5 mb-7.5 text-darkgray border-b border-b-deepskyblue'>Active Proposals</h2>
      
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No active proposals</p>
      ) : (
        applications.map((application) => (
          <article key={application._id} className="">
            <p className='text-xs text-boldblue font-semibold mb-5'>
              Applied {formatDate(application.createdAt)}
            </p>
            
            <h3 className="text-xl font-semibold mb-3.75">
              {typeof application.jobId === 'object' ? application.jobId.jobTitle : "Job Title"}
            </h3>
            
            <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
              <div className="flex items-center gap-1.25">
                <FaRegHourglass size={15} />
                {`Hourly | $${application.proposedRate}`} | {application.availability || "Full Time"}
              </div>
              
              <div className="flex items-center gap-1.25">
                <FaLocationDot size={15} />
                {typeof application.jobId === 'object' ? application.jobId.location : "Remote"}
              </div>
            </div>

            <p className="text-gray-600 mb-3.75">
              {truncateDescription(typeof application.jobId === 'object' ? application.jobId.description : "No description provided")}
            </p>

            <div className='flex items-center flex-wrap gap-2.5 mb-3.75'>
              <button 
                onClick={() => openProposalModal(application)}
                className='text-boldblue border border-boldblue rounded-lg py-2.5 px-5 transition transform active:scale-95 hover:bg-boldblue hover:text-white duration-300 ease-in-out cursor-pointer'
              >
                View proposal
              </button>
              <Link href={`/message-client/${typeof application.jobId === 'object' ? application.jobId.clientId : ''}`} className='text-boldblue border border-boldblue rounded-lg py-2.5 px-5 transition transform active:scale-95 hover:bg-boldblue hover:text-white duration-300 ease-in-out'>
                Message Client
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-8.75 h-8.75 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                <img width={35} height={35} className="rounded-full" 
                  src={typeof application.jobId === 'object' ? application.jobId.clientLogo : ""} 
                  alt={typeof application.jobId === 'object' ? application.jobId.clientName : "Client"} 
                />
              </div>
              <Link  href={''} className="font-semibold text-sm hover:underline">
                {typeof application.jobId === 'object' ? application.jobId.clientName : "Client"}
              </Link>
            </div>
          </article>
        ))
      )}
      
      {selectedProposal && ( <ProposalModal proposal={selectedProposal} onClose={closeProposalModal} /> )}

    </section>
  );
};

export default ActiveProposals;