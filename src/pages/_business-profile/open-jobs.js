import React, { useState, useEffect } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaRegHourglass } from "react-icons/fa6";

const OpenJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all jobs from your API
    fetch('http://localhost:5050/api/jobs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Filter jobs by status
  const openJobs = jobs.filter(job => job.status === 'open');
  const activeJobs = jobs.filter(job => job.status === 'active');

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className='p-6'>
      <section className='w-full max-w-[1100px] m-auto'>
        {/* Open Jobs Section */}
        <article>
          <h2 className='font-semibold text-xl mb-[15px]'>Open Jobs</h2>
          
          {openJobs.length === 0 ? (
            <p>No open jobs at the moment.</p>
          ) : (
            openJobs.map(job => (
              <div key={job.id} className='border-b border-b-[#ccc] pb-10 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                  {/* date and time job was posted */}
                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.postedAt).toLocaleDateString()} {new Date(job.postedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  {/* number of proposals */}
                  <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>
                    {job.proposalsCount} Proposals
                  </button>
                </div>

                <p className='text-sm mb-[15px] font-semibold'>Job Category</p>
                <h3 className='font-semibold text-xl mb-[15px]'>{job.title}</h3>

                <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                  <div className='flex items-center gap-2'>
                    <FaRegHourglass size={18} />
                    <p>
                      {job.location} | {job.workType}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaLocationDot size={18} />
                    <p>
                      {job.location} | {job.workType}
                    </p>
                  </div>
                </div>

                <p className='text-[16px] mb-[15px]'>{job.description}</p>

                <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
                  {job.category}
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
              <div key={job.id} className='border-b border-b-[#ccc] pb-10 mb-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                  {/* date and time job was posted */}
                  <p className="text-[12px] text-[#808080]">
                    Posted {new Date(job.postedAt).toLocaleDateString()} {new Date(job.postedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>

                  {/* number of proposals */}
                  <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>
                    {job.proposalsCount} Proposals
                  </button>
                </div>

                <p className='text-sm mb-[15px] font-semibold'>Job Category</p>
                <h3 className='font-semibold text-xl mb-[15px]'>{job.title}</h3>

                <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                  <div className='flex items-center gap-2'>
                    <FaRegHourglass size={18} />
                    <p>
                      {job.location} | {job.workType}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaLocationDot size={18} />
                    <p>
                      {job.location} | {job.workType}
                    </p>
                  </div>
                </div>

                <p className='text-[16px] mb-[15px]'>{job.description}</p>

                <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>
                  {job.category}
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