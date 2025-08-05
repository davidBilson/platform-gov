'use client'
import useAuthStore from '@/store/useAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ConsultantSubscriptionInterface from './_consultant'
import ClientSubscriptionInterface from './_client'

const SubscribeInterface = () => {
    const { role, userId } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!userId) {
            router.replace('/login')
        }
    }, [userId, role, router])

    if (!userId) return null

    return <>
        {role === 'consultant' ?
            (<ConsultantSubscriptionInterface />) :
            role === 'client' ?
                (<ClientSubscriptionInterface />) :
                (null)
        }
    </>
}

export default SubscribeInterface
