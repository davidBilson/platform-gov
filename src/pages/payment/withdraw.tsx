// components/Withdraw.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import { getWithdrawableFunds, withdrawFunds, getPayoutMethods } from '@/api/payment-api';
import { toast } from 'react-toastify';
import { Wallet, AlertCircle, Download, CreditCard, ArrowRight } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading';

const Withdraw = () => {
  const router = useRouter();
  const { userId } = useAuthStore();
  const [funds, setFunds] = useState<{ fundId: string; jobTitle: string; amount: number }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState<Record<string, boolean>>({});
  const [payoutMethods, setPayoutMethods] = useState<{ bankName?: string; last4?: string; isPrimary?: boolean }[]>([]);
  const [hasPayoutSetup, setHasPayoutSetup] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both withdrawable funds and payout methods
      const [fundsResponse, payoutResponse] = await Promise.all([
        getWithdrawableFunds(userId),
        getPayoutMethods(userId)
      ]);

      // Handle funds response
      if (fundsResponse?.success) {
        setFunds(fundsResponse.funds || []);
        setTotalAmount(fundsResponse.totalAmount || 0);
      }

      // Handle payout methods response
      if (payoutResponse?.success) {
        setPayoutMethods(payoutResponse.payoutMethods || []);
        setHasPayoutSetup(payoutResponse.payoutMethods?.length > 0);
      } else {
        // If the response structure is different (direct array)
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

  interface WithdrawResponse {
    success: boolean;
    amount?: number;
    message?: string;
  }

  const handleWithdraw = async (fundId: string): Promise<void> => {
    if (!hasPayoutSetup) {
      toast.error('Please set up your payout method first');
      return;
    }

    if (totalAmount <= 0) {
      toast.error('No funds available for withdrawal');
      return;
    }
    
    try {
      setWithdrawing((prev: Record<string, boolean>) => ({ ...prev, [fundId]: true }));
      
      const response: WithdrawResponse = await withdrawFunds(userId, fundId);
      
      if (response?.success) {
        toast.success(`Successfully withdrew $${response.amount?.toFixed(2) || totalAmount.toFixed(2)}`);
        // Refresh data after successful withdrawal
        await fetchData();
      } else {
        throw new Error(response?.message || 'Withdrawal failed');
      }
    } catch (error: unknown) {
      console.error('Withdrawal error:', error);
      toast.error((error as Error).message || 'Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing((prev: Record<string, boolean>) => ({ ...prev, [fundId]: false }));
    }
  };

  const handleWithdrawAll = async () => {
    if (!hasPayoutSetup) {
      toast.error('Please set up your payout method first');
      return;
    }

    if (funds.length === 0) {
      toast.error('No funds available for withdrawal');
      return;
    }

    try {
      setWithdrawing(prev => ({ ...prev, 'all': true }));
      
      // Process all funds for withdrawal
      const withdrawalPromises = funds.map(fund => withdrawFunds(userId, fund.fundId));
      const results = await Promise.allSettled(withdrawalPromises);
      
      let successCount = 0;
      let totalWithdrawn = 0;
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value?.success) {
          successCount++;
          totalWithdrawn += result.value.amount || funds[index].amount;
        }
      });
      
      if (successCount > 0) {
        toast.success(`Successfully withdrew $${totalWithdrawn.toFixed(2)} from ${successCount} payment${successCount > 1 ? 's' : ''}`);
        await fetchData();
      } else {
        toast.error('All withdrawals failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Bulk withdrawal error:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(prev => ({ ...prev, 'all': false }));
    }
  };

  const navigateToPayoutSetup = () => {
    router.push('/payment/payout-setup');
  };

  if (loading) return <LoadingAnimation />;

  const hasWithdrawableFunds = totalAmount > 0;
  const primaryPayoutMethod = payoutMethods.find(method => method.isPrimary) || payoutMethods[0];

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

          {/* Balance Card */}
          <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
            <div className="text-center">
              <h2 className="font-semibold text-boldblue mb-2">Available Balance</h2>
              <div className="text-3xl font-bold text-aquagreen mb-4">
                ${totalAmount?.toFixed(2) ?? '0.00'}
              </div>
              <p className="text-gray-600 mb-8">
                {hasWithdrawableFunds 
                  ? hasPayoutSetup 
                    ? "Ready for withdrawal to your registered bank account" 
                    : "Set up your bank account to withdraw these funds"
                  : "No funds available for withdrawal at this time"
                }
              </p>

              {/* Withdraw Buttons */}
              <div className="space-y-4">
                {hasWithdrawableFunds && funds.length > 1 && (
                  <button
                    onClick={handleWithdrawAll}
                    disabled={!hasPayoutSetup || withdrawing.all}
                    className={`
                      inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[200px] justify-center
                      ${hasPayoutSetup
                        ? 'bg-aquagreen hover:bg-aquagreen/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
                      }
                    `}
                  >
                    {withdrawing.all ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing All...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-3" />
                        Withdraw All Funds
                      </>
                    )}
                  </button>
                )}

                {!hasPayoutSetup && hasWithdrawableFunds && (
                  <button
                    onClick={navigateToPayoutSetup}
                    className="inline-flex items-center px-6 py-3 rounded-xl font-semibold bg-boldblue hover:bg-boldblue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer transition-all duration-200"
                  >
                    Set Up Withdrawal Method
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Individual Funds List */}
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
                      {/* <p className="text-sm text-gray-500">
                        Released on {new Date(fund.releasedAt).toLocaleDateString()}
                      </p> */}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-aquagreen">
                        ${fund.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleWithdraw(fund.fundId)}
                        disabled={!hasPayoutSetup || withdrawing[fund.fundId]}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-w-[100px]
                          ${hasPayoutSetup
                            ? 'bg-aquagreen hover:bg-aquagreen/90 text-white cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {withdrawing[fund.fundId] ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </div>
                        ) : (
                          'Withdraw'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State Message */}
          {!hasWithdrawableFunds && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Funds Available</h3>
              <p className="text-gray-600 mb-6">
                You currently don't have any funds available for withdrawal. 
                Complete more tasks or wait for pending payments to be processed.
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
              <p>• Minimum withdrawal amount: $50.00</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Withdraw;