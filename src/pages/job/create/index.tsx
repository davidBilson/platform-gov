import useAuthStore from '@/store/useAuth'
import React from 'react'
import CreateJob from './_create'

const Create = () => {
    const { userId, role } = useAuthStore()

    if (!userId) {
        return <div className='text-center p-6 text-red-500'>Unauthorized access!</div>
    }

    if (role === 'contractor') {
        return <div className='text-center p-6 text-red-500'>Unauthorized access!</div>
    }

    if (role === 'client') {
        return <CreateJob />
    }

    return <div className='text-center p-6 text-red-500'>Unauthorized access!</div>
}

export default Create