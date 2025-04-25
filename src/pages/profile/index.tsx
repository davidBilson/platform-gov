import useAuthStore from '@/store/authStore'
import React from 'react'
import BusinessProfile from './_business'
import FreelancerProfile from './_freelancer'

const Index = () => {

    const {userId, role } = useAuthStore()
  
    if ( userId && role === 'client') {
        return (
            <>
                <BusinessProfile />
            </>
      )
    }

    if ( userId && role === 'contractor') {
        return (
            <>
                <FreelancerProfile />
            </>
      )
    }
    
}

export default Index