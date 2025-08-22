import React from 'react';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { Application } from '@/types/proposals';
import { useRouter } from 'next/router';

interface ProposalModalProps {
  proposal: Application;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ proposal, onClose }) => {

  const router = useRouter();

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      console.log(error)
      return 'Invalid date';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const jobDetails = typeof proposal.jobId === 'object' ? proposal.jobId : null;

  // duplicate this for message client button
  const viewContract = (id: string) => {
    router.push({
      pathname: `/contract-wizard/${id}`,
      query: { jobId: typeof proposal.jobId === 'object' ? proposal.jobId._id : undefined }
    });
  }

  return (
    <section
      className='fixed top-0 left-0 w-full h-screen p-6 flex items-center justify-center bg-black/50 bg-opacity-50 z-200'
      onClick={handleBackdropClick}
    >
      <div className='p-6 rounded-lg bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative'>
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer'
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold mb-2">{jobDetails?.jobTitle || "Job Title"}</h2>
            <p className="text-sm text-gray-500">
              Applied on {formatDate(proposal.createdAt)}
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Cover Letter</h3>
            <p className="whitespace-pre-line">{proposal.coverLetter || "No cover letter provided"}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Proposal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Proposed Rate</p>
                <p className="font-semibold">${proposal.proposedRate}</p>
              </div>
              <div>
                <p className="text-gray-600">Availability</p>
                <p className="font-semibold capitalize">{proposal.availability}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold capitalize">{proposal.status}</p>
              </div>
              <div>
                {
                  proposal.status === 'active' &&
                  <button onClick={() => viewContract(proposal._id)} className='bg-deepskyblue rounded-lg text-white text-sm  px-3 py-2 font-semibold cursor-pointer hover:opacity-70 transition duration-300 ease-in-out' >View Contract</button>
                }
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Attachments</h3>
            {!proposal.attachments || proposal.attachments.length === 0 ? (
              <p className="text-gray-600">No attachments</p>
            ) : (
              <ul className="space-y-2">
                {proposal.attachments.map((attachment) => (
                  <li key={attachment._id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium">{attachment.originalName}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(attachment.fileSize)} • {attachment.fileType.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}${attachment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-boldblue text-white py-1 px-3 rounded-md text-sm transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Certifications</h3>
            <p>
              {proposal.certificationAcknowledgment ? (
                <span className="text-green-600 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All required certifications acknowledged
                </span>
              ) : (
                <span className="text-red-600">No certifications acknowledged</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProposalModal;