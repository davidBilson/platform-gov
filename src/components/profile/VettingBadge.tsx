/**
 * VettingBadge Component
 * Displays vetting credibility badge on public profiles
 */

import React from 'react';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

interface VettingBadgeProps {
    vettingCount: number;
    className?: string;
}

const VettingBadge: React.FC<VettingBadgeProps> = ({ vettingCount, className = '' }) => {
    if (vettingCount === 0) {
        return null;
    }

    return (
        <div className={`inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 ${className}`}>
            <RiVerifiedBadgeFill size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">
                Verified by {vettingCount} colleague{vettingCount > 1 ? 's' : ''}
            </span>
        </div>
    );
};

export default VettingBadge;



