import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdStar, MdStarBorder } from "react-icons/md";
import useAuthStore from '@/store/useAuth';
import { fetchProfile } from "@/api/profile-api";
import Link from "next/link";
import { toast } from 'react-toastify';
import { IoLocationOutline } from "react-icons/io5";
import ProfilePicture from '@/components/profile/profilePicture';
import { WorkHistoryItem, ProfileData, FetchResponse, ProfileProps } from '@/types/profile';
import LoadingAnimation from '@/components/ui/loading';


const FreelancerProfile = ({ initialProfileId }: ProfileProps) => {
  // Get user data from auth store - add proper typing
  const { userId } = useAuthStore() as { userId: string | null; name: string | null };
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Mock Table data for work history
  const workHistory: WorkHistoryItem[] = [];

  useEffect(() => {
    const getProfileData = async (): Promise<void> => {
      try {
        const profileId = initialProfileId ?? userId;
        
        if (!profileId) {
          setLoading(false);
          return;
        }
        
        const response = await fetchProfile(profileId) as FetchResponse;
        
        if (response?.success && response?.data) {
          setProfileData(response.data);

        }

      } catch (error){
        console.log(error)
        toast.error('Error fetching profile')
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [initialProfileId, userId ]);

  useEffect(() => {
    getProfileImageUrl();
  },[profileData]);

  // Extract profile data with fallbacks
  const profession = profileData?.primaryPosition || '';
  const location = profileData?.location?.country + ' ' + profileData?.location?.state;
  const rate = profileData?.ratePerHour || 75;
  const clearance = profileData?.clearance || "";
  const skills = profileData?.skills || [];
  const expertise = profileData?.expertise || [];
  const certifications = profileData?.certifications || [];
  const bio = profileData?.bio || 'No bio available';
  const name = profileData?.name || "";
  
  // Helper function to render star ratings
  const renderRating = (rating: number, maxRating: number = 5) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => (
          i < rating ? 
            <MdStar key={i} className="text-deepskyblue text-lg" /> : 
            <MdStarBorder key={i} className="text-deepskyblue text-lg" />
        ))}
      </div>
    );
  };

  // Function to get the proper profile image URL
  const getProfileImageUrl = (): string => {
    if (!profileData?.profileImage) return ''; // Return empty string instead of null
    
    // Handle blob URLs directly
    if (profileData.profileImage.startsWith('blob:')) {
      return profileData.profileImage;
    }
    
    // Handle server paths that start with '/uploads'
    if (profileData.profileImage.startsWith('/uploads')) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}${profileData.profileImage}`;
    }
    
    // Handle full URLs or other formats
    return profileData.profileImage;
  };

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
                {/* Image */}
                <ProfilePicture source={getProfileImageUrl()} alt={name ?? ""} width={88} height={88} />
                {/* Name (now using the name from auth store) */}
                <div className="text-center sm:text-left mt-2 sm:mt-0">
                  <p className='font-semibold text-xl'>{name ??""}</p>
                  <p className='text-xs font-bold py-2.5'>{profession}</p>
                  <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} /> {location ?? 'No location'}</p>
                </div>
              </div>

              {/* Title Rating Skills Certification */}
              <div className='w-full sm:max-w-85 mt-4 sm:mt-0'>
                {/* Title & Rating */}
                <div className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6'>
                  <h3 className="text-sm text-boldblue font-bold mb-2 sm:mb-0">{profession}</h3>
                  <div className='flex items-center gap-1'> 
                    {renderRating(profileData?.rating || 2)}
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

            <Link href="/profile/edit" className='w-fit text-xs flex items-center gap-1.5 hover:underline hover:text-deepskyblue text-boldblue active:text-skyblue cursor-pointer pt-6'><FaEdit /> Edit Profile</Link>

            {/* Description */}
            <div className='py-5'>
              <p className="text-sm sm:text-base">
                {bio}
              </p>
            </div>

            {/* Rate */}
            <p className='font-semibold mb-6'>Clearance: {clearance}</p>

            {/* Rate */}
            <p className='font-semibold mb-6'>Rate: ${rate}</p>

            {/* Work History */}
            <div>
              <p className='font-semibold mb-4'>Work History</p>
              
              {/* Work History Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr className="border-b border-b-black text-left font-bold">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Dates</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workHistory.length > 0 ? (
                      workHistory.map((job, index) => (
                        <tr key={index} className={index % 2 === 1 ? "bg-lightgray" : "bg-white"}>
                          <td className="py-3 px-4">{job.jobTitle}</td>
                          <td className="py-3 px-4 text-xs">{job.dates}</td>
                          <td className="py-3 px-4">
                            {renderRating(job.rating)}
                          </td>
                          <td className="py-3 px-4">{job.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                          No work history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default FreelancerProfile;