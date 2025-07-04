// client
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Details from './_details';
import Messages from '../../../components/chat/_messages';
import { fetchApplication, fetchJob } from '@/api/job-api';
import useAuthStore from '@/store/useAuth';
import Milestones from './_milestones';
import { getSingleContract } from '@/api/contract/contract-api';
import { useQuery } from '@tanstack/react-query';
import LoadingAnimation from '@/components/ui/loading';
import ClientTimesheet from './_timesheet';
import ClientRetainer from './_retainer';
import PaymentModal from '@/components/payment/PaymentModal';
import FundProjectBtn from '@/components/payment/FundProjectBtn';
import { FaDollarSign, FaEdit } from 'react-icons/fa';
import PaymentTransferModal from '@/components/payment/timeBasedPayout/paymentTransferModal';
import { startContract } from '@/api/payment/time-based-payment';
import EditContract from '@/components/contracts/editContract';
import { toast } from 'react-toastify';

const ContractClient = ({ jobId, proposalId, tab }) => {

    const { userId, name } = useAuthStore();

    const [applicationDetail, setApplicationDetail] = useState(null);
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState(null);
    const [jobIsFunded, setJobIsFunded] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showEditContractModal, setShowEditContractModal] = useState(false);
    const [mutualContractId, setMutualContractId] = useState('');
    const [contract, setContract] = useState(null);
    const [contractStatus, setContractStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [middleTab, setMiddleTab] = useState('milestone');
    
    const [retainerRefreshTrigger, setRetainerRefreshTrigger] = useState(0);

    const tabOptions = useMemo(() => {
        return ['details', middleTab, 'messages'];
    }, [middleTab]);

    const fetchJobData = useCallback(async () => {
        if (!jobId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const jobData = await fetchJob(jobId);
            if (jobData) {
                setJob(jobData);
                setJobIsFunded(jobData.isFunded);
                // Set middleTab based on payment type
                if (jobData.paymentType === 'hourly') {
                    setMiddleTab('timesheet');
                } else if (jobData.paymentType === 'retainer') {
                    setMiddleTab('retainer');
                } else {
                    // Default to milestone for fixed-price or if not specified
                    setMiddleTab('milestone');
                }
            } else {
                setError('Job information could not be found.');
            }
        } catch (error) {
            console.error('Error loading job:', error);
            setError('Failed to load job details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    const fetchApplicationData = useCallback(async () => {
        if (!proposalId) {
            console.warn('No proposal ID provided');
            return;
        }
        try {
            const application = await fetchApplication(proposalId);

            if (application?.data) {
                setApplicationDetail(application.data);
            } else {
                console.warn('No application data received');
            }
        } catch (error) {
            console.error('Error loading application:', error);
        }
    }, [proposalId]);

    const intializeContract = async () => {
        if (!mutualContractId) {
            toast.error('Contractor has not accepted contract')
            return;
        }
        if (!contract?.isStarted) {
            try {
                await startContract(mutualContractId, userId)
                toast.success('Contract started')
                refetchContract();
            } catch (error) {
                console.log(error)
            }

        }
    }

    const initiatePayment = () => {
        if (!contract) return;
        setShowTransferModal(true)
    };

    // Function to trigger retainer refresh
    const triggerRetainerRefresh = () => {
        setRetainerRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        fetchJobData();
        fetchApplicationData();
    }, [fetchJobData, fetchApplicationData]);

    const {
        data: contractData,
        isLoading: contractLoading,
        error: contractError,
        refetch: refetchContract
    } = useQuery({
        queryKey: ['mutualContract', jobId, userId, applicationDetail?.freelancerId],
        queryFn: async () => {
            if (!jobId || !userId || !applicationDetail?.freelancerId) {
                return null;
            }

            const contractQueryParams = {
                jobId: jobId,
                clientId: userId,
                contractorId: applicationDetail.freelancerId
            };

            const response = await getSingleContract(contractQueryParams);

            if (response.success && response.data) {
                if (response.data._id) {
                    setMutualContractId(response.data._id);
                    setContract(response.data);
                    setContractStatus(response?.data?.status);
                    if (response.data.paymentStructure) {
                        setMiddleTab(response.data.paymentStructure);
                    }
                }
                return response.data;
            }
            return null;
        },
        enabled: !!jobId && !!userId && !!applicationDetail?.freelancerId,
        refetchInterval: (query) => {
            return !query.state.data ? 5000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: 60000,
        retry: (failureCount, error) => {
            return failureCount < 2;
        },
        retryDelay: 5000
    });

    useEffect(() => {
        if (activeTab !== 'details' && activeTab !== 'messages' && activeTab !== middleTab) {
            setActiveTab(middleTab);
        }
    }, [activeTab, middleTab]);

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className='flex items-center justify-center h-[60vh]'>
                    <LoadingAnimation />
                </div>
            );
        }

        if (error) {
            return (
                <div className='flex flex-col items-center justify-center h-[60vh] px-4 text-center'>
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-opacity-90 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'details':
                return job && <Details job={job} jobId={jobId} applicationDetail={applicationDetail} contract={contract} />;
            case 'timesheet':
                return <ClientTimesheet
                    refetchContract={refetchContract}
                    contractStarted={contract?.isStarted}
                    jobId={jobId}
                    jobIsFunded={jobIsFunded}
                    contractStatus={contractStatus}
                    mutualContractId={mutualContractId}
                />;
            case 'retainer':
                return <ClientRetainer
                    intializeContract={intializeContract}
                    contractStatus={contractStatus}
                    job={job}
                    mutualContractId={mutualContractId}
                    refreshTrigger={retainerRefreshTrigger}
                />;
            case 'milestone':
                return <Milestones 
                jobId={jobId} 
                jobIsFunded={jobIsFunded} 
                contractStatus={contractStatus} 
                mutualContractId={mutualContractId} 
                isLoading={contractLoading && !mutualContractId} />;
            case 'messages':
                return applicationDetail?.freelancerId ? (
                    <Messages jobId={jobId} proposalId={proposalId} currentUser={{ _id: userId, name: name, }} otherUser={{ _id: applicationDetail?.freelancerId, name: applicationDetail?.freelancerName, }} />
                ) : (<div className='flex items-center justify-center h-[60vh]'> <p>Loading conversation details...</p></div>);
            default:
                return null;
        }
    };

    return (
        <>

            {/* Redirect to payment page for fixed contract to fund job */}
            {showPaymentModal && job && (
                <PaymentModal
                    jobId={jobId}
                    mutualContractId={mutualContractId}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}

            {/* Initiate payment to contractor */}
            {
                showTransferModal &&
                <PaymentTransferModal
                    refetchContract={refetchContract}
                    job={job}
                    jobId={jobId}
                    contract={contract}
                    mutualContractId={mutualContractId}
                    onClose={() => setShowTransferModal(false)}
                    // Add callback to trigger retainer refresh for retainer jobs
                    onPaymentSuccess={() => {
                        if (job?.paymentType === 'retainer') {
                            triggerRetainerRefresh();
                        }
                    }}
                />
            }

            {!contract?.isStarted && showEditContractModal &&
                <EditContract
                    job={job}
                    jobId={jobId}
                    contract={contract}
                    fetchJobData={fetchJobData}
                    mutualContractId={mutualContractId}
                    onClose={() => setShowEditContractModal(false)}
                />
            }

            <main className='w-full'>
                <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>

                    <div className='flex items-center justify-between gap-4'>
                        <h1 className='font-bold text-xl'>{job?.jobTitle ?? "Contract Details"}</h1>

                        {(() => {
                            const isTimeBased = job?.paymentType === 'hourly' || job?.paymentType === 'retainer';

                            return !jobIsFunded && job?.paymentType === 'fixed-price' ? (
                                <FundProjectBtn onClick={() => setShowPaymentModal(true)} />
                            ) : isTimeBased ? (
                                !contract?.isStarted ? (
                                    <div className='flex items-center pt-6 gap-3'>
                                        <button onClick={() => setShowEditContractModal(true)} className='bg-deepskyblue hover:bg-deepskyblue/70 rounded py-2 px-4 h-fit w-fit text-white cursor-pointer flex items-center gap-2 text-sm font-semibold'>
                                            Edit Contract <FaEdit />
                                        </button>
                                        <button onClick={intializeContract} className='cursor-pointer bg-boldblue text-white text-sm py-2 px-4 font-semibold hover:bg-boldblue/70 rounded'>
                                            Start Contract
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={initiatePayment} className={`${contract?.isPaymentAmountConfirmed ? 'bg-aquagreen hover:bg-aquagreen/70' : 'bg-deepskyblue hover:bg-deepskyblue/70'} rounded py-2 px-4 h-fit w-fit text-white cursor-pointer flex items-center gap-2 text-sm font-semibold mt-6`}>
                                        Pay Now <FaDollarSign />
                                    </button>
                                )
                            ) : null;
                        })()}
                    </div>

                    <div className='flex items-center md:gap-10 pt-5.5'>
                        {tabOptions.map((tabOption) => (
                            <button
                                key={tabOption}
                                onClick={() => setActiveTab(tabOption)}
                                className={`border-b-3 pb-5 px-5 text-sm text-darkgray cursor-pointer ${activeTab === tabOption
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
        </>
    );
};

export default React.memo(ContractClient);