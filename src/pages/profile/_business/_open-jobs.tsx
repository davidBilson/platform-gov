import React, { useState, useEffect } from 'react';
import { FaRegHourglass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Job, ApiResponse } from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { truncateDescription } from '@/utils/format';

const OpenJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const { userId } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endpoint = process.env.NEXT_PUBLIC_GET_JOB_BY_USERID?.replace(':id', userId);
        const response = await axios.get<ApiResponse>(`${baseURL}${endpoint}`);

        if (response.data.success) {
          setJobs(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, [userId]);

  const getJobsByStatus = (status: string) => jobs.filter(job => job.status === status);

  const getStatusButtonProps = (job: Job) => {
    switch (job.status) {
      case 'active':
        return { text: 'In Progress', bgColor: 'bg-aquagreen' };
      case 'completed':
        return { text: 'Completed', bgColor: 'bg-gray-600' };
      default:
        return { 
          text: `${job.proposalsCount} ${job.proposalsCount < 2 ? 'Proposal' : 'Proposals'}`, 
          bgColor: 'bg-deepskyblue' 
        };
    }
  };

  const getNavigationPath = (job: Job) => {
    // For active jobs, you might want to navigate to contract page
    // return job.status === 'active' ? `/contract/${job._id}` : `/job/${job._id}/proposals`;
    return `/job/${job._id}/proposals`;
  };

  const renderJobCard = (job: Job) => {
    const statusProps = getStatusButtonProps(job);
    const navigationPath = getNavigationPath(job);

    return (
      <div 
        key={job._id} 
        onClick={() => router.push(navigationPath)} 
        className='border-b cursor-pointer border-b-[#ccc] pb-10 mb-8'
      >
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
          <p className="text-[12px] text-[#808080]">
            Posted {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>

          <Link
            href={navigationPath}
            className={`self-end text-xs sm:text-sm text-center flex justify-center items-center text-white font-bold w-fit sm:w-28.5 h-fit sm:h-7.5 px-2 py-1 sm:px-0 sm:py-1 rounded-full hover:shadow-lg hover:opacity-70 transition duration-300 ease-in-out cursor-pointer ${statusProps.bgColor}`}
          >
            {statusProps.text}
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

        <p className='text-[16px] mb-[15px]'>{truncateDescription(job.description)}</p>

        <button disabled className='bg-deepskyblue text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
          {job.jobCategory}
        </button>
      </div>
    );
  };

  const renderJobSection = (title: string, jobs: Job[], emptyMessage: string) => (
    <article className='mb-8'>
      <h2 className='font-semibold text-xl mb-[15px]'>{title}</h2>
      {jobs.length === 0 ? (
        <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
          <p className="text-center text-sm text-gray-500 mt-2">{emptyMessage}</p>
        </section>
      ) : (
        jobs.map(renderJobCard)
      )}
    </article>
  );

  const openJobs = getJobsByStatus('open');
  const activeJobs = getJobsByStatus('active');
  const completedJobs = getJobsByStatus('completed');

  return (
    <main className='p-6'>
      <section className='w-full max-w-275 m-auto'>
        {renderJobSection('Open Jobs', openJobs, 'No open jobs at the moment.')}
        {renderJobSection('Active Jobs', activeJobs, 'No active jobs at the moment.')}
        {renderJobSection('Completed Jobs', completedJobs, 'No completed jobs at the moment.')}
      </section>
    </main>
  );
};

export default OpenJobs;