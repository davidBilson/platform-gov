import React, { useState, useEffect } from 'react'
import { fetchSubscriptions } from '@/api/admin-subscription-api'
import SubscriptionTable from './subscriptions/subscriptionTable'

// Minimal types that work with any data structure
type SubscriptionData = any // Replace with actual type when known
type ErrorType = string | null

interface SubscriptionTabData {
  data: SubscriptionData | null
  loading: boolean
  error: ErrorType
}

interface SubscriptionDataState {
  all: SubscriptionTabData
  clients: SubscriptionTabData
  contractors: SubscriptionTabData
}

type TabKey = keyof SubscriptionDataState

interface Tab {
  key: TabKey
  label: string
  component: React.ComponentType<any> // Flexible component type
}

const Subscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionDataState>({
    all: { data: null, loading: true, error: null },
    clients: { data: null, loading: true, error: null },
    contractors: { data: null, loading: true, error: null }
  })

  const tabs: Tab[] = [
    {
      key: 'all',
      label: 'All',
      component: SubscriptionTable
    },
    {
      key: 'clients',
      label: 'Clients',
      component: SubscriptionTable
    },
    {
      key: 'contractors',
      label: 'Consultants',
      component: SubscriptionTable
    }
  ]

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [allSubscriptions, clientSubscriptions, contractorSubscriptions] = await Promise.all([
          fetchSubscriptions(),
          fetchSubscriptions({ userType: 'client' }),
          fetchSubscriptions({ userType: 'contractor' })
        ])

        setSubscriptionData({
          all: { data: allSubscriptions, loading: false, error: null },
          clients: { data: clientSubscriptions, loading: false, error: null },
          contractors: { data: contractorSubscriptions, loading: false, error: null }
        })

      } catch (error: any) {
        console.error('Error fetching subscription data:', error)
        const errorMessage = error?.message || 'An error occurred'
        
        setSubscriptionData(prev => ({
          all: { data: null, loading: false, error: errorMessage },
          clients: { data: null, loading: false, error: errorMessage },
          contractors: { data: null, loading: false, error: errorMessage }
        }))
      }
    }

    fetchAllData()
  }, [])

  const renderContent = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab)
    const Component = activeTabData?.component
    const currentData = subscriptionData[activeTab]

    // @ts-ignore
    if (!Component) return <SubscriptionTable data={subscriptionData.all} />

    return <Component data={currentData} />
  }

  return (
    <section>
      {/* Tabs and Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer
                  ${activeTab === tab.key
                    ? 'border-deepskyblue text-deepskyblue bg-deepskyblue/5'
                    : 'border-transparent text-gray-500 hover:text-skyblue hover:border-skyblue'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </section>
  )
}

export default Subscriptions