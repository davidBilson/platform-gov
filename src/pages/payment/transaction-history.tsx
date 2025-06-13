import React, { useState } from 'react';

type TransactionType = 'payment_received' | 'withdrawal' | 'refund' | 'chargeback';
type TransactionStatus = 'completed' | 'pending' | 'disputed';

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  client?: string;
  project?: string;
  amount: number;
  fee: number;
  netAmount: number;
  date: string;
  status: TransactionStatus;
  paymentMethod: string;
  reference: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface Summary {
  totalReceived: number;
  totalWithdrawn: number;
  totalFees: number;
}

const TransactionHistory: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('last30days');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'payment_received',
      description: 'Payment for E-commerce Platform Development',
      client: 'TechCorp Solutions',
      project: 'Modern E-commerce Website',
      amount: 2500,
      fee: 75,
      netAmount: 2425,
      date: '2025-06-10T14:30:00Z',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-2025-001'
    },
    {
      id: 'TXN-002',
      type: 'withdrawal',
      description: 'Withdrawal to Bank Account',
      amount: 1800,
      fee: 5,
      netAmount: 1795,
      date: '2025-06-08T09:15:00Z',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'WTH-2025-002'
    },
    {
      id: 'TXN-003',
      type: 'payment_received',
      description: 'Milestone Payment - Mobile App UI/UX Design',
      client: 'StartupXYZ',
      project: 'Mobile App Design System',
      amount: 900,
      fee: 27,
      netAmount: 873,
      date: '2025-06-05T16:45:00Z',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'REF-2025-003'
    },
    {
      id: 'TXN-004',
      type: 'refund',
      description: 'Partial refund for cancelled project',
      client: 'Marketing Agency Pro',
      project: 'Website Redesign',
      amount: 500,
      fee: 0,
      netAmount: 500,
      date: '2025-06-03T11:20:00Z',
      status: 'completed',
      paymentMethod: 'Original Payment Method',
      reference: 'RFD-2025-004'
    },
    {
      id: 'TXN-005',
      type: 'payment_received',
      description: 'Final payment for Database Migration',
      client: 'Enterprise Corp',
      project: 'Legacy System Migration',
      amount: 3200,
      fee: 96,
      netAmount: 3104,
      date: '2025-05-28T13:00:00Z',
      status: 'completed',
      paymentMethod: 'Wire Transfer',
      reference: 'REF-2025-005'
    },
    {
      id: 'TXN-006',
      type: 'withdrawal',
      description: 'Withdrawal to PayPal',
      amount: 2200,
      fee: 22,
      netAmount: 2178,
      date: '2025-05-25T10:30:00Z',
      status: 'pending',
      paymentMethod: 'PayPal',
      reference: 'WTH-2025-006'
    },
    {
      id: 'TXN-007',
      type: 'payment_received',
      description: 'Retainer payment for API Development',
      client: 'FinTech Solutions',
      project: 'Payment Gateway Integration',
      amount: 1500,
      fee: 45,
      netAmount: 1455,
      date: '2025-05-20T08:45:00Z',
      status: 'completed',
      paymentMethod: 'ACH Transfer',
      reference: 'REF-2025-007'
    },
    {
      id: 'TXN-008',
      type: 'chargeback',
      description: 'Chargeback disputed - Under investigation',
      client: 'Disputed Client Co',
      project: 'Web Development Project',
      amount: 800,
      fee: 25,
      netAmount: 775,
      date: '2025-05-18T14:15:00Z',
      status: 'disputed',
      paymentMethod: 'Credit Card',
      reference: 'CHB-2025-008'
    }
  ];

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Transactions' },
    { value: 'payment_received', label: 'Payments Received' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'refund', label: 'Refunds' },
    { value: 'chargeback', label: 'Chargebacks' }
  ];

  const dateRangeOptions: FilterOption[] = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'lastyear', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'payment_received':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-aquagreen to-aquagreen rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-boldblue to-boldblue rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        );
      case 'refund':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-deepskyblue to-deepskyblue rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        );
      case 'chargeback':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-crimson to-crimson rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-mediumgray to-mediumgray rounded-full flex items-center justify-center">
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
          <span className="px-3 py-1 bg-gradient-to-r from-aquagreen/10 to-aquagreen/10 text-aquagreen text-sm font-medium rounded-full border border-aquagreen/20">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-deepskyblue/10 to-deepskyblue/10 text-deepskyblue text-sm font-medium rounded-full border border-deepskyblue/20">
            Pending
          </span>
        );
      case 'disputed':
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-crimson/10 to-crimson/10 text-crimson text-sm font-medium rounded-full border border-crimson/20">
            Disputed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-mediumgray/10 to-mediumgray/10 text-mediumgray text-sm font-medium rounded-full border border-mediumgray/20">
            Unknown
          </span>
        );
    }
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const isPositive = transaction.type === 'payment_received' || transaction.type === 'refund';
    const amountColor = isPositive ? 'text-aquagreen' : 'text-darkgray';
    const sign = isPositive ? '+' : '-';

    return (
      <div className="text-right">
        <div className={`text-lg font-bold ${amountColor}`}>
          {sign}${Math.abs(transaction.amount).toLocaleString()}
        </div>
        {transaction.fee > 0 && (
          <div className="text-sm text-mediumgray">
            Fee: ${transaction.fee.toFixed(2)}
          </div>
        )}
        <div className="text-sm font-medium text-darkgray">
          Net: {sign}${Math.abs(transaction.netAmount).toLocaleString()}
        </div>
      </div>
    );
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const calculateSummary = (): Summary => {
    return filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'payment_received') {
        acc.totalReceived += transaction.netAmount;
      } else if (transaction.type === 'withdrawal') {
        acc.totalWithdrawn += transaction.netAmount;
      }
      acc.totalFees += transaction.fee;
      return acc;
    }, { totalReceived: 0, totalWithdrawn: 0, totalFees: 0 });
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue/5 to-faintskyblue/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Transaction History</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-lightblue/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mediumgray mb-1">Total Received</p>
                <p className="text-2xl font-bold text-aquagreen">${summary.totalReceived.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-aquagreen/10 to-aquagreen/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-lightblue/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mediumgray mb-1">Total Withdrawn</p>
                <p className="text-2xl font-bold text-boldblue">${summary.totalWithdrawn.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-boldblue/10 to-boldblue/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-lightblue/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions, clients, or references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-lightgray rounded-lg focus:ring-2 focus:ring-boldblue/20 focus:border-boldblue outline-none transition-colors"
                />
              </div>
            </div>

            <div className="min-w-0 md:w-48">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 border border-lightgray rounded-lg focus:ring-2 focus:ring-boldblue/20 focus:border-boldblue outline-none transition-colors bg-white"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 md:w-40">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-3 border border-lightgray rounded-lg focus:ring-2 focus:ring-boldblue/20 focus:border-boldblue outline-none transition-colors bg-white"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-lightblue/20">
          <div className="p-6 border-b border-lightgray/50">
            <h2 className="text-xl font-bold text-darkgray">
              Transactions ({filteredTransactions.length})
            </h2>
          </div>

          <div className="divide-y divide-lightgray/50">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-lightgray rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-darkgray mb-2">No transactions found</h3>
                <p className="text-mediumgray">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gradient-to-r hover:from-skyblue/5 hover:to-transparent transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {getTransactionIcon(transaction.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-darkgray truncate">
                            {transaction.description}
                          </h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        
                        <div className="space-y-1">
                          {transaction.client && (
                            <p className="text-sm text-mediumgray">
                              Client: <span className="font-medium text-darkgray">{transaction.client}</span>
                            </p>
                          )}
                          {transaction.project && (
                            <p className="text-sm text-mediumgray">
                              Project: <span className="font-medium text-darkgray">{transaction.project}</span>
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-mediumgray">
                            <span>
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                            <span>•</span>
                            <span className="font-mono">{transaction.reference}</span>
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

        <div className="flex justify-center mt-8">
          <button className="text-sm cursor-pointer bg-gradient-to-r from-boldblue to-boldblue text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Transaction History
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-mediumgray">
            Questions about your transactions?{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;