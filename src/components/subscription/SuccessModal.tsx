interface ModalProps { 
    isOpen?: boolean;
    onClose?: () => void;
    onContinue?: () => void;
    planType?: string;
}

const SuccessModal = ({ isOpen, onClose, onContinue, planType }: ModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-aquagreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-aquagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-darkgray mb-2">Subscription Successful!</h2>
            <p className="text-mediumgray mb-6">
              Welcome to Premium! You've successfully subscribed to the {planType} plan. 
              You now have access to all premium features.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onContinue}
                className="cursor-pointer flex-1 bg-gradient-to-r from-aquagreen to-aquagreen text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SuccessModal;