import useAuthStore from '@/store/useAuth'
import React from 'react'
import ContractorProposals from './_contractor'

const Proposals = () => {

  const {role} = useAuthStore();
  
  return <>{ role === "contractor" && <ContractorProposals /> }</>

}

export default Proposals;