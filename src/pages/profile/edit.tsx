import React from 'react';
import useAuthStore from '@/store/useAuth';
import CreateFreelancerProfile from './_freelancer/create';
import CreateBusinessProfile from './_business/create';

const Edit = () => {

    const { userId, role } = useAuthStore()

    if (userId && role === 'client') {
        return (
            <>
                <CreateBusinessProfile />
            </>
        )
    }

    if (userId && role === 'contractor') {
        return (
            <>
                <CreateFreelancerProfile />
            </>
        )
    }

}

export default Edit;