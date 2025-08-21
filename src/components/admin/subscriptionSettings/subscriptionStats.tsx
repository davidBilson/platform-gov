import React from 'react'
import { Users, UserCheck, UserX, Clock, Loader2 } from 'lucide-react'

interface SubscriptionStatsData {
  totalSubscriptions: number
  subscriptionsByStatus: {
    active: number
    cancelled: number
    expired: number
    pending: number
  }
  subscriptionsByUserType: {
    consultant: number
    client: number
  }
}

interface SubscriptionStatsProps {
  data: SubscriptionStatsData | null
  isLoading: boolean
}

interface StatItem {
  label: string
  value: string
  icon: React.ComponentType<{ size: number }>
  color: string
}

const getStatsArray = (stats: SubscriptionStatsData): StatItem[] => {
  return [
    {
      label: 'Total Subscriptions',
      value: stats.totalSubscriptions.toLocaleString(),
      icon: Users,
      color: 'deepskyblue'
    },
    {
      label: 'Active',
      value: stats.subscriptionsByStatus.active.toLocaleString(),
      icon: UserCheck,
      color: 'green-500'
    },
    {
      label: 'Cancelled',
      value: stats.subscriptionsByStatus.cancelled.toLocaleString(),
      icon: UserX,
      color: 'red-500'
    },
    {
      label: 'Expired',
      value: stats.subscriptionsByStatus.expired.toLocaleString(),
      icon: Clock,
      color: 'orange-500'
    },
    {
      label: 'Pending',
      value: stats.subscriptionsByStatus.pending.toLocaleString(),
      icon: Clock,
      color: 'yellow-500'
    },
  ]
}

const SubscriptionStats = ({ data, isLoading }: SubscriptionStatsProps) => {
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <Loader2 size={24} className="text-gray-400 animate-spin" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Unable to load subscription statistics</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {getStatsArray(data).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-boldblue">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  {/* @ts-ignore */}
                  <Icon size={24} className={`text-${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SubscriptionStats