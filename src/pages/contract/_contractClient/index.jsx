import React, { useEffect, useState, useCallback } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from '../../../components/chat/_messages';
import { fetchApplication, fetchJob } from '@/api/job-api';
import useAuthStore from '@/store/useAuth';
import Milestones from './_milestones';
import { getSingleContract } from '@/api/contract-api';

// varTab could later be replaced with a dynamic value
const varTab = "milestones";
const TAB_OPTIONS = ['details', varTab, 'messages'];

const ContractClient = ({ contractId, jobId, proposalId, tab }) => {
    const [applicationDetail, setApplicationDetail] = useState(null);
    const [activeTab, setActiveTab] = useState(tab || 'details');
    const [job, setJob] = useState(null);
    const { userId, name } = useAuthStore();
    const [mutualContract, setMutualContract] = useState(null);

    const fetchJobData = useCallback(async () => {
        if (!jobId) return;
        try {
            const jobData = await fetchJob(jobId);
            setJob(jobData);
        } catch (error) {
            console.error('Error loading job:', error);
            setJob(null);
        }
    }, [jobId]);

    const fetchApplicationData = useCallback(async () => {
        try {
            const application = await fetchApplication(proposalId);
            if (application?.data) {
                setApplicationDetail(application.data);
            }
        } catch (error) {
            console.error('Error loading application:', error);
        }
    }, [proposalId]);

    useEffect(() => {
        const fetchSingleMutualContract =  async () => {
            if (contractId && userId && applicationDetail?.freelancerId) {
                try {
                    const mutualContract = await getSingleContract({
                        hiringId: contractId,
                        clientId: userId,
                        contractorId: applicationDetail?.freelancerId
                    })
                    if (mutualContract) {
                        console.log(mutualContract)
                        setMutualContract(mutualContract.data);
                    }
                } catch (error) {
                    console.error('Error loading contract:', error);
                }
            }
        }
        fetchSingleMutualContract();
    }, [contractId, userId, applicationDetail?.freelancerId])

    useEffect(() => {
        fetchJobData();
        fetchApplicationData();
    }, [fetchJobData, fetchApplicationData]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return job && <Details job={job} jobId={jobId} applicationDetail={applicationDetail} />;
            case 'timesheet':
                return <Timesheet />;
            case 'milestones':
                // 
                return mutualContract && <Milestones mutualContractId={mutualContract._id} />;
            case 'messages':
                return (
                    <Messages
                        hiringId={contractId}
                        currentUser={{
                            _id: userId,
                            name: name,
                            profilePicture: ""
                        }}
                        otherUser={{
                            _id: applicationDetail?.freelancerId,
                            name: applicationDetail?.freelancerName,
                            profilePicture: applicationDetail?.freelancerProfileId?.profileImage
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className='w-full'>
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
    );
};

export default React.memo(ContractClient);