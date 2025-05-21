// CONTRACTOR
import Messages from '../../../components/chat/_messages';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getSingleContract } from '@/api/contract/contract-api';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuth';
import { fetchJob } from '@/api/job-api';
import Milestones from './_milestones';
import { Jobs } from '@/types/jobs';
import Details from './_details';
import ContractorTimesheet from './_timesheet';
import ContractorRetainer from './_retainer';

interface ContractContractorProps {
    hiringId?: string;
    jobId: string;
    proposalId: string;
    tab?: string;
}

const ContractContractor = ({ jobId, proposalId, tab }: ContractContractorProps) => {
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState<Jobs | null>(null);
    const [mutualContractId, setMutualContractId] = useState('');
    const [middleTab, setMiddleTab] = useState('milestone');
    
    const { userId, name } = useAuthStore();

    // Use useMemo to update tabOptions whenever middleTab changes
    const tabOptions = useMemo(() => {
        return ['details', middleTab, 'messages'];
    }, [middleTab]);

    const fetchJobData = useCallback(async () => {
        if (!jobId) return;
        try {
            const jobData = await fetchJob(jobId as string);
            setJob(jobData);
            
            if (jobData?.paymentType === 'hourly') {
                setMiddleTab('timesheet');
            } else if (jobData?.paymentType === 'retainer') {
                setMiddleTab('retainer');
            } else {
                // Default to milestone for fixed-price or if not specified
                setMiddleTab('milestone');
            }
        } catch (error) {
            console.error('Error loading job:', error);
            setJob(null);
        }
    }, [jobId]);

    useEffect(() => {
        fetchJobData();
    }, [fetchJobData]);

    useEffect(() => {
        if (activeTab !== 'details' && activeTab !== 'messages' && activeTab !== middleTab) {
            setActiveTab(middleTab);
        }
    }, [activeTab, middleTab]);

    
    useEffect(() => {
        if (tab) {
            if (tab === 'details' || tab === 'messages' || tab === middleTab) {
                setActiveTab(tab);
            }
        }
    }, [tab, middleTab]);
    
    useEffect(() => {
        const fetchMutualContract = async () => {
            if (!job?.userId?._id || !userId) return null;
            
            const response = await getSingleContract({
                jobId: jobId,
                clientId: job.userId._id,
                contractorId: userId
            });
            if (response.success && response.data) {
                setMutualContractId(response.data._id);
                
                if (response.data.paymentStructure) {
                    setMiddleTab(response.data.paymentStructure);
                }
                return response.data;
            }
            return null;
        }
        fetchMutualContract();
    }, [job, userId, jobId])

    useQuery({
        queryKey: ['mutualContract', jobId, job?.userId?._id, userId],
        queryFn: async () => {
            if (!job?.userId?._id || !userId) return null;
            
            const response = await getSingleContract({
                jobId: jobId,
                clientId: job.userId._id,
                contractorId: userId
            });
            
            // Set contract ID regardless of success/failure
            if (response.success && response.data) {
                setMutualContractId(response.data._id);
                
                if (response.data.paymentStructure) {
                    setMiddleTab(response.data.paymentStructure);
                }
                return response.data;
            }
            return null;
        },
        enabled: !!job?.userId?._id && !!userId,
        refetchInterval: (query) => {
            return !query.state.data ? 20000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: Infinity,
        // Add retry configuration to prevent excessive retries on 404
        retry: (failureCount, error) => {
            console.log(error)
            return failureCount < 3;
        }
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
                return <ContractorTimesheet mutualContractId={mutualContractId} />;
            case 'milestone':
                return <Milestones mutualContractId={mutualContractId} />;
            case 'retainer':
                return <ContractorRetainer job={job} mutualContractId={mutualContractId} />;
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
                    {tabOptions.map((tabOption) => (
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
    );
};

export default ContractContractor;