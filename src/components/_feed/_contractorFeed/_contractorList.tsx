import React, { useState, useEffect, useCallback } from 'react';
import { ContractorListProps } from '@/types/contractors';
import { FaUser } from "react-icons/fa";
import { MdStar, MdStarBorder } from "react-icons/md";
import { IoLocationOutline } from 'react-icons/io5';
import Link from 'next/link';
import { getUserRatings } from '@/api/rating-api';
import { formatName } from '@/utils/format';
import ProfilePicture from '@/components/profile/profilePicture';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import useAuthStore from '@/store/useAuth';

interface ContractorWithRating {
  contractor: {
    _id?: string;
    user: {
      _id: string;
      name: string;
      isHighPriority?: boolean;
      isSubscribed?: boolean;
    };
    profileImage?: string;
    primaryPosition: string;
    profession?: string;
    location: {
      state: string;
    };
    firmAffiliation?: string;
    skills: string[];
    expertise: string[];
    certifications: string[];
    bio: string;
  };
  rating: { average: number; count: number };
}

const ContractorList = ({ contractors }: ContractorListProps) => {

  const [contractorsWithRatings, setContractorsWithRatings] = useState<ContractorWithRating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState<boolean>(true);

  const { isSubscribed }  = useAuthStore();

  const getContractorRatings = useCallback(async (contractorId: string, isSubscribed: boolean = false): Promise<{ average: number; count: number }> => {
    try {
      // If user is subscribed, return perfect 5-star rating
      if (isSubscribed) {
        return { average: 5.0, count: 1 }; // You can adjust count as needed
      }

      const ratings = await getUserRatings(contractorId, 'contractor');

      if (!ratings || ratings.length === 0) {
        return { average: 0, count: 0 };
      }

      // Handle the ratings without explicit typing to avoid conflicts
      const sum = ratings.reduce((acc: number, rating: { rating?: number }) => {
        return acc + (rating.rating ?? 0);
      }, 0);

      const average = sum / ratings.length;

      return {
        average: Math.round(average * 10) / 10, // Round to 1 decimal
        count: ratings.length
      };
    } catch (error) {
      console.error(`Error fetching ratings for contractor ${contractorId}:`, error);
      // If subscribed and error occurs, still return 5 stars
      if (isSubscribed) {
        return { average: 5.0, count: 1 };
      }
      return { average: 0, count: 0 };
    }
  }, []);

  // Fetch ratings for all contractors
  useEffect(() => {
    const fetchAllRatings = async () => {
      if (!contractors || contractors.length === 0) {
        setRatingsLoading(false);
        return;
      }

      setRatingsLoading(true);

      try {
        const contractorsWithRatingsData = await Promise.all(
          contractors.map(async (contractor) => {
            // Handle potential undefined _id
            const contractorId = contractor.user._id || contractor._id || '';
            if (!contractorId) {
              console.warn('Contractor missing ID:', contractor);
              return {
                contractor,
                rating: { average: 0, count: 0 }
              };
            }

            // Pass subscription status to rating function
            const rating = await getContractorRatings(contractorId, contractor.user.isSubscribed);

            return {
              contractor,
              rating
            };
          })
        );

        setContractorsWithRatings(contractorsWithRatingsData);
        
      } catch (error) {
        console.error('Error fetching contractor ratings:', error);
        // Set contractors with default ratings if fetching fails
        const defaultContractors = contractors.map(contractor => ({
          contractor,
          rating: contractor.user.isSubscribed 
            ? { average: 5.0, count: 1 } // 5 stars for subscribed users even on error
            : { average: 0, count: 0 }
        }));
        setContractorsWithRatings(defaultContractors);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchAllRatings();
  }, [contractors, getContractorRatings]);

  // Render rating component
  const renderRating = useCallback((rating: number, maxRating: number = 5, showCount: boolean = false, count: number = 0) => {
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
        {showCount && count > 0 && (
          <span className="text-sm text-boldblue ml-1">
            ({rating.toFixed(1)})
          </span>
        )}
      </div>
    );
  }, []);

  if (!contractors || contractors.length === 0) {
    return <section>No contractors found</section>;
  }

  // Truncate description if it's too long
  const truncateBio = (text: string, maxLength = 200): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const sortedContractorsWithRatings = [...contractorsWithRatings].sort((a, b) => {
    // First priority: Subscribed users
    const aIsSubscribed = a.contractor.user.isSubscribed === true;
    const bIsSubscribed = b.contractor.user.isSubscribed === true;

    if (aIsSubscribed && !bIsSubscribed) {
      return -1; // a comes before b
    }
    if (!aIsSubscribed && bIsSubscribed) {
      return 1; // b comes before a
    }

    // Second priority: Janus Global Advisors contractors
    const aIsJanus = a.contractor.firmAffiliation === 'Janus Global Advisors';
    const bIsJanus = b.contractor.firmAffiliation === 'Janus Global Advisors';

    if (aIsJanus && !bIsJanus) {
      return -1; // a comes before b
    }
    if (!aIsJanus && bIsJanus) {
      return 1; // b comes before a
    }

    // Third priority: High priority users
    const aIsHighPriority = a.contractor.user.isHighPriority === true;
    const bIsHighPriority = b.contractor.user.isHighPriority === true;

    if (aIsHighPriority && !bIsHighPriority) {
      return -1; // a comes before b
    }
    if (!aIsHighPriority && bIsHighPriority) {
      return 1; // b comes before a
    }

    // If all criteria are equal, maintain original order
    return 0;
  });

  return (
    <>
      <section className="pt-7.5 pb-10 flex flex-col gap-7.5">
        {sortedContractorsWithRatings.map(({ contractor, rating }, index) => (
          <div className='border-b border-b-lightblue pb-7.5'>
            {/* Visual indicator for Janus Global Advisors contractors */}
            {contractor.firmAffiliation === 'Janus Global Advisors' && (
              <div className="mb-2 text-[8px] font-bold text-boldblue w-fit px-2 py-1 bg-blue-50 rounded-md inline-block">
                Janus Global Advisors
              </div>
            )}
            <div
              key={contractor._id || contractor.user._id || index}
            >


              <div className='flex flex-col md:flex-row items-start gap-4 md:gap-18.25 mb-6 md:mb-10.25'>

                <div className='flex items-center  gap-4.25 w-full md:max-w-[20%] h-26  '>

                  <div className='border border-boldblue rounded-full h-19 w-19 flex items-center justify-center overflow-hidden'>
                    {contractor.profileImage ? (
                      <div className='rounded-full h-19 w-19 flex items-center justify-center'>
                        <ProfilePicture
                          source={contractor?.profileImage ?? ""}
                          alt={contractor?.user?.name ?? ""}
                          width={76}
                          height={76}
                        />
                      </div>
                    ) :
                      <div className='text-white flex items-center justify-center w-16 h-16 md:w-[87px] md:h-[87px] rounded-full bg-boldblue border border-boldblue'>
                        <FaUser size={24} className="md:text-4xl" />
                      </div>
                    }
                  </div>
                  <div className='flex flex-col items-start justify-center gap-1 md:gap-2.5 w-1/2 h-full'>
                    <span className='flex items-center gap-2'>
                      <Link href={`/profile/${contractor.user._id}`} className="text-lg md:text-xl font-semibold cursor-pointer hover:underline">
                        {isSubscribed ? contractor.user.name : formatName(contractor.user.name)}
                      </Link>
                      {contractor.user.isSubscribed && <RiVerifiedBadgeFill size={20} color='#00A871' />}
                    </span>
                    <p className='text-xs font-bold'>{contractor.profession ?? "Profession"}</p>
                    <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} />{contractor.location.state !== "" ? contractor?.location.state : "no location"}</p>
                  </div>

                </div>

                <div className='w-full md:max-w-[80%] mt-4 md:mt-0'>
                  <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
                    <h3 className='font-bold text-sm text-boldblue'>{contractor.primaryPosition}</h3>
                    {ratingsLoading ? (
                      <span className="text-sm text-gray-500">Loading...</span>
                    ) : (
                      renderRating(rating.average, 5, true, rating.count)
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
                    {contractor.skills.slice(0, 3).map((skill, index) => (
                      <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {skill}
                      </span>
                    ))}

                    {contractor.expertise.slice(0, 2).map((exp, index) => (
                      <span key={`expertise-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {exp}
                      </span>
                    ))}

                    {contractor.certifications.slice(0, 2).map((cert, index) => (
                      <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* *********** 2 *********** */}
              <p className="text-sm md:text-base">{truncateBio(contractor.bio)}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ContractorList;