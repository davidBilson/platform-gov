import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JobPost from './_jobpost';
import Application from './_application';
import { Jobs } from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';
import { fetchJob } from '@/api/job-api';

const JobPostApplication = () => {
  const router = useRouter();
  const { userId, role } = useAuthStore();
  const { id: jobId } = router.query;
  
  const [showApplication, setShowApplication] = useState(false);
  const [job, setJob] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  
  const handleApply = () => {
    if (userId && role === "client") {
      return toast.error('Unauthorized! Sign up as a contractor to apply');
    }
    setShowApplication(true);
  };
  
  const handleClose = () => {
    setShowApplication(false);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const loadJob = async () => {
      if (jobId) {
        try {
          setLoading(true);
          const jobData = await fetchJob(jobId as string);
          setJob(jobData);
        } catch (error) {
          console.error('Error loading job:', error);
          setJob(null);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadJob();
  }, [jobId]);

  if (loading) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-end'>
        <section className='w-full h-screen p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        </section>
      </section>
    );
  }

  if (!job) {
    return <div className="flex justify-center items-center min-h-screen">Job not found</div>;
  }

  return (
    <main className='p-6 pt-7.5 relative overflow-hidden'>
      <JobPost job={job} onApply={handleApply} />
      
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