// _activeContracts.tsx
import Link from 'next/link';
import React, { 
  // useState, 
  MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
// import RateUserModal from '../../../components/rating/rateUserModal';
import StatusTag from '@/components/tags/statusTag';

interface Job {
  _id: string;
  jobTitle: string;
  description: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Application {
  _id: string;
  coverLetter: string;
}

interface OfferDetails {
  rate: number;
  paymentType: string;
  employmentType: string;
  startDate: string;
  milestones: unknown[];
}

interface HiringOffer {
  _id: string;
  offerDetails: OfferDetails;
  clientSigned: boolean;
  jobId: Job;
  clientId: string;
  contractorId: User;
  applicationId: Application;
  status: 'offered' | 'accepted' | 'declined' | 'withdrawn';
  documents: unknown[];
  clientNotes: string;
  contractorNotes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  contractorSigned: boolean;
}

interface ActiveContractsProps {
  offers?: HiringOffer[];
}

const ActiveContracts: React.FC<ActiveContractsProps> = ({ offers = [] }) => {
  const router = useRouter();
  // const [showRateUserModal, setShowRateUserModal] = useState(false);

  // const handleClose = () => {
  //   setShowRateUserModal(false);
  // };

  // const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     handleClose();
  //   }
  // };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (error) {
      console.log(error);
      return 'Invalid date';
    }
  };

  const getStatusDisplay = (status: HiringOffer['status']): string => {
    switch(status) {
      case 'offered': return 'Offered';
      case 'accepted': return 'Accepted';
      default: return status;
    }
  };

  const viewContract = (hiringId: string, jobId?: string, applicationId?: string) => {
    const query: { jobId?: string; proposalId?: string } = {};
    
    if (jobId) query.jobId = jobId;
    if (applicationId) query.proposalId = applicationId;

    router.push({
      pathname: `/contract/${hiringId}`,
      query: Object.keys(query).length > 0 ? query : undefined
    });
  };

  return (
    <>
      <section className='pb-5 mb-12.5'>
        <h2 className='pb-5 mb-7.5 text-darkgray text-xl font-bold'>Active Contracts</h2>
        
        <section className='flex flex-col gap-12.5'>
          {offers.length === 0 ? (
            <p>No active contracts found</p>
          ) : (
            offers.map((offer) => (
              <article 
                key={offer._id} 
                onClick={() => viewContract(
                  offer._id, 
                  offer.jobId?._id, 
                  offer.applicationId?._id
                )}
                className='flex flex-wrap md:justify-between gap-5 items-start pb-10 border-b border-b-lightblue cursor-pointer hover:bg-gray-50 transition-colors'
              >
                <section className='flex flex-col items-start gap-3.75'>
                  <p className='text-xs text-boldblue font-semibold'>
                    Created: {formatDate(offer.createdAt)}
                  </p>
                  <h3 className="text-xl font-semibold">
                    {offer.jobId?.jobTitle || "Job Title Not Available"}
                  </h3>
                  <Link 
                    href={`/profile/${offer.contractorId?._id}`} 
                    className="font-semibold text-sm hover:underline"
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                  >
                    {offer.contractorId?.name || "Contractor Name Not Available"}
                  </Link>
                  <StatusTag status={getStatusDisplay(offer.status)} />
                </section>
              </article>
            ))
          )}
        </section>
      </section>

      {/* {showRateUserModal && (
        <div 
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
          onClick={handleOverlayClick}
        >
          <RateUserModal onClose={handleClose} userToRate={"Contractor"} />
        </div>
      )} */}
    </>
  );
};

export default ActiveContracts;