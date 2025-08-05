// admin-subscription-api.ts
import useAuthStore from '@/store/useAuth';
import { FetchSubscriptionsOptions } from '@/types/subscription';
import axios from 'axios';

// Environment variables for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const { userId } = useAuthStore.getState();
const adminId = userId;

// Environment variables for API endpoints
const FETCH_SUBSCRIPTION_STATS = process.env.NEXT_PUBLIC_FETCH_SUBSCRIPTION_STATS || '';
const FETCH_ALL_SUBSCRIPTIONS = process.env.NEXT_PUBLIC_FETCH_ALL_SUBSCRIPTIONS || '';
const FETCH_SUBSCRIPTION_SETTINGS = process.env.NEXT_PUBLIC_FETCH_SUBSCRIPTION_SETTINGS || '';


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