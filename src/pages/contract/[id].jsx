import useAuthStore from '@/store/useAuth'
import React from 'react'
import { useRouter } from 'next/router'
import ContractClient from './_contractClient'
import ContractContractor from './_contractContractor'

const AllContracts = () => {
  const router = useRouter()
  const { role } = useAuthStore();

  const contractId = router.query.id;
  const proposalId = router.query.proposalId ||router.query.id ;
  const jobId = router.query.jobId;

  return (
    <main className='w-full max-w-275 mx-auto p-5 pb-20 md:p-6'>
      {role === "client" && <ContractClient contractId={contractId} jobId={jobId} proposalId={proposalId} />}
      
      {role === "contractor" && <ContractContractor contractId={contractId} jobId={jobId} proposalId={proposalId} />}
    </main>
  )
}

export default AllContracts