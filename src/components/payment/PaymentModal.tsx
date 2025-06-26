import React from 'react';
import { useRouter } from 'next/router';
import { BiSolidLock } from "react-icons/bi";

interface PaymentModalProps {
  jobId: string;
  onClose: () => void;
}

const PaymentModal = ({ jobId, onClose }: PaymentModalProps) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md">
        <h2 className="flex items-start gap-1.25 h-fit  text-xl text-boldblue font-bold mb-4"><span className='h-2 pt-0.75'><BiSolidLock /></span> Payment Required</h2>
        <p className="mb-6">
          You must set up a payment method to fund the project. The contract cannot begin unless the project is funded.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 cursor-pointer bg-white hover:bg-lightgray/50 border border-gray-300 rounded"
          >
            Fund Later
          </button>
          <button
            onClick={() => router.push(`/payment/billing-method?jobId=${jobId}`)}
            className="px-4 py-1 cursor-pointer bg-boldblue  hover:bg-boldblue/70 text-white rounded"
          >
            Set Up Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;