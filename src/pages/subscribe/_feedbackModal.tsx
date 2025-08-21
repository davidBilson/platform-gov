const FeedbackModal = ({ 
    isOpen, 
    onClose, 
    type, 
    endDate 
  }: {
    isOpen: boolean;
    onClose: () => void;
    type: 'cancel' | 'resume';
    endDate?: string;
  }) => {
    if (!isOpen) return null;
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          {type === 'cancel' ? (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Subscription Cancelled</h3>
              <p className="text-gray-600 mb-4">
                Your subscription has been successfully cancelled. However, you'll continue to enjoy all premium features until your current billing period ends.
              </p>
              {endDate && (
                <div className="bg-blue-50 border border-skyblue rounded-lg p-3 mb-4">
                  <p className="text-sm text-boldblue">
                    <strong>Access continues until:</strong> {formatDate(endDate)}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-6">
                You can reactivate your subscription anytime before the expiry date.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome Back!</h3>
              <p className="text-gray-600 mb-4">
                Your subscription has been successfully reactivated! You can now continue to enjoy all the premium features and benefits.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-800">
                  <strong>✅ Auto-renewal is now enabled</strong><br />
                  Your subscription will automatically renew at the end of each billing cycle.
                </p>
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="cursor-pointer w-full px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    );
  };

  export default FeedbackModal;