import React, { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const EndContractModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    contractorName, 
    jobTitle,
    isLoading = false 
}:{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason?: string) => void;
    contractorName: string;
    jobTitle: string;
    isLoading?: boolean;
}) => {
    const [reason, setReason] = useState('');
    
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-crimson text-xl" />
                        <h2 className="text-xl font-bold text-gray-900">End Contract</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-gray-700 mb-2">
                            Are you sure you want to end this contract?
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Job:</strong> {jobTitle}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Contractor:</strong> {contractorName}
                            </p>
                        </div>
                        <p className="text-sm text-crimson">
                            <strong>Warning:</strong> This action cannot be undone
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Ending Contract...
                            </>
                        ) : (
                            'End Contract'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndContractModal;