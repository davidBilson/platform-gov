import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { format } from 'date-fns';
import ProposalModal from './_proposalModal';

// Define TypeScript interfaces
interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

interface JobDetails {
  _id: string;
  userId: string;
  clientId?: string;
  clientName: string;
  clientLogo: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  employmentType: string;
  paymentType: string;
  price: number;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number;
  status: string;
  createdAt: string;
}

interface ProposedMilestone {
  description: string;
  price: number;
  dueDate: string;
}

interface Interview {
  scheduledDate: string;
  meetingLink: string;
  notes: string;
  completed: boolean;
}

interface Application {
  _id: string;
  jobId: JobDetails;
  freelancerId: string;
  freelancerProfileId: string;
  coverLetter: string;
  proposedRate: number;
  proposedMilestones: ProposedMilestone[];
  proposedRetainerAmount?: number;
  proposedRetainerFrequency?: string;
  proposedRetainerDuration?: number;
  availableStartDate?: string;
  availability: string;
  customAvailabilityNote?: string;
  relevantSkills: string[];
  relevantExperience?: string;
  attachments: Attachment[];
  certificationAcknowledgment: boolean;
  status: string;
  clientNotes?: string;
  interviews: Interview[];
  messageThreadId?: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  lastStatusChangeAt: string;
  draftExpiresAt: string | null;
}

interface PendingProposalsProps {
  applications: Application[];
}

const PendingProposals: React.FC<PendingProposalsProps> = ({ applications = [] }) => {
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
      
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No pending proposals</p>
      ) : (
        applications.map((application) => (
          <article key={application._id} className="">
            <p className='text-xs text-boldblue font-semibold mb-5'>
              Applied {formatDate(application.createdAt)}
            </p>
            
            <h3 className="text-xl font-semibold mb-3.75">
              {application.jobId?.jobTitle || "Job Title"}
            </h3>
            
            <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
              <div className="flex items-center gap-1.25">
                <FaRegHourglass size={15} />
                {`Hourly | $${application.proposedRate}`} | {application.availability || "Full-time"}
              </div>
              
              <div className="flex items-center gap-1.25">
                <FaLocationDot size={15} />
                {application.jobId?.location || "Remote"}
              </div>
            </div>

            <p className="text-gray-600 mb-3.75">
              {truncateDescription(application.jobId?.description || "No description provided")}
            </p>

            <div className='flex items-center flex-wrap gap-2.5 mb-3.75'>
              <button 
                onClick={() => openProposalModal(application)}
                className='text-boldblue border border-boldblue rounded-lg py-2.5 px-5 transition transform active:scale-95 hover:bg-boldblue hover:text-white duration-300 ease-in-out'
              >
                View proposal
              </button>
             
            </div>

            <div className="flex items-center gap-5">
              <div className="w-8.75 h-8.75 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                <img 
                  src={application.jobId?.clientLogo} 
                  alt={application.jobId?.clientName || "Client"} 
                  width={35} 
                  height={35} 
                  className="rounded-full" 
                />
              </div>
              <Link 
                // href={`/client-profile/${application.jobId?.clientId}`} 
                href={''}
                className="font-semibold text-sm hover:underline">
                {application.jobId?.clientName || "Client"}
              </Link>
            </div>
          </article>
        ))
      )}
      
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