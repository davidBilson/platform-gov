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