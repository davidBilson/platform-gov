/**
 * VetterList Component
 * Displays list of vetters with their status
 */

import React from 'react';
import { Vetter } from '@/types/vetting';
import { toast } from 'react-toastify';

interface VetterListProps {
    vetters: Vetter[];
    onRemove: (vetterId: string) => Promise<void>;
    onResendEmail: (vetterId: string) => Promise<void>;
    isLoading?: boolean;
}

const VetterList: React.FC<VetterListProps> = ({
    vetters,
    onRemove,
    onResendEmail,
    isLoading = false
}) => {
    const getStatusBadge = (status: Vetter['status']) => {
        const baseClasses = "px-2 py-1 rounded text-xs font-semibold";

        switch (status) {
            case 'confirmed':
                return (
                    <span className={`${baseClasses} bg-green-100 text-green-800`}>
                        ✓ Confirmed
                    </span>
                );
            case 'rejected':
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-800`}>
                        ✗ Rejected
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
                        ⏳ Pending
                    </span>
                );
        }
    };

    const handleRemove = async (vetterId: string, vetterName: string) => {
        if (!confirm(`Are you sure you want to remove ${vetterName}?`)) {
            return;
        }

        try {
            await onRemove(vetterId);
            toast.success('Vetter removed successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove vetter');
        }
    };

    const handleResendEmail = async (vetterId: string, vetterName: string) => {
        try {
            await onResendEmail(vetterId);
            toast.success(`Email resent to ${vetterName}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend email');
        }
    };

    if (vetters.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No vetters added yet. Add at least one vetter to activate your profile.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {vetters.map((vetter) => (
                <div
                    key={vetter._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{vetter.name}</h3>
                                {getStatusBadge(vetter.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{vetter.email}</p>
                            {vetter.linkedinUrl && (
                                <p className="text-xs text-gray-500 truncate">
                                    LinkedIn: {vetter.linkedinUrl}
                                </p>
                            )}
                            {vetter.status === 'confirmed' && vetter.confirmationTimestamp && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Confirmed: {new Date(vetter.confirmationTimestamp).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                            {vetter.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleResendEmail(vetter._id, vetter.name)}
                                        disabled={isLoading}
                                        className="text-xs bg-boldblue text-white px-3 py-1 rounded hover:opacity-90 disabled:opacity-50"
                                    >
                                        Resend Email
                                    </button>
                                    <button
                                        onClick={() => handleRemove(vetter._id, vetter.name)}
                                        disabled={isLoading}
                                        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:opacity-90 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VetterList;



