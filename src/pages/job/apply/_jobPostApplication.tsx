import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JobPost from './_jobpost';
import Application from './_application';
import axios from 'axios';
import { Jobs } from '@/types/jobs';

const JobPostApplication = () => {
  const router = useRouter();
  const { id: jobId } = router.query;
  
  const [showApplication, setShowApplication] = useState(false);
  const [job, setJob] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to show the application form
  const handleApply = () => {
    setShowApplication(true);
  };
  
  // Function to close the application form
  const handleClose = () => {
    setShowApplication(false);
  };
  
  // Function to close when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    // Only fetch job data when jobId is available
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const endpoint = process.env.NEXT_PUBLIC_GET_SINGLE_JOB?.replace(':id', jobId as string) || '';
      
      const response = await axios.get(`${baseUrl}${endpoint}`);
      
      if (response.data.success) {
        setJob(response.data.data);
      } else {
        throw new Error('Failed to fetch job details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle the loading state
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading job details...</div>;
  }

  // Handle errors
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  // Handle case where job data is not available
  if (!job) {
    return <div className="flex justify-center items-center min-h-screen">Job not found</div>;
  }

  return (
    <main className='p-6 pt-7.5 relative overflow-hidden'>
      {/* Pass down the job data and handleApply function to JobPost */}
      <JobPost job={job} onApply={handleApply} />
      
      {/* Application form with slide animation */}
      {showApplication && (
        <div 
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-end transition-opacity duration-300 ease-in-out'
          onClick={handleOverlayClick}
        >
          <div 
            className="w-full md:max-w-3/6 h-screen bg-skyblue overflow-y-auto"
            style={{
              animation: 'slideIn 0.3s forwards'
            }}
          >
            <Application job={job} onClose={handleClose} />
          </div>
        </div>
      )}
      
      {/* Add keyframe animations to global style */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </main>
  );
};

export default JobPostApplication;