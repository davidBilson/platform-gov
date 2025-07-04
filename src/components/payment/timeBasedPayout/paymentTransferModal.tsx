import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaClock, FaDollarSign, FaCreditCard, FaEdit, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { initPayAmount } from '@/api/payment/time-based-payment';
import { getUserPaymentMethods } from '@/api/payment/payment-api';
import { handleInstantPayment } from '@/api/payment/time-based-payment';
import useAuthStore from '@/store/useAuth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentTransferModal = ({
  job,
  contract,
  onClose,
  refetchContract,
  onPaymentSuccess
}:
{
  job: any;
  contract: any;
  onClose: () => void;
  refetchContract: any;
  onPaymentSuccess?: () => void;
}) => {
  const { userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [checkingPaymentMethods, setCheckingPaymentMethods] = useState(true);
  
  // Payment calculation states
  const [paymentCalculation, setPaymentCalculation] = useState({
    baseAmount: 0,
    platformFee: 0,
    totalAmount: 0,
    totalHours: 0,
    effectiveHours: 0, // Hours being paid for (can differ from logged hours)
    isCustomAmount: false
  });
  
  const [finalAmount, setFinalAmount] = useState(0);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [tempAmount, setTempAmount] = useState('');

  // Check payment methods on mount
  const checkPaymentMethods = async () => {
    if (userId) {
      setCheckingPaymentMethods(true);
      try {
        const response = await getUserPaymentMethods(userId);
        if (response.success) {
          setHasPaymentMethod((response.paymentMethods?.length || 0) > 0);
        }
      } catch (error) {
        console.error('Error checking payment methods:', error);
        setHasPaymentMethod(false);
      } finally {
        setCheckingPaymentMethods(false);
      }
    }
  };

  useEffect(() => {
    checkPaymentMethods();
  }, [userId]);

  // Helper functions
  interface SafeNumberOptions {
    value: unknown;
    fallback?: number;
  }

  const safeNumber = ({ value, fallback = 0 }: SafeNumberOptions): number => {
    const num = Number(value);
    return isNaN(num) || num < 0 ? fallback : num;
  };

  const toCents = (amount: number): number => Math.round(amount * 100);
  const fromCents = (cents: number): number => cents / 100;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate total hours from timesheets
  const calculateTotalHours = () => {
    if (!contract?.timesheets || !Array.isArray(contract.timesheets)) {
      return 0;
    }

    interface Timesheet {
      status: string;
      duration?: number;
    }

    const totalSeconds = (contract.timesheets as Timesheet[])
      .filter((timesheet) => timesheet.status === 'approved')
      .reduce((total, timesheet) => total + (timesheet.duration || 0), 0);
    return totalSeconds / 3600; // Convert seconds to hours
  };

  // Calculate payment amount based on payment type and custom amount
  const calculatePaymentAmount = (customBaseAmount: number | null | undefined = null) => {
    const platformFeeRate = 0.05; // 5%
    const totalLoggedHours = calculateTotalHours();
    let baseAmount = 0;
    let effectiveHours = totalLoggedHours;
    let isCustomAmount = false;

    if (customBaseAmount !== null && customBaseAmount !== undefined) {
      // Custom amount provided - reverse calculate
      baseAmount = customBaseAmount;
      isCustomAmount = true;
      
      if (job?.paymentType === 'hourly') {
        const hourlyRate = safeNumber({ value: job?.price });
        effectiveHours = hourlyRate > 0 ? baseAmount / hourlyRate : 0;
      } else {
        effectiveHours = totalLoggedHours; // For non-hourly, keep original hours
      }
    } else {
      // Standard calculation
      switch (job?.paymentType) {
        case 'hourly':
          const hourlyRate = safeNumber({ value: job?.price });
          baseAmount = totalLoggedHours * hourlyRate;
          effectiveHours = totalLoggedHours;
          break;
        case 'retainer':
          baseAmount = safeNumber({ value: job?.retainerAmount });
          effectiveHours = totalLoggedHours;
          break;
        case 'fixed-price':
          baseAmount = safeNumber({ value: job?.price });
          effectiveHours = totalLoggedHours;
          break;
        default:
          baseAmount = 0;
      }
    }

    // Calculate fees using cents to avoid floating point issues
    const baseAmountCents = toCents(baseAmount);
    const platformFeeCents = Math.round(baseAmountCents * platformFeeRate);
    const totalAmountCents = baseAmountCents + platformFeeCents;

    return {
      baseAmount: fromCents(baseAmountCents),
      platformFee: fromCents(platformFeeCents),
      totalAmount: fromCents(totalAmountCents),
      totalHours: totalLoggedHours,
      effectiveHours: Math.max(0, effectiveHours),
      isCustomAmount
    };
  };

  // Update payment calculation when job or contract changes
  useEffect(() => {
    const calculation = calculatePaymentAmount();
    setPaymentCalculation(calculation);
    setFinalAmount(calculation.totalAmount);
  }, [job, contract]);

  // Payment processing functions
  const handleAskConfirmation = async () => {
    setIsLoading(true);
    try {
      const res = await initPayAmount(contract._id, Number(finalAmount), userId);
      if (res.success) {
        await refetchContract();
        toast.success('Sent confirmation request');
      }
    } catch (error) {
      console.error('Failed to request confirmation:', error);
      toast.error('Failed to send confirmation request');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean payment handler using the utility function
  const handleFundsRelease = async () => {
    const stripe = await stripePromise; // Get the actual Stripe instance
    
    await handleInstantPayment({
      contractId: contract._id,
      userId,
      amount: finalAmount, // Use the editable final amount
      hasPaymentMethod,
      setIsLoading,
      onSuccess: () => {
        refetchContract?.();
        onClose();
        onPaymentSuccess?.();
      },
      stripe
    });
  };

  // Handle amount editing
  const handleEditAmount = () => {
    setIsEditingAmount(true);
    setTempAmount(paymentCalculation.baseAmount.toString());
  };

  const handleSaveAmount = () => {
    const newBaseAmount = parseFloat(tempAmount);
    if (!isNaN(newBaseAmount) && newBaseAmount > 0) {
      // Recalculate everything based on new base amount
      const newCalculation = calculatePaymentAmount(newBaseAmount);
      setPaymentCalculation(newCalculation);
      setFinalAmount(newCalculation.totalAmount);
      setIsEditingAmount(false);
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAmount(false);
    setTempAmount('');
  };

  const handleResetToCalculated = () => {
    const originalCalculation = calculatePaymentAmount();
    setPaymentCalculation(originalCalculation);
    setFinalAmount(originalCalculation.totalAmount);
  };

  const handleAddPaymentMethod = () => {
    // Get current URL to determine return path
    const currentPath = window.location.pathname;
    const returnPath = currentPath.startsWith('/contract') ? currentPath : '';
    
    // Navigate to payment method setup with return path
    window.location.href = `/payment/billing-method${returnPath ? `?returnTo=${encodeURIComponent(returnPath)}` : ''}`;
  };

  const getPaymentTypeLabel = () => {
    switch (job?.paymentType) {
      case 'hourly':
        return 'Hourly Rate';
      case 'retainer':
        return 'Retainer';
      case 'fixed-price':
        return 'Fixed Price';
      default:
        return 'Payment';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Payment Transfer</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-deepskyblue text-xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{job?.jobTitle}</h3>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Payment Type</span>
                <span className="text-sm text-gray-600 capitalize">{job?.paymentType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{getPaymentTypeLabel()}</span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(job?.paymentType === 'retainer' ? job?.retainerAmount : job?.price)}
                  {job?.paymentType === 'hourly' && '/hr'}
                </span>
              </div>
            </div>

            {/* Hourly Calculation Details */}
            {job?.paymentType === 'hourly' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaClock className="text-deepskyblue text-sm" />
                  <span className="text-sm font-semibold text-gray-700">Time Calculation</span>
                  {paymentCalculation.isCustomAmount && (
                    <FaInfoCircle className="text-orange-500 text-xs" title="Custom amount - hours recalculated" />
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Hours Logged:</span>
                    <span className="font-semibold">{paymentCalculation.totalHours.toFixed(2)} hrs</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span className="font-semibold">{formatCurrency(job?.price || 0)}/hr</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-deepskyblue">
                    <span>Platform Fee:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total to Charge:</span>
                      <span>{formatCurrency(paymentCalculation.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Retainer Calculation Details */}
            {job?.paymentType === 'retainer' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                </div>
                <div className="flex justify-between text-deepskyblue">
                  <span>Platform Fee:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total to Charge:</span>
                    <span>{formatCurrency(paymentCalculation.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed Price Calculation Details */}
            {job?.paymentType === 'fixed-price' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span>Fixed Price:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                </div>
                <div className="flex justify-between text-deepskyblue">
                  <span>Platform Fee:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total to Charge:</span>
                    <span>{formatCurrency(paymentCalculation.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Editable Base Payment Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Payment Amount {paymentCalculation.isCustomAmount && <span className="text-orange-600">(Custom)</span>}
            </label>
            <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
              {!isEditingAmount ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-deepskyblue text-lg" />
                    <span className="text-2xl font-bold text-gray-800">
                      {formatCurrency(paymentCalculation.baseAmount)}
                    </span>
                  </div>
                  <button
                    onClick={handleEditAmount}
                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    <FaEdit className="text-xs" />
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-deepskyblue text-lg" />
                    <input
                      type="number"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                      className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAmount}
                      className="cursor-pointer px-3 py-1.5 text-sm bg-aquagreen hover:bg-aquagreen/70 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cursor-pointer px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-2">
                This is the base amount before platform fees. Final charge will be {formatCurrency(finalAmount)}
              </p>
            </div>
          </div>

          {/* Final Amount Display */}
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Final Amount to Charge:</span>
              <span className="text-2xl font-bold text-aquagreen">{formatCurrency(finalAmount)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Includes {formatCurrency(paymentCalculation.platformFee)} platform fee (5%)
            </p>
          </div>

          {/* Payment Method Warning */}
          {!checkingPaymentMethods && !hasPaymentMethod && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaCreditCard className="text-yellow-600 text-lg" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Payment Method Required</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You need to add a payment method before you can make payments.
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddPaymentMethod}
                className="mt-3 w-full cursor-pointer py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold"
              >
                Add Payment Method
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold"
            >
              Cancel
            </button>
            {contract?.isPaymentAmountConfirmed ? (
              <button
                type="button"
                onClick={handleFundsRelease}
                disabled={isLoading || finalAmount <= 0 || !hasPaymentMethod || checkingPaymentMethods || isEditingAmount}
                className="cursor-pointer flex-1 py-3 px-4 bg-aquagreen hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
              >
                {checkingPaymentMethods ? 'Checking...' : isLoading ? 'Processing...' : 'Pay Now'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAskConfirmation}
                disabled={isLoading || finalAmount <= 0 || isEditingAmount}
                className="cursor-pointer flex-1 py-3 px-4 bg-deepskyblue hover:bg-boldblue disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
              >
                {isLoading ? 'Processing...' : 'Ask for Confirmation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransferModal;