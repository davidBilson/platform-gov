import { Crown } from 'lucide-react';
import React from 'react'

const LockedOverlay = ({ descriptionText } : { descriptionText: string }) => (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md mx-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-darkgray mb-2">Premium Feature</h3>
        <p className="text-mediumgray mb-6">
          {descriptionText}
        </p>
        <button className="w-full bg-boldblue text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          Upgrade to Access
        </button>
      </div>
    </div>
  );

export default LockedOverlay