import React, { useState } from 'react';

const WithdrawEarnings = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodType, setNewMethodType] = useState('bank');

  // Mock data for available balance and payment methods
  const availableBalance = 8250;
  const paymentMethods = [
    {
      id: 'bank1',
      type: 'bank',
      name: 'Chase Bank',
      details: '****1234',
      primary: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'paypal1',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      primary: false,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a5.7 5.7 0 0 1-.108.731c-1.075 5.526-4.735 7.474-9.456 7.474h-2.39c-.277 0-.513.202-.559.478l-.63 3.985-.178 1.133a.324.324 0 0 0 .32.374h2.735a.562.562 0 0 0 .555-.478l.023-.12.445-2.821.028-.156a.562.562 0 0 1 .555-.478h.351c3.69 0 6.58-1.5 7.43-5.835.356-1.81.172-3.32-.706-4.397-.29-.357-.646-.673-1.073-.927z"/>
        </svg>
      )
    }
  ];

  // Mock transaction history
  const transactionHistory = [
    {
      id: 1,
      amount: 2500,
      method: 'Chase Bank',
      date: '2025-06-10',
      status: 'completed',
      reference: 'WD001234'
    },
    {
      id: 2,
      amount: 1800,
      method: 'PayPal',
      date: '2025-06-05',
      status: 'completed',
      reference: 'WD001235'
    },
    {
      id: 3,
      amount: 3200,
      method: 'Chase Bank',
      date: '2025-05-28',
      status: 'pending',
      reference: 'WD001236'
    }
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= availableBalance) {
      // Handle withdrawal logic here
      alert(`Withdrawal of $${amount.toLocaleString()} initiated!`);
    }
  };

  interface Transaction {
    id: number;
    amount: number;
    method: string;
    date: string;
    status: string;
    reference: string;
  }

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'completed':
        return 'text-aquagreen bg-aquagreen/10';
      case 'pending':
        return 'text-deepskyblue bg-deepskyblue/10';
      case 'failed':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-mediumgray bg-lightgray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue/5 to-faintskyblue/5">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button className="mr-4 p-2 hover:bg-white/50 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-boldblue mb-2">Withdraw Earnings</h1>
              <p className="text-mediumgray">Transfer your available earnings to your preferred payment method</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Available Balance Card */}
            <div className="bg-gradient-to-r from-aquagreen to-aquagreen rounded-xl p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold mb-2">Available Balance</h3>
                  <div className="text-3xl font-bold">${availableBalance.toLocaleString()}</div>
                  <p className="text-white/80 text-sm">Ready to withdraw</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div className="bg-white rounded-xl p-6 border border-lightblue/20">
              <h3 className="text-lg font-bold text-darkgray mb-4">Withdrawal Amount</h3>
              
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumgray text-lg">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-lightgray rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-boldblue focus:border-transparent"
                    max={availableBalance}
                    min="1"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-mediumgray">Minimum: $1</span>
                  <span className="text-sm text-mediumgray">Maximum: ${availableBalance.toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex space-x-2 mb-4">
                {[25, 50, 75, 100].map((percentage) => {
                  const amount = Math.floor((availableBalance * percentage) / 100);
                  return (
                    <button
                      key={percentage}
                      onClick={() => setWithdrawAmount(amount.toString())}
                      className="flex-1 py-2 px-3 text-sm border border-lightgray rounded-lg hover:border-boldblue hover:text-boldblue transition-colors duration-200"
                    >
                      {percentage}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 border border-lightblue/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-darkgray">Payment Method</h3>
                <button
                  onClick={() => setShowAddMethod(true)}
                  className="text-boldblue hover:text-deepskyblue font-medium text-sm flex items-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Method
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-boldblue bg-gradient-to-r from-skyblue/5 to-faintskyblue/5'
                        : 'border-lightgray hover:border-lightblue/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          selectedPaymentMethod === method.id ? 'text-boldblue' : 'text-mediumgray'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-medium text-darkgray flex items-center">
                            {method.name}
                            {method.primary && (
                              <span className="ml-2 px-2 py-1 bg-aquagreen/10 text-aquagreen text-xs rounded-full font-bold">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-mediumgray">{method.details}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-boldblue bg-boldblue'
                          : 'border-lightgray'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdrawal Button */}
            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance}
              className="w-full bg-gradient-to-r from-aquagreen to-aquagreen text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Withdraw ${withdrawAmount ? parseFloat(withdrawAmount).toLocaleString() : '0'}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Processing Time Info */}
            <div className="bg-white rounded-xl p-6 border border-lightblue/20">
              <h3 className="text-lg font-bold text-darkgray mb-4">Processing Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-mediumgray mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm text-darkgray">Bank Transfer</span>
                  </div>
                  <span className="text-sm text-mediumgray">1-3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-mediumgray mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a5.7 5.7 0 0 1-.108.731c-1.075 5.526-4.735 7.474-9.456 7.474h-2.39c-.277 0-.513.202-.559.478l-.63 3.985-.178 1.133a.324.324 0 0 0 .32.374h2.735a.562.562 0 0 0 .555-.478l.023-.12.445-2.821.028-.156a.562.562 0 0 1 .555-.478h.351c3.69 0 6.58-1.5 7.43-5.835.356-1.81.172-3.32-.706-4.397-.29-.357-.646-.673-1.073-.927z"/>
                    </svg>
                    <span className="text-sm text-darkgray">PayPal</span>
                  </div>
                  <span className="text-sm text-mediumgray">Instant</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 border border-lightblue/20">
              <h3 className="text-lg font-bold text-darkgray mb-4">Recent Withdrawals</h3>
              <div className="space-y-4">
                {transactionHistory.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-darkgray">${transaction.amount.toLocaleString()}</div>
                      <div className="text-sm text-mediumgray">{transaction.method}</div>
                      <div className="text-xs text-mediumgray">{new Date(transaction.date).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
                View All Transactions
              </button>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-skyblue/10 to-faintskyblue/10 rounded-xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-boldblue rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Z" />
                  </svg>
                </div>
                <h4 className="font-bold text-darkgray mb-2">Need Help?</h4>
                <p className="text-sm text-mediumgray mb-4">
                  Contact our support team if you have questions about withdrawals.
                </p>
                <button className="text-boldblue hover:text-deepskyblue font-medium text-sm transition-colors duration-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddMethod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-darkgray">Add Payment Method</h3>
                <button
                  onClick={() => setShowAddMethod(false)}
                  className="text-mediumgray hover:text-darkgray"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-2">Method Type</label>
                  <select
                    value={newMethodType}
                    onChange={(e) => setNewMethodType(e.target.value)}
                    className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:ring-2 focus:ring-boldblue focus:border-transparent"
                  >
                    <option value="bank">Bank Account</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddMethod(false)}
                    className="flex-1 py-2 px-4 border border-lightgray text-mediumgray rounded-lg hover:bg-lightgray/20 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle adding new payment method
                      setShowAddMethod(false);
                    }}
                    className="flex-1 py-2 px-4 bg-boldblue text-white rounded-lg hover:bg-deepskyblue transition-colors duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawEarnings;