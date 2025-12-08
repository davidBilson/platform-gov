/**
 * GCCBadge Component
 * Displays GCC Certification badge on public profiles
 */

import React from 'react';
import { RiAwardFill } from 'react-icons/ri';

interface GCCBadgeProps {
    gccCertificationId: string;
    gccCertificationVerified: boolean;
    verificationUrl?: string;
    className?: string;
}

const GCCBadge: React.FC<GCCBadgeProps> = ({
    gccCertificationId,
    gccCertificationVerified,
    verificationUrl,
    className = ''
}) => {
    if (!gccCertificationId || !gccCertificationVerified) {
        return null;
    }

    const badgeContent = (
        <div className={`inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 ${className}`}>
            <RiAwardFill size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
                GCC Certified
            </span>
        </div>
    );

    if (verificationUrl) {
        return (
            <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
            >
                {badgeContent}
            </a>
        );
    }

    return badgeContent;
};

export default GCCBadge;






