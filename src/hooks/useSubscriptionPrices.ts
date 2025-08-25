// hooks/useSubscriptionPrices.js
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchSubscriptionPrices } from '@/api/subscription-api';
import useAuthStore from '@/store/useAuth'

const useSubscriptionPrices = () => {

    const { userId, role } = useAuthStore();

    const [subscriptionPrices, setSubscriptionPrices] = useState({
            monthly: 0,
            annual: 0,
            adminFeePercent : 0
        }
    )

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPrices = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetchSubscriptionPrices()

            if (response.success) {
                if (userId && role === 'contractor') {
                    setSubscriptionPrices(prev => ({
                        ...prev,
                        monthly: response.prices.consultant.monthly,
                        annual: response.prices.consultant.annual,
                        adminFeePercent: response.prices.adminFeePercent
                    }))
                } else if (userId && role === 'client') {
                    setSubscriptionPrices(prev => ({
                        ...prev,
                        monthly: response.prices.client.monthly,
                        annual: response.prices.client.annual,
                        adminFeePercent: response.prices.adminFeePercent
                    }))
                }
            }
        } catch (error) {
            console.error('Error fetching subscription prices:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrices()
    }, [])

    return {
        subscriptionPrices,
        loading,
        error,
        refetch: () => fetchPrices()
    }
}

export default useSubscriptionPrices