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