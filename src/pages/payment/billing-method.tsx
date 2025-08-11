import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payment/PaymentForm';
import { getUserPaymentMethods, updateDefaultPaymentMethod, deletePaymentMethod } from '@/api/payment/payment-api';
import useAuthStore from '@/store/useAuth';
import CreditCardIcon from '@/components/payment/CreditCardIcon';
import { toast } from 'react-toastify';
import LoadingAnimation from '@/components/ui/loading';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentMethodSetup = () => {

  const router = useRouter();
  const { jobId, returnTo } = router.query;
  const { userId, role } = useAuthStore();
  
  const [paymentMethodSaved, setPaymentMethodSaved] = useState(false);
  const [hasExistingMethod, setHasExistingMethod] = useState(false);
  const [loading, setLoading] = useState(true);

  const isFromContractOrSubscription =
  typeof returnTo === 'string' &&
  (returnTo.startsWith('/contract') || returnTo.startsWith('subscribe'));

  
  interface PaymentMethod {
    id: string;
    brand: | "Alipay"
    | "Amex"
    | "Code"
    | "CodeFront"
    | "Diners"
    | "Discover"
    | "Elo"
    | "Generic"
    | "Hiper"
    | "Hipercard"
    | "Jcb"
    | "Maestro"
    | "Mastercard"
    | "Mir"
    | "Paypal"
    | "Unionpay"
    | "Visa";
    last4: string;
    expMonth: number;
    expYear: number;
  }

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchPaymentMethods = async () => {
    if (userId) {
      setLoading(true);
      try {
        const response = await getUserPaymentMethods(userId);
        if (response.success) {
          setPaymentMethods(response.paymentMethods || []);
          setDefaultPaymentMethod(response.defaultPaymentMethod || null);
          setHasExistingMethod((response.paymentMethods?.length || 0) > 0);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!userId) return;

    try {
      const response = await updateDefaultPaymentMethod(userId, paymentMethodId);
      if (response.success) {
        toast.success('Default payment method updated');
        setDefaultPaymentMethod(paymentMethodId);
      } else {
        toast.error(response.message || 'Failed to set default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method');
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!userId) return;

    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const response = await deletePaymentMethod(userId, paymentMethodId);
      if (response.success) {
        toast.success('Payment method deleted');
        await fetchPaymentMethods();

        // If we deleted the default, update state
        if (paymentMethodId === defaultPaymentMethod) {
          setDefaultPaymentMethod(
            paymentMethods.length > 1 ? paymentMethods[0].id : null
          );
        }
      } else {
        toast.error(response.message || 'Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  const handleReturnToPrevPage = () => {
    if (returnTo && typeof returnTo === 'string') {
      router.back();
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
      </div>
    );
  }

  if (paymentMethodSaved) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="p-8 lg:p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-aquagreen to-aquagreen rounded-full mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-darkgray mb-4">Payment Method Saved!</h2>
            </div>

            {/* Show contract return option if coming from contract */}
            {isFromContractOrSubscription ? (
              <div className="rounded-2xl p-8 border border-lightblue/30 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                    <svg className="w-16 h-16 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-darkgray mb-3">Payment Method Ready</h3>
                <p className="text-mediumgray mb-6">
                  Your payment method has been saved. You can now continue with your payment.
                </p>

                <button
                  onClick={handleReturnToPrevPage}
                  className="cursor-pointer group relative inline-flex items-center justify-center px-6 py-3 bg-deepskyblue text-white text-sm font-bold rounded-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30"
                >
                  <span className="mr-2">Continue Payment</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            ) : jobId && (
              <div className="rounded-2xl p-8 border border-lightblue/30 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                    <svg className="w-16 h-16 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-darkgray mb-3">Ready to Fund Your Project</h3>
                <p className="text-mediumgray mb-6">
                  Secure your project funding to activate the contract and begin work immediately.
                </p>

                <button
                  onClick={() => router.push(`/payment/fund-project?jobId=${jobId}`)}
                  className="cursor-pointer group relative inline-flex items-center justify-center px-4 py-2 bg-deepskyblue text-white text-sm font-bold rounded-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30"
                >
                  <span className="mr-2">Fund Project</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center text-sm text-mediumgray">
              <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your payment information is protected with bank-level security
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-boldblue">
            {hasExistingMethod ? 'Payment Methods' : 'Add Payment Method'}
          </h1>
          <p className="text-mediumgray mt-2">
            {hasExistingMethod
              ? 'Manage your saved payment methods'
              : 'Select your preferred payment option to continue'}
          </p>
        </div>

        {isFromContractOrSubscription && (
          <div className="mb-6 text-center">
            <button
              onClick={handleReturnToPrevPage}
              className="inline-flex items-center text-sm text-boldblue hover:text-deepskyblue font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Payment
            </button>
          </div>
        )}

        {hasExistingMethod && (
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-boldblue">Saved Payment Methods</h2>
              <button
                onClick={() => setShowPaymentForm(true)}
                className="bg-boldblue hover:bg-boldblue/70 text-sm px-4 py-2 rounded-lg text-white cursor-pointer font-medium"
              >
                Add New Method
              </button>
            </div>

            <div>
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between px-4 py-6 bg-darkgray/5 rounded-lg mb-3"
                >
                  <div className="flex items-center">
                    <CreditCardIcon brand={method.brand} />
                    <div className="ml-4">
                      <h3 className="font-medium capitalize">
                        {method.brand} ending in {method.last4}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear.toString().slice(-2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {method.id === defaultPaymentMethod ? (
                      <span className="bg-aquagreen/10 text-aquagreen text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-xs text-mediumgray hover:text-boldblue cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(showPaymentForm || !hasExistingMethod) && (
          <div className="overflow-hidden">
            <div className="p-8 lg:p-12">

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="group cursor-pointer">
                  <div className="relative bg-gradient-to-br from-white to-skyblue/10 border-2 border-boldblue rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-boldblue rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-boldblue to-boldblue rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-darkgray">Credit/Debit Card</h3>
                        <p className="text-sm text-mediumgray">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-aquagreen font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure & Encrypted
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="relative bg-gradient-to-br from-lightgray/30 to-lightgray/10 border-2 border-lightgray rounded-2xl p-6 opacity-60">
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-mediumgray rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-mediumgray rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.508 0 4.514.893 5.535 2.459 1.01 1.566 1.065 3.699.151 5.879-.915 2.18-2.564 3.738-4.54 4.295-1.976.557-4.334.557-6.5.557v.557c0 .557.446 1.004 1.004 1.004h6.5c.557 0 1.004.446 1.004 1.004v1.004c0 .557-.446 1.004-1.004 1.004H7.076zm6.032-14.019c1.004 0 1.004-.557 1.004-1.115 0-.557 0-1.115-1.004-1.115H9.588c-.557 0-1.004.558-1.004 1.115v1.115c0 .558.447 1.115 1.004 1.115h3.52z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-mediumgray">PayPal</h3>
                        <p className="text-sm text-mediumgray">Quick & secure payments</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-mediumgray/20 rounded-full">
                      <svg className="w-4 h-4 mr-2 text-mediumgray" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L9.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-mediumgray">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-skyblue/5 to-faintskyblue/5 rounded-2xl p-6 border border-lightblue/20">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    setHasExistingMethod={setHasExistingMethod}
                    onSuccess={() => {
                      setPaymentMethodSaved(true);
                      setShowPaymentForm(false);
                    }}
                    existingPaymentMethods={paymentMethods}
                  />
                </Elements>
              </div>

              {hasExistingMethod && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="text-mediumgray hover:text-boldblue underline text-sm"
                  >
                    Cancel adding new method
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {jobId && !showPaymentForm && hasExistingMethod && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push(`/payment/fund-project?jobId=${jobId}`)}
              className="bg-boldblue hover:bg-boldblue/70 text-white text-sm py-2 px-4 rounded-lg cursor-pointer transition-all duration-300"
            >
              Proceed to Fund Project
            </button>
            <button
              onClick={() => router.back()}
              className="ml-4 bg-darkgray/10 text-darkgray cursor-pointer text-sm py-2 px-4 rounded-lg hover:bg-darkgray/5 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSetup;