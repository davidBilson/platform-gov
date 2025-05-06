import useAuthStore from '@/store/useAuth'
import React from 'react'
import ContractClient from './_contractClient'
import ContractContractor from './_contractContractor'
const AllContracts = () => {

  const {userId, role} = useAuthStore();
  
  if (userId) {

  }
  return <main className='w-full max-w-275 mx-auto p-5 pb-20 md:p-6'>
      {
        role === "client" && <ContractClient />
      }
      {
        role === "contractor" && <ContractContractor />
      }
      
    </main>

}

export default AllContracts