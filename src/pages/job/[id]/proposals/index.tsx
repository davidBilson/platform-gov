"use client"
import React, { useEffect, useState } from 'react';
import JobDetails from './_jobDetails';
import ProposalsList from './_proposalsList';
import { IoMdArrowDropdown } from "react-icons/io";
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { fetchJob } from '@/api/job-api';
import { Jobs } from '@/types/jobs';

const SingleJobProposals = () => {

  const router = useRouter();

  const { id } = router.query;
  const { role } = useAuthStore();
  const [job, setJob] = useState<Jobs | null>(null);
  const [jobStatus, setJobStatus] = useState<string | ''>('');


  useEffect(() => {
    if (typeof window !== 'undefined' && role === "contractor") {
      const timer = setTimeout(() => {
        router.back();
      }, 100);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [role]);
  
  useEffect(() => {
    const loadJob = async () => {
      if (id) {
        try {
          const jobData = await fetchJob(id as string);
          setJob(jobData);
          setJobStatus(jobData?.status ?? "");
        } catch (error) {
          console.error('Error loading job:', error);
          setJob(null);
        }
      }
    };
    
    loadJob();
  }, [id]);

  return (
    <main className='container mx-auto p-6'>

        <JobDetails job={job} jobStatus={jobStatus} />

        <section className='flex flex-wrap items-start md:items-center gap-7.5 justify-between mb-7.5'>
          <h2 className=' font-semibold text-xl'>Proposals</h2>
          <div className='flex items-center gap-7.5'>
            <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input type="text" placeholder="Filter By"  className="text-boldblue placeholder:text-boldblue font-semibold outline-none w-[80%]"/>
              <button type="button" className="focus:outline-none"><IoMdArrowDropdown /></button>
            </div>
            <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input type="text" className="text-boldblue placeholder:text-boldblue font-semibold outline-none w-[80%]" placeholder="Sort By" />
              <button type="button" className="focus:outline-none"><IoMdArrowDropdown /></button>
            </div>
          </div>
        </section>

        <ProposalsList jobId={Array.isArray(id) ? id[0] : id || ''} jobStatus={jobStatus} />

    </main>

  )
}

export default SingleJobProposals;