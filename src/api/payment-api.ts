// payment-api.ts
import { GetPaymentMethodsResponse, SavePaymentMethodRequest } from '@/types/payment';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

////////////////// UPDATE PAYMENT METHOD //////////////////
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

////////////////// SAVE PAYMENT METHOD //////////////////
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

////////////////// GET PAYMENT HISTORY //////////////////
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

////////////////// GET USER PAYMENT METHOD //////////////////

export const getUserPaymentMethods = async (userId: string): Promise<GetPaymentMethodsResponse> => {
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
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Get platform fee error:', error);
  }
}