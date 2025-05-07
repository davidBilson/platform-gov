import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { fetchJob } from '@/api/job-api';
import { Jobs } from '@/types/jobs';
import { format } from 'date-fns';

interface JobDetailsProps {
  jobId?: string | string[];
}

const JobDetails = ({jobId}: JobDetailsProps) => {

  const [job, setJob] = useState<Jobs | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      if (jobId) {
        try {
          const jobData = await fetchJob(jobId as string);
          setJob(jobData);
        } catch (error) {
          console.error('Error loading job:', error);
          setJob(null);
        }
      }
    };
    
    loadJob();
  }, [jobId]);

  const postedDate = job?.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';

  return (
    <section className='w-full mx-auto bg-skyblue rounded-lg p-7.5 mb-7.5'>
        <div className='flex items-center justify-between mb-7.5'>
          <p className='font-bold text-sm text-boldblue'>Posted {postedDate}</p>
          <button className='p-2.5 w-fit h-fit bg-boldblue rounded-lg text-white'><IoIosArrowDown size={20} /></button>
        </div>

        <article className='flex flex-col gap-5 '>
          <p className='text-sm font-semibold'>{job?.jobCategory ?? ""}</p>
          <h1 className='font-bold text-xl'>{job?.jobTitle ?? ""}</h1>
          <p className='bg-deepskyblue text-sm text-white w-fit h-fit rounded-full py-1.25 px-2.5'>{job?.jobCategory ?? ""}</p>
        </article>
    </section>
  )
}

export default JobDetails;