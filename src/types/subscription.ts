export interface PricingContent {
    freeTier: {
      title: string;
      description: string;
      features: Array<{ icon: string; additionalIcon?: string; included: boolean; text: string }>;
      buttonText: string;
    };
    premiumTier: {
      title: string;
      description: string;
      price: { monthly: number; annual: number };
      savings?: string;
      savingsPercentage?: string;
      features: Array<{ icon: string; additionalIcon?: string; included: boolean; text: string }>;
      buttonText: string;
      badge?: string;
    };
  }

  export interface SubscriptionHeaderProps {
    title: string;
    subtitle: string;
  }

  export interface SubscriptionStatsData {
    totalSubscriptions: number
    subscriptionsByStatus: {
      active: number
      cancelled: number
      expired: number
      pending: number
    }
    subscriptionsByUserType: {
      consultant: number
      client: number
    }
  }

  export interface FetchSubscriptionsOptions {
    page?: number;
    limit?: number;
    status?: string;
    userType?: string;
    sortBy?: string;
    sortOrder?: string;
  }

  export interface DiscountDetails {
    token: string;
    discountPercentage: number;
    // Add other discount properties as needed
  }
  
  export interface SubscriptionPlan {
    price: number;
    period: string;
    savings: number;
    description: string;
  }
  
  export interface SubscriptionPlans {
    monthly: SubscriptionPlan;
    annual: SubscriptionPlan;
  }
  
  export interface DiscountTokenResponse {
    success: boolean;
    discountCode: DiscountDetails;
  }
  
  export interface SubscriptionData {
    planName: string;
    userType: string;
    billingInterval: 'monthly' | 'annual';
    subscriptionAmount: number;
    currency: string;
    discountToken: string;
    autoRenew: boolean;
  }
  
 export interface CreateSubscriptionResponse {
    success: boolean;
    data?: {
      reason?: string;
      requires_action?: boolean;
    };
  }
  
  export type PlanType = 'monthly' | 'annual';