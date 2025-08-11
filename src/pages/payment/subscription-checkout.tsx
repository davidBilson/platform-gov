import React, { useState, useEffect } from 'react';
import useSubscriptionPrices from '@/hooks/useSubscriptionPrices';
import { createSubscription } from '@/api/subscription-api';
import useAuthStore from '@/store/useAuth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PaymentMethodModal from '@/components/payment/PaymentMethodModal';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, onContinue, planType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-aquagreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-darkgray mb-2">Subscription Successful!</h2>
          <p className="text-mediumgray mb-6">
            Welcome to Premium! You've successfully subscribed to the {planType} plan. 
            You now have access to all premium features.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onContinue}
              className="cursor-pointer flex-1 bg-gradient-to-r from-aquagreen to-aquagreen text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionCheckoutPage = () => {
  const router = useRouter();
  const { query } = router;
  const { plan } = query;
  const { userId, role, setFormData } = useAuthStore();

  const { subscriptionPrices } = useSubscriptionPrices();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subscriptionPlans = {
    monthly: {
      price: subscriptionPrices.monthly,
      period: 'month',
      savings: 0,
      description: 'Billed monthly, cancel anytime'
    },
    annual: {
      price: subscriptionPrices.annual,
      period: 'year',
      savings: ((subscriptionPrices.monthly * 12 - subscriptionPrices.annual)),
      description: 'Billed annually, save 2 months'
    }
  };

  useEffect(() => {
    plan && setSelectedPlan(plan === 'annual' ? 'annual' : 'monthly');
  }, [query, plan]);

  const platformFeeRate = 0.03; // 3% processing fee
  const currentPlan = subscriptionPlans[selectedPlan];
  const processingFee = currentPlan.price * platformFeeRate;
  const totalAmount = currentPlan.price + processingFee;

  const handleSubscribe = async () => {
    if (!userId) {
      toast.error('Please log in to continue');
      return;
    }

    if (!role) {
      toast.error('User role not found. Please try logging in again.');
      return;
    }

    setProcessingPayment(true);

    try {
      const subscriptionData = {
        planName: 'premium',
        userType: role,
        billingInterval: selectedPlan,
        subscriptionAmount: currentPlan.price,
        currency: 'USD',
        autoRenew: autoRenew
      };

      const response = await createSubscription(userId, subscriptionData);

      if (response.success) {
        setFormData({
          isSubscribed: true
        });
        // Show success modal instead of toast and redirect
        setShowSuccessModal(true);
      } else {
        // Check if the error is due to payment method not being set up
        if (response.data?.reason === 'payment_method_not_set_up') {
          setShowPaymentModal(true);
        } else if (response.data?.requires_action) {
          // Handle authentication required case
          toast.error('Payment requires additional authentication. Please try again.');
        } else {
          // Handle other errors
          toast.error(response.message || 'Error processing subscription');
        }
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSetupPayment = () => {
    setShowPaymentModal(false);
    router.push(`/payment/billing-method?returnTo=subscribe`);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handleSuccessModalContinue = () => {
    setShowSuccessModal(false);
    router.push('/subscribe');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Upgrade to Premium</h1>
          <p className="text-mediumgray text-lg">
            Unlock advanced features and take your projects to the next level
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden bg-gradient-to-br from-white to-skyblue/10 border-2 border-skyblue">
          <div className="p-8">
            {/* Plan Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-darkgray">Choose Your Plan</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Monthly Plan */}
                <div 
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlan === 'monthly' 
                      ? 'border-boldblue bg-boldblue/5' 
                      : 'border-lightgray bg-white hover:border-boldblue/50'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-darkgray">Monthly</h3>
                      <p className="text-sm text-mediumgray">Perfect for trying out premium features</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'monthly' ? 'border-boldblue bg-boldblue' : 'border-lightgray'
                    }`}>
                      {selectedPlan === 'monthly' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-darkgray">${subscriptionPlans.monthly.price}</span>
                    <span className="text-mediumgray ml-1">/month</span>
                  </div>
                  <p className="text-sm text-mediumgray">{subscriptionPlans.monthly.description}</p>
                </div>

                {/* Annual Plan */}
                <div 
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlan === 'annual' 
                      ? 'border-boldblue bg-boldblue/5' 
                      : 'border-lightgray bg-white hover:border-boldblue/50'
                  }`}
                  onClick={() => setSelectedPlan('annual')}
                >
                  {/* Popular Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-aquagreen to-aquagreen text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-darkgray">Annual</h3>
                      <p className="text-sm text-mediumgray">Best value with 2 months free</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === 'annual' ? 'border-boldblue bg-boldblue' : 'border-lightgray'
                    }`}>
                      {selectedPlan === 'annual' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-darkgray">${subscriptionPlans.annual.price}</span>
                    <span className="text-mediumgray ml-1">/year</span>
                    <div className="text-sm text-aquagreen font-semibold">
                      Save {(
                        ((subscriptionPrices.monthly * 12 - subscriptionPrices.annual) /
                          (subscriptionPrices.monthly * 12) * 100)
                      ).toFixed(0)}%
                    </div>
                  </div>
                  <p className="text-sm text-mediumgray">{subscriptionPlans.annual.description}</p>
                </div>
              </div>

              {/* Premium Features */}
              <div className="bg-gradient-to-br from-boldblue/5 to-aquagreen/5 rounded-xl p-6 border border-boldblue/10">
                <h3 className="text-lg font-bold text-darkgray mb-4">Premium Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-aquagreen mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-darkgray">Unlimited Projects</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-aquagreen mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-darkgray">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-aquagreen mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-darkgray">Priority Support</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-aquagreen mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-darkgray">Custom Integrations</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-aquagreen mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-darkgray">Team Collaboration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Renew Toggle */}
            <div className="mb-8">
              <div className="bg-lightgray/20 rounded-xl p-6 border border-lightgray/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-darkgray mb-2">Auto-Renewal</h3>
                    <p className="text-sm text-mediumgray">
                      {autoRenew 
                        ? `Your subscription will automatically renew every ${selectedPlan === 'monthly' ? 'month' : 'year'}. You can cancel anytime.`
                        : `Your subscription will not automatically renew. You'll need to manually renew before it expires.`
                      }
                    </p>
                  </div>
                  <div className="ml-6">
                    <button
                      type="button"
                      onClick={() => setAutoRenew(!autoRenew)}
                      className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-offset-2 ${
                        autoRenew ? 'bg-boldblue' : 'bg-mediumgray'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRenew ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {!autoRenew && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Reminder Required</p>
                        <p className="text-sm text-yellow-700">
                          We'll send you an email reminder before your subscription expires so you can renew manually.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="font-semibold text-darkgray mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                  <span className="text-mediumgray">
                    Premium {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan
                    {autoRenew && <span className="text-xs ml-2 text-boldblue">(Auto-renewing)</span>}
                  </span>
                  <span className="font-semibold text-darkgray">${currentPlan.price}</span>
                </div>

                <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                  <span className="text-mediumgray">Processing fee ({(platformFeeRate * 100).toFixed(1)}%)</span>
                  <span className="font-semibold text-darkgray">${processingFee.toFixed(2)}</span>
                </div>

                {selectedPlan === 'annual' && (
                  <div className="flex justify-between items-center py-2 px-4 bg-aquagreen/10 rounded-lg border border-aquagreen/20">
                    <span className="text-aquagreen font-medium">Annual Savings</span>
                    <span className="font-semibold text-aquagreen">-${subscriptionPlans.annual.savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-boldblue to-boldblue rounded-lg">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="font-bold text-white text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="mb-6">
              <button
                onClick={handleSubscribe}
                disabled={processingPayment}
                className={`group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold rounded-xl cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30 ${
                  processingPayment
                    ? 'bg-mediumgray text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-aquagreen to-aquagreen text-white hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {processingPayment ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Processing Subscription...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">Subscribe to Premium</span>
                    <span className="font-bold">${totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </button>
            </div>

            {/* Security & Guarantee */}
            <div className="space-y-4">
              <div className="flex items-center justify-center text-sm text-mediumgray">
                <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your payment information is protected with bank-level security
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center text-sm text-mediumgray bg-lightgray/30 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Setup Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        onSetupPayment={handleSetupPayment}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        onContinue={handleSuccessModalContinue}
        planType={selectedPlan}
      />
    </div>
  );
};

export default SubscriptionCheckoutPage;