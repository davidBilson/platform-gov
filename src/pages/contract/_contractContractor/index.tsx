import React, { useEffect, useState } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from '../../../components/chat/_messages'
import Milestones from './_milestones';
import Retainer from './_retainer';
import { fetchJob } from '@/api/job-api';
import { Jobs } from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import { getHiringOffer } from '@/api/hiring';
import { getSingleContract } from '@/api/contract-api';
import { useQuery } from '@tanstack/react-query';

interface HiringDocument {
    jobId: { description: string };
    offerDetails: {
      rate: number;
      paymentType: string;
      employmentType: string;
      startDate: string;
    };
    clientNotes: string;
    applicationId: { coverLetter: string };
    status: string;
}

interface ContractContractorProps {
    hiringId?: string;
    jobId: string;
    proposalId: string;
}

const ContractContractor = ({ jobId, proposalId }: ContractContractorProps) => {
    
    const [activeTab, setActiveTab] = useState('details');
    const [job, setJob] = useState<Jobs | null>(null);

    const [, setHiringOffer] = useState<HiringDocument>();
    const [, setHiringId] = useState<string>('');
    const [mutualContractId, setMutualContractId] = useState('')
    
    const { userId, role, name} = useAuthStore();

    useEffect(() => {
        const loadJob = async () => {
        if (jobId) {
            try {
                const jobData = await fetchJob(jobId as string);
                setJob(jobData);
            } catch (error) {
                console.error('Error loading job:', error);
                setJob(null);
            }
        }
        };
        loadJob();
    }, [jobId]);

    useEffect(() => {

        if (!userId || role !== 'contractor'){
          return;
        }
    
        const fetchHiringOffer = async () => {
          try {
            const offer = await getHiringOffer(jobId, proposalId);
            setHiringOffer(offer);
            setHiringId(offer?._id);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchHiringOffer();
      }, [jobId, proposalId]);

      const { data: mutualContract } = useQuery({
        queryKey: ['mutualContract', jobId, job?.userId?._id, userId],
        queryFn: async () => {
            if (!job?.userId?._id || !userId) return null;
            const response = await getSingleContract({
                jobId: jobId,
                clientId: job.userId._id,
                contractorId: userId
            });
            setMutualContractId(response?.data._id)
            console.log(response?.data._id)
            return response?.data || null;
        },
        enabled: !!job?.userId?._id && !!userId,
        refetchInterval: (query) => {
            return !query.state.data ? 5000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: Infinity
    });

    return (
        <main>
            <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>
                <h1 className='font-bold text-xl'>{job?.jobTitle ?? ""}</h1>
                <div className='flex items-center md:gap-10 pt-5.5'>
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`border-b-3 hover:border-b-skyblue pb-5 px-5 text-sm text-darkgray cursor-pointer ${
                            activeTab === 'details' 
                                ? 'border-b-boldblue' 
                                : 'border-b-transparent'
                        }`}
                    >
                        Details
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('milestones')}
                        className={`border-b-3  pb-5 px-5 text-sm text-darkgray cursor-pointer ${
                            activeTab === 'milestones' 
                                ? 'border-b-boldblue' 
                                : 'border-b-transparent'
                        }`}
                    >
                        Milestones
                    </button>

                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`border-b-3 pb-5 px-5 text-sm text-darkgray cursor-pointer ${
                            activeTab === 'messages' 
                                ? 'border-b-boldblue' 
                                : 'border-b-transparent'
                        }`}
                    >
                        Messages
                    </button>
                </div>
            </section>

            <section className={activeTab === 'details' ? 'block' : 'hidden'}>
               {job !== null && (
                   <Details 
                       job={{
                           ...job,
                           userId: job.userId ? { _id: job.userId._id } : undefined
                       }} 
                       jobId={jobId} 
                       applicationId={proposalId} 
                   />
               )}
            </section>
            <section className={activeTab === 'timesheet' ? 'block' : 'hidden'}>
                <Timesheet />
            </section>
            <section className={activeTab === 'milestones' ? 'block' : 'hidden'}>
                <Milestones 
                    mutualContractId={mutualContractId}
                />
            </section>
            <section className={activeTab === 'retainer' ? 'block' : 'hidden'}>
                <Retainer />
            </section>
            <section className={activeTab === 'messages' ? 'block' : 'hidden'}>
                <Messages
                    jobId={jobId}
                    proposalId={proposalId}
                    
                    currentUser={{
                        _id: userId,
                        name: name,
                        profilePicture: ""
                    }}

                    otherUser={{
                        _id: job?.userId?._id,
                        name:job?.userId?.name,
                        profilePicture: ""
                    }}
                    
                />
            </section>
            
        </main>
    )
}

export default ContractContractor