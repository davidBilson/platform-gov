import useAuthStore from '@/store/useAuth'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ContractClient from './_contractClient'
import ContractContractor from './_contractContractor'

const AllContracts = () => {
  const router = useRouter()
  const { role } = useAuthStore();

  const hiringId = router.query.id;
  const proposalId = router.query.proposalId || router.query.id ;
  const jobId = router.query.jobId;
  const tab = router.query.tab || 'details';


  useEffect(() => {
    console.log(jobId)
  }, [jobId])

  return (
    <main className='w-full max-w-275 mx-auto p-5 pb-20 md:p-6'>
      {role === "client" && <ContractClient hiringId={hiringId} jobId={jobId} proposalId={proposalId} tab={tab} />}
      
      {role === "contractor" && <ContractContractor hiringId={hiringId} jobId={jobId} proposalId={proposalId} tab={tab} />}
    </main>
  )
}

export default AllContracts