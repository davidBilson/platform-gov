import axios from 'axios';
import { SavePaymentMethodRequest } from '@/types/payment';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const adminId = process.env.NEXT_PUBLIC_AUTHORIZED;

export const savePaymentMethod = async (data: SavePaymentMethodRequest) => {
  try {

    const endPoint = process.env.NEXT_PUBLIC_SAVE_PAYMENT_METHOD;
    const response = await axios.post(`${BASE_URL}${endPoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Save payment method error:', error);
    
    return {
      success: false,
      message: 'Network error occurred while saving payment method',
      error: 'Network error occurred while saving payment method'
    };
  }
};

export const getUserPaymentMethods = async (userId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_USER_PAYMENT_METHOD?.replace(':id', userId);
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    return response.data;
  } catch (error) {
    console.error('Get payment methods error:', error);
    return {
      success: false,
      paymentMethods: [],
      defaultPaymentMethod: null,
      message: 'Network error occurred while fetching payment methods'
    };
  }
};

export const updateDefaultPaymentMethod = async (userId: string, paymentMethodId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_UPDATE_DEFAULT_PAYMENT_METHOD;
    const response = await axios.put(`${BASE_URL}${endPoint}`, {
      userId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    console.error('Update payment method error:', error);
    return {
      success: false,
      message: 'Network error occurred while updating payment method'
    };
  }
}

export const getTransactionHistory = async ( userId: string ) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_PAYMENT_HISTORY?.replace(':id', userId);

    const url = `${BASE_URL}${endPoint}`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Get payment history error:', error);
    
    return {
      success: false,
      data: {
        transactions: [],
        summary: {
          totalReceived: 0,
          totalWithdrawn: 0,
          totalRefunds: 0,
          totalDisputes: 0
        },
      },
      message: 'Network error occurred while fetching payment history'
    };
  }
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_DELETE_PAYMENT_METHOD;
    const response = await axios.delete(`${BASE_URL}${endPoint}?userId=${userId}&paymentMethodId=${paymentMethodId}`);
    return response.data;
  } catch (error) {
    console.error('Delete payment method error:', error);
    return {
      success: false,
      message: 'Network error occurred while deleting payment method'
    };
  }
};

export const fundProject = async (jobId: string, userId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_FUND_PROJECT;
    const response = await axios.post(`${BASE_URL}${endPoint}`, { jobId, userId });
    return response.data;
  } catch (error) {
    console.error('Fund project error:', error);
    return {
      success: false,
      message: 'Network error occurred while funding project',
      error: 'Network error occurred while funding project'
    };
  }
};

export const getPlatformFee = async () => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_PLATFORM_FEE;
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    return response.data;
  } catch (error) {
    console.error('Get platform fee error:', error);
  }
}

export const getPayoutMethods = async (userId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_GET_PAYOUT_METHODS ?? "").replace(':id', userId) || "";
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    return response.data.payoutMethods;
  } catch (error) {
    console.error('Error fetching payout methods:', error);
    return [];
  }
};

export const saveBankAccount = async (userId: string, token: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_SAVE_BANK_ACCOUNT;
    const response = await axios.post(`${BASE_URL}${endPoint}`, { userId, token });
    return response.data;
  } catch (error) {
    console.error('Error saving bank account:', error);
    return { success: false, message: 'Failed to save bank account' };
  }
};

export const createOnboardingLink = async (userId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_CREATE_ONBOARDING_LINK ?? "").replace(':id', userId) || '';
    console.log(endPoint)
    const response = await axios.post(`${BASE_URL}${endPoint}`);
    console.log('createOnboardlink response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error creating onboarding link:', error);
    return { success: false, message: 'Failed to create onboarding link' };
  }
};

export const getAccountStatus = async (userId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_GET_ACCOUNT_STATUS ?? "").replace(':id', userId) || "";
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account status:', error);
    return { success: false, message: 'Failed to fetch account status' };
  }
};

export const releaseFunds = async (contractId: string, userId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_RELEASE_FUNDS;
    const response = await axios.post(`${BASE_URL}${endPoint}`, { contractId, userId });
    console.log('releaseFunds response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Release funds error:', error);
    return {
      success: false,
      message: 'Network error occurred while releasing funds',
      error: 'Network error occurred while releasing funds'
    };
  }
}

export const getPendingPayouts = async () => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_PENDING_PAYOUTS?.replace(':id', adminId || '') || "";
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        summary: response.data.summary,
        count: response.data.count,
        message: response.data.message
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch pending payouts');
    }
  } catch (error) {
    console.error('Error fetching pending payouts:', error);
    
    return {
      success: false,
      data: [],
      summary: null,
      count: 0,
      error: 'Network error occurred'
    };
  }
};

export const approvePayout = async (fundId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_APPROVE_PAYOUT ?? "").replace(':id', fundId) || "";
    console.log('api: ', `${BASE_URL}${endPoint}?adminId=${adminId}`)
    const response = await axios.post(`${BASE_URL}${endPoint}?adminId=${adminId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const getWithdrawableFunds = async (userId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_GET_WITHDRAWABLE_FUNDS ?? "").replace(':id', userId) || "";
    const response = await axios.get(`${BASE_URL}${endPoint}`)
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

export const withdrawFunds = async (userId: string, amount: number) => {
  try {
    
    const endPoint = (process.env.NEXT_PUBLIC_WITHDRAW_FUNDS ?? "").replace(':id', userId) || "";
    const response = await axios.post(`${BASE_URL}${endPoint}?amount=${amount}`)
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

export const fetchContractorFunds = async (userId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_GET_CONTRACTOR_FUNDS ?? "").replace(':id', userId) || "";
    const response = await axios.get(
      `${BASE_URL}${endPoint}`
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }

    if (response.data.success) {
      return response.data.funds;
    } else {
      throw new Error(response.data.message || 'Failed to fetch funds');
    }
  } catch (error) {

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Contractor not found');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
};

export const fetchClientFunds = async (userId: string) => {
  const endPoint = (process.env.NEXT_PUBLIC_GET_CLIENT_FUNDS ?? "").replace(':id', userId) || "";
  const response = await axios.get(
    `${BASE_URL}${endPoint}`
  );
  
  if (!response.data.success) {
    throw new Error('Failed to fetch funds data');
  }
  
  return response.data;
};

export const fetchUserWithdrawals = async (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'completed' | 'failed';
  }
) => {
  try {
    const { page = 1, limit = 10, status } = options || {};
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });

    const endPoint = (process.env.NEXT_PUBLIC_GET_USER_WITHDRAWALS ?? "").replace(':id', userId) || "";

    const response = await axios.get(
      `${BASE_URL}${endPoint}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching user withdrawals:', error);
    return {
      success: false,
      totalWithdrawals: 0,
      totalPages: 0,
      currentPage: 1,
      withdrawals: [],
      message: (axios.isAxiosError(error) && error.response?.data?.message) || 'Failed to fetch withdrawals'
    };
  }
};