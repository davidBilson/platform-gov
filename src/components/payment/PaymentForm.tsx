// paymentform.tsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { savePaymentMethod } from '@/api/payment/payment-api';
import useAuthStore from '@/store/useAuth';

interface PaymentMethodData {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface PaymentFormProps {
  onSuccess: (paymentMethodData: { id: string; card: { brand: string; last4: string } }) => void;
  setHasExistingMethod: (hasMethod: boolean) => void;
  existingPaymentMethods: PaymentMethodData[];
}

const PaymentForm = ({ onSuccess, existingPaymentMethods }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe is not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    if (!userId) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create token from card element
      const { token, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!token) {
        throw new Error('Failed to create payment token');
      }

      // Check for duplicate card
      const isDuplicate = existingPaymentMethods.some(
        method =>
          method.last4 === token.card?.last4 &&
          method.expMonth === token.card?.exp_month &&
          method.expYear === token.card?.exp_year
      );

      if (isDuplicate) {
        throw new Error('This card is already saved to your account');
      }

      // Send token to backend to save payment method
      const response = await savePaymentMethod({
        token: token.id,
        userId
      });

      if (response.success) {
        cardElement.clear();
        onSuccess(response.data);
      } else {
        throw new Error(response.message || 'Failed to save payment method');
      }

    } catch (err) {
      console.error('Payment method save error:', err);
      setError('Failed to save payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: '#ffffff',
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
      complete: {
        color: '#4ade80',
      },
    },
    hidePostalCode: false,
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your card will be securely saved but not charged at this time.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l2.707-2.707a1 1 0 111.414 1.414L11.414 12l2.707 2.707a1 1 0 01-1.414 1.414L10 13.414l-2.707 2.707a1 1 0 01-1.414-1.414L9.586 12 6.879 9.293a1 1 0 011.414-1.414L10 10.586l2.707-2.707z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-deepskyblue hover:deepskyblue/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-boldblue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Payment Method...
            </div>
          ) : (
            'Save Payment Method'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secured by Stripe - Your card details are encrypted and stored securely
        </div>
        <p className="text-xs text-gray-400 mt-2">
          No charges will be made until you authorize a payment
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;