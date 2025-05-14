import React, { useEffect, useState, useCallback } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from '../../../components/chat/_messages'
import Milestones from './_milestones';
import Retainer from './_retainer';
import { fetchJob } from '@/api/job-api';
import { Jobs } from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import { getSingleContract } from '@/api/contract-api';
import { useQuery } from '@tanstack/react-query';

interface ContractContractorProps {
    hiringId?: string;
    jobId: string;
    proposalId: string;
    tab?: string;
}

const TAB_OPTIONS = ['details', 'milestones', 'messages'];

const ContractContractor = ({ jobId, proposalId, tab }: ContractContractorProps) => {
    
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState<Jobs | null>(null);

    const [mutualContractId, setMutualContractId] = useState('')
    
    const { userId, name} = useAuthStore();

    const fetchJobData = useCallback(async () => {
        if (!jobId) return;
        try {
            const jobData = await fetchJob(jobId as string);
            setJob(jobData);
        } catch (error) {
            console.error('Error loading job:', error);
            setJob(null);
        }
    }, [jobId]);

    useEffect(() => {
        fetchJobData();
    }, [fetchJobData]);



    // Set active tab when tab prop changes
    useEffect(() => {
        if (tab && TAB_OPTIONS.includes(tab)) {
            setActiveTab(tab);
        }
    }, [tab]);

   useQuery({
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
            return !query.state.data ? 20000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: Infinity

    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return job !== null && (
                    <Details 
                        job={{
                            ...job,
                            userId: job.userId ? { _id: job.userId._id } : undefined
                        }} 
                        jobId={jobId} 
                        applicationId={proposalId} 
                    />
                );
            case 'timesheet':
                return <Timesheet />;
            case 'milestones':
                return <Milestones mutualContractId={mutualContractId} />;
            case 'retainer':
                return <Retainer />;
            case 'messages':
                return (
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
                            name: job?.userId?.name,
                            profilePicture: ""
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main>
            <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>
                <h1 className='font-bold text-xl'>{job?.jobTitle ?? ""}</h1>
                <div className='flex items-center md:gap-10 pt-5.5'>
                    {TAB_OPTIONS.map((tabOption) => (
                        <button 
                            key={tabOption}
                            onClick={() => setActiveTab(tabOption)}
                            className={`border-b-3 pb-5 px-5 text-sm text-darkgray cursor-pointer ${
                                activeTab === tabOption 
                                    ? 'border-b-boldblue' 
                                    : 'border-b-transparent hover:border-b-skyblue'
                            }`}
                        >
                            {tabOption.charAt(0).toUpperCase() + tabOption.slice(1)}
                        </button>
                    ))}
                </div>
            </section>

            <section className='w-full'>
                {renderTabContent()}
            </section>
        </main>
    )
}

export default ContractContractor;