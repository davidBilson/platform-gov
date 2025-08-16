import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import Subscriptions from '@/components/admin/subscriptionSettings/subscriptions'
import AdminSubscriptionSettings from '@/components/admin/subscriptionSettings/subscriptionSettings'
import SubscriptionStats from '@/components/admin/subscriptionSettings/subscriptionStats'
import { fetchSubscriptionStats } from '@/api/admin-subscription-api'
import { SubscriptionStatsData } from '@/types/subscription'
import DiscountCodes from '@/components/admin/subscriptionSettings/DiscountCodes';


const SubscriptionSettings = () => {

  const [activeTab, setActiveTab] = useState('subscriptions')
  const [statsData, setStatsData] = useState<SubscriptionStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'subscriptions', label: 'Subscriptions', component: <Subscriptions /> },
    { id: 'settings', label: 'Settings', component: <AdminSubscriptionSettings /> },
    { id: 'discount-codes', label: 'Manage Discount Codes', component: <DiscountCodes /> }
  ]

  useEffect(() => {
    const loadSubscriptionStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetchSubscriptionStats()

        if (response.success && response.data) {
          setStatsData(response.data)
        } else {
          toast.error('Failed to load subscription statistics')
        }
      } catch (error) {
        console.error('Error fetching subscription stats:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to load subscription statistics')
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscriptionStats()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Subscription Settings</h1>
      </div>

      <SubscriptionStats data={statsData} isLoading={isLoading} />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 cursor-pointer text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.id
                  ? 'text-boldblue border-boldblue bg-boldblue/5'
                  : 'text-gray-500 border-transparent hover:text-boldblue hover:border-boldblue/50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <section className="min-h-[400px]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </section>

    </div>
  )
}

export default SubscriptionSettings