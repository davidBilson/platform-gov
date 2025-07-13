// React and Hooks
import React, { useEffect, useState } from 'react';

// Third-Party Libraries
import axios from 'axios';
import { IoReload } from "react-icons/io5";

// Types
import { Jobs, PaginationInfo, JobsResponse } from '@/types/jobs';

// Store
import { useJobFilter } from '@/store/useJobFilter';

// UI Components
import LoadingAnimation from '@/components/ui/loading';

// Internal Components
import JobList from '../../_home/_jobFeed/_jobList';
import JobCountFilters from '../../_home/_jobFeed/_jobCountFilters';
import JobFilter from '../../_home/_jobFeed/_jobFilter';


const JobFeed = () => {
  const [allJobs, setAllJobs] = useState<Jobs[]>([]); // All fetched jobs from server
  const [filteredJobs, setFilteredJobs] = useState<Jobs[]>([]); // Jobs after applying filters
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 20, pages: 0 });
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);

  const { activeFilters, removeFilter } = useJobFilter()
  
  const fetchJobs = async (page: number = 1, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const endpoint = process.env.NEXT_PUBLIC_GET_ALL_JOBS || '';
      
      const response = await axios.get<JobsResponse>(`${baseUrl}${endpoint}?page=${page}&limit=20`);
      
      if (response.data.success) {
        const newJobs = response.data.data;
        
        if (reset) {
          setAllJobs(newJobs);
          if (!hasActiveFilters) {
            setFilteredJobs(newJobs);
          }
        } else {
          setAllJobs(prevJobs => {
            const updatedJobs = [...prevJobs, ...newJobs];
            // Only update filteredJobs if no active filters
            if (!hasActiveFilters) {
              setFilteredJobs(updatedJobs);
            }
            return updatedJobs;
          });
        }
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch jobs');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (newFilteredJobs: Jobs[]) => {
    setFilteredJobs(newFilteredJobs);
    setSearchPerformed(true);
    setHasActiveFilters(newFilteredJobs.length !== allJobs.length);
  };

  const handleLoadMore = async () => {
    if (pagination.page < pagination.pages) {
      await fetchJobs(pagination.page + 1, false);
    }
  };

  const canLoadMore = () => {
    return pagination.page < pagination.pages;
  };

  const handleRetry = () => {
    setError(null);
    fetchJobs();
  };

  return (
    <main className="container mx-auto p-6">
      <JobFilter 
        jobs={allJobs} 
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
          
          {canLoadMore() && !hasActiveFilters && (
            <div className="flex justify-center pt-8 pb-40">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-aquagreen cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  'Load More Jobs'
                )}
              </button>
            </div>
          )}
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
          <button onClick={handleRetry} className="bg-aquagreen text-white px-4 py-2 flex items-center gap-2 rounded-lg mx-auto text-sm mt-7.5 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out">
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