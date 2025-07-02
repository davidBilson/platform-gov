import React, { useState, useEffect } from 'react';
import { X, CreditCard, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const BankDetailsPromptModal = ({toggle} : {toggle: () => void;}) => {
    const router = useRouter()

    const handleAddBankDetails = () => {
        router.push('/payment/payout-setup');
        toggle();
    };


    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="rounded-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
                <div className="bg-transparent py-6 rounded-t-2xl relative">
                    <button
                        onClick={toggle}
                        className="absolute top-4 right-0 text-white hover:text-white/50 hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 text-center shadow-2xl bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Add Your Bank Details
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        To start receiving payments, you'll need to add your bank account information.
                        This will allow us to securely transfer your earnings directly to your account.
                    </p>

                    <button
                        onClick={handleAddBankDetails}
                        className="w-full bg-deepskyblue hover:bg-deepskyblue/70 cursor-pointer text-white px-6 py-4 rounded-xl font-semibold transform transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>Add Bank Details</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                        onClick={toggle}
                        className="w-full mt-4 text-gray-500 hover:text-gray-700 py-2  cursor-pointer font-medium transition-colors"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsPromptModal;