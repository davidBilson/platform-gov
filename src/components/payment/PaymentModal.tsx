import React from 'react';
import { useRouter } from 'next/router';

interface PaymentModalProps {
  jobId: string;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ jobId, onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment Required</h2>
        <p className="mb-6">
          You must set up a payment method to fund the project. The contract cannot begin unless the project is funded.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Fund Later
          </button>
          <button
            onClick={() => router.push(`/payment/setup?jobId=${jobId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Set Up Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;