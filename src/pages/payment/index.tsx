import ClientOverview from '@/components/payment/index/clientOverview';
import ContractorOverview from '@/components/payment/index/contractorOverview';
import useAuthStore from '@/store/useAuth'
import React from 'react'

const PaymentIndex = () => {

  const { userId, role } = useAuthStore();

  if (userId && role === 'contractor') {
    return <ContractorOverview />
  }

  if (userId && role === 'client') {
    return <ClientOverview />
  }
  
}

export default PaymentIndex




