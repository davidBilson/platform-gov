import useAuthStore from '@/store/useAuth'
import React from 'react'
import ContractorContracts from './_contractorContracts';
import ClientContracts from './_clientContracts';

const AllContracts = () => {

  const { role } = useAuthStore();
  
  return <main className='w-full container mx-auto p-5 pb-20 md:p-6'>
      {
        role === "client" && <ClientContracts />
      }
      {
        role === "contractor" && <ContractorContracts />
      }
      
    </main>

}

export default AllContracts