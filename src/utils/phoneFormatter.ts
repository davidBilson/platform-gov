// Phone number formatting utility with country code detection

export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
    format: (digits: string) => string;
}

// Common countries with their dial codes and formatting functions
export const countries: Country[] = [
    {
        name: 'United States',
        code: 'US',
        dialCode: '+1',
        flag: '🇺🇸',
        format: (digits: string) => {
            // Format: +1 (505) 575-9463
            const cleaned = digits.replace(/\D/g, '');
            if (cleaned.length === 0) return '';
            if (cleaned.length <= 3) return `+1 (${cleaned}`;
            if (cleaned.length <= 6) return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
            return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    },
    {
        name: 'Canada',
        code: 'CA',
        dialCode: '+1',
        flag: '🇨🇦',
        format: (digits: string) => {
            const cleaned = digits.replace(/\D/g, '');
            if (cleaned.length === 0) return '';
            if (cleaned.length <= 3) return `+1 (${cleaned}`;
            if (cleaned.length <= 6) return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
            return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    },
    {
        name: 'United Kingdom',
        code: 'GB',
        dialCode: '+44',
        flag: '🇬🇧',
        format: (digits: string) => {
            const cleaned = digits.replace(/\D/g, '');
            if (cleaned.length === 0) return '';
            if (cleaned.length <= 4) return `+44 ${cleaned}`;
            if (cleaned.length <= 7) return `+44 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
            return `+44 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
        }
    },
    {
        name: 'Australia',
        code: 'AU',
        dialCode: '+61',
        flag: '🇦🇺',
        format: (digits: string) => {
            const cleaned = digits.replace(/\D/g, '');
            if (cleaned.length === 0) return '';
            if (cleaned.length <= 4) return `+61 ${cleaned}`;
            if (cleaned.length <= 8) return `+61 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
            return `+61 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
        }
    },
];

// Default to United States
export const defaultCountry = countries[0];

/**
 * Detects country from phone number input
 * Tries to match dial codes or patterns
 */
export const detectCountry = (value: string): Country => {
    const cleaned = value.replace(/\D/g, '');

    // If starts with +, try to match dial code
    if (value.startsWith('+')) {
        for (const country of countries) {
            const dialCodeDigits = country.dialCode.replace(/\D/g, '');
            if (cleaned.startsWith(dialCodeDigits)) {
                return country;
            }
        }
    }

    // If starts with 1 and has 10+ digits, likely US/Canada
    if (cleaned.startsWith('1') && cleaned.length >= 11) {
        return countries.find(c => c.dialCode === '+1') || defaultCountry;
    }

    // If has 10 digits and no country code, assume US
    if (cleaned.length === 10 && !value.startsWith('+')) {
        return countries.find(c => c.dialCode === '+1') || defaultCountry;
    }

    // Default to US
    return defaultCountry;
};

/**
 * Extracts digits from formatted phone number
 */
export const extractDigits = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Extracts local digits (without country code) from input value
 * This ensures we never have duplicate country codes
 */
export const extractLocalDigits = (value: string, country: Country): string => {
    // Remove all non-digits
    let digits = extractDigits(value);

    if (digits.length === 0) {
        return '';
    }

    // Get country code digits (e.g., "1" for +1)
    const countryCodeDigits = country.dialCode.replace(/\D/g, '');

    // Always remove country code if present at the start
    // This handles cases like:
    // - "15055759463" -> "5055759463"
    // - "5055759463" -> "5055759463" (no change)
    // - "+1 (505) 575-9463" -> extract digits -> "15055759463" -> "5055759463"
    if (digits.startsWith(countryCodeDigits)) {
        digits = digits.slice(countryCodeDigits.length);
    }

    return digits;
};

/**
 * Formats phone number for display based on selected country
 */
export const formatPhoneNumber = (value: string, country: Country): string => {
    // Extract local digits (without country code)
    const localDigits = extractLocalDigits(value, country);

    // If no digits, return empty or just dial code
    if (localDigits.length === 0) {
        return '';
    }

    // Apply country-specific formatting
    return country.format(localDigits);
};

/**
 * Gets the final formatted value to send to backend
 * Format: +1 (505) 575-9463
 */
export const getFormattedPhoneForBackend = (value: string, country: Country): string => {
    // Extract local digits (without country code)
    const localDigits = extractLocalDigits(value, country);

    // If no local digits, return empty string
    if (localDigits.length === 0) {
        return '';
    }

    // Format with country code included
    return country.format(localDigits);
};

