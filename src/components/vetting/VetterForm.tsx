/**
 * VetterForm Component
 * Form to add a new vetter
 */

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { VettingFormData } from '@/types/vetting';

interface VetterFormProps {
    onSubmit: (data: VettingFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

const VetterForm: React.FC<VetterFormProps> = ({ onSubmit, isLoading = false, error }) => {
    const [formData, setFormData] = useState<VettingFormData>({
        name: '',
        email: '',
        linkedinUrl: ''
    });

    const [validationErrors, setValidationErrors] = useState<Partial<VettingFormData>>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateLinkedIn = (url: string): boolean => {
        if (!url) return true; // Optional field
        const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
        return linkedInRegex.test(url);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error for this field
        if (validationErrors[name as keyof VettingFormData]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof VettingFormData];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<VettingFormData> = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.linkedinUrl && !validateLinkedIn(formData.linkedinUrl)) {
            errors.linkedinUrl = 'Please enter a valid LinkedIn profile URL';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            // Reset form on success
            setFormData({
                name: '',
                email: '',
                linkedinUrl: ''
            });
        } catch (err) {
            // Error handled by parent component
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boldblue ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Enter vetter's full name"
                    disabled={isLoading}
                />
                {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boldblue ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Enter vetter's email address"
                    disabled={isLoading}
                />
                {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile URL
                </label>
                <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boldblue ${validationErrors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="https://linkedin.com/in/username"
                    disabled={isLoading}
                />
                {validationErrors.linkedinUrl && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.linkedinUrl}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                    Optional: For verification purposes only
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-boldblue text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Adding...' : 'Add Vetter'}
            </button>
        </form>
    );
};

export default VetterForm;







