interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSetupPayment: () => void;
  }
  
const PaymentMethodModal = ({ isOpen, onClose, onSetupPayment }: PaymentMethodModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-mediumgray hover:text-darkgray transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-darkgray mb-2">Payment Method Required</h3>
            <p className="text-mediumgray">
              You need to set up a payment method before you can subscribe to a premium plan.
            </p>
          </div>
  
          <div className="space-y-4">
            <button
              onClick={onSetupPayment}
              className="cursor-pointer w-full bg-gradient-to-r from-boldblue to-boldblue text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Set Up Payment Method
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer w-full bg-lightgray/30 text-mediumgray font-semibold py-3 px-6 rounded-xl hover:bg-lightgray/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  
  export default PaymentMethodModal;