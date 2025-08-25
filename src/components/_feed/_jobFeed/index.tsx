// React and Hooks
import React, { useEffect, useState } from 'react';

// Third-Party Libraries
import axios from 'axios';
import { IoReload } from "react-icons/io5";

// Types
import { Jobs, PaginationInfo, JobsResponse } from '@/types/jobs';

// Store
import { useJobFilter } from '@/store/useJobFilter';
import useAuthStore from '@/store/useAuth'; // Added for subscription status

// UI Components
import LoadingAnimation from '@/components/ui/loading';

// Internal Components
import JobList from './_jobList';
import JobCountFilters from './_jobCountFilters';
import JobFilter from './_jobFilter';
import DotLoader from '@/components/ui/dotloader';

import { fetchEarlyAccessDuration } from '@/api/subscription-api';


const JobFeed = () => {
  const [allJobs, setAllJobs] = useState<Jobs[]>([]); // All fetched jobs from server
  const [filteredJobs, setFilteredJobs] = useState<Jobs[]>([]); // Jobs after applying filters
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 20, pages: 0 });
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [earlyAccessHours, setEarlyAccessHours] = useState<number>(24); // Default to 24 hours

  const { activeFilters, removeFilter } = useJobFilter()
  const { isSubscribed } = useAuthStore() // Get subscription status

  // ============== FETCH EARLY ACCESS DURATION ==============
  
  useEffect(() => {
    const getEarlyAccessDuration = async () => {
      try {
        const response = await fetchEarlyAccessDuration();
        if (response.success) {
          setEarlyAccessHours(response.earlyAccessDurationHours);
        }
      } catch (error) {
        console.error('Error fetching early access duration:', error);
        // Keep default value of 24 hours if fetch fails
      }
    };

    getEarlyAccessDuration();
  }, []);

  // ============== EARLY ACCESS IMPLEMENTATION START ==============

  const applyEarlyAccessFilter = (jobs: Jobs[]): Jobs[] => {
    if (isSubscribed) {
      // Subscribed users get immediate access to all jobs
      return jobs;
    }

    // For unsubscribed users, filter out jobs posted within the early access duration
    const currentTime = new Date();
    
    return jobs.filter(job => {
      const jobPostedTime = new Date(job.createdAt);
      const timeDifferenceInHours = (currentTime.getTime() - jobPostedTime.getTime()) / (1000 * 60 * 60);
      
      // Only show jobs that are older than the early access duration for unsubscribed users
      return timeDifferenceInHours >= earlyAccessHours;
    });
  };
  
  // =============== EARLY ACCESS IMPLEMENTATION END ===============

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
        
        // ============== APPLY EARLY ACCESS FILTER HERE ==============
        const accessFilteredJobs = applyEarlyAccessFilter(newJobs);
        // =============================================================

        if (reset) {
          setAllJobs(accessFilteredJobs); // Store only accessible jobs
          if (!hasActiveFilters) {
            setFilteredJobs(accessFilteredJobs);
          }
        } else {
          setAllJobs(prevJobs => {
            const updatedJobs = [...prevJobs, ...accessFilteredJobs];
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

  // ============== RE-APPLY EARLY ACCESS FILTER WHEN SUBSCRIPTION CHANGES ==============
  
  /**
   * When subscription status changes, re-filter existing jobs
   * This handles cases where user subscribes/unsubscribes during the session
   */
  useEffect(() => {
    if (allJobs.length > 0) {
      // Re-fetch jobs to get the correct set based on new subscription status
      // This is important because we might have previously filtered out jobs
      // that should now be visible (if user just subscribed)
      fetchJobs();
    }
  }, [isSubscribed]);
  
  // ================================================================================

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
              {loadingMore ?
                <DotLoader />
                : <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-aquagreen cursor-pointer text-white px-4 py-2 rounded-lg font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Load More Jobs
                </button>
              }
            </div>
          )}
        </div>
      ) : loading ? (
        <div className='flex items-center justify-center h-[60vh]'>
          <DotLoader />
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