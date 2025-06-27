// components/Withdraw.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { getWithdrawableFunds, withdrawFunds, getPayoutMethods, fetchUserWithdrawals } from '@/api/payment-api';
import { toast } from 'react-toastify';
import { Wallet, AlertCircle, Download, CreditCard, ArrowRight, DollarSign, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, History } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading';

const Withdraw = () => {
  const router = useRouter();
  const { userId } = useAuthStore();
  const [funds, setFunds] = useState<{ fundId: string; jobTitle: string; amount: number }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState<{ bankName?: string; last4?: string; isPrimary?: boolean }[]>([]);
  const [hasPayoutSetup, setHasPayoutSetup] = useState(false);

  // Withdrawal history state
  type Withdrawal = {
    _id: string;
    amount: number;
    status: string;
    bankAccount?: {
      bankName?: string;
      last4?: string;
    };
    createdAt: string;
    id: string;
  };

  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const MINIMUM_WITHDRAWAL = 50.00;
  const HISTORY_LIMIT = 5;

  useEffect(() => {
    if (userId) {
      fetchData();
      fetchWithdrawalHistory();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [fundsResponse, payoutResponse] = await Promise.all([
        getWithdrawableFunds(userId),
        getPayoutMethods(userId)
      ]);

      if (fundsResponse?.success) {
        setFunds(fundsResponse.funds || []);
        setTotalAmount(fundsResponse.totalAmount || 0);
      }

      if (payoutResponse?.success) {
        setPayoutMethods(payoutResponse.payoutMethods || []);
        setHasPayoutSetup(payoutResponse.payoutMethods?.length > 0);
      } else {
        const methods = Array.isArray(payoutResponse) ? payoutResponse : [];
        setPayoutMethods(methods);
        setHasPayoutSetup(methods.length > 0);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load withdrawal information');
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);

      const response = await fetchUserWithdrawals(userId, {
        page,
        limit: HISTORY_LIMIT
      });
      console.log('withdrawalhistory: ', response);

      if (response?.success) {
        setWithdrawalHistory(response.withdrawals || []);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.totalPages || 1);
        setTotalWithdrawals(response.totalWithdrawals || 0);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      toast.error('Failed to load withdrawal history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchWithdrawalHistory(newPage);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setWithdrawalAmount(value);
    }
  };

  const validateWithdrawalAmount = () => {
    const amount = parseFloat(withdrawalAmount);

    if (!withdrawalAmount || isNaN(amount)) {
      toast.error('Please enter a valid amount');
      return false;
    }

    if (amount < MINIMUM_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL.toFixed(2)}`);
      return false;
    }

    if (amount > totalAmount) {
      toast.error('Withdrawal amount cannot exceed available balance');
      return false;
    }

    return true;
  };

  const setMaxAmount = () => {
    setWithdrawalAmount(totalAmount.toFixed(2));
  };

  const handleWithdraw = async (): Promise<void> => {
    if (!hasPayoutSetup) {
      toast.error('Please set up your payout method first');
      return;
    }

    if (!validateWithdrawalAmount()) {
      return;
    }

    setWithdrawing(true);
    try {
      const amount = parseFloat(withdrawalAmount);

      const response = await withdrawFunds(userId, amount);

      if (response?.success) {
        toast.success(`Successfully withdrew $${amount.toFixed(2)}`);

        setTotalAmount(prev => parseFloat((prev - amount).toFixed(2)));
        setWithdrawalAmount('');

        await fetchData();
        await fetchWithdrawalHistory(); // Refresh history after successful withdrawal
      } else {
        throw new Error(response?.message || 'Withdrawal failed');
      }
    } catch (error: unknown) {
      console.error('Withdrawal error:', error);
      toast.error((error as Error).message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const navigateToPayoutSetup = () => {
    router.push('/payment/payout-setup');
  };

  if (loading) return <LoadingAnimation />;

  const hasWithdrawableFunds = totalAmount >= MINIMUM_WITHDRAWAL;
  const primaryPayoutMethod = payoutMethods.find(method => method.isPrimary) || payoutMethods[0];
  const withdrawalAmountNum = parseFloat(withdrawalAmount) || 0;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-boldblue/10 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-boldblue" />
            </div>
            <h1 className="text-3xl font-bold text-boldblue mb-2">Withdraw Funds</h1>
            <p className="text-gray-600">Transfer your earnings to your bank account</p>
          </div>

          {/* Payout Setup Alert */}
          {!hasPayoutSetup && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Payment Setup Required
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    You need to set up a bank account before you can withdraw funds.
                    This is a one-time setup process.
                  </p>
                  <button
                    onClick={navigateToPayoutSetup}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    Set Up Bank Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payout Method Display */}
          {hasPayoutSetup && primaryPayoutMethod && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-gray-500 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Withdrawal Method</h3>
                    <p className="text-sm text-gray-600">
                      {primaryPayoutMethod.bankName || 'Bank Account'} ****{primaryPayoutMethod.last4}
                    </p>
                  </div>
                </div>
                <button
                  onClick={navigateToPayoutSetup}
                  className="text-boldblue hover:text-boldblue/80 text-sm font-medium transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Balance and Withdrawal Card */}
          <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="font-semibold text-boldblue mb-2">Available Balance</h2>
              <div className="text-3xl font-bold text-aquagreen mb-4">
                ${totalAmount?.toFixed(2) ?? '0.00'}
              </div>
              <p className="text-gray-600">
                {hasWithdrawableFunds
                  ? hasPayoutSetup
                    ? "Ready for withdrawal to your registered bank account"
                    : "Set up your bank account to withdraw these funds"
                  : `Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL.toFixed(2)}`
                }
              </p>
            </div>

            {/* Withdrawal Amount Input */}
            {hasWithdrawableFunds && hasPayoutSetup && (
              <div className="max-w-md mx-auto mb-8">
                <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="withdrawalAmount"
                    value={withdrawalAmount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="block w-full pl-10 pr-20 py-3 border border-gray-300 text-darkgray outline-none rounded-lg focus:ring-2 focus:ring-boldblue focus:border-boldblue text-lg font-semibold text-center"
                  />
                  <button
                    onClick={setMaxAmount}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-medium text-boldblue hover:text-boldblue/80 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Min: ${MINIMUM_WITHDRAWAL.toFixed(2)}</span>
                  <span>Max: ${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Withdraw Button */}
            <div className="text-center">
              {hasWithdrawableFunds && hasPayoutSetup ? (
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing || !withdrawalAmount || withdrawalAmountNum < MINIMUM_WITHDRAWAL || withdrawalAmountNum > totalAmount}
                  className={`
                    inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 min-w-[200px] justify-center
                    ${!withdrawing && withdrawalAmount && withdrawalAmountNum >= MINIMUM_WITHDRAWAL && withdrawalAmountNum <= totalAmount
                      ? 'bg-aquagreen hover:bg-aquagreen/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
                    }
                  `}
                >
                  {withdrawing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-3" />
                      Withdraw ${withdrawalAmountNum > 0 ? withdrawalAmountNum.toFixed(2) : '0.00'}
                    </>
                  )}
                </button>
              ) : !hasPayoutSetup && hasWithdrawableFunds ? (
                <button
                  onClick={navigateToPayoutSetup}
                  className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-boldblue hover:bg-boldblue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer transition-all duration-200"
                >
                  Set Up Withdrawal Method
                  <ArrowRight className="w-5 h-5 ml-3" />
                </button>
              ) : null}
            </div>
            <p className="text-mediumgray p-6 max-w-xl m-auto text-[10px] text-center leading-relaxed">
              Our advanced security protocols and multi-layer verification systems provide{" "}
              <span className="font-semibold text-aquagreen">uncompromising safety</span>{" "}
              for your funds, giving you complete peace of mind with every withdrawal.
            </p>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <History className="w-6 h-6 text-boldblue mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Withdrawal History
                {totalWithdrawals > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({totalWithdrawals} total)
                  </span>
                )}
              </h3>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boldblue"></div>
              </div>
            ) : withdrawalHistory.length > 0 ? (
              <>
                <div className="space-y-4">
                  {withdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        {getStatusIcon(withdrawal.status)}
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800">
                              ${withdrawal.amount.toFixed(2)}
                            </span>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span>{withdrawal.bankAccount?.bankName || 'Bank Account'} ****{withdrawal.bankAccount?.last4}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(withdrawal.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          ID: {withdrawal.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">No Withdrawal History</h4>
                <p className="text-gray-400">You haven't made any withdrawals yet.</p>
              </div>
            )}
          </div>

          {/* Available Payments Summary */}
          {hasWithdrawableFunds && funds.length > 0 && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Payments ({funds.length})
              </h3>
              <div className="space-y-3">
                {funds.map((fund) => (
                  <div key={fund.fundId} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{fund.jobTitle}</h4>
                      <p className="text-sm text-gray-500">Payment ID: {fund.fundId}</p>
                    </div>
                    <div className="text-lg font-semibold text-aquagreen">
                      ${fund.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total Available:</span>
                  <span className="text-xl font-bold text-aquagreen">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State Message */}
          {!hasWithdrawableFunds && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {totalAmount > 0 ? 'Minimum Amount Not Met' : 'No Funds Available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {totalAmount > 0
                  ? `You have $${totalAmount.toFixed(2)} available, but need at least $${MINIMUM_WITHDRAWAL.toFixed(2)} to withdraw.`
                  : 'You currently don\'t have any funds available for withdrawal. Complete more tasks or wait for pending payments to be processed.'
                }
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-boldblue font-medium">
                  💡 Tip: Earnings are typically available for withdrawal within 24-48 hours after job completion and approval.
                </p>
              </div>
            </div>
          )}

          {/* Processing Info */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-3">Withdrawal Information</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Bank transfers typically take 5-7 business days to process</p>
              <p>• Withdrawals are processed Monday through Friday</p>
              <p>• You'll receive an email confirmation once the transfer is initiated</p>
              <p>• Minimum withdrawal amount: ${MINIMUM_WITHDRAWAL.toFixed(2)}</p>
              <p>• You can withdraw any amount up to your available balance</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Withdraw;