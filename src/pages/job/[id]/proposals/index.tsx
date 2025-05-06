"use client"
import React from 'react';
import JobDetails from './_jobDetails';
import ProposalsList from './_proposalsList';
import { IoMdArrowDropdown } from "react-icons/io";
import { useRouter } from 'next/router';

const SingleJobProposals = () => {

  const router = useRouter();
  const { id } = router.query;

  return (

    <main className='container mx-auto p-6'>
        <JobDetails jobId={id} />

        <section className='flex flex-wrap items-start md:items-center gap-7.5 justify-between mb-7.5'>
          <h2 className=' font-semibold text-xl'>Proposals</h2>
          
          <div className='flex items-center gap-7.5'>
            <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input type="text" placeholder="Filter By" />
              <button type="button" className="focus:outline-none"><IoMdArrowDropdown /></button>
              {/* <IoMdArrowDropup /> */}
            </div>
            <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
              <input type="text" className="text-boldblue placeholder:text-boldblue font-semibold outline-none w-[80%]" placeholder="Sort By" />
              <button type="button" className="focus:outline-none"><IoMdArrowDropdown /></button>
              {/* <IoMdArrowDropup /> */}
            </div>
          </div>
        </section>

        <ProposalsList jobId={id} />
    </main>

  )
}

export default SingleJobProposals;