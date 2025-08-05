import axios from 'axios';

// Environment variables for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const CREATE_SUBSCRIPTION_ENDPOINT = process.env.NEXT_PUBLIC_CREATE_SUBSCRIPTION || '';
const CANCEL_SUBSCRIPTION_ENDPOINT = process.env.NEXT_PUBLIC_CANCEL_SUBSCRIPTION || '';
const CHECK_SUBSCRIPTION_STATUS_ENDPOINT = process.env.NEXT_PUBLIC_CHECK_SUBSCRIPTION_STATUS || '';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handler utility
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

/**
 * Create a new subscription
 * @param {string} userId - User ID
 * @param {Object} subscriptionData - Subscription details
 * @param {string} subscriptionData.planName - Plan name ("free" or "premium")
 * @param {string} subscriptionData.userType - User type ("contractor" or "client")
 * @param {string} subscriptionData.billingInterval - Billing interval ("monthly" or "annual")
 * @param {number} subscriptionData.subscriptionAmount - Subscription amount
 * @param {string} [subscriptionData.currency="USD"] - Currency (default: "USD")
 * @returns {Promise<Object>} API response
 */
interface SubscriptionData {
    planName: string;
    userType: string;
    billingInterval: string;
    subscriptionAmount: number;
    currency?: string;
}

interface CreateSubscriptionResponse {
    success: boolean;
    data?: any;
    status: number;
}

export const createSubscription = async (
    userId: string,
    subscriptionData: SubscriptionData
): Promise<CreateSubscriptionResponse> => {
    try {
        const { planName, userType, billingInterval, subscriptionAmount, currency = 'USD' } = subscriptionData;

        // Validate required fields
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!planName || !userType || !billingInterval || !subscriptionAmount) {
            throw new Error('Plan name, user type, billing interval, and subscription amount are required');
        }

        const response = await api.post(`${CREATE_SUBSCRIPTION_ENDPOINT}?userId=${userId}`, {
            planName,
            userType,
            billingInterval,
            subscriptionAmount,
            currency,
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

/**
 * Cancel an active subscription
 * @param {string} userId - User ID
 * @param {string} [cancelReason] - Optional reason for cancellation
 * @returns {Promise<Object>} API response
 */
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

        const response = await api.patch(`${CANCEL_SUBSCRIPTION_ENDPOINT}?userId=${userId}`, requestBody);

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'cancelSubscription');
    }
};

/**
 * Check subscription status for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} API response
 */
interface CheckSubscriptionStatusResponse {
    success: boolean;
    data?: any;
    status: number;
}

export const checkSubscriptionStatus = async (
    userId: string
): Promise<CheckSubscriptionStatusResponse> => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const response = await api.get(`${CHECK_SUBSCRIPTION_STATUS_ENDPOINT}?userId=${userId}`);

        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return handleApiError(error, 'checkSubscriptionStatus');
    }
};

// Helper functions for common subscription operations

/**
 * Create a premium monthly subscription
 * @param {string} userId - User ID
 * @param {string} userType - User type ("contractor" or "client")
 * @param {number} amount - Subscription amount
 * @param {string} [currency="USD"] - Currency
 * @returns {Promise<Object>} API response
 */
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

/**
 * Create a premium annual subscription
 * @param {string} userId - User ID
 * @param {string} userType - User type ("contractor" or "client")
 * @param {number} amount - Subscription amount
 * @param {string} [currency="USD"] - Currency
 * @returns {Promise<Object>} API response
 */
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

/**
 * Check if user has active premium subscription
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Whether user has active premium subscription
 */
interface HasActivePremiumSubscriptionResponse {
    success: boolean;
    data?: {
        isPremium?: boolean;
    };
    status: number;
}

export const hasActivePremiumSubscription = async (
    userId: string
): Promise<boolean> => {
    try {
        const result: HasActivePremiumSubscriptionResponse = await checkSubscriptionStatus(userId);
        return result.success && result.data?.isPremium === true;
    } catch (error) {
        console.error('Error checking premium subscription status:', error);
        return false;
    }
};

/**
 * Check if user's subscription is expiring soon (within 7 days)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Whether subscription is expiring soon
 */
interface IsSubscriptionExpiringSoonResponse {
    success: boolean;
    data?: {
        flags?: {
            isExpiringSoon?: boolean;
        };
    };
    status: number;
}

export const isSubscriptionExpiringSoon = async (
    userId: string
): Promise<boolean> => {
    try {
        const result: IsSubscriptionExpiringSoonResponse = await checkSubscriptionStatus(userId);
        return result.success && result.data?.flags?.isExpiringSoon === true;
    } catch (error) {
        console.error('Error checking subscription expiry:', error);
        return false;
    }
};

export default {
    createSubscription,
    cancelSubscription,
    checkSubscriptionStatus,
    createPremiumMonthlySubscription,
    createPremiumAnnualSubscription,
    hasActivePremiumSubscription,
    isSubscriptionExpiringSoon,
};