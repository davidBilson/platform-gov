// admin-subscription-api.ts
import useAuthStore from '@/store/useAuth';
import { FetchSubscriptionsOptions } from '@/types/subscription';
import axios from 'axios';
import { toast } from 'react-toastify';

// Environment variables for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const { userId } = useAuthStore.getState();
const adminId = userId;

// Environment variables for API endpoints
const FETCH_SUBSCRIPTION_STATS = process.env.NEXT_PUBLIC_FETCH_SUBSCRIPTION_STATS || '';
const FETCH_ALL_SUBSCRIPTIONS = process.env.NEXT_PUBLIC_FETCH_ALL_SUBSCRIPTIONS || '';
const FETCH_SUBSCRIPTION_SETTINGS = process.env.NEXT_PUBLIC_FETCH_SUBSCRIPTION_SETTINGS || '';
const SET_SUBSCRIPTION_PRICE = process.env.NEXT_PUBLIC_SET_SUBSCRIPTION_PRICE || '';
const SET_FEE_PERCENT = process.env.NEXT_PUBLIC_SET_FEE_PERCENT || '';
const SET_TIPS = process.env.NEXT_PUBLIC_SET_TIPS|| '';
const SET_EARLY_ACCESS_DURATION = process.env.NEXT_PUBLIC_SET_EARLY_ACCESS_DURATION || '';
const GENERATE_GCC_DISCOUNT_TOKEN = process.env.NEXT_PUBLIC_GENERATE_GCC_DISCOUNT_TOKEN || "";
const FETCH_ALL_DISCOUNT_CODES = process.env.NEXT_PUBLIC_FETCH_ALL_DISCOUNT_CODES || '';

export const fetchSubscriptionStats = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}${FETCH_SUBSCRIPTION_STATS}`,
      {
        params: {
          adminId
        },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
          `Server error: ${error.response.status}`
        );
      }
      if (error.request) {
        throw new Error('Network error: Unable to reach server');
      }
    }

    throw new Error('Failed to fetch subscription statistics');
  }
};

export const fetchSubscriptions = async (options: FetchSubscriptionsOptions = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const queryParams = new URLSearchParams({
      adminId,
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    // Add optional filters only if they exist
    if (status) {
      queryParams.append('status', status);
    }
    if (userType) {
      queryParams.append('userType', userType);
    }
    const response = await axios.get(`${BASE_URL}${FETCH_ALL_SUBSCRIPTIONS}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const fetchSubscriptionSettings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${FETCH_SUBSCRIPTION_SETTINGS}?adminId=${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription settings:', error);
    throw error;
  }
}

export const saveSubscriptionPrice = async (
  { consultantMonthlyPrice, consultantAnnualPrice, clientMonthlyPrice, clientAnnualPrice }: {
    consultantMonthlyPrice: number;
    consultantAnnualPrice: number;
    clientMonthlyPrice: number;
    clientAnnualPrice: number;
  }
) => {
  try {
    const response = await axios.put(`${BASE_URL}${SET_SUBSCRIPTION_PRICE}?adminId=${adminId}`,
      {
        consultant: {
          monthly: consultantMonthlyPrice,
          annual: consultantAnnualPrice
        },
        client: {
          monthly: clientMonthlyPrice,
          annual: clientAnnualPrice
        }
      }
    )
    if (response) {
      toast.success('Subscription prices updated successfully');
      return response.data;
    }

  } catch (error) {
    toast.error('Failed to update subscription prices');
    console.error('Error setting subscription price:', error);
    throw error;
  }
}

export const saveFeePercentage = async (feePercent: number) => {
  try {
    const response = await axios.put(`${BASE_URL}${SET_FEE_PERCENT}?adminId=${adminId}`,
      {
        feePercent 
      }
    )
    if (response) {
      toast.success('Fee percent updated');
      return response.data;
    }

  } catch (error) {
    toast.error('Failed to update subscription prices');
    console.error('Error setting subscription price:', error);
    throw error;
  }
}

export const saveTips = async (tips: string) => {
  try {
    const response = await axios.put(`${BASE_URL}${SET_TIPS}?adminId=${adminId}`, {
      tips
    });
    if (response) {
      toast.success('Tips updated successfully');
      return response.data;
    }
  } catch (error) {
    toast.error('Failed to update tips');
    console.error('Error setting tips:', error);
    throw error;
  }
}

export const saveEarlyAccessDuration = async (hours: number) => {
  try {
    const response = await axios.put(`${BASE_URL}${SET_EARLY_ACCESS_DURATION}?adminId=${adminId}`, {
      hours
    });
    if (response) {
      toast.success('Early access duration updated successfully');
      return response.data;
    }
  } catch (error) {
    toast.error('Failed to update early access duration');
    console.error('Error setting early access duration:', error);
    throw error;
  }
}

export const generateGCCToken = async (percentOff: number) => {
  try {
    const response = await axios.post(`${BASE_URL}${GENERATE_GCC_DISCOUNT_TOKEN}?adminId=${adminId}`, {
      percentOff
    });

    if (response) {
      toast.success('GCC discount token generated successfully');
      return response.data;
    }

  } catch (error) {
    toast.error('Failed to generate GCC discount token');
    console.error('Error generating GCC token:', error);
    throw error;
  }
}

export const fetchAllDiscountCodes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${FETCH_ALL_DISCOUNT_CODES}?adminId=${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all discount codes:', error);
    throw error;
  }
}