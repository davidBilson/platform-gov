import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobList from './_jobList';
import JobCountFilters from './_jobCountFilters';
import JobFilter from './_jobFilter';
import { Jobs, PaginationInfo, JobsResponse } from '@/types/jobs';
import { IoReload } from "react-icons/io5";

const JobFeed: React.FC = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });
  const [activeFilters, setActiveFilters] = useState<Array<{id: string, name: string}>>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const endpoint = process.env.NEXT_PUBLIC_GET_ALL_JOBS || '';
      
      const response = await axios.get<JobsResponse>(`${baseUrl}${endpoint}`);
      
      if (response.data.success) {
        setJobs(response.data.data);
        setFilteredJobs(response.data.data); // Initialize filtered jobs with all jobs
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch jobs');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilteredJobs: Jobs[]) => {
    setFilteredJobs(newFilteredJobs);
    setSearchPerformed(true);
  };

  // Handle removing a filter
  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = activeFilters.filter(filter => filter.id !== filterId);
    setActiveFilters(updatedFilters);
    
    // If all filters are removed, reset to original jobs
    if (updatedFilters.length === 0) {
      setFilteredJobs(jobs);
      setSearchPerformed(false);
    }
  };

  return (
    <main className="container mx-auto p-6">
      <JobFilter 
        jobs={jobs} 
        onFilterChange={handleFilterChange} 
        setActiveFilters={setActiveFilters} 
        loading={loading}
      />
      
      <JobCountFilters 
        jobCount={filteredJobs.length} 
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
      />
      
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <JobList key={job._id} job={job} />
          ))}
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <p>Loading jobs...</p>
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
          <p>No jobs matched your search.</p>
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