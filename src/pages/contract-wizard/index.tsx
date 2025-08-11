import useAuthStore from '@/store/useAuth';
import LockedOverlay from '@/components/subscription/LockedOverlay';
import ContractorWizard from './_wizards/_contractor';
import ClientWizard from './_wizards/_client';

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
          <ClientWizard />
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