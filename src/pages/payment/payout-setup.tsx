"use client"
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import {
  getPayoutMethods,
  saveBankAccount,
  deletePaymentMethod,
  createOnboardingLink,
  getAccountStatus
} from '@/api/payment/payment-api';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';
import LoadingAnimation from '@/components/ui/loading';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PayoutMethod {
  id: string;
  type: 'bank';
  name: string;
  details: string;
  primary: boolean;
  icon: React.ReactNode;
}

interface ApiPayoutMethod {
  id: string;
  type: 'bank';
  bankName?: string;
  last4?: string;
  isPrimary?: boolean;
}

interface AccountStatus {
  payouts_enabled: boolean;
  charges_enabled: boolean;
  details_submitted: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  capabilities: {
    transfers: string;
  };
}

const PayoutSetupContent = () => {
  const { userId, role } = useAuthStore();
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [bankFormError, setBankFormError] = useState('');
  const [bankFormLoading, setBankFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  const [bankForm, setBankForm] = useState({
    routingNumber: '',
    accountNumber: '',
    accountHolderName: '',
    accountType: 'checking'
  });

  const stripe = useStripe();

  const transformMethods = (methods: ApiPayoutMethod[]): PayoutMethod[] => {
    return methods.map((method) => ({
      id: method.id,
      type: method.type,
      name: method.bankName || 'Bank Account',
      details: `****${method.last4}`,
      primary: method.isPrimary || false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }));
  };

  const fetchAccountStatus = async () => {
    if (!userId) return;

    try {
      const statusRes = await getAccountStatus(userId);
      if (statusRes.success) {
        setAccountStatus(statusRes.account);
      }
    } catch (error) {
      console.error('Error fetching account status:', error);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!userId) return;

    try {
      setOnboardingLoading(true);
      const onboardingRes = await createOnboardingLink(userId);

      if (onboardingRes.success) {
        window.location.href = onboardingRes.onboardingUrl;
      } else {
        toast.error(onboardingRes.message || 'Failed to start onboarding');
      }
    } catch (error) {
      console.error('Error starting onboarding:', error);
      toast.error('Failed to start onboarding process');
    } finally {
      setOnboardingLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const methodsRes = await getPayoutMethods(userId);
        const transformedMethods = transformMethods(methodsRes);
        setPayoutMethods(transformedMethods);

        await fetchAccountStatus();

        console.log('Data fetched successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast.success('Account setup completed successfully!');
      fetchAccountStatus(); // Refresh account status
    } else if (urlParams.get('refresh') === 'true') {
      toast.info('Please complete the account setup to receive payments.');
    }
  }, [userId]);

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormError('');
    setBankFormLoading(true);

    if (!stripe) {
      setBankFormError('Payment system not ready. Please try again.');
      setBankFormLoading(false);
      return;
    }

    // Enhanced validation
    if (!bankForm.routingNumber || !/^\d{9}$/.test(bankForm.routingNumber)) {
      setBankFormError('Please enter a valid 9-digit routing number');
      setBankFormLoading(false);
      return;
    }

    if (!bankForm.accountNumber || bankForm.accountNumber.length < 4) {
      setBankFormError('Please enter a valid account number');
      setBankFormLoading(false);
      return;
    }

    if (!bankForm.accountHolderName || bankForm.accountHolderName.length < 2) {
      setBankFormError('Please enter the account holder name');
      setBankFormLoading(false);
      return;
    }

    try {
      // Create bank account token
      const { token, error } = await stripe.createToken('bank_account', {
        country: 'US',
        currency: 'usd',
        routing_number: bankForm.routingNumber,
        account_number: bankForm.accountNumber,
        account_holder_name: bankForm.accountHolderName,
        account_holder_type: 'individual',
      });

      console.log('Stripe token:', token);

      if (error) {
        throw new Error(error.message || 'Bank account validation failed');
      }

      // Save bank account via API
      const result = await saveBankAccount(userId, token.id);
      console.log('API save result:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to save bank account');
      }

      // Reset form and refresh data
      resetForm();
      const methodsRes = await getPayoutMethods(userId);
      console.log('Fetched updated payout methods:', methodsRes);
      setPayoutMethods(transformMethods(methodsRes));

      // Refresh account status
      await fetchAccountStatus();

      toast.success('Bank account added successfully! Please complete account setup to receive payments.');

    } catch (error) {
      setBankFormError(
        'We couldn\'t add your bank account. Please check the details and try again.'
      );
      console.log('Error adding bank account:', error);
    } finally {
      setBankFormLoading(false);
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    try {
      // Call API to remove method
      await deletePaymentMethod(userId, methodId);
      const updatedMethods = payoutMethods.filter(method => method.id !== methodId);
      setPayoutMethods(updatedMethods);
      toast.success('Bank account removed successfully');
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast.error('Failed to remove bank account');
    }
  };

  const resetForm = () => {
    setShowAddMethod(false);
    setBankForm({
      routingNumber: '',
      accountNumber: '',
      accountHolderName: '',
      accountType: 'checking'
    });
    setBankFormError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!userId || !role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unauthorized</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  const needsOnboarding = accountStatus && !accountStatus.payouts_enabled;
  const hasRequirements = accountStatus?.requirements?.currently_due && accountStatus.requirements.currently_due.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-boldblue mb-2">Payout Setup</h1>
              <p className="text-gray-600">Add and manage your bank accounts for receiving payments</p>
            </div>
          </div>
        </div>

        {needsOnboarding && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Account Setup Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your account needs additional information before you can receive payments.</p>
                  {hasRequirements && (
                    <div className="mt-2">
                      <p className="font-medium">Required information:</p>
                      <ul className="list-disc list-inside mt-1">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req} className="text-xs">{req.replace(/_/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleCompleteOnboarding}
                    disabled={onboardingLoading}
                    className="bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {onboardingLoading ? 'Starting...' : 'Complete Account Setup'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Status Badge */}
        {accountStatus && (
          <div className="bg-white rounded-xl p-4 border border-blue-100 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Account Status</h3>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${accountStatus.payouts_enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {accountStatus.payouts_enabled ? 'Ready for Payouts' : 'Setup Required'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${accountStatus.capabilities.transfers === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                  }`}>
                  Transfers: {accountStatus.capabilities.transfers}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-blue-100 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-boldblue">Bank Accounts</h3>
            <button
              onClick={() => setShowAddMethod(true)}
              className="bg-deepskyblue cursor-pointer text-white font-semibold text-sm p-2 rounded-lg hover:bg-deepskyblue/80 flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Bank Account
            </button>
          </div>

          {payoutMethods.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No bank accounts yet</h4>
              <p className="text-gray-500 mb-6">Add a bank account to receive your earnings</p>
              <button
                onClick={() => setShowAddMethod(true)}
                className="bg-deepskyblue cursor-pointer text-sm font-semibold text-white py-2 px-4 rounded-lg hover:bg-deepskyblue/80 transition-colors duration-200"
              >
                Add Your First Bank Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {payoutMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg mr-4 text-gray-500">
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center">
                          {method.name}
                          {method.primary && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{method.details}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMethod(method.id)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processing Time Info */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <h3 className="text font-bold text-gray-800 mb-4">Processing Time</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xs">Bank Transfer</span>
            </div>
            <span className="text-xs bg-boldblue/10 text-boldblue px-2 py-1 rounded">5 business days</span>
          </div>
        </div>

        {/* Add Bank Account Modal */}
        {showAddMethod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Add Bank Account</h3>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddBankAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountHolderName}
                    onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                    placeholder="Full name on account"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepskyblue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Routing Number *
                  </label>
                  <input
                    type="text"
                    value={bankForm.routingNumber}
                    onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                    placeholder="9-digit routing number"
                    maxLength={9}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepskyblue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                    placeholder="Account number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepskyblue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Account Type
                  </label>
                  <select
                    value={bankForm.accountType}
                    onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepskyblue focus:border-transparent"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>

                {bankFormError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{bankFormError}</div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 px-4 border border-gray-300 text-sm cursor-pointer text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bankFormLoading}
                    className="flex-1 py-2 px-4 bg-deepskyblue text-white text-sm cursor-pointer rounded-lg hover:bg-deepskyblue/70 disabled:opacity-50 transition-colors duration-200"
                  >
                    {bankFormLoading ? 'Adding...' : 'Add Bank Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component wrapped with Elements provider
const PayoutSetup = () => {
  return (
    <Elements stripe={stripePromise}>
      <PayoutSetupContent />
    </Elements>
  );
};

export default PayoutSetup;