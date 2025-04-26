import React from 'react';
import useAuthStore from '@/store/authStore';
import CreateBusinessProfile from './_business/create';
import CreateFreelancerProfile from './_freelancer/create';

const Edit = () => {

    const {userId, role } = useAuthStore()
  
    if ( userId && role === 'client') {
        return (
            <>
                <CreateBusinessProfile />
            </>
      )
    }

    if ( userId && role === 'contractor') {
        return (
            <>
                <CreateFreelancerProfile />
            </>
      )
    }
    
}

export default Edit;