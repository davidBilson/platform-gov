import useAuthStore from '@/store/authStore';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaRegHourglass } from "react-icons/fa6";

// Define TypeScript interfaces based on the example response
interface ClientLocation {
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  _id: string;
}

interface Milestone {
  id: number;
  description: string;
  price: number;
  dueDate: string | null;
  _id?: string; // MongoDB might add this
}

interface Job {
  _id: string;
  userId: string;
  clientName: string;
  clientLogo: string;
  clientIndustry: string;
  clientCompanySize: string;
  clientSpecializations: string[];
  clientLocation: ClientLocation[];
  clientAccountAge: string;
  userRole: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiresRegisteredLobbyist: boolean;
  employmentType: string;
  paymentType: string;
  price: number;
  milestones: Milestone[];
  startDate: string;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  proposalsCount: number;
}

interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const OpenJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endpoint = process.env.NEXT_PUBLIC_GET_JOB_BY_USERID?.replace(':id', userId);
        const response = await axios.get<ApiResponse>(`${baseURL}${endpoint}`
        );
        
        if (response.data.success) {
          setJobs(response.data.data);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  // Filter jobs by status
  const openJobs = jobs.filter(job => job.status === 'open');
  const activeJobs = jobs.filter(job => job.status === 'active');

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className='p-6'>
      <section className='w-full max-w-275 m-auto'>
        {/* Open Jobs Section */}
        <article className='border-b border-b-[#ccc] pb-10 mb-8'>
          <h2 className='font-semibold text-xl mb-[15px]'>Open Jobs</h2>
          
          {openJobs.length === 0 ? (
            <p>No open jobs at the moment.</p>
          ) : (
            openJobs.map(job => (
              <div key={job._id} className='border-b border-b-[#ccc] pb-10 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                  {/* date and time job was posted */}
                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  {/* number of proposals */}
                  <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>
                    {job.proposalsCount} Proposals
                  </button>
                </div>

                <p className='text-sm mb-[15px] font-semibold'>{job.jobCategory}</p>
                <h3 className='font-semibold text-xl mb-[15px]'>{job.jobTitle}</h3>

                <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                  <div className='flex items-center gap-2'>
                    <FaRegHourglass size={18} />
                    <p>
                      {job.employmentType} | {job.paymentType}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaLocationDot size={18} />
                    <p>
                      {job.location}
                    </p>
                  </div>
                </div>

                <p className='text-[16px] mb-[15px]'>{job.description}</p>

                <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
                  {job.jobCategory}
                </button>
              </div>
            ))
          )}
        </article>

        {/* Active Jobs Section */}
        <article>
          <h2 className='font-semibold text-xl mb-[15px]'>Active Jobs</h2>
          
          {activeJobs.length === 0 ? (
            <p>No active jobs at the moment.</p>
          ) : (
            activeJobs.map(job => (
              <div key={job._id} className='border-b border-b-[#ccc] pb-10 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                  {/* date and time job was posted */}
                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  {/* number of proposals */}
                  <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>
                    {job.proposalsCount} Proposals
                  </button>
                </div>

                <p className='text-sm mb-[15px] font-semibold'>{job.jobCategory}</p>
                <h3 className='font-semibold text-xl mb-[15px]'>{job.jobTitle}</h3>

                <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                  <div className='flex items-center gap-2'>
                    <FaRegHourglass size={18} />
                    <p>
                      {job.employmentType} | {job.paymentType}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaLocationDot size={18} />
                    <p>
                      {job.location}
                    </p>
                  </div>
                </div>

                <p className='text-[16px] mb-[15px]'>{job.description}</p>

                <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
                  {job.jobCategory}
                </button>
              </div>
            ))
          )}
        </article>
      </section>
    </main>
  );
};

export default OpenJobs;