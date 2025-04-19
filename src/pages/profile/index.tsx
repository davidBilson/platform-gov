import React, { useState, useEffect } from 'react';
import { IoMdImages } from "react-icons/io";
import { MdStar, MdStarBorder } from "react-icons/md";
import useAuthStore from '@/store/authStore';
import { fetchProfile } from "@/api/profile-api";

// Define proper TypeScript interfaces
interface WorkHistoryItem {
  jobTitle: string;
  dates: string;
  rating: number;
  amount: string;
}

// interface Skill {
//   name: string;
//   level?: string;
// }

interface ProfileData {
  profileImage?: string;
  primaryPosition?: string;
  workHistory?: Array<{
    location?: string;
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
  }>;
  ratePerHour?: number;
  skills?: string[];
  expertise?: string[];
  certifications?: string[];
  bio?: string;
  rating?: number;
}

interface FetchResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

// Define props if needed (for future extensibility)
interface ProfileProps {
  initialProfileId?: string;
}

const Index: React.FC<ProfileProps> = ({ initialProfileId }) => {
  // Get user data from auth store - add proper typing
  const { userId, name } = useAuthStore() as { userId: string | null; name: string | null };
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Table data for work history
  const workHistory: WorkHistoryItem[] = [
    {
      jobTitle: "Web Developer",
      dates: "12/12/2023 - 02/2024",
      rating: 2,
      amount: "$500"
    },
    {
      jobTitle: "Frontend Engineer",
      dates: "08/2023 - 11/2023",
      rating: 3,
      amount: "$1,200"
    },
    {
      jobTitle: "UI Designer",
      dates: "03/2023 - 07/2023",
      rating: 4,
      amount: "$850"
    }
  ];

  // Fetch profile data on component mount
  useEffect(() => {
    const getProfileData = async (): Promise<void> => {
      try {
        // Use the initialProfileId prop if available, otherwise fall back to userId from store
        const profileId = initialProfileId || userId;
        
        if (!profileId) {
          setLoading(false);
          return;
        }
        
        const response = await fetchProfile(profileId) as FetchResponse;
        
        if (response?.success && response?.data) {
          setProfileData(response.data);
        } else {
          // Handle unsuccessful API response
          setError(response?.error || 'Failed to load profile data');
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [userId, initialProfileId]);

  // Extract profile data with fallbacks
  const profession = profileData?.primaryPosition || 'Web Developer';
  const location = profileData?.workHistory?.[0]?.location || 'Remote';
  const rate = profileData?.ratePerHour || 75;
  const skills = profileData?.skills || [];
  const expertise = profileData?.expertise || [];
  const certifications = profileData?.certifications || [];
  const bio = profileData?.bio || 'No bio available';
  
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
  
  return (
    <main className="p-4 md:p-6">
      <section className="w-full max-w-3xl mx-auto pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading profile data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <>
            {/* Bio */}
            <div className='flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0'>

              {/* Image and Name+Loc+Profession */}
              <div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
                {/* Image */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
                  {profileData?.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt={`${name || 'User'}'s profile`}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Handle image loading errors
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = ''; // Could set a default image URL here
                        // Show icon instead
                        target.style.display = 'none';
                        target.parentElement?.classList.add('has-error');
                      }}
                    />
                  ) : (
                    <IoMdImages size={32} className="text-white/70" />
                  )}
                </div>
                {/* Name (now using the name from auth store) */}
                <div className="text-center sm:text-left mt-2 sm:mt-0">
                  <p className='font-semibold text-xl'>{name || "Anonymous User"}</p>
                  <p className='text-xs font-bold py-2.5'>{profession}</p>
                  <p className='text-xs font-bold'>{location}</p>
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
                  {skills.slice(0, 3).map((skill, index) => (
                    <button 
                      key={`skill-${index}`} 
                      className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' 
                      disabled
                    >
                      {skill}
                    </button>
                  ))}
                  {expertise.slice(0, 1).map((exp, index) => (
                    <button 
                      key={`exp-${index}`} 
                      className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' 
                      disabled
                    >
                      {exp}
                    </button>
                  ))}
                  {certifications.slice(0, 2).map((cert, index) => (
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

            {/* Rate */}
            <p className='font-semibold mb-6'>Proposed Rate: ${rate}</p>

            {/* Work History */}
            <div>
              <p className='font-semibold mb-4'>Work History</p>
              
              {/* Work History Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-3 px-4 text-sm font-medium">Job Title</th>
                      <th className="py-3 px-4 text-sm font-medium">Dates</th>
                      <th className="py-3 px-4 text-sm font-medium">Rating</th>
                      <th className="py-3 px-4 text-sm font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workHistory.length > 0 ? (
                      workHistory.map((job, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="py-3 px-4 text-sm">{job.jobTitle}</td>
                          <td className="py-3 px-4 text-sm">{job.dates}</td>
                          <td className="py-3 px-4">
                            {renderRating(job.rating)}
                          </td>
                          <td className="py-3 px-4 text-sm">{job.amount}</td>
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

export default Index;