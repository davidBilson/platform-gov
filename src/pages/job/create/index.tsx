import useAuthStore from '@/store/useAuth'
import React from 'react'
import CreateJob from './_create'

const Create = () => {

    const { userId, role } = useAuthStore()

    if (!userId) {
        return <div className='text-center p-6 text-red-500'>Unauthorized access!</div>
    }

    if (userId && role === "contractor") {
        return <div className='text-center p-6 text-red-500'>Unauthorized access!</div>
    }

    if (userId && role === "client") {
        return (
            <>
                <CreateJob />
            </>
        )
    }
}

export default Create