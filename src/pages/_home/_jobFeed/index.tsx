import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobList from '../../_home/_jobFeed/_jobList';
import JobCountFilters from '../../_home/_jobFeed/_jobCountFilters';
import JobFilter from '../../_home/_jobFeed/_jobFilter';
import { Jobs, PaginationInfo, JobsResponse } from '@/types/jobs';
import { IoReload } from "react-icons/io5";
import { useJobFilter } from '@/store/useJobFilter';
import LoadingAnimation from '@/components/ui/loading';

const JobFeed = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  const { activeFilters, removeFilter } = useJobFilter()
  
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const endpoint = process.env.NEXT_PUBLIC_GET_ALL_JOBS || '';
      
      const response = await axios.get<JobsResponse>(`${baseUrl}${endpoint}`);
      
      if (response.data.success) {
        console.log('Jobs fetched successfully:', response.data.data);
        setJobs(response.data.data);
        setFilteredJobs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch jobs');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (newFilteredJobs: Jobs[]) => {
    setFilteredJobs(newFilteredJobs);
    setSearchPerformed(true);
  };

  return (
    <main className="container mx-auto p-6">
      <JobFilter 
        jobs={jobs} 
        onFilterChange={handleFilterChange}
        loading={loading}
      />
      
      <JobCountFilters 
        jobCount={filteredJobs.length} 
        activeFilters={activeFilters}
        onRemoveFilter={removeFilter}
      />
      
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <JobList key={job._id} job={job} />
          ))}
        </div>
      ) : loading ? (
        <div className='flex items-center justify-center h-[60vh]'>
          <LoadingAnimation />
        </div>
      ) : error ? (
        <div className="text-boldblue text-center py-8">
          <p>
            {"Cannot fetch job list at this time. "}
          </p>
          <button onClick={() => fetchJobs()} className="bg-aquagreen text-white px-4 py-2 flex items-center gap-2 rounded-lg mx-auto text-sm mt-7.5 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out">
            Retry <IoReload />
          </button>
        </div>
      ) : searchPerformed ? (
        <div className="flex justify-center py-8 text-boldblue">
          <p>No jobs</p>
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <p>No jobs found.</p>
        </div>
      )}
    </main>
  );
};

export default JobFeed;