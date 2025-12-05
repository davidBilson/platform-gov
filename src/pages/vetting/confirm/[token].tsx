/**
 * Vetting Confirmation Page
 * Public page where vetters confirm a consultant's profile
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { confirmVetting, getVetterByToken } from '@/api/vetting-api';
import { VetterByTokenResponse } from '@/types/vetting';
import LoadingAnimation from '@/components/ui/loading';
import ProfilePicture from '@/components/profile/profilePicture';

const VettingConfirmPage: React.FC = () => {
    const router = useRouter();
    const { token } = router.query;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [vetterData, setVetterData] = useState<VetterByTokenResponse['data'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (!token || typeof token !== 'string') {
            return;
        }

        const loadVetterData = async () => {
            try {
                setLoading(true);
                const response = await getVetterByToken(token);
                setVetterData(response.data);

                if (response.data.vetter.status === 'confirmed') {
                    setConfirmed(true);
                }
            } catch (error: any) {
                setError(error.message || 'Invalid or expired vetting link');
            } finally {
                setLoading(false);
            }
        };

        loadVetterData();
    }, [token]);

    const handleConfirm = async () => {
        if (!token || typeof token !== 'string') return;

        setSubmitting(true);
        try {
            const response = await confirmVetting(token);
            setConfirmed(true);
            toast.success(response.message);

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            toast.error(error.message || 'Failed to confirm vetting');
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

    if (confirmed || vetterData.vetter.status === 'confirmed') {
        return (
            <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-2xl m-auto text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                        <div className="text-6xl mb-4">✓</div>
                        <h1 className="text-2xl font-semibold text-green-800 mb-4">
                            Profile Confirmed!
                        </h1>
                        <p className="text-gray-700 mb-6">
                            Thank you for confirming {vetterData.consultant.name}'s profile.
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

    const { consultant, vetter } = vetterData;
    const profile = consultant.profile;

    return (
        <main className="pt-10 pb-20 md:pt-20 px-5 md:px-6 min-h-screen">
            <div className="w-full max-w-3xl m-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h1 className="text-2xl font-semibold text-center mb-6">
                        Confirm Profile Verification
                    </h1>

                    <div className="bg-blue-50 border-l-4 border-boldblue p-4 mb-6 rounded">
                        <p className="text-gray-700">
                            <strong>{consultant.name}</strong> has listed you as a reference to verify their GovLink Global consultant profile.
                        </p>
                    </div>

                    {/* Consultant Profile Preview */}
                    {profile && (
                        <div className="border border-gray-200 rounded-lg p-6 mb-6">
                            <h2 className="font-semibold text-lg mb-4">Profile Preview</h2>

                            <div className="flex items-start gap-4 mb-4">
                                {profile.profileImage && (
                                    <ProfilePicture
                                        source={profile.profileImage}
                                        alt={consultant.name}
                                        dimension={80}
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg">{consultant.name}</h3>
                                    {profile.primaryPosition && (
                                        <p className="text-gray-600">{profile.primaryPosition}</p>
                                    )}
                                    {profile.profession && (
                                        <p className="text-sm text-gray-500">{profile.profession}</p>
                                    )}
                                    {profile.location?.state && (
                                        <p className="text-sm text-gray-500">{profile.location.state}</p>
                                    )}
                                </div>
                            </div>

                            {profile.bio && (
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Bio</h4>
                                    <p className="text-gray-700 text-sm">{profile.bio}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded">
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> Your name and contact information will remain private and will not be displayed on the public profile. Only the number of confirmed vetters will be shown.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={handleConfirm}
                            disabled={submitting || !vetter.isTokenValid}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Confirming...' : '✓ Confirm Profile'}
                        </button>

                        <button
                            onClick={() => router.push(`/vetting/reject/${token}`)}
                            disabled={submitting}
                            className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            ✗ Reject
                        </button>
                    </div>

                    {!vetter.isTokenValid && (
                        <p className="text-center text-red-600 text-sm mt-4">
                            This confirmation link has expired. Please contact the consultant for a new link.
                        </p>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/account/sign-up?type=contractor')}
                            className="text-boldblue hover:underline text-sm"
                        >
                            Create your own GovLink Global account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VettingConfirmPage;

