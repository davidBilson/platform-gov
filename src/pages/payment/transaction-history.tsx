import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuth';
import { getTransactionHistory } from '@/api/payment-api';
import { PaymentHistoryData, Transaction, TransactionType, TransactionStatus, FilterOption, PaymentMethod } from '@/types/payment';
import ClientHistoryCards from '@/components/payment/transactionHistory/clientHistoryCards';
import ContractorHistoryCards from '@/components/payment/transactionHistory/contractorHistoryCards';

const TransactionHistory = () => {

  const { userId, role } = useAuthStore();

  const [data, setData] = useState<PaymentHistoryData>({
    transactions: [],
    summary: {
      totalReceived: 0,
      totalWithdrawn: 0,
      totalRefunds: 0,
      totalDisputes: 0
    }
  });

  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactionHistory(userId);
      
      if (response.success) {
        setData({
          transactions: response.data.transactions,
          summary: response.data.summary
        });
      } else {
        console.error('Failed to fetch transactions:', response.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const typeOptions: FilterOption[] = [
    { value: 'all', label: 'All Types' },
    { value: 'payment_method_added', label: 'Payment Method Added' },
    { value: 'project_funding', label: 'Project Funding' },
    { value: 'payout', label: 'Payouts' },
    { value: 'refund', label: 'Refunds' },
    { value: 'dispute', label: 'Disputes' }
  ];

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'disputed', label: 'Disputed' }
  ];

  const filteredTransactions = data.transactions.filter(transaction => {
    if (selectedFilter !== 'all' && transaction.type !== selectedFilter) {
      return false;
    }
    
    if (selectedStatus !== 'all' && transaction.status !== selectedStatus) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesDescription = transaction.description?.toLowerCase().includes(searchLower);
      const matchesJobTitle = transaction.jobTitle?.toLowerCase().includes(searchLower);
      const matchesId = transaction.id.toLowerCase().includes(searchLower);
      const matchesPaymentId = transaction.stripePaymentIntentId?.toLowerCase().includes(searchLower);
      
      if (!matchesDescription && !matchesJobTitle && !matchesId && !matchesPaymentId) {
        return false;
      }
    }
    
    if (startDate || endDate) {
      const transactionDate = new Date(transaction.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && transactionDate < start) {
        return false;
      }
      if (end && transactionDate > end) {
        return false;
      }
    }
    
    return true;
  });

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'project_funding':
        return (
          <div className="w-10 h-10 bg-aquagreen/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        );
      case 'payout':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-deepskyblue to-deepskyblue rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        );
      case 'refund':
        return (
          <div className="w-10 h-10 bg-boldblue rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        );
      case 'dispute':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'payment_method_added':
        return (
          <div className="w-10 h-10 bg-aquagreen/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full border border-yellow-200">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full border border-red-200">
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200">
            Refunded
          </span>
        );
      case 'disputed':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full border border-red-200">
            Disputed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
            Unknown
          </span>
        );
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return 'Credit Card';
      case 'bank_account':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const isPositive = transaction.type === 'project_funding' || transaction.type === 'payment_method_added' || transaction.type === 'refund';
    const amountColor = isPositive ? 'text-green-600' : 'text-gray-700';
    const sign = isPositive ? '+' : '-';

    return (
      <div className="text-right">
        <div className={`text-lg font-bold ${amountColor}`}>
          {sign}${Math.abs(transaction.amount).toLocaleString()} {transaction.currency.toUpperCase()}
        </div>
        {transaction.fee > 0 && (
          <div className="text-sm text-gray-500">
            Fee: ${transaction.fee.toFixed(2)}
          </div>
        )}
        <div className="text-sm font-medium text-gray-700">
          Net: {sign}${Math.abs(transaction.netAmount).toLocaleString()}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepskyblue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deepskyblue mb-3">Payment History</h1>
        </div> 
        
        {role === 'client' ? ( <ClientHistoryCards data={data} /> ) : ( <ContractorHistoryCards data={data} /> ) }

        <div className="bg-white rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            
            <div className="lg:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions, jobs, or references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-deepskyblue/20 rounded-lg focus:ring-2 focus:ring-deepskyblue focus:border-deepskyblue outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-sm w-full px-4 py-3 border border-deepskyblue/20 rounded-lg focus:ring-2 focus:ring-deepskyblue focus:border-deepskyblue outline-none transition-colors bg-white"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-sm w-full px-4 py-3 border border-deepskyblue/20 rounded-lg focus:ring-2 focus:ring-deepskyblue focus:border-deepskyblue outline-none transition-colors bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm w-full px-4 py-3 border border-deepskyblue/20 rounded-lg focus:ring-2 focus:ring-deepskyblue focus:border-deepskyblue outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm w-full px-4 py-3 border border-deepskyblue/20 rounded-lg focus:ring-2 focus:ring-deepskyblue focus:border-deepskyblue outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-white ">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Transactions ({filteredTransactions.length})
              </h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="px-2 py-6 hover:bg-gray-50 transition-colors duration-200 ">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-4 flex-1 ">
                      {getTransactionIcon(transaction.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.description || getDefaultDescription(transaction.type)}
                          </h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        
                        <div className="space-y-1">
                          {transaction.jobTitle && (
                            <p className="text-sm text-gray-600">
                              Job: <span className="font-medium text-gray-900">{transaction.jobTitle}</span>
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {new Date(transaction.createdAt.toString()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>•</span>
                            <span>{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                            {transaction.stripePaymentIntentId && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-xs">
                                  {transaction.stripePaymentIntentId.substring(0, 8)}...
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {getAmountDisplay(transaction)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};


const getDefaultDescription = (type: TransactionType): string => {
  switch (type) {
    case 'project_funding':
      return 'Project funding';
    case 'payout':
      return 'Withdrawal';
    case 'refund':
      return 'Refund issued';
    case 'dispute':
      return 'Dispute';
    case 'payment_method_added':
      return 'Payment method added';
    default:
      return 'Transaction';
  }
};

export default TransactionHistory;