import React, { useState, useEffect } from 'react';
import { FaRegHourglass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Job, ApiResponse} from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const OpenJobs = () => {

  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
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
        }

      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();

  }, [userId]);

  const openJobs = jobs.filter(job => job.status === 'open');
  const activeJobs = jobs.filter(job => job.status === 'active');

  return (
    <main className='p-6'>
      <section className='w-full max-w-275 m-auto'>
        <article className='mb-8'>
          
          <h2 className='font-semibold text-xl mb-[15px]'>Open Jobs</h2>
          {openJobs.length === 0 ? (
            <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
              <p className="text-center text-sm text-gray-500 mt-2">No open jobs at the moment.</p>
            </section>
          ) : (
            openJobs.map(job => (
              <div key={job._id} onClick={() => router.push(`/job/${job._id}/proposals`)} className='border-b cursor-pointer border-b-[#ccc] pb-10 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>

                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  <Link
                    href={`/job/${job._id}/proposals`}
                    className={`self-end text-xs sm:text-sm text-center flex justify-center items-center text-white font-bold w-fit sm:w-28.5 h-fit sm:h-7.5 px-2 py-1 sm:px-0 sm:py-1  rounded-full hover:shadow-lg hover:opacity-70 transition duration-300 ease-in-out cursor-pointer ${
                      job?.status === 'active' ? 'bg-aquagreen' : 'bg-deepskyblue'
                    }`}
                  >
                    {job?.status === 'active' 
                      ? 'In Progress'
                      : `${job.proposalsCount} ${job.proposalsCount < 2 ? 'Proposal' : 'Proposals'}`
                    }
                  </Link>
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

                <button disabled className='bg-deepskyblue text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
                  {job.jobCategory}
                </button>
              </div>
            ))
          )}
        </article>

        <article>
          <h2 className='font-semibold text-xl mb-[15px]'>Active Jobs</h2>
          
          {activeJobs.length === 0 ? (
            <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
              <p className="text-center text-sm text-gray-500 mt-2">No active jobs at the moment.</p>
            </section>
          ) : (
            activeJobs.map(job => (
                    // router.push={take to contract page instead for that particular job}

              <div key={job._id} onClick={() => router.push(`/job/${job._id}/proposals`)} className='border-b border-b-[#ccc] cursor-pointer pb-10  mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                  
                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  <Link
                    // href={take to contract page instead for that particular job}
                    href={`/job/${job._id}/proposals`}
                    className={`self-end text-xs sm:text-sm text-center flex justify-center items-center text-white font-bold w-fit sm:w-28.5 h-fit sm:h-7.5 px-2 py-1 sm:px-0 sm:py-1  rounded-full hover:shadow-lg hover:opacity-70 transition duration-300 ease-in-out cursor-pointer ${
                      job?.status === 'active' ? 'bg-aquagreen' : 'bg-deepskyblue'
                    }`}
                  >
                    {job?.status === 'active' 
                      ? 'In Progress'
                      :`
                        ${job.proposalsCount} ${job.proposalsCount < 2 
                        ? 'Proposal' 
                        : 'Proposals'}
                      `
                    }
                  </Link>
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

                <button disabled className='bg-deepskyblue text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
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