import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobList from './_jobList';
import JobCountFilters from './_jobCountFilters';
import JobFilter from './_jobFilter';
import { Jobs, PaginationInfo, JobsResponse } from '@/types/jobs';

const JobFeed: React.FC = () => {
  
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 });

  useEffect(() => {

    const fetchJobs = async () => {
      try {
        
        setLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const endpoint = process.env.NEXT_PUBLIC_GET_ALL_JOBS || '';
        
        const response = await axios.get<JobsResponse>(`${baseUrl}${endpoint}`);
        
        if (response.data.success) {
          setJobs(response.data.data);
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

    fetchJobs();
  }, []);

  return (
    <main className="container mx-auto p-6">
      {/* Search Bar and Filters Section */}
      <JobFilter />
      
      {/* Job count and active filters */}
      <JobCountFilters jobCount={pagination.total} />
      
      {/* Job Listing */}
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <JobList key={job._id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
};

export default JobFeed;