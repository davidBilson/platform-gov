import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

interface PaymentFormProps {
  jobId: string;
  onSuccess: () => void;
}

const PaymentForm = ({ jobId, onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const cardElement = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(cardElement!);

      if (error) throw error;

      // Send token to backend
      await axios.post('/api/payment/save-method', {
        jobId,
        token: token.id
      });

      onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                '::placeholder': { color: '#a0aec0' },
              },
            },
          }}
        />
      </div>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-3 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Save Payment Method'}
      </button>
    </form>
  );
};

export default PaymentForm;