import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaClock, FaDollarSign, FaCreditCard, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { initPayAmount } from '@/api/payment/time-based-payment';
import { getUserPaymentMethods } from '@/api/payment/payment-api';
import { handleInstantPayment } from '@/api/payment/time-based-payment';
import useAuthStore from '@/store/useAuth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentTransferModal = (
  {
    job,
    contract,
    onClose,
    refetchContract
  }:
    {
      job: any;
      contract: any;
      onClose: () => void;
      refetchContract: any;
    }
) => {

  const { userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [checkingPaymentMethods, setCheckingPaymentMethods] = useState(true);
  const [paymentCalculation, setPaymentCalculation] = useState({
    baseAmount: 0,
    platformFee: 0,
    totalAmount: 0
  });
  
  // New state for editable final amount
  const [finalAmount, setFinalAmount] = useState(0);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [tempAmount, setTempAmount] = useState('');

  // Check if user has payment methods
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

  // Calculate total hours from timesheets
  const calculateTotalHours = () => {
    if (!contract?.timesheets || !Array.isArray(contract.timesheets)) {
      return 0;
    }

    // Sum up all approved timesheet durations and convert from seconds to hours
    const totalSeconds = contract.timesheets
      .filter((timesheet: { status: string; duration?: number }) => timesheet.status === 'approved')
      .reduce((total: number, timesheet: { status: string; duration?: number }) => total + (timesheet.duration || 0), 0);

    return totalSeconds / 3600; // Convert seconds to hours
  };

  // Calculate payment amount based on payment type
  const calculatePaymentAmount = () => {
    const platformFeeRate = 0.05; // 5%
    let baseAmount = 0;

    switch (job?.paymentType) {
      case 'hourly':
        const totalHours = calculateTotalHours();
        const hourlyRate = job?.price || 0;
        baseAmount = totalHours * hourlyRate;
        break;
      case 'retainer':
        baseAmount = job?.retainerAmount || 0;
        break;
      case 'fixed-price':
        baseAmount = job?.price || 0;
        break;
      default:
        baseAmount = 0;
    }

    const platformFee = baseAmount * platformFeeRate;
    const totalAmount = baseAmount + platformFee;

    return {
      baseAmount,
      platformFee,
      totalAmount
    };
  };

  // Update payment calculation when job or contract changes
  useEffect(() => {
    const calculation = calculatePaymentAmount();
    setPaymentCalculation(calculation);
    // Set final amount to calculated total initially
    setFinalAmount(calculation.totalAmount);
  }, [job, contract]);

  const totalHours = calculateTotalHours();

  const handleAskConfirmation = async () => {
    setIsLoading(true);
    try {
      const res = await initPayAmount(contract._id, Number(finalAmount), userId);
      if (res.success) {
        await refetchContract();
        toast.success('Sent confirmation request')
      }
    } catch (error) {
      console.error('Failed to request confirmation:', error);
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
      },
      stripe // Pass the resolved Stripe instance
    });
  };

  // Handle amount editing
  const handleEditAmount = () => {
    setIsEditingAmount(true);
    setTempAmount(finalAmount.toString());
  };

  const handleSaveAmount = () => {
    const newAmount = parseFloat(tempAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      setFinalAmount(newAmount);
      setIsEditingAmount(false);
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAmount(false);
    setTempAmount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const handleAddPaymentMethod = () => {
    // Get current URL to determine return path
    const currentPath = window.location.pathname;
    const returnPath = currentPath.startsWith('/contract') ? currentPath : '';
    
    // Navigate to payment method setup with return path
    window.location.href = `/payment/billing-method${returnPath ? `?returnTo=${encodeURIComponent(returnPath)}` : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-skyblue">
          <h2 className="text-xl font-bold text-darkgray">Payment Transfer</h2>
          <button
            onClick={onClose}
            className="text-darkgray cursor-pointer hover:text-deepskyblue text-xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-darkgray mb-4">{job?.jobTitle}</h3>

            <div className="bg-skyblue rounded-lg p-4 mb-4">

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-darkgray">Payment Type</span>
                <span className="text-sm text-darkgray capitalize">{job?.paymentType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-darkgray">{getPaymentTypeLabel()}</span>
                <span className="text-sm text-darkgray">
                  {formatCurrency(job?.paymentType === 'retainer' ? job?.retainerAmount : job?.price)}
                  {job?.paymentType === 'hourly' && '/hr'}
                </span>
              </div>

            </div>

            {job?.paymentType === 'retainer' && (
              <div className="bg-white border border-skyblue rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                </div>
                <div className="flex justify-between text-boldblue">
                  <span>Platform Fee:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                </div>
                <div className="border-t border-skyblue pt-2 mt-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Calculated Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.totalAmount)}</span>
                  </div>
                </div>
              </div>

            )}

            {/* Hourly Calculation Details */}
            {job?.paymentType === 'hourly' && (
              <div className="bg-white border border-skyblue rounded-lg p-4 mb-4">
                
                <div className="flex items-center gap-2 mb-3">
                  <FaClock className="text-deepskyblue text-sm" />
                  <span className="text-sm font-semibold text-darkgray">Time Calculation</span>
                </div>

                <div className="space-y-2 text-sm text-darkgray">
                  <div className="flex justify-between">
                    <span>Hours Logged:</span>
                    <span className="font-semibold">{totalHours.toFixed(2)} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span className="font-semibold">{formatCurrency(job?.price || 0)}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-boldblue">
                    <span>Platform Fee:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                  </div>
                  <div className="border-t border-skyblue pt-2 mt-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Calculated Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(paymentCalculation.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed Price Calculation */}
            {job?.paymentType === 'fixed-price' && (
              <div className="bg-white border border-skyblue rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span>Fixed Price:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.baseAmount)}</span>
                </div>
                <div className="flex justify-between text-boldblue">
                  <span>Platform Fee:</span>
                  <span className="font-semibold">{formatCurrency(paymentCalculation.platformFee)} (5%)</span>
                </div>
                <div className="border-t border-skyblue pt-2 mt-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Calculated Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(paymentCalculation.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Editable Final Payment Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-darkgray mb-2">
              Final Payment Amount
            </label>
            <div className="bg-white border-2 border-deepskyblue rounded-lg p-4">
              {!isEditingAmount ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-deepskyblue text-lg" />
                    <span className="text-2xl font-bold text-darkgray">
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                  <button
                    onClick={handleEditAmount}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
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
                      className="text-2xl font-bold text-darkgray bg-transparent border-b-2 border-deepskyblue focus:outline-none flex-1"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAmount}
                      className="px-3 py-1.5 text-sm bg-aquagreen hover:bg-aquagreen/80 text-white rounded-lg cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-darkgray mt-2 opacity-75">
                {finalAmount !== paymentCalculation.totalAmount && (
                  <span className="text-orange-600 font-medium">
                    Modified from calculated amount ({formatCurrency(paymentCalculation.totalAmount)}). 
                  </span>
                )}
                {finalAmount === paymentCalculation.totalAmount ? 
                  'Click "Edit" to adjust the final payment amount' :
                  'Amount has been customized from the calculated total'
                }
              </p>
            </div>
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
              className="flex-1 cursor-pointer py-3 px-4 border border-skyblue text-darkgray rounded-lg hover:bg-skyblue text-sm font-semibold"
            >
              Cancel
            </button>
            {contract?.isPaymentAmountConfirmed ?
              <button
                type="button"
                onClick={handleFundsRelease}
                disabled={isLoading || finalAmount <= 0 || !hasPaymentMethod || checkingPaymentMethods || isEditingAmount}
                className="flex-1 cursor-pointer py-3 px-4 bg-aquagreen hover:bg-aquagreen/70 disabled:bg-skyblue disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
              >
                {checkingPaymentMethods ? 'Checking...' : isLoading ? 'Processing...' : 'Pay Now'}
              </button> :
              <button
                type="button"
                onClick={handleAskConfirmation}
                disabled={isLoading || finalAmount <= 0 || isEditingAmount}
                className="flex-1 cursor-pointer py-3 px-4 bg-deepskyblue hover:bg-boldblue disabled:bg-skyblue disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
              >
                {isLoading ? 'Processing...' : 'Ask for Confirmation'}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransferModal;