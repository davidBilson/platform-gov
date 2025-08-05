import DotLoader from '@/components/ui/dotloader';
import { formatDate } from '@/utils/format';
import React from 'react'

interface SubscriptionTableProps {
  data: {
    loading?: boolean;
    error?: string;
    data?: {
      data?: {
        subscriptions?: Array<{
          _id: string;
          user?: { name?: string; email?: string };
          userType?: string;
          planName?: string;
          subscriptionAmount?: number;
          currency?: string;
          billingInterval?: string;
          status?: string;
          autoRenew?: boolean;
          subscriptionPeriod?: { startDate?: string; endDate?: string };
          createdAt?: string;
        }>;
        pagination?: {
          currentPage?: number;
          limit?: number;
          totalCount?: number;
          hasPrevPage?: boolean;
          hasNextPage?: boolean;
          totalPages?: number;
        };
        summary?: any;
      };
    };
  };
}

const SubscriptionTable = ({ data }: SubscriptionTableProps) => {
  if (data?.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <DotLoader />
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {data.error}</p>
      </div>
    );
  }

  if (!data?.data?.data?.subscriptions || data.data.data.subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No subscriptions found</p>
      </div>
    );
  }

  const { subscriptions, pagination, summary } = data.data.data;

  interface StatusBadgeProps {
    status: 'active' | 'cancelled' | 'expired' | 'pending' | string;
  }

  const getStatusBadge = (status: StatusBadgeProps['status']) => {
    const statusColors: Record<StatusBadgeProps['status'], string> = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  interface FormatCurrencyProps {
    amount: number | string | null | undefined;
    currency: string | null | undefined;
  }

  const formatCurrency = (amount: FormatCurrencyProps['amount'], currency: FormatCurrencyProps['currency']): string => {
    // Ensure amount is a number
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount as string) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(numAmount);
  };

  // Helper function to safely render values
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      // If it's an object, try to stringify it or return fallback
      console.warn('Attempting to render object:', value);
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                User Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Billing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Auto Renew
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {safeRender(subscription?.user?.name)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {safeRender(subscription?.user?.email)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="capitalize">{safeRender(subscription?.userType)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {safeRender(subscription?.planName)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(subscription?.subscriptionAmount, subscription?.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="capitalize">{safeRender(subscription?.billingInterval)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(subscription?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription?.autoRenew 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription?.autoRenew ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(subscription?.subscriptionPeriod?.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(subscription?.subscriptionPeriod?.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(subscription?.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination?.currentPage - 1) * pagination?.limit) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination?.currentPage * pagination?.limit, pagination?.totalCount) || 0}
              </span>{' '}
              of <span className="font-medium">{pagination?.totalCount || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                disabled={!pagination?.hasPrevPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
              </span>
              <button
                disabled={!pagination?.hasNextPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionTable