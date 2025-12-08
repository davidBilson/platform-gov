import React, { useState, useRef, useEffect } from 'react';
import { countries, defaultCountry, detectCountry, formatPhoneNumber, getFormattedPhoneForBackend, Country } from '@/utils/phoneFormatter';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    id?: string;
    name?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    placeholder = 'Phone',
    className = '',
    required = false,
    id = 'phoneNumber',
    name = 'phoneNumber',
}) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize country detection from value (only on mount)
    useEffect(() => {
        if (value && value.trim() !== '') {
            const detected = detectCountry(value);
            setSelectedCountry(detected);
            setDisplayValue(formatPhoneNumber(value, detected));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // If user is deleting and we're back to just dial code, clear everything
        if (inputValue === selectedCountry.dialCode || inputValue === selectedCountry.dialCode + ' ') {
            setDisplayValue('');
            onChange('');
            return;
        }

        // If input is empty, clear everything
        if (!inputValue || inputValue.trim() === '') {
            setDisplayValue('');
            onChange('');
            return;
        }

        // Auto-detect country if user starts typing with a different country code
        const detected = detectCountry(inputValue);
        const countryToUse = detected.code !== selectedCountry.code ? detected : selectedCountry;
        if (detected.code !== selectedCountry.code) {
            setSelectedCountry(detected);
        }

        // Format the phone number for display
        const formatted = formatPhoneNumber(inputValue, countryToUse);
        setDisplayValue(formatted);

        // Get the backend-formatted value (this will be sent to the server)
        // This function ensures no duplicate country codes
        const backendValue = getFormattedPhoneForBackend(inputValue, countryToUse);
        onChange(backendValue);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);

        // Reformat current value with new country
        if (displayValue && displayValue.trim() !== '') {
            const formatted = formatPhoneNumber(displayValue, country);
            setDisplayValue(formatted);
            const backendValue = getFormattedPhoneForBackend(displayValue, country);
            onChange(backendValue);
        } else {
            // Clear the display value when switching countries with no input
            setDisplayValue('');
            onChange('');
        }

        // Focus back on input
        inputRef.current?.focus();
    };

    const handleInputFocus = () => {
        // Don't auto-populate on focus - let user type naturally
        // The country selector already shows the dial code
    };

    return (
        <div className="relative">
            <div className="relative flex items-center">
                {/* Country Selector Button */}
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute left-3 z-10 flex items-center gap-1.5 focus:outline-none"
                    aria-label="Select country"
                >
                    <span className="text-lg" role="img" aria-label={selectedCountry.name}>
                        {selectedCountry.flag}
                    </span>
                    <span className="text-boldblue text-sm font-medium">
                        {selectedCountry.dialCode}
                    </span>
                    <svg
                        className={`w-3 h-3 text-boldblue transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Phone Input */}
                <input
                    ref={inputRef}
                    type="tel"
                    id={id}
                    name={name}
                    value={displayValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-24 pr-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium ${className}`}
                />
            </div>

            {/* Country Dropdown */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-boldblue rounded-lg shadow-lg z-50"
                >
                    {countries.map((country) => (
                        <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors ${selectedCountry.code === country.code ? 'bg-blue-50' : ''
                                }`}
                        >
                            <span className="text-xl" role="img" aria-label={country.name}>
                                {country.flag}
                            </span>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-gray-900">{country.name}</div>
                                <div className="text-xs text-gray-500">{country.dialCode}</div>
                            </div>
                            {selectedCountry.code === country.code && (
                                <svg className="w-4 h-4 text-boldblue" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhoneInput;

