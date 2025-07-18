import { confirmPayAmount } from '@/api/payment/time-and-commission-based-payment';
import useAuthStore from '@/store/useAuth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5';
import { FaDollarSign, FaHandshake } from 'react-icons/fa';

const ConfirmPaymentAmount = (
  {
    onClose,
    contract,
    fetchMutualContract
  }: {
    onClose: () => void;
    contract: any;
    fetchMutualContract: () => void;
  }
) => {
  const { userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleConfirmation = async () => {
    setIsLoading(true);
    try {
      const res = await confirmPayAmount(contract._id, userId);
      if (res.success) {
        toast.success('Payment amount confirmed successfully!');
        fetchMutualContract();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to confirm payment amount');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-skyblue">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-deepskyblue/10 rounded-full">
              <FaHandshake className="text-deepskyblue text-lg" />
            </div>
            <h2 className="text-xl font-bold text-darkgray">Confirm Payment Amount</h2>
          </div>
          <button
            onClick={onClose}
            className="text-darkgray cursor-pointer hover:text-deepskyblue text-xl transition-colors"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Amount Display */}
          <div className="bg-gradient-to-r from-deepskyblue/5 to-skyblue/20 rounded-lg p-6 mb-6 border border-skyblue">
            <div className="text-center">
              <p className="text-sm text-darkgray/70 font-medium mb-3">You are about to receive</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl font-bold text-darkgray">
                  {formatCurrency(contract.timeBasedPayment.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="mb-6">
            <div className="bg-white border border-skyblue rounded-lg p-4">
              <h3 className="font-semibold text-darkgray mb-3 flex items-center gap-2">
                <IoCheckmarkCircle className="text-deepskyblue" />
                Confirmation Details
              </h3>
              <div className="space-y-3 text-sm text-darkgray">
                <p className="leading-relaxed">
                  By confirming this amount, you acknowledge that this payment reflects the agreed-upon work completed according to your contract terms.
                </p>
                <p className="leading-relaxed">
                  Once confirmed, your client will be able to proceed with the payment transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Please Review Carefully</p>
                <p className="text-xs text-yellow-700">
                  Make sure this amount matches your agreement with the client before confirming.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer py-3 px-4 border border-skyblue text-darkgray rounded-lg hover:bg-skyblue disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmation}
              disabled={isLoading}
              className="flex-1 cursor-pointer py-3 px-4 bg-deepskyblue hover:bg-boldblue disabled:bg-skyblue disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Confirming...
                </>
              ) : (
                <>
                  Confirm
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentAmount;