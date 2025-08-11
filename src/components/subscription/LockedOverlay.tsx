import { Crown } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LockedOverlay = ({ descriptionText } : { descriptionText: string }) => (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8 py-12 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md mx-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-darkgray mb-2">Premium Feature</h3>
        <p className="text-mediumgray mb-6">
          {descriptionText}
        </p>
        <Link href='/subscribe' className="w-full bg-boldblue hover:bg-boldblue/70 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          Upgrade to Access
        </Link>
      </div>
    </div>
  );

export default LockedOverlay