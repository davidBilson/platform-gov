import React, { useEffect, useState, useCallback } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from '../../../components/chat/_messages';
import { fetchApplication, fetchJob } from '@/api/job-api';
import useAuthStore from '@/store/useAuth';
import Milestones from './_milestones';
import { getSingleContract } from '@/api/contract-api';
import { useQuery } from '@tanstack/react-query';
import LoadingAnimation from '@/components/ui/loading';

const TAB_OPTIONS = ['details', "milestones", 'messages'];

const ContractClient = ({ hiringId, jobId, proposalId, tab }) => {
    const [applicationDetail, setApplicationDetail] = useState(null);
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState(null);
    const [mutualContractId, setMutualContractId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { userId, name } = useAuthStore();

    // Fetch job data
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

    // Fetch application data
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
                // We don't set error here as it's not critical - might be fixed with job data
            }
        } catch (error) {
            console.error('Error loading application:', error);
            // Don't set error state here to avoid blocking the main UI
        }
    }, [proposalId]);

    // Load initial data
    useEffect(() => {
        fetchJobData();
        fetchApplicationData();
    }, [fetchJobData, fetchApplicationData]);

    // Query for contract data using react-query
    const { 
        data: contractData,
        isLoading: contractLoading,
        error: contractError
    } = useQuery({
        queryKey: ['mutualContract', jobId, userId, applicationDetail?.freelancerId],
        queryFn: async () => {
            // Make sure we have all necessary data before querying
            if (!jobId || !userId || !applicationDetail?.freelancerId) {
                return null;
            }
            
            const contractQueryParams = {
                jobId: jobId,
                clientId: userId,
                contractorId: applicationDetail.freelancerId
            };
            
            // Log what we're querying with
            console.log('Querying contract with:', contractQueryParams);
            
            const response = await getSingleContract(contractQueryParams);
            
            if (response.success && response.data) {
                // Only set contract ID if we have valid data
                if (response.data._id) {
                    setMutualContractId(response.data._id);
                }
                return response.data;
            }
            
            if (response.error) {
                console.warn('Contract query error:', response.error);
                
                // Special handling for 404 - contract may not exist yet
                if (response.error.status === 404) {
                    return null; // Not an error, just not found yet
                }
                
                throw new Error(response.error.message || 'Failed to fetch contract');
            }
            
            return null;
        },
        enabled: !!jobId && !!userId && !!applicationDetail?.freelancerId,
        refetchInterval: (query) => {
            // If we don't have data yet, poll every 5 seconds
            return query.state.error || !query.state.data ? 5000 : false;
        },
        refetchIntervalInBackground: true,
        staleTime: 60000, // 1 minute instead of Infinity to ensure fresh data
        retry: 3, // Retry failed requests 3 times before giving up
        retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000) // Exponential backoff
    });

    // Render content based on active tab
    const renderTabContent = () => {
        // Show loading state while initial data loads
        if (loading) {
            return (
                <div className='flex items-center justify-center h-[60vh]'>
                    <LoadingAnimation />
                </div>
            );
        }
        
        // Show error message if critical data failed to load
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

        // Render tab content if we have the necessary data
        switch (activeTab) {
            case 'details':
                return job && 
                <Details 
                    job={job} 
                    jobId={jobId} 
                    applicationDetail={applicationDetail} 
                />;
            case 'timesheet':
                return <Timesheet />;
            case 'milestones':
                return <Milestones 
                    mutualContractId={mutualContractId}
                    isLoading={contractLoading && !mutualContractId} 
                />;
            case 'messages':
                return applicationDetail?.freelancerId ? (
                    <Messages
                        jobId={jobId}
                        proposalId={proposalId}
                        currentUser={{
                            _id: userId,
                            name: name,
                        }}
                        otherUser={{
                            _id: applicationDetail?.freelancerId,
                            name: applicationDetail?.freelancerName,
                        }}
                    />
                ) : (
                    <div className='flex items-center justify-center h-[60vh]'>
                        <p>Loading conversation details...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className='w-full'>
            <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>
                <h1 className='font-bold text-xl'>{job?.jobTitle ?? "Contract Details"}</h1>
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
    );
};

export default React.memo(ContractClient);