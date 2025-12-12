/**
 * Vetting Rejection Page
 * Public page where vetters reject a consultant's profile
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { rejectVetting, getVetterByToken } from '@/api/vetting-api';
import { VetterByTokenResponse } from '@/types/vetting';
import LoadingAnimation from '@/components/ui/loading';

const VettingRejectPage: React.FC = () => {
    const router = useRouter();
    const { token } = router.query;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [vetterData, setVetterData] = useState<VetterByTokenResponse['data'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rejected, setRejected] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (!token || typeof token !== 'string') {
            return;
        }

        const loadVetterData = async () => {
            try {
                setLoading(true);
                const response = await getVetterByToken(token);
                setVetterData(response.data);

                if (response.data.vetter.status === 'rejected') {
                    setRejected(true);
                }
            } catch (error: any) {
                setError(error.message || 'Invalid or expired vetting link');
            } finally {
                setLoading(false);
            }
        };

        loadVetterData();
    }, [token]);

    const handleReject = async () => {
        if (!token || typeof token !== 'string') return;

        setSubmitting(true);
        try {
            const response = await rejectVetting(token, rejectionReason);
            setRejected(true);
            toast.success(response.message);

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject vetting');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen flex items-center justify-center">
                <LoadingAnimation />
            </main>
        );
    }

    if (error || !vetterData) {
        return (
            <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-2xl m-auto text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <h1 className="text-2xl font-semibold text-red-800 mb-4">
                            Invalid Vetting Link
                        </h1>
                        <p className="text-gray-700 mb-6">
                            {error || 'This vetting link is invalid or has expired.'}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-boldblue text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (rejected || vetterData.vetter.status === 'rejected') {
        return (
            <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-2xl m-auto text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <div className="text-6xl mb-4">✗</div>
                        <h1 className="text-2xl font-semibold text-red-800 mb-4">
                            Vetting Request Rejected
                        </h1>
                        <p className="text-gray-700 mb-6">
                            You have rejected {vetterData.consultant.name}'s profile verification request.
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Redirecting to homepage...
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-boldblue text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const { consultant } = vetterData;

    return (
        <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen">
            <div className="w-full max-w-2xl m-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h1 className="text-2xl font-semibold text-center mb-6">
                        Reject Profile Verification
                    </h1>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-gray-700">
                            You are about to reject the profile verification request for <strong>{consultant.name}</strong>.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rejection (Optional)
                        </label>
                        <textarea
                            id="reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-boldblue"
                            placeholder="Please provide a reason for rejecting this profile verification..."
                        />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded">
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> Rejecting this profile will prevent it from being activated. The consultant will be notified of your decision.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push(`/vetting/confirm/${token}`)}
                            disabled={submitting}
                            className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            Go Back
                        </button>

                        <button
                            onClick={handleReject}
                            disabled={submitting}
                            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {submitting ? 'Rejecting...' : '✗ Confirm Rejection'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VettingRejectPage;







