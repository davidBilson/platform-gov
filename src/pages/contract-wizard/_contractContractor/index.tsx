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
import { FaDollarSign } from 'react-icons/fa';
import ConfirmPaymentAmount from '@/components/payment/timeBasedPayout/confirmPaymentAmount';

interface ContractContractorProps {
    hiringId?: string;
    jobId: string;
    proposalId: string;
    tab?: string;
}

interface Contract {
    _id: string;
    status: string;
    isPaymentAmountConfirmed: boolean;
    isStarted: boolean;
    jobId?: {
        _id: string;
    };
    contractorId?: {
        _id: string;
        name: string;
        bankAccounts?: any[];
    };
    clientId?: {
        _id: string;
        name: string;
    };
    timeBasedPayment?: {
        amount: number;
    };
}

const ContractContractor = ({ jobId, proposalId, tab }: ContractContractorProps) => {
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState<Jobs | null>(null);
    const [mutualContractId, setMutualContractId] = useState('');
    const [contract, setContract] = useState<Contract | null>(null);
    const [contractStatus, setContractStatus] = useState('');
    const [middleTab, setMiddleTab] = useState('milestone');
    const [showConfirmPaymentAmount, setShowConfirmPaymentAmount] = useState(false);
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState<string | null>(null);

    const { userId, name } = useAuthStore();

    const tabOptions = useMemo(() => {
        return ['details', middleTab, 'messages'];
    }, [middleTab]);

    // Extract bank accounts from contract data
    const bankAccounts = useMemo(() => {
        return contract?.contractorId?.bankAccounts || [];
    }, [contract?.contractorId?.bankAccounts]);

    const fetchJobData = useCallback(async () => {
        if (!jobId) {
            setJobError('Job ID is required');
            setJobLoading(false);
            return;
        }
        
        try {
            setJobLoading(true);
            setJobError(null);
            
            const jobData = await fetchJob(jobId as string);
            setJob(jobData);

            if (jobData?.paymentType === 'hourly') {
                setMiddleTab('timesheet');
            } else if (jobData?.paymentType === 'retainer') {
                setMiddleTab('retainer');
            } else {
                setMiddleTab('milestone');
            }
        } catch (error) {
            console.error('Error loading job:', error);
            setJobError(error instanceof Error ? error.message : 'Failed to load job data');
            setJob(null);
        } finally {
            setJobLoading(false);
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

    // Remove the duplicate fetchMutualContract function and useEffect
    // Only use the useQuery approach for better consistency

    const {
        data: contractData,
        isLoading: contractLoading,
        error: contractError,
        refetch: refetchContract
    } = useQuery({
        queryKey: ['mutualContract', jobId, job?.userId?._id, userId],
        queryFn: async () => {
            if (!job?.userId?._id || !userId) {
                throw new Error('Missing required user IDs');
            }

            const response = await getSingleContract({
                jobId: jobId,
                clientId: job.userId._id,
                contractorId: userId
            });

            if (!response.success) {
                // Don't throw error for 404 (no contract found)
                // This is expected when contractor hasn't accepted
                if (response.error?.status === 404) {
                    return null;
                }
                throw new Error(response.error?.message || 'Failed to fetch contract');
            }

            return response.data;
        },
        enabled: !!job?.userId?._id && !!userId && !jobLoading && !jobError,
        refetchInterval: (query) => {
            // Only refetch if no contract data and no error
            return (!query.state.data && !query.state.error) ? 20000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry on 404 (contract not found)
            if (error?.message?.includes('404') || error?.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });

    // Update state when contract data changes
    useEffect(() => {
        if (contractData) {
            setContract(contractData);
            setMutualContractId(contractData._id || '');
            setContractStatus(contractData.status || '');
            
            if (contractData.paymentStructure) {
                setMiddleTab(contractData.paymentStructure);
            }
        } else {
            setContract(null);
            setMutualContractId('');
            setContractStatus('');
        }
    }, [contractData]);

    // Create a wrapper function for refetch that the child components can use
    const handleRefetchContract = useCallback(async () => {
        try {
            const result = await refetchContract();
            return result.data;
        } catch (error) {
            console.error('Error refetching contract:', error);
            return null;
        }
    }, [refetchContract]);

    const renderTabContent = () => {
        // Show loading state
        if (jobLoading) {
            return <div className="flex justify-center items-center py-8">Loading job details...</div>;
        }

        // Show job error
        if (jobError) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-500 mb-4">Error loading job: {jobError}</p>
                    <button 
                        onClick={fetchJobData}
                        className="bg-boldblue text-white px-4 py-2 rounded hover:bg-boldblue/70"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        // Show contract error (only if it's not a 404)
        if (contractError && !contractError.message?.includes('404')) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-500 mb-4">Error loading contract: {contractError.message}</p>
                    <button 
                        onClick={() => refetchContract()}
                        className="bg-boldblue text-white px-4 py-2 rounded hover:bg-boldblue/70"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (!job) {
            return <div className="text-center py-8">No job data available</div>;
        }

        switch (activeTab) {
            case 'details':
                return (
                    <Details
                        job={{
                            ...job,
                            userId: job.userId ? { _id: job.userId._id } : { _id: '' }
                        }}
                        jobId={jobId}
                        applicationId={proposalId}
                        contract={contract}
                    />
                );
            case 'timesheet':
                return (
                    <ContractorTimesheet
                        refetchContract={handleRefetchContract}
                        contract={contract}
                        contractStatus={contractStatus}
                        mutualContractId={mutualContractId}
                    />
                );
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
            {showConfirmPaymentAmount && (
                <ConfirmPaymentAmount
                    contract={contract}
                    onClose={() => setShowConfirmPaymentAmount(false)}
                    fetchMutualContract={handleRefetchContract}
                />
            )}

            <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>
                <div className='flex items-center justify-between gap-4'>
                    <h1 className='font-bold text-xl'>{job?.jobTitle ?? "Contract Details"}</h1>
                    {contract && 
                     (contract.timeBasedPayment?.amount ?? 0) > 0 && 
                     !contract.isPaymentAmountConfirmed && 
                     contract.isStarted && (
                        <button 
                            onClick={() => setShowConfirmPaymentAmount(true)} 
                            className="bg-aquagreen hover:bg-aquagreen/70 rounded py-2 px-4 h-fit w-fit text-white cursor-pointer flex items-center gap-2 text-sm font-semibold mt-6"
                        >
                            Confirm Payment Amount <FaDollarSign />
                        </button>
                    )}
                </div>

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