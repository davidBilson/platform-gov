import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payment/PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!);

const PaymentSetup = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const [paymentMethodSaved, setPaymentMethodSaved] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Payment Setup</h1>
          <p className="text-lg text-mediumgray max-w-2xl mx-auto">
            Secure your project with our trusted payment system. Your information is protected with industry-standard encryption.
          </p>
        </div>

        <div className="overflow-hidden">
          {!paymentMethodSaved ? (
            <div className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-boldblue text-white rounded-full text-sm font-bold">
                    1
                  </div>
                  <div className="w-16 h-1 bg-lightgray mx-2">
                    <div className="w-full h-full bg-gradient-to-r from-boldblue to-deepskyblue rounded"></div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-lightgray text-mediumgray rounded-full text-sm font-bold">
                    2
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-darkgray mb-2">Choose Payment Method</h2>
                <p className="text-mediumgray">Select your preferred payment option to continue</p>
              </div>

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
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.508 0 4.514.893 5.535 2.459 1.01 1.566 1.065 3.699.151 5.879-.915 2.18-2.564 3.738-4.54 4.295-1.976.557-4.334.557-6.5.557v.557c0 .557.446 1.004 1.004 1.004h6.5c.557 0 1.004.446 1.004 1.004v1.004c0 .557-.446 1.004-1.004 1.004H7.076zm6.032-14.019c1.004 0 1.004-.557 1.004-1.115 0-.557 0-1.115-1.004-1.115H9.588c-.557 0-1.004.558-1.004 1.115v1.115c0 .558.447 1.115 1.004 1.115h3.52z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-mediumgray">PayPal</h3>
                        <p className="text-sm text-mediumgray">Quick & secure payments</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-mediumgray/20 rounded-full">
                      <svg className="w-4 h-4 mr-2 text-mediumgray" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L9.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-medium text-mediumgray">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-skyblue/5 to-faintskyblue/5 rounded-2xl p-6 border border-lightblue/20">
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    jobId={jobId as string} 
                    onSuccess={() => setPaymentMethodSaved(true)}
                  />
                </Elements>
              </div>
            </div>
          ) : (
            <div className="p-8 lg:p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-aquagreen to-aquagreen/80 rounded-full mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-darkgray mb-4">Payment Method Saved!</h2>
                <p className="text-lg text-mediumgray mb-8 max-w-lg mx-auto">
                  Great! Your payment method has been securely saved. Now {"let's"} fund your project to get started with the contract.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-aquagreen text-white rounded-full text-sm font-bold">
                    ✓
                  </div>
                  <div className="w-16 h-1 bg-lightgray mx-2">
                    <div className="w-full h-full bg-gradient-to-r from-aquagreen to-boldblue rounded"></div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-boldblue text-white rounded-full text-sm font-bold">
                    2
                  </div>
                </div>
              </div>

              {/* Fund Project Card */}
              <div className="bg-gradient-to-br from-skyblue/10 to-faintskyblue/20 rounded-2xl p-8 border border-lightblue/30 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-boldblue to-deepskyblue rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-darkgray mb-3">Ready to Fund Your Project</h3>
                <p className="text-mediumgray mb-6">
                  Secure your project funding to activate the contract and begin work immediately.
                </p>
                
                <button
                  onClick={() => router.push(`/payment/fund?jobId=${jobId}`)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-boldblue to-deepskyblue text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30"
                >
                  <span className="mr-2">Fund Project</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center text-sm text-mediumgray">
                <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your payment information is protected with bank-level security
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-mediumgray">
            Need help? Contact our{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetup;