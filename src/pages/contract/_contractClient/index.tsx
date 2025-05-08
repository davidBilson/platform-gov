import React, { useState } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from './_messages'

// so you can either make request with contractId and userId alone or make request with jobId and proposalId
// you make request with contractId and userId when you go from /contract to /contract/:id
// you make request with jobId and proposalId when you go from /proposals to /contract/:id

interface ContractClientProps {
    contractId?: string;
    jobId: string;
    proposalId: string;
}

const ContractClient = ({ contractId, jobId, proposalId }: ContractClientProps) => {

    const [activeTab, setActiveTab] = useState('details');

    console.log('contractId', contractId);
    console.log('jobId', jobId);
    console.log('proposalId', proposalId);

    // make request using contractId and userId if jobId and proposalId are not provided


    // need to fetch job details and client information

    // FOR PENDING CONTRACT (contractor is yet to accept)

    // 1. show job details and contractor details
    // show sign document fixed bar at the bottom
    // it shows the documents you need to sign, this shows the hiring offer details as a ui
    // then contractor has to sign
    // after signin you can now accept the job
    // FOR ACTIVE CONTRACT (contractor has accepted)

    return (
        <main className='w-full'>
            <section className='w-full mx-auto bg-skyblue border-b border-b-deepskyblue rounded-lg p-7.5 pb-0 mb-7.5'>
                <h1 className='font-bold text-xl'>Job Title Lorem ipsum dolor sit amet.</h1>
                {/* tabs */}
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
                        onClick={() => setActiveTab('timesheet')}
                        className={`border-b-3  pb-5 px-5 text-sm text-darkgray cursor-pointer ${
                            activeTab === 'timesheet' 
                                ? 'border-b-boldblue' 
                                : 'border-b-transparent'
                        }`}
                    >
                        Timesheet
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
                <Details />
            </section>
            <section className={activeTab === 'timesheet' ? 'block' : 'hidden'}>
                <Timesheet />
            </section>
            <section className={activeTab === 'messages' ? 'block' : 'hidden'}>
                <Messages />
            </section>
            
        </main>
    )
}

export default ContractClient;