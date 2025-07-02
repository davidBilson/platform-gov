import useAuthStore from '@/store/useAuth'
import React from 'react'
import BusinessProfile from './_business'
import FreelancerProfile from './_freelancer'

const Index = () => {
    const { userId, role } = useAuthStore()

    if (!userId) return null

    const ProfileComponent = role === 'client' ? BusinessProfile : FreelancerProfile

    return (
        <>
            <ProfileComponent />
        </>
    )
}

export default Index