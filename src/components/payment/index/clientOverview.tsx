import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { fetchClientFunds } from '@/api/payment/payment-api';

interface Fund {
  id: string;
  jobId: string;
  jobTitle: string;
  contractorName: string;
  amount: number;
  createdAt: string;
  releasedAt?: string;
}

interface ClientFundsResponse {
  success: boolean;
  funds: {
    in_escrow: Fund[];
    released: Fund[];
  };
}

interface Tab {
  id: 'in_escrow' | 'released';
  label: string;
  count: number;
}

type ActiveTab = 'in_escrow' | 'released';

const EscrowCard = ({ fund }: { fund: Fund }) => (
  <div className="bg-white rounded-xl border border-lightblue/20 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{fund.jobTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Contractor: {fund.contractorName}</p>
        <p className="text-sm text-mediumgray">Created: {new Date(fund.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-boldblue">${fund.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium mt-2">
          In Escrow
        </span>
      </div>
    </div>

    <div className="bg-orange-50 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-orange-800">Awaiting Work Completion</span>
      </div>
      <p className="text-sm text-orange-700">Funds are secured and will be released upon project completion and approval.</p>
    </div>

  </div>
);

const ReleasedCard = ({ fund }: { fund: Fund }) => (
  <div className="bg-white rounded-xl border border-lightblue/20 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{fund.jobTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Contractor: {fund.contractorName}</p>
        <p className="text-sm text-mediumgray">Originally Created: {new Date(fund.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-green-600">${fund.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-2">
          Released
        </span>
      </div>
    </div>

    <div className="bg-green-50 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-green-800">Payment Completed</span>
      </div>
    </div>
  </div>
);

const ClientOverview = () => {
  const { userId } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>('in_escrow');
  const [funds, setFunds] = useState<ClientFundsResponse['funds']>({
    in_escrow: [],
    released: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClientFunds = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchClientFunds(userId);
        setFunds(response.funds);
      } catch (err) {
        console.error('Error fetching client funds:', err);
        setError('Failed to load funds data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadClientFunds();
    }
  }, [userId]);

  const tabs: Tab[] = [
    { id: 'in_escrow', label: 'In Escrow', count: funds.in_escrow.length },
    { id: 'released', label: 'Released', count: funds.released.length }
  ];

  const getTotalEscrow = (): number => {
    return funds.in_escrow.reduce((total: number, fund: Fund) => total + fund.amount, 0);
  };

  const getTotalReleased = (): number => {
    return funds.released.reduce((total: number, fund: Fund) => total + fund.amount, 0);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-boldblue mb-4"></div>
          <p className="text-mediumgray">Loading funds data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-8.138 8.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-mediumgray mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-deepskyblue transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    const data = funds[activeTab];

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-lightgray rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-darkgray mb-2">No {activeTab === 'in_escrow' ? 'escrow' : 'released'} funds</h3>
          <p className="text-mediumgray">
            {activeTab === 'in_escrow'
              ? 'No funds are currently in escrow.'
              : 'No funds have been released yet.'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.map((fund: Fund) => {
          if (activeTab === 'in_escrow') {
            return <EscrowCard key={fund.id} fund={fund} />;
          } else {
            return <ReleasedCard key={fund.id} fund={fund} />;
          }
        })}
      </div>
    );
  };

  const handleTabClick = (tabId: ActiveTab): void => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue/5 to-faintskyblue/5">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Funds Overview</h1>
          <p className="text-mediumgray">Manage your project funds and contractor payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-lightblue/20 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-darkgray mb-2">Total in Escrow</h3>
                <div className="text-3xl font-bold text-boldblue">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                  ) : (
                    `$${getTotalEscrow().toLocaleString()}`
                  )}
                </div>
                <p className="text-mediumgray text-sm mt-1">Secured funds for active projects</p>
              </div>
              <div className="w-16 h-16 bg-boldblue/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-lightblue/20 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-darkgray mb-2">Total Released</h3>
                <div className="text-3xl font-bold text-green-600">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                  ) : (
                    `$${getTotalReleased().toLocaleString()}`
                  )}
                </div>
                <p className="text-mediumgray text-sm mt-1">Paid to contractors</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-lightblue/20 mb-8">
          <div className="flex border-b border-lightgray/50 overflow-x-auto">
            {tabs.map((tab: Tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer flex-1 min-w-0 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${activeTab === tab.id
                    ? 'text-boldblue border-b-2 border-boldblue bg-gradient-to-t from-skyblue/5 to-transparent'
                    : 'text-mediumgray hover:text-darkgray hover:bg-lightgray/20'
                  }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === tab.id
                      ? 'bg-boldblue text-white'
                      : 'bg-lightgray text-mediumgray'
                    }`}>
                    {loading ? '...' : tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl mb-8">
          <h3 className="text-lg font-semibold text-darkgray mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button onClick={() => router.push('/payment/transaction-history')} className="cursor-pointer p-4 border border-lightblue/20 rounded-xl hover:bg-skyblue/5 transition-colors text-left">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-boldblue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-darkgray">Payment History</span>
              </div>
              <p className="text-sm text-mediumgray">View all transaction records</p>
            </button>

            <button onClick={() => router.push('/payment/billing-method')} className="cursor-pointer p-4 border border-lightblue/20 rounded-xl hover:bg-skyblue/5 transition-colors text-left">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-boldblue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-darkgray">Payment Settings</span>
              </div>
              <p className="text-sm text-mediumgray">Manage payment methods and preferences</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-mediumgray">
            Need help with payments?{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;