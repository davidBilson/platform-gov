import ProfilePicture from '@/components/profile/profilePicture'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { IoLocationOutline } from 'react-icons/io5';
import { MdStar, MdStarBorder } from "react-icons/md";
import { ProposalData } from '@/types/proposalsList';
import { useHire } from '@/store/useHire';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { trackHiringStatus, updateJobApplicationStatus } from '@/api/status-api';
import { getContracts } from '@/api/contract/contract-api';
import { getUserRatings } from '@/api/rating-api';
import WorkHistory from '@/pages/profile/_freelancer/workHistory';

interface ProposalProps {
  handleClose: () => void;
  proposalData: ProposalData;
  jobStatus: string;
}

interface Contract {
  id: string;
  jobId: {
    _id: string;
    jobTitle: string;
    price?: number;
    retainerAmount?: number;
  };
  startDate: string;
  endDate: string;
}

interface Rating {
  _id: string;
  contractId: string;
  jobId: string;
  reviewer: string;
  reviewee: string | { _id: string; name: string };
  role: 'client' | 'contractor';
  rating: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContractWithRating extends Contract {
  ratingData?: Rating | undefined;
}

const Proposal: React.FC<ProposalProps> = ({ handleClose, proposalData, jobStatus }) => {

  const router = useRouter();
  const { setHireData, } = useHire();
  const { userId } = useAuthStore();
  const [contractorHired, setContractorHired] = useState(false);
  const [contractorHiredStatus, setContractorHiredStatus] = useState("");
  const [completedContracts, setCompletedContracts] = useState<Contract[]>([]);
  const [contractorRatings, setContractorRatings] = useState<Rating[]>([]);

  // Exact functions from FreelancerProfile
  const normalizeId = useCallback((id: unknown): string => {
    if (!id) return '';
    if (typeof id === 'object' && id !== null && '_id' in id) {
      return String(id._id);
    }
    return String(id);
  }, []);

  const getContractorRatings = useCallback(async (contractorId: string): Promise<Rating[]> => {
    try {
      const ratings = await getUserRatings(contractorId, 'contractor');
      return (ratings || []).map(rating => ({
        ...rating,
        _id: rating._id || '', // Ensure _id is always a string
        createdAt: rating.createdAt ? String(rating.createdAt) : '',
        updatedAt: rating.updatedAt ? String(rating.updatedAt) : '',
      }));
    } catch (error) {
      console.error('Error fetching contractor ratings:', error);
      return [];
    }
  }, []);

  const getCompletedContracts = useCallback(async (contractorId: string): Promise<Contract[]> => {
    try {
      // Add validation
      if (!contractorId || contractorId.trim() === '') {
        console.warn('Invalid contractorId provided to getCompletedContracts');
        return [];
      }
  
      const contracts = await getContracts(contractorId);
      
      // Since getContracts now always returns an object (never null), we can safely access completed
      const completedContracts = contracts?.completed || [];
      
      return completedContracts.map(contract => ({
        ...contract,
        id: contract.id || contract._id || '', // Ensure 'id' is populated
        startDate: contract.startDate ? new Date(contract.startDate).toISOString() : '',
        endDate: contract.endDate ? new Date(contract.endDate).toISOString() : '',
      }));
      
    } catch (error) {
      // This catch block should rarely execute now since getContracts handles all errors
      console.error('Unexpected error in getCompletedContracts:', error);
      return [];
    }
  }, []);

  // Exact memoized contracts with ratings from FreelancerProfile
  const contractsWithRatings = useMemo((): ContractWithRating[] => {
    if (!completedContracts.length || !contractorRatings.length) {
      return completedContracts.map(contract => ({ ...contract, ratingData: undefined }));
    }

    // Create a rating lookup map for better performance
    const ratingMap = new Map<string, Rating>();
    contractorRatings.forEach(rating => {
      const jobId = normalizeId(rating.jobId);
      const contractId = normalizeId(rating.contractId);

      // Use both jobId and contractId as keys for lookup
      if (jobId) ratingMap.set(`job-${jobId}`, rating);
      if (contractId) ratingMap.set(`contract-${contractId}`, rating);
    });

    return completedContracts.map(contract => {
      const jobId = normalizeId(contract.jobId?._id || contract.jobId);
      const contractId = normalizeId(contract.id);

      // Try to find rating by jobId first, then by contractId
      const ratingData = ratingMap.get(`job-${jobId}`) || ratingMap.get(`contract-${contractId}`);

      return {
        ...contract,
        ratingData
      };
    });
  }, [completedContracts, contractorRatings, normalizeId]);

  // Exact renderRating function from FreelancerProfile
  const renderRating = useCallback((rating: number, maxRating: number = 5, showCount: boolean = false) => {
    const filledStars = Math.floor(rating);

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {Array.from({ length: maxRating }).map((_, i) => (
            i < filledStars ?
              <MdStar key={i} className="text-deepskyblue text-lg" /> :
              <MdStarBorder key={i} className="text-deepskyblue text-lg" />
          ))}
        </div>
        {showCount && (
          <span className="text-sm text-gray-600 ml-1">
            ({rating.toFixed(1)})
          </span>
        )}
      </div>
    );
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (proposalData.contractorId) {
        const [contracts, ratings] = await Promise.all([
          getCompletedContracts(proposalData.contractorId),
          getContractorRatings(proposalData.contractorId)
        ]);
        setCompletedContracts(contracts);
        setContractorRatings(ratings);
      }
    };

    fetchData();
  }, [proposalData.contractorId, getCompletedContracts, getContractorRatings]);

  useEffect(() => {
    setHireData({
      jobId: proposalData.jobId,
      contractorId: proposalData.contractorId,
      contractorName: proposalData.contractorName,
      contractorProfilePicture: proposalData.contractorProfilePicture,
      applicationId: proposalData.applicationId
    });
  }, [proposalData])

  useEffect(() => {
    const checkHiringStatus = async () => {
      if (userId && proposalData.jobId && proposalData.contractorId) {
        const result = await trackHiringStatus({
          jobId: proposalData.jobId,
          contractorId: proposalData.contractorId,
          clientId: userId
        });

        if (result && result.found) {
          setContractorHired(true);
          setContractorHiredStatus(result.data.data.hiringStatus);
        } else {
          updateJobApplicationStatus({
            applicationId: proposalData.applicationId,
            status: "viewed",
          });
        }
      }
    };

    checkHiringStatus();
  }, [userId, proposalData.jobId, proposalData.contractorId, proposalData.applicationId]);

  const navigateToContract = (tab: string) => {
    router.push({
      pathname: `/contract-wizard/${proposalData.applicationId}`,
      query: {
        jobId: proposalData.jobId,
        tab
      }
    });
  };

  return (
    <section className='w-full h-full relative'>
      <div className='px-7.5 pt-7.5 flex flex-col gap-5 mb-7.5'>
        <div className='flex gap-4 h-26'>
          <div>
            <ProfilePicture source={proposalData.contractorProfilePicture} alt={proposalData.name} />
          </div>
          <div className='flex flex-col items-start md:justify-center gap-1 md:gap-2.5 md:w-1/2 h-full'>
            <p className="text-lg md:text-xl font-semibold">{proposalData.name}</p>
            <p className='text-xs font-bold'>{proposalData.primaryPosition}</p>
            <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} /> {proposalData.location}</p>
          </div>
        </div>

        <div className=''>
          <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
            <h3 className='font-bold text-sm text-boldblue'>{proposalData.primaryPosition}</h3>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
            {proposalData.skills.map((skill, index) => (
              <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                {skill}
              </span>
            ))}

            {proposalData.expertise.map((exp, index) => (
              <span key={`exp-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                {exp}
              </span>
            ))}

            {proposalData.certifications.map((cert, index) => (
              <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm md:text-base mb-7.5 px-7.5">{proposalData.coverLetter}</p>
      <p className='font-semibold mb-7.5 px-7.5'>Proposed Rate: ${proposalData.proposedRate}</p>
      <p className='font-semibold mb-7.5 px-7.5'>Work History</p>

      <div className="px-7.5 pb-100">
        <WorkHistory
          completedContracts={contractsWithRatings}
          renderRating={renderRating}
        />
      </div>

      <div className="md:max-w-1/2 w-full h-2/12 fixed bottom-0 bg-skyblue border-t border-t-boldblue py-12.5 px-6 mt-30">
        <div className="flex items-center justify-center gap-2.5 md:gap-7.5">
          <button onClick={handleClose} type="button" className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg">
            Back
          </button>
          <button type="button" className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg">
            Short List
          </button>
          <button onClick={() => navigateToContract("messages")} type="button" className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg">
            Message
          </button>
          {
            !contractorHired ?
              <button onClick={() => router.push('/hire')} className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue">
                Hire
              </button> :
              <button className="transition transform active:scale-95 opacity-70 cursor-not-allowed duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-aquagreen text-white text-xs md:text-sm font-semibold rounded-lg border border-aquagreen">
                {contractorHiredStatus}
              </button>
          }
        </div>
      </div>

    </section>
  )
}

export default Proposal