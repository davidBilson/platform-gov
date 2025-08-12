import { useState } from "react";

const CancelSubscriptionModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isLoading 
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
  }) => {
    const [cancelReason, setCancelReason] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!showConfirm) {
        setShowConfirm(true);
      } else {
        onConfirm(cancelReason);
      }
    };
  
    const handleClose = () => {
      setShowConfirm(false);
      setCancelReason('');
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          {!showConfirm ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancel Subscription</h3>
              <p className="text-gray-600 mb-4">
                We're sorry to see you go! Please let us know why you're cancelling so we can improve our service.
              </p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're cancelling... (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Confirm Cancellation</h3>
              <p className="text-gray-700 mb-4">
                Are you absolutely sure you want to cancel your subscription? This action cannot be undone.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You'll continue to have access to premium features until your current billing period ends.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Go Back
                </button>
                <button
                  onClick={() => onConfirm(cancelReason)}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  export default CancelSubscriptionModal;