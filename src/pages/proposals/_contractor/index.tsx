import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActiveProposals from './_activeProposals';
import PendingProposals from './_pendingProposals';
import DraftProposals from './_draftProposals';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Application } from '@/types/proposals';

const ContractorProposals = () => {

  const { userId, resetAll} = useAuthStore()
  const router = useRouter()

  const handleSignOut = () => {
    resetAll();
    router.push('/auth/sign-in');
  }

  const [applications, setApplications] = useState({
    pending: [],
    active: [],
    draft: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        setLoading(true);

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endPoint = process.env.NEXT_PUBLIC_GET_JOB_APPLICATION_BY_CONTRACTOR_ID?.replace(':id', userId);
        
        const response = await axios.get(
          `${baseURL}${endPoint}`
        );

        if (response.data.success) {

          // Filter applications by status
          const activeApplications = response.data.data.filter((app: Application) => app.status === 'active');
          const pendingApplications = response.data.data.filter((app: Application) => app.status === 'pending' || app.status === 'viewed');
          const draftApplications = response.data.data.filter((app: Application) => app.status === 'draft');
          
          setApplications({
            pending: pendingApplications,
            active: activeApplications,
            draft: draftApplications
          });

        } else {
          toast.error('Failed to fetch applications');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        toast.error('Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, [userId]);

    // Handle the loading state
    if (loading) {
      return (
        <section className='h-screen w-full fixed top-0 left-0 z-50  flex items-center justify-end'>
          <section className='w-full h-screen  p-4 md:p-7.5 overflow-y-auto'>
            <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
            </div>
          </section>
        </section>
      );
    }

    if (!userId)  {
        return (
        <main className='p-5 pb-20 md:p-6 flex items-center justify-center flex-col gap-7.5'>
          <p className='text-boldblue font-semibold'>You are not logged in</p>
          <button onClick={handleSignOut} className='outline-none bg-aquagreen px-6 py-2 text-white font-semibold rounded-lg transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer'>Sign in</button>
        </main>
      )
    }

  return (
    
    <main className='p-5 pb-20 md:p-6'>
      <ActiveProposals applications={applications.active} />
      <PendingProposals applications={applications.pending} />
      <DraftProposals applications={applications.draft} />
    </main>

  );
};

export default ContractorProposals;