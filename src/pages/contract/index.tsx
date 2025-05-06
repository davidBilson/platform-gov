import useAuthStore from '@/store/useAuth'
import React from 'react'
import ContractorContracts from './_contractorContracts';
import ClientContracts from './_clientContracts';

const AllContracts = () => {

  const {userId, role} = useAuthStore();
  
  if (userId) {

  }
  return <main className='w-full max-w-275 mx-auto p-5 pb-20 md:p-6'>
      {
        role === "client" && <ClientContracts />
      }
      {
        role === "contractor" && <ContractorContracts />
      }
      
    </main>

}

export default AllContracts