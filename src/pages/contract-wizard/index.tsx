import useAuthStore from '@/store/useAuth'
import React from 'react'
import ContractorContracts from './_contractorContracts';
import ClientContracts from './_clientContracts';
import useSubscription from '@/hooks/useSubscription';
import LockedOverlay from '@/components/subscription/LockedOverlay';
import ContractorProposals from '../proposals/_contractor';
import ContractorWizard from './_wizards/_contractor';

const AllContracts = () => {

  const { role, isSubscribed } = useAuthStore();

  if (!isSubscribed) {
    return (
      <section className='w-full min-h-screen'>
        <LockedOverlay descriptionText='Subscribe to access contract wizard advanced features.' />
      </section>
    )
  }

  return <main className='w-full container mx-auto p-5 pb-20 md:p-6'>
    {
      role === "client" &&
      (
        <>
          <ClientContracts />
        </>
      )
    }
    {
      role === "contractor" && (
        <ContractorWizard />
      )
    }

  </main>

}

export default AllContracts