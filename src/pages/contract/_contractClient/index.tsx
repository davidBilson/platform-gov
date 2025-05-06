import React, { useState } from 'react';
import Details from './_details';
import Timesheet from './_timesheet';
import Messages from './_messages'

const ContractClient = () => {

    const [activeTab, setActiveTab] = useState('messages');
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