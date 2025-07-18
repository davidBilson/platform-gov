export const maskEmail = (email: string): string => {
    if (!email || typeof email !== 'string') {
        return '';
    }

    const [localPart, domainPart] = email.split('@');

    if (!localPart || !domainPart) {
        return email;
    }

    const maskedLocal = localPart.length > 6
        ? localPart.substring(0, 6) + '*'.repeat(localPart.length - 6)
        : localPart;

    return maskedLocal + '@' + domainPart;
}

export const maskPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return '';
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');

    if (digitsOnly.length === 0) {
        return phoneNumber;
    }

    return digitsOnly.length > 6
        ? digitsOnly.substring(0, 6) + '*'.repeat(digitsOnly.length - 6)
        : digitsOnly;
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatName = (fullName: string) => {
    if (!fullName) return 'Name not available';

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastInitial = nameParts[1]?.charAt(0) || '';

    return `${firstName} ${lastInitial}${lastInitial ? '.' : ''}`;
};

export const formatPaymentInfo = (job: {
    paymentType?: string;
    price?: number;
    retainerAmount?: number;
    retainerFrequency?: string;
}): string => {
    if (job.paymentType === 'hourly') {
        return `Hourly | $${job.price}/hr`;
    } else if (job.paymentType === 'commission') {
        return `Commission | $${job.price}/conversion`;
    } else if (job.paymentType === 'fixed-price') {
        return `Fixed Price | $${job.price}`;
    } else if (job.paymentType === 'retainer' && job.retainerAmount && job.retainerFrequency) {
        return `Retainer | $${job.retainerAmount}/${job.retainerFrequency.toLowerCase()}`;
    }
    return '';
};

export const truncateDescription = (text: string, maxLength = 200): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
};