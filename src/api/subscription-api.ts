import axios from 'axios';

// Environment variables for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const CREATE_SUBSCRIPTION = process.env.NEXT_PUBLIC_CREATE_SUBSCRIPTION || '';
const CANCEL_SUBSCRIPTION = process.env.NEXT_PUBLIC_CANCEL_SUBSCRIPTION || '';
const RESUME_SUBSCRIPTION = process.env.NEXT_PUBLIC_RESUME_SUBSCRIPTION || '';
const CHECK_SUBSCRIPTION_STATUS = process.env.NEXT_PUBLIC_CHECK_SUBSCRIPTION_STATUS || '';
const FETCH_SUBSCRIPTION_PRICES = process.env.NEXT_PUBLIC_FETCH_SUBSCRIPTION_PRICES || '';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});


interface ApiErrorResponse {
    success: false;
    message: string;
    status: number;
    data?: any;
}

interface ApiSuccessResponse {
    success: true;
    data: any;
    status: number;
}

type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

const handleApiError = (error: any, endpoint: string): ApiErrorResponse => {
    console.error(`Error in ${endpoint}:`, error);

    if (error.response) {
        // Server responded with error status
        return {
            success: false,
            message: error.response.data?.message || 'Server error occurred',
            status: error.response.status,
            data: error.response.data,
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            success: false,
            message: 'Network error - no response from server',
            status: 0,
        };
    } else {
        // Something else happened
        return {
            success: false,
            message: error.message || 'An unexpected error occurred',
            status: 0,
        };
    }
};

interface SubscriptionData {
    planName: string;
    userType: string;
    billingInterval: string;
    subscriptionAmount: number;
    currency?: string;
    autoRenew?: boolean;
}

interface CreateSubscriptionResponse {
    success: boolean;
    data?: any;
    status: number;
}

export const createSubscription = async (
    userId: string,
    subscriptionData: SubscriptionData
) => {
    try {
        const { planName, userType, billingInterval, subscriptionAmount, currency = 'USD', autoRenew } = subscriptionData;

        // Validate required fields
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!planName || !userType || !billingInterval || !subscriptionAmount) {
            throw new Error('Plan name, user type, billing interval, and subscription amount are required');
        }

        const response = await api.post(`${CREATE_SUBSCRIPTION}?userId=${userId}`, {
            planName,
            userType,
            billingInterval,
            subscriptionAmount,
            currency,
            autoRenew: autoRenew !== undefined ? autoRenew : false,
        });

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'createSubscription');
    }
};

interface CancelSubscriptionResponse {
    success: boolean;
    data?: any;
    status: number;
}

interface CancelSubscriptionRequestBody {
    cancelReason?: string;
}

export const cancelSubscription = async (
    userId: string,
    cancelReason: string | null = null
): Promise<CancelSubscriptionResponse> => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const requestBody: CancelSubscriptionRequestBody = cancelReason ? { cancelReason } : {};

        const response = await api.patch(`${CANCEL_SUBSCRIPTION}?userId=${userId}`, requestBody);

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'cancelSubscription');
    }
};

export const resumeSubscription = async (
    userId: string
) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const response = await api.patch(`${RESUME_SUBSCRIPTION}?userId=${userId}`);

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'resumeSubscription');
    }
}

export const checkSubscriptionStatus = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const response = await api.get(`${CHECK_SUBSCRIPTION_STATUS}?userId=${userId}`);

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'checkSubscriptionStatus');
    }
};

interface CreatePremiumMonthlySubscriptionParams {
    userId: string;
    userType: string;
    amount: number;
    currency?: string;
}

export const createPremiumMonthlySubscription = async (
    userId: CreatePremiumMonthlySubscriptionParams['userId'],
    userType: CreatePremiumMonthlySubscriptionParams['userType'],
    amount: CreatePremiumMonthlySubscriptionParams['amount'],
    currency: CreatePremiumMonthlySubscriptionParams['currency'] = 'USD'
): Promise<CreateSubscriptionResponse> => {
    return createSubscription(userId, {
        planName: 'premium',
        userType,
        billingInterval: 'monthly',
        subscriptionAmount: amount,
        currency,
    });
};

interface CreatePremiumAnnualSubscriptionParams {
    userId: string;
    userType: string;
    amount: number;
    currency?: string;
}

export const createPremiumAnnualSubscription = async (
    userId: CreatePremiumAnnualSubscriptionParams['userId'],
    userType: CreatePremiumAnnualSubscriptionParams['userType'],
    amount: CreatePremiumAnnualSubscriptionParams['amount'],
    currency: CreatePremiumAnnualSubscriptionParams['currency'] = 'USD'
): Promise<CreateSubscriptionResponse> => {
    return createSubscription(userId, {
        planName: 'premium',
        userType,
        billingInterval: 'annual',
        subscriptionAmount: amount,
        currency,
    });
};


export const hasActivePremiumSubscription = async (
    userId: string
): Promise<boolean> => {
    try {
        const result = await checkSubscriptionStatus(userId);
        return result.success && result.data?.isPremium === true;
    } catch (error) {
        console.error('Error checking premium subscription status:', error);
        return false;
    }
};

export const isSubscriptionExpiringSoon = async (
    userId: string
): Promise<boolean> => {
    try {
        const result = await checkSubscriptionStatus(userId);
        return result.success && result.data?.flags?.isExpiringSoon === true;
    } catch (error) {
        console.error('Error checking subscription expiry:', error);
        return false;
    }
};

export const fetchSubscriptionPrices = async () => {
    try {
        const response = await api.get(FETCH_SUBSCRIPTION_PRICES);
        return response.data;
    } catch (error) {
        console.error('Error fetching subscription prices:', error);
        throw error;
    }
}

export default {
    createSubscription,
    cancelSubscription,
    checkSubscriptionStatus,
    createPremiumMonthlySubscription,
    createPremiumAnnualSubscription,
    hasActivePremiumSubscription,
    isSubscriptionExpiringSoon,
    fetchSubscriptionPrices
};