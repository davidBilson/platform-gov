import { useQuery } from '@tanstack/react-query';
import { checkSubscriptionStatus } from '@/api/subscription-api';
import useAuthStore from "@/store/useAuth";

// Type definitions with strict typing
interface User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly role: string;
    readonly isSubscribed: boolean;
}

interface Subscription {
    readonly id: string;
    readonly planName: string;
    readonly userType: string;
    readonly status: 'active' | 'cancelled' | 'expired' | 'pending';
    readonly billingInterval: 'monthly' | 'yearly';
    readonly amount: number;
    readonly currency: string;
    readonly startDate: string;
    readonly endDate: string;
    readonly autoRenew: boolean;
    readonly daysRemaining: number;
    readonly cancelledAt?: string | null;
    readonly cancelReason?: string | null;
}

interface SubscriptionFlags {
    readonly canAccessPremiumFeatures: boolean;
    readonly willAutoRenew: boolean;
    readonly isExpiringSoon: boolean;
    readonly needsPaymentMethod: boolean;
}

interface SubscriptionApiResponse {
    readonly success: boolean;
    readonly message: string;
    readonly user: User;
    readonly isSubscribed: boolean;
    readonly isPremium: boolean;
    readonly hasActiveSubscription: boolean;
    readonly subscription: Subscription | null;
    readonly flags: SubscriptionFlags;
}

// Safe defaults for when data is unavailable
const DEFAULT_FLAGS: SubscriptionFlags = {
    canAccessPremiumFeatures: false,
    willAutoRenew: false,
    isExpiringSoon: false,
    needsPaymentMethod: true,
} as const;

const DEFAULT_USER: Partial<User> = {
    id: '',
    name: '',
    email: '',
    role: 'client',
    isSubscribed: false,
} as const;

// Custom error types for better error handling
class SubscriptionError extends Error {
    constructor(
        message: string,
        public readonly code: 'NO_USER_ID' | 'API_ERROR' | 'INVALID_RESPONSE' | 'NETWORK_ERROR'
    ) {
        super(message);
        this.name = 'SubscriptionError';
    }
}

// Type guard to validate API response structure
const isValidSubscriptionResponse = (data: any): data is SubscriptionApiResponse => {
    return (
        data &&
        typeof data === 'object' &&
        typeof data.success === 'boolean' &&
        typeof data.message === 'string' &&
        typeof data.isSubscribed === 'boolean' &&
        typeof data.isPremium === 'boolean' &&
        typeof data.hasActiveSubscription === 'boolean' &&
        data.user &&
        typeof data.user === 'object' &&
        typeof data.user.id === 'string' &&
        data.flags &&
        typeof data.flags === 'object' &&
        typeof data.flags.canAccessPremiumFeatures === 'boolean'
    );
};

interface UseSubscriptionReturn {
    // Data with safe defaults
    readonly subscriptionData: SubscriptionApiResponse | null;
    readonly user: User | null;
    readonly subscription: Subscription | null;
    readonly flags: SubscriptionFlags;
    
    // Status booleans (always defined)
    readonly isSubscribed: boolean;
    readonly isPremium: boolean;
    readonly hasActiveSubscription: boolean;
    readonly canAccessPremiumFeatures: boolean;
    readonly willAutoRenew: boolean;
    readonly isExpiringSoon: boolean;
    readonly needsPaymentMethod: boolean;
    
    // Computed values
    readonly planName: string | null;
    readonly daysRemaining: number | null;
    readonly subscriptionStatus: Subscription['status'] | null;
    readonly isSubscriptionActive: boolean;
    readonly isSubscriptionCancelled: boolean;
    readonly isSubscriptionExpired: boolean;
    
    // Query states
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly error: SubscriptionError | null;
    readonly isSuccess: boolean;
    readonly isFetching: boolean;
    readonly isInitialLoading: boolean;
    
    // Actions
    readonly refetch: () => Promise<any>;
    readonly invalidate: () => Promise<void>;
}

const useSubscription = (): UseSubscriptionReturn => {
    const authStore = useAuthStore();
    
    // Safely extract userId with fallback
    const userId = authStore?.userId ?? null;

    const {
        data,
        isLoading,
        isError,
        error: queryError,
        isSuccess,
        isFetching,
        isInitialLoading,
        refetch,
    } = useQuery({
        queryKey: ['subscription-status', userId] as const,
        queryFn: async (): Promise<SubscriptionApiResponse> => {
            // Validate userId first
            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                throw new SubscriptionError('User ID is required and must be a valid string', 'NO_USER_ID');
            }

            try {
                const response = await checkSubscriptionStatus(userId);
                
                // Check if the API call itself failed
                if (!response || !response.success) {
                    throw new SubscriptionError(
                        `API call failed: ${response?.data?.message || 'Unknown error'}`,
                        'API_ERROR'
                    );
                }

                // Validate response structure
                if (!isValidSubscriptionResponse(response.data)) {
                    throw new SubscriptionError(
                        'Invalid response structure from subscription API',
                        'INVALID_RESPONSE'
                    );
                }

                return response.data;
            } catch (err) {
                // Handle different error types
                if (err instanceof SubscriptionError) {
                    throw err;
                }
                
                // Network or unexpected errors
                if (err instanceof Error) {
                    throw new SubscriptionError(
                        `Network or unexpected error: ${err.message}`,
                        'NETWORK_ERROR'
                    );
                }
                
                throw new SubscriptionError(
                    'An unknown error occurred while fetching subscription status',
                    'NETWORK_ERROR'
                );
            }
        },
        enabled: Boolean(userId?.trim()), // Only run if we have a valid userId
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: (failureCount, error) => {
            // Don't retry on validation errors
            if (error instanceof SubscriptionError && 
                ['NO_USER_ID', 'INVALID_RESPONSE'].includes(error.code)) {
                return false;
            }
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
    });

    // Convert query error to our custom error type
    const typedError: SubscriptionError | null = queryError instanceof SubscriptionError 
        ? queryError 
        : queryError 
            ? new SubscriptionError(
                queryError instanceof Error ? queryError.message : 'Unknown query error',
                'NETWORK_ERROR'
              )
            : null;

    // Safe data extraction with defaults
    const safeData = data || null;
    const safeFlags = safeData?.flags || DEFAULT_FLAGS;
    const safeUser = safeData?.user || null;
    const safeSubscription = safeData?.subscription || null;

    // Computed values with null safety
    const planName = safeSubscription?.planName || null;
    const daysRemaining = safeSubscription?.daysRemaining ?? null;
    const subscriptionStatus = safeSubscription?.status || null;
    const isSubscriptionActive = subscriptionStatus === 'active';
    const isSubscriptionCancelled = subscriptionStatus === 'cancelled';
    const isSubscriptionExpired = subscriptionStatus === 'expired';

    // Invalidate function for manual cache clearing
    const invalidate = async (): Promise<void> => {
        const queryClient = (window as any).__queryClient; // You might need to import this properly
        if (queryClient) {
            await queryClient.invalidateQueries({
                queryKey: ['subscription-status', userId]
            });
        }
    };

    return {
        // Raw data
        subscriptionData: safeData,
        user: safeUser,
        subscription: safeSubscription,
        flags: safeFlags,
        
        // Status booleans with safe defaults
        isSubscribed: safeData?.isSubscribed ?? false,
        isPremium: safeData?.isPremium ?? false,
        hasActiveSubscription: safeData?.hasActiveSubscription ?? false,
        canAccessPremiumFeatures: safeFlags.canAccessPremiumFeatures,
        willAutoRenew: safeFlags.willAutoRenew,
        isExpiringSoon: safeFlags.isExpiringSoon,
        needsPaymentMethod: safeFlags.needsPaymentMethod,
        
        // Computed values
        planName,
        daysRemaining,
        subscriptionStatus,
        isSubscriptionActive,
        isSubscriptionCancelled,
        isSubscriptionExpired,
        
        // Query states
        isLoading,
        isError,
        error: typedError,
        isSuccess,
        isFetching,
        isInitialLoading,
        
        // Actions
        refetch,
        invalidate,
    } as const;
};

export default useSubscription;

// Export types for consumers
export type {
    UseSubscriptionReturn,
    SubscriptionApiResponse,
    User,
    Subscription,
    SubscriptionFlags,
    SubscriptionError,
};