import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MdStar, MdStarBorder } from "react-icons/md";
import useAuthStore from '@/store/useAuth';
import { fetchProfile } from "../../../api/profile-api";
import { toast } from 'react-toastify';
import { IoLocationOutline } from "react-icons/io5";
import ProfilePicture from '@/components/profile/profilePicture';
import { ProfileData, FetchResponse, ProfileProps } from '@/types/profile';
import LoadingAnimation from '@/components/ui/loading';
import WorkHistory from './workHistory';
import { getContracts } from '@/api/contract/contract-api';
import { getUserRatings } from '@/api/rating-api';

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
  reviewee: string | { _id: string; name: string }; // Allow both string and object
  role: 'client' | 'contractor';
  rating: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContractWithRating extends Contract {
  ratingData?: Rating;
}

const FreelancerProfile = ({ initialProfileId }: ProfileProps) => {
  const { userId } = useAuthStore() as { userId: string | null; name: string | null };
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedContracts, setCompletedContracts] = useState<Contract[]>([]);
  const [contractorRatings, setContractorRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState<boolean>(false);

  // Helper function to normalize IDs
  const normalizeId = useCallback((id: unknown): string => {
    if (!id) return '';
    if (typeof id === 'object' && id !== null && '_id' in id) {
      return String(id._id);
    }
    return String(id);
  }, []);

  // Helper function to extract name from reviewee

  // Function to get contractor ratings
  const getContractorRatings = useCallback(async (contractorId: string): Promise<Rating[]> => {
    try {
      setRatingsLoading(true);
      const ratings = await getUserRatings(contractorId, 'contractor');
      return (ratings || []).map(rating => ({
        ...rating,
        _id: rating._id || '', // Ensure _id is always a string
        createdAt: rating.createdAt ? String(rating.createdAt) : '', // Convert createdAt to string
        updatedAt: rating.updatedAt ? String(rating.updatedAt) : '', // Convert updatedAt to string
      }));
    } catch (error) {
      console.error('Error fetching contractor ratings:', error);
      return [];
    } finally {
      setRatingsLoading(false);
    }
  }, []);

  const getCompletedContracts = useCallback(async (contractorId: string): Promise<Contract[]> => {
    try {
      const contracts = await getContracts(contractorId);
      if (!contracts) {
        console.warn('No contracts data received');
        return [];
      }
      return contracts.completed.map(contract => ({
        ...contract,
        id: contract.id || contract._id || '', // Ensure 'id' is populated
        startDate: contract.startDate ? new Date(contract.startDate).toISOString() : '',
        endDate: contract.endDate ? new Date(contract.endDate).toISOString() : '',
      }));
    } catch (error) {
      console.error('Error fetching completed contracts:', error);
      throw error;
    }
  }, []);
  
  const getProfileData = useCallback(async (profileId: string): Promise<void> => {
    try {
      const response = await fetchProfile(profileId) as FetchResponse;
      
      if (response?.success && response?.data) {
        setProfileData(response.data);
      } else {
        throw new Error('Invalid response format or no data received');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error fetching profile');
    }
  }, []);

  const fetchAllData = useCallback(async (profileId: string): Promise<void> => {
    try {
      setLoading(true);
      const [, completedContractsData, ratingsData] = await Promise.allSettled([
        getProfileData(profileId),
        getCompletedContracts(profileId),
        getContractorRatings(profileId)
      ]);

      if (completedContractsData.status === 'fulfilled') {
        setCompletedContracts(completedContractsData.value);
      } else {
        console.error('Failed to fetch completed contracts:', completedContractsData.reason);
        toast.error('Error fetching contracts');
      }

      if (ratingsData.status === 'fulfilled') {
        setContractorRatings(ratingsData.value);
      } else {
        console.error('Failed to fetch ratings:', ratingsData.reason);
      }
      
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      setLoading(false);
    }
  }, [getProfileData, getCompletedContracts, getContractorRatings]);

  useEffect(() => {
    const profileId = initialProfileId ?? userId;
    
    if (!profileId) {
      console.warn('No profile ID available');
      setLoading(false);
      return;
    }

    fetchAllData(profileId);
  }, [initialProfileId, userId, fetchAllData]);

  // Memoized contracts with ratings to avoid recalculation
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

  // Calculate overall contractor rating
  const overallRating = useMemo((): { average: number; count: number } => {
    if (!contractorRatings || contractorRatings.length === 0) {
      return { average: profileData?.rating || 0, count: 0 };
    }
    
    const sum = contractorRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / contractorRatings.length;
    
    return { 
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      count: contractorRatings.length 
    };
  }, [contractorRatings, profileData?.rating]);

  // Extract profile data with fallbacks
  const {
    profession = "Profession",
    primaryPosition = '',
    location,
    ratePerHour: rate = 0,
    clearance = "",
    skills = [],
    expertise = [],
    certifications = [],
    bio = 'No bio available',
    name = "",
    profileImage
  } = profileData || {};

  const locationString = location ? `${location.country} ${location.state}` : 'No location';
  
  // Helper function to render star ratings
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

  // Function to get the proper profile image URL
  const getProfileImageUrl = useCallback((): string => {
    if (!profileImage) return '';
    
    if (profileImage.startsWith('blob:')) {
      return profileImage;
    }
    
    if (profileImage.startsWith('/uploads')) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}${profileImage}`;
    }
    
    return profileImage;
  }, [profileImage]);

  return (
    <main className="p-5 pb-20 md:p-6">
      <section className="w-full max-w-275 mx-auto pb-32">
        {loading ? (
          <div className='flex items-center justify-center h-[60vh]'>
            <LoadingAnimation />
          </div>
        ) : (
          <>
            {/* Bio */}
            <div className='flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0'>

              {/* Image and Name+Loc+Profession */}
              <div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
                <ProfilePicture source={getProfileImageUrl()} alt={name} width={88} height={88} />
                <div className="text-center sm:text-left mt-2 sm:mt-0">
                  <p className='font-semibold text-xl'>{name}</p>
                  <p className='text-xs font-bold py-2.5'>{profession}</p>
                  <p className='text-xs font-bold flex items-center gap-1'>
                    <IoLocationOutline size={20} /> {locationString}
                  </p>
                </div>
              </div>

              {/* Title Rating Skills Certification */}
              <div className='w-full sm:max-w-85 mt-4 sm:mt-0'>
                {/* Title & Rating */}
                <div className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6'>
                  <h3 className="text-sm text-boldblue font-bold mb-2 sm:mb-0">{primaryPosition}</h3>
                  <div className='flex items-center gap-1'> 
                    {ratingsLoading ? (
                      <span className="text-sm text-gray-500">Loading ratings...</span>
                    ) : (
                      renderRating(overallRating.average, 5, true)
                    )}
                  </div>
                </div>

                {/* Skills & Certifications */}
                <div className='flex items-center justify-center sm:justify-start flex-wrap gap-2'>
                  {skills.map((skill, index) => (
                    <button 
                      key={`skill-${index}`} 
                      className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' 
                      disabled
                    >
                      {skill}
                    </button>
                  ))}
                  {expertise.map((exp, index) => (
                    <button 
                      key={`exp-${index}`} 
                      className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' 
                      disabled
                    >
                      {exp}
                    </button>
                  ))}
                  {certifications.map((cert, index) => (
                    <button 
                      key={`cert-${index}`} 
                      className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-aquagreen' 
                      disabled
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='py-5'>
              <p className="text-sm sm:text-base">
                {bio}
              </p>
            </div>

            {/* Clearance */}
            <p className='font-semibold mb-6'>Clearance: {clearance}</p>

            {/* Rate */}
            <p className='font-semibold mb-6'>Rate: ${rate}</p>

            {/* Work History */}
            <WorkHistory 
              completedContracts={contractsWithRatings} 
              renderRating={renderRating}
            />

            {/* Recent Reviews Section */}
            {contractorRatings.length > 0 && (
              <div className='mt-8'>
                <p className='font-semibold mb-4'>Recent Reviews</p>
                <div className='space-y-4'>
                  {contractorRatings.slice(0, 3).map((rating, index) => (
                    <div key={rating._id || index} className='bg-gray-50 p-4 rounded-lg'>
                      <h4 className='mb-3.75 font-bold'>
                        {typeof rating.reviewer === 'object' && rating.reviewer !== null && 'name' in rating.reviewer ? (rating.reviewer as { name: string }).name : rating.reviewer}
                      </h4>
                      <div className='flex items-center gap-2 mb-2'>
                        {renderRating(rating.rating)}
                        <span className='text-sm text-gray-500'>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comments && (
                        <p className='text-sm text-gray-700'>{rating.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default FreelancerProfile;