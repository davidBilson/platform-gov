import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { editContractPrice } from '@/api/payment/time-based-payment';
import useAuthStore from '@/store/useAuth';

const EditContract = (
    {
        job,
        jobId,
        onClose,
        contract,
        fetchJobData,
    }:
        {
            job: any,
            jobId: string;
            onClose: () => void;
            contract: any;
            userId: string; // Add userId to props
            fetchJobData: () => void; // Add fetchJobData to props
        }
) => {
    const [amount, setAmount] = useState(
        job?.paymentType === 'retainer'
        ? job?.retainerAmount || ''
        : job?.price || ''
    );
    const { userId } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!amount || !userId) {
            setError('Amount and user information are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare the payload based on payment type
            const payload = {
                jobId,
                userId,
                ...(job?.paymentType === 'retainer'
                    ? { retainerAmount: parseFloat(amount) }
                    : { price: parseFloat(amount) }
                )
            };

            await editContractPrice(payload);
            fetchJobData()
            onClose();
        } catch (error: any) {
            console.error('Failed to update contract:', error);
            setError(error?.response?.data?.message || 'Failed to update contract');
        } finally {
            setIsLoading(false);
        }
    };

    const getAmountLabel = () => {
        switch (job?.paymentType) {
            case 'hourly':
                return 'Hourly Rate';
            case 'retainer':
                return 'Retainer Amount';
            case 'fixed-price':
                return 'Fixed Price';
            default:
                return 'Amount';
        }
    };

    // Don't allow editing fixed-price jobs
    const isFixedPrice = job?.paymentType === 'fixed-price';

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-skyblue">
                    <h2 className="text-xl font-bold text-darkgray">Edit Contract</h2>
                    <button
                        onClick={onClose}
                        className="text-darkgray cursor-pointer hover:text-deepskyblue text-xl"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-darkgray mb-2">{job?.jobTitle}</h3>
                        <p className="text-sm text-darkgray capitalize">Payment Type: {job?.paymentType}</p>
                    </div>

                    {isFixedPrice ? (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                Fixed-price contracts cannot be edited. Please contact support if you need to make changes.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-darkgray mb-2">
                                {getAmountLabel()}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-darkgray">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border border-skyblue rounded-lg focus:outline-none focus:border-deepskyblue text-darkgray"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            {job?.paymentType === 'hourly' && (
                                <p className="text-xs text-darkgray mt-1">Per hour</p>
                            )}
                            {job?.paymentType === 'retainer' && (
                                <p className="text-xs text-darkgray mt-1">
                                    {job?.retainerFrequency ? `Per ${job.retainerFrequency}` : 'Recurring payment'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
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
                        {!isFixedPrice && (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || !amount || !userId}
                                className="flex-1 cursor-pointer py-3 px-4 bg-deepskyblue hover:bg-boldblue disabled:bg-skyblue disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
                            >
                                {isLoading ? 'Updating...' : 'Update Contract'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditContract;