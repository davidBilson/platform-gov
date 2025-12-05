/**
 * Vetting Page
 * Page where consultants add vetters to activate their profile
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import useAuthStore from '@/store/useAuth';
import { useVettingStore } from '@/store/useVetting';
import VetterForm from '@/components/vetting/VetterForm';
import VetterList from '@/components/vetting/VetterList';
import { VettingFormData } from '@/types/vetting';
import LoadingAnimation from '@/components/ui/loading';

const VettingPage: React.FC = () => {
    const router = useRouter();
    const { userId, role } = useAuthStore();
    const {
        vetters,
        vettingStatus,
        isLoading,
        error,
        fetchVetters,
        fetchVettingStatus,
        addVetter: addVetterAction,
        removeVetter: removeVetterAction,
        resendVettingEmail: resendVettingEmailAction,
        clearError
    } = useVettingStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Redirect if not a contractor
        if (userId && role !== 'contractor') {
            router.push('/profile');
            return;
        }

        // Redirect if not logged in
        if (!userId) {
            router.push('/account/sign-in');
            return;
        }

        // Fetch vetting data
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchVetters(userId),
                    fetchVettingStatus(userId)
                ]);
            } catch (error: any) {
                toast.error(error.message || 'Failed to load vetting information');
            }
        };

        loadData();
    }, [userId, role, router, fetchVetters, fetchVettingStatus]);

    const handleAddVetter = async (formData: VettingFormData) => {
        if (!userId) return;

        setIsSubmitting(true);
        clearError();

        try {
            await addVetterAction({
                consultantId: userId,
                name: formData.name,
                email: formData.email,
                ...(formData.linkedinUrl && { linkedinUrl: formData.linkedinUrl })
            });

            toast.success('Vetter added successfully! Confirmation email sent.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add vetter');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveVetter = async (vetterId: string) => {
        if (!userId) return;
        await removeVetterAction(vetterId, userId);
    };

    const handleResendEmail = async (vetterId: string) => {
        await resendVettingEmailAction(vetterId);
    };

    // Show loading state
    if (!userId || isLoading) {
        return (
            <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6">
                <div className="w-full max-w-4xl m-auto">
                    <LoadingAnimation />
                </div>
            </main>
        );
    }

    const canActivate = (vettingStatus?.confirmedCount || 0) >= 1;
    const hasPendingVetters = (vettingStatus?.pendingCount || 0) > 0;

    return (
        <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6">
            <section className="w-full max-w-4xl m-auto">
                <h1 className="font-semibold text-2xl md:text-3xl text-center mb-6 md:mb-10">
                    Activate Your Profile
                </h1>

                {/* Information Box */}
                <div className="bg-blue-50 border-l-4 border-boldblue p-6 mb-8 rounded">
                    <h2 className="font-semibold text-lg mb-3 text-boldblue">
                        Profile Activation Required
                    </h2>
                    <p className="text-gray-700 mb-4">
                        To activate your GovLink Global profile, you must add at least one vetter who has worked with you and can confirm the accuracy of your profile.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                        <li>You may add more than one vetter.</li>
                        <li>The total number of confirmed vetters will appear on your public profile — but their names or contact information will NOT be shown.</li>
                        <li>Once the first vetter confirms your profile, your profile will be active.</li>
                    </ul>
                </div>

                {/* Status Display */}
                {vettingStatus && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-lg mb-4">Vetting Status</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Profile Status</p>
                                <p className={`text-lg font-semibold ${vettingStatus.profileActive ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                    {vettingStatus.profileActive ? 'Active' : 'Pending'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-lg font-semibold text-green-600">
                                    {vettingStatus.confirmedCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-lg font-semibold text-yellow-600">
                                    {vettingStatus.pendingCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {vettingStatus.totalCount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Vetter Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="font-semibold text-lg mb-4">Add a Vetter</h2>
                    <VetterForm
                        onSubmit={handleAddVetter}
                        isLoading={isSubmitting}
                        error={error}
                    />
                </div>

                {/* Vetters List */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="font-semibold text-lg mb-4">
                        Your Vetters ({vetters.length})
                    </h2>
                    <VetterList
                        vetters={vetters}
                        onRemove={handleRemoveVetter}
                        onResendEmail={handleResendEmail}
                        isLoading={isSubmitting}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {canActivate ? (
                        <button
                            onClick={() => router.push('/profile')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            ✓ Profile Activated - View Profile
                        </button>
                    ) : (
                        <button
                            disabled
                            className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50"
                        >
                            Profile Activation Pending
                        </button>
                    )}

                    <button
                        onClick={() => router.push('/profile/edit')}
                        className="bg-boldblue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Help Text */}
                {!canActivate && hasPendingVetters && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Waiting for vetters to confirm. You can resend emails or add more vetters if needed.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default VettingPage;

