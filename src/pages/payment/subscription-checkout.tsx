import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

const SubscriptionCheckoutPage = () => {
  const router = useRouter();
  const { userId } = useAuthStore();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Subscription pricing
  const subscriptionPlans = {
    monthly: {
      price: 29.99,
      period: 'month',
      savings: 0,
      description: 'Billed monthly, cancel anytime'
    },
    annual: {
      price: 299.99,
      period: 'year',
      savings: 59.89, // (29.99 * 12) - 299.99
      description: 'Billed annually, save 2 months'
    }
  };

  const platformFeeRate = 0.03; // 3% processing fee
  const currentPlan = subscriptionPlans[selectedPlan];
  const processingFee = currentPlan.price * platformFeeRate;
  const totalAmount = currentPlan.price + processingFee;

  const handleSubscribe = async () => {
    if (!userId) {
      toast.error('Please log in to continue');
      return;
    }

    setProcessingPayment(true);

    try {
      // TODO: Implement subscription API call
      // const response = await subscribeUser(userId, selectedPlan);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully subscribed to ${selectedPlan} plan!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error('Error processing subscription');
      console.error('Error subscribing:', err);
    } finally {
      setProcessingPayment(false);
    }
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

            {/* Premium Features */}
      

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
                      Save ${subscriptionPlans.annual.savings.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-sm text-mediumgray">{subscriptionPlans.annual.description}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="font-semibold text-darkgray mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                  <span className="text-mediumgray">
                    Premium {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan
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
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
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
                  30-day money-back guarantee • Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;