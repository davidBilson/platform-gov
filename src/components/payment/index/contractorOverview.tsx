import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { fetchContractorFunds, fetchUserWithdrawals } from '@/api/payment/payment-api';

interface FundData {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  amount: number;
  createdAt: string;
  availableAfter?: string;
  withdrawnAt?: string;
  availableDate?: string;    // Added for available funds
  pendingDate?: string;      // Added for pending funds
  disputedDate?: string;     // Added for disputed funds
}

// Updated to match backend response structure
interface BackendFundData {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  amount: number;
  createdAt: string;
  availableDate?: string;    // From backend available funds
  pendingDate?: string;      // From backend pending funds
  disputedDate?: string;     // From backend disputed funds
  availableAfter?: string;   // From backend pending funds
}

interface BackendCategorizedFunds {
  available: BackendFundData[];
  pending: BackendFundData[];
  disputed: BackendFundData[];  // Backend sends 'disputed', not 'in_review'
  withdrawn?: BackendFundData[]; // May not exist in backend
}

// Withdrawal interfaces
interface WithdrawalData {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payoutId: string;
  bankAccount: {
    id: string;
    bankName: string;
    last4: string;
  };
  createdAt: string;
  id: string;
}

interface WithdrawalResponse {
  success: boolean;
  totalWithdrawals: number;
  totalPages: number;
  currentPage: number;
  withdrawals: WithdrawalData[];
  message?: string;
}

interface CategorizedFunds {
  available: FundData[];
  in_review: FundData[];
  pending: FundData[];
  withdrawn: FundData[];
}

interface Tab {
  id: keyof CategorizedFunds;
  label: string;
  count: number;
}

type ActiveTab = keyof CategorizedFunds;

// Individual Fund Card Component
const FundCard = ({ fund, status }: { fund: FundData; status: ActiveTab }) => {
  const getStatusConfig = (status: ActiveTab) => {
    switch (status) {
      case 'available':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          badgeColor: 'bg-green-100 text-green-700',
          label: 'Available'
        };
      case 'in_review':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700',
          label: 'In Review'
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          badgeColor: 'bg-yellow-100 text-yellow-700',
          label: 'Pending'
        };
      case 'withdrawn':
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-700',
          label: 'Withdrawn'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-700',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get the appropriate date to display
  const getRelevantDate = () => {
    if (status === 'available' && fund.availableDate) {
      return { label: 'Available since', date: fund.availableDate };
    }
    if (status === 'pending' && fund.pendingDate) {
      return { label: 'Pending since', date: fund.pendingDate };
    }
    if (status === 'in_review' && fund.disputedDate) {
      return { label: 'In review since', date: fund.disputedDate };
    }
    if (status === 'withdrawn' && fund.withdrawnAt) {
      return { label: 'Withdrawn', date: fund.withdrawnAt };
    }
    return null;
  };

  const relevantDate = getRelevantDate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
            {fund.jobTitle}
          </h3>
          <p className="text-sm text-gray-600 mb-1">Client: {fund.clientName}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-xl sm:text-2xl font-bold text-boldblue mb-2">
            ${fund.amount.toLocaleString()}
          </div>
          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          {fund.availableAfter && status === 'pending' && (
            <div>
              <span className="font-medium">Available after:</span> {formatDate(fund.availableAfter)}
            </div>
          )}
          {relevantDate && (
            <div>
              <span className="font-medium">{relevantDate.label}:</span> {formatDate(relevantDate.date)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Withdrawal Card Component
const WithdrawalCard = ({ withdrawal }: { withdrawal: WithdrawalData }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          badgeColor: 'bg-green-100 text-green-700',
          label: 'Completed'
        };
      case 'pending':
        return {
          badgeColor: 'bg-yellow-100 text-yellow-700',
          label: 'Pending'
        };
      case 'failed':
        return {
          badgeColor: 'bg-red-100 text-red-700',
          label: 'Failed'
        };
      default:
        return {
          badgeColor: 'bg-gray-100 text-gray-700',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(withdrawal.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
            Withdrawal to {withdrawal.bankAccount.bankName}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Account ending in •••• {withdrawal.bankAccount.last4}
          </p>
          <p className="text-xs text-gray-500">ID: {withdrawal.payoutId}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-xl font-bold text-aquagreen mb-2">
            ${withdrawal.amount.toLocaleString()} {withdrawal.currency}
          </div>
          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Withdrawn on:</span> {formatDate(withdrawal.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContractorFundsOverview = () => {
  const router = useRouter();
  const { userId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('available');

  const [funds, setFunds] = useState<CategorizedFunds>({
    available: [],
    in_review: [],
    pending: [],
    withdrawn: []
  });

  // Withdrawal-specific states
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalResponse>({
    success: false,
    totalWithdrawals: 0,
    totalPages: 0,
    currentPage: 1,
    withdrawals: []
  });
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadContractorFunds();
    }
  }, [userId]);

  // Load withdrawals when withdrawal tab is active
  useEffect(() => {
    if (userId) {
      loadWithdrawals(withdrawalPage);
    }
  }, [userId, activeTab, withdrawalPage]);

  // Transform backend data to match frontend structure
  const transformBackendData = (backendData: BackendCategorizedFunds): CategorizedFunds => {
    return {
      available: backendData.available || [],
      pending: backendData.pending || [],
      in_review: backendData.disputed || [], // Map disputed to in_review
      withdrawn: [] // Always empty since we fetch withdrawals separately
    };
  };

  const loadContractorFunds = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendFundsData: BackendCategorizedFunds = await fetchContractorFunds(userId);

      // Transform the backend data structure to match frontend expectations
      const transformedFunds = transformBackendData(backendFundsData);

      setFunds(transformedFunds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching funds';
      setError(errorMessage);
      console.error('Error fetching contractor funds:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawals = async (page: number = 1) => {
    try {
      setWithdrawalLoading(true);
      const response: WithdrawalResponse = await fetchUserWithdrawals(userId, {
        page,
        limit: 10
      });
      setWithdrawalData(response);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setWithdrawalData({
        success: false,
        totalWithdrawals: 0,
        totalPages: 0,
        currentPage: 1,
        withdrawals: [],
        message: 'Failed to fetch withdrawals'
      });
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const tabs: Tab[] = [
    { id: 'available', label: 'Available', count: funds.available.length },
    { id: 'pending', label: 'Pending', count: funds.pending.length },
    { id: 'in_review', label: 'In Review', count: funds?.in_review?.length ?? 0 },
    { id: 'withdrawn', label: 'Withdrawn', count: withdrawalData.totalWithdrawals }
  ];

  const getTotalAvailable = (): number => {
    return funds.available.reduce((total, fund) => total + fund.amount, 0);
  };

  const getTotalEarnings = (): number => {
    return [...funds.available, ...funds.pending, ...funds.in_review ?? funds.in_review, ...funds.withdrawn]
      .reduce((total, fund) => total + fund.amount, 0);
  };

  const renderWithdrawalPagination = () => {
    if (withdrawalData.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= withdrawalData.totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setWithdrawalPage(prev => Math.max(1, prev - 1))}
          disabled={withdrawalData.currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setWithdrawalPage(page)}
            className={`px-3 py-1 text-sm border rounded-md ${page === withdrawalData.currentPage
                ? 'bg-boldblue text-white border-boldblue'
                : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setWithdrawalPage(prev => Math.min(withdrawalData.totalPages, prev + 1))}
          disabled={withdrawalData.currentPage === withdrawalData.totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'withdrawn') {
      if (withdrawalLoading) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boldblue"></div>
          </div>
        );
      }

      if (!withdrawalData.success) {
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-8.138 8.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Withdrawals</h3>
            <p className="text-gray-600 mb-4">{withdrawalData.message || 'Failed to fetch withdrawals'}</p>
            <button
              onClick={() => loadWithdrawals(withdrawalPage)}
              className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      }

      if (withdrawalData.withdrawals.length === 0) {
        return (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No withdrawals found</h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">You haven't made any withdrawals yet.</p>
          </div>
        );
      }

      return (
        <div className="space-y-4 sm:space-y-6">
          {withdrawalData.withdrawals.map((withdrawal) => (
            <WithdrawalCard key={withdrawal._id} withdrawal={withdrawal} />
          ))}
          {renderWithdrawalPagination()}
        </div>
      );
    }

    // Original logic for other tabs
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boldblue"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Funds</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadContractorFunds}
            className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    const data = funds[activeTab];

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No funds found</h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">There are no funds in this category at the moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {data.map((fund) => (
          <FundCard key={fund.id} fund={fund} status={activeTab} />
        ))}
      </div>
    );
  };

  const handleTabClick = (tabId: ActiveTab): void => {
    setActiveTab(tabId);
  };

  // Show loading state if userId is not available yet
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boldblue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">

        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-boldblue mb-1 sm:mb-2 md:mb-3">
            Funds Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your earnings and manage withdrawals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 ">
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Total Available</h3>
                <div className="text-2xl sm:text-3xl font-bold text-aquagreen break-words">
                  ${getTotalAvailable().toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Ready to withdraw</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 ">
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Total Earnings</h3>
                <div className="text-2xl sm:text-3xl font-bold text-boldblue break-words">
                  ${getTotalEarnings().toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">All time earnings</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl  border border-gray-200 mb-4 sm:mb-6 md:mb-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto [&::-webkit-scrollbar]:h-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer flex-shrink-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                  ? 'text-boldblue border-b-2 border-boldblue bg-gradient-to-t from-boldblue/5 to-boldblue/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{ minWidth: '120px' }}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <span className="truncate">{tab.label}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex-shrink-0 ${activeTab === tab.id
                    ? 'bg-boldblue text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {renderTabContent()}
          </div>
        </div>

        {getTotalAvailable() > 0 && (
          <div className="bg-gradient-to-r from-aquagreen to-aquagreen rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Ready to Withdraw</h3>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold break-words">
                  ${getTotalAvailable().toLocaleString()}
                </div>
                <p className="text-white/80 text-xs sm:text-sm">Available for immediate withdrawal</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/payment/withdraw')}
                className="cursor-pointer flex-1 bg-white text-aquagreen font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white/90 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="truncate">Withdraw Now</span>
              </button>
              <button
                onClick={() => router.push('/payment/payout-setup')}
                className="cursor-pointer flex-1 bg-white/20 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden xs:inline">Payout Settings</span>
                <span className="xs:hidden">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center px-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Questions about payments?{' '}
            <a href="#" className="text-boldblue hover:text-blue-700 font-medium transition-colors duration-200 whitespace-nowrap">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractorFundsOverview;