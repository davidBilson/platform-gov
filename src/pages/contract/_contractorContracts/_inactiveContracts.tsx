import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
// import { format } from 'date-fns';
import ProposalModal from './_proposalModal';
import { Application } from '@/types/proposals';
import MockImage from "@/assets/GovLink_Global_Logo.png"
import Image from 'next/image';

// interface ActiveProposalsProps {
//   applications: Application[];
// }

const InactiveContracts
// React.FC<ActiveProposalsProps> 
= (
  // { applications = [] }
) => {
  const [selectedProposal, setSelectedProposal] = useState<Application | null>(null);

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

  const closeProposalModal = (): void => {
    setSelectedProposal(null);
  };

  return (
    <section className='border-b border-b-deepskyblue pb-5 mb-12.5'>
      <h2 className='pb-5 mb-7.5 text-darkgray text-xl font-bold'>Inactive Contracts</h2>
      
      {/* {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No active proposals</p>
      ) : (
        applications.map((application) => ( */}
          <article // key={application._id} 
            className=""
          >
            <section className='flex flex-col md:flex-row md:items-center justify-between gap-5 mb-5'>
              <div>
                <p className='text-xs text-mediumgray font-semibold mb-5'>
                  {'10/3/2024'} - {'Present'}
                </p>
                <h3 className="text-xl font-semibold mb-3.75">
                  {/* {typeof application.jobId === 'object' ? application.jobId.jobTitle : "Job Title"} */}
                  Job Title
                </h3>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold'>This Week</p>
                <p className='text-xl'>25/40 hours</p>
              </div>
            </section>
            

            <div className="flex items-center gap-5 mb-5">
              <div className="w-8.75 h-8.75 bg-cyan-200 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                <Image 
                  src={MockImage} 
                  alt={"Client"} 
                  width={35}
                  height={35} 
                  className="rounded-full border" 
                  // src={typeof application.jobId === 'object' ? application.jobId.clientLogo : ""} 
                  // alt={typeof application.jobId === 'object' ? application.jobId.clientName : "Client"} 
                />
              </div>
              <Link  href={''} className="font-semibold text-sm hover:underline">
                {/* {typeof application.jobId === 'object' ? application.jobId.clientName : "Client"} */}
                Client
              </Link>
            </div>

            <section className='flex flex-col md:flex-row items-start md:items-center justify-between gap-5'>
              <div className="flex flex-wrap items-center gap-10 text-sm font-semibold">
                <div className="flex items-center gap-1.25">
                  <FaRegHourglass size={15} /> Hourly | $75 | Full Time 
                  {/* {`Hourly | $${application.proposedRate}`} | {application.availability || "Full Time"} */}
                </div>
                <div className="flex items-center gap-1.25">
                  <FaLocationDot size={15} />
                  {/* {typeof application.jobId === 'object' ? application.jobId.location : "Remote"} */}
                </div>
              </div>
              <p className='font-bold text-sm'>Contract Detail | Manage Timesheet | Submit For Payment</p>
            </section>
          </article>
        {/* ))
      )} */}
      
      {selectedProposal && ( <ProposalModal proposal={selectedProposal} onClose={closeProposalModal} /> )}

    </section>
  );
};

export default InactiveContracts;