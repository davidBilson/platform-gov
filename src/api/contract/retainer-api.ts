import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Common types used across components
export interface RetainerPaymentHistory {
  periodStart: string;
  periodEnd: string;
  amount: number;
  paymentDate?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'paid';
}

export interface RetainerWorkSummary {
  _id: string;
  text: string;
  submittedAt: string;
  forPeriod: string;
}

export interface RetainerData {
  recurringAmount?: number;
  frequency?: 'weekly' | 'bi-weekly' | 'monthly';
  nextPaymentDate?: string;
  lastPaymentDate?: string;
  paymentHistory?: RetainerPaymentHistory[];
  startDate?: string;
  workSummaries?: RetainerWorkSummary[];
}

/**
 * Start a retainer contract as a client
 */
export const startRetainerContract = async (contractId: string, userId: string): Promise<RetainerData> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_START_RETAINER?.replace(':id', contractId);
    const response = await axios.put(`${baseURL}${endpoint}`, {userId});
    
    if (response.data) {
      toast.success('Retainer contract started successfully');
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Unknown error');
    }
  } catch (error: unknown) {
    toast.warn('hit')
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || 'Failed to start retainer contract'
      : 'An unexpected error occurred';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Submit work summary as a contractor
 */
export const submitWorkSummary = async (contractId: string, summaryText: string, userId: string): Promise<RetainerWorkSummary> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_SUBMIT_RETAINER_SUMMARY?.replace(':id', contractId);
    const response = await axios.post(`${baseURL}${endpoint}`, { summaryText, userId });
    
    if (response.data?.success) {
      toast.success('Work summary submitted successfully');
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Unknown error');
    }
  } catch (error: unknown) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || 'Failed to submit work summary'
      : 'An unexpected error occurred';
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Get retainer details for both client and contractor
 */
export const getRetainerDetails = async (contractId: string, userId: string): Promise<RetainerData> => {
  try {
    if (!contractId) {
      throw new Error('Contract ID is required');
    }
    
    const endpoint = process.env.NEXT_PUBLIC_GET_RETAINER_DETAILS?.replace(':id', contractId);
    const response = await axios.post(`${baseURL}${endpoint}`, { userId });
    
    if (response.data?.success) {
      // Normalize dates to string format for consistent handling
      const data = response.data.data;
      
      // Ensure date strings are properly formatted
      if (data.nextPaymentDate) {
        data.nextPaymentDate = new Date(data.nextPaymentDate).toISOString();
      }
      
      if (data.lastPaymentDate) {
        data.lastPaymentDate = new Date(data.lastPaymentDate).toISOString();
      }
      
      if (data.startDate) {
        data.startDate = new Date(data.startDate).toISOString();
      }
      
      // Format payment history dates
      if (data.paymentHistory && Array.isArray(data.paymentHistory)) {
        data.paymentHistory = (data.paymentHistory as RetainerPaymentHistory[]).map((payment: RetainerPaymentHistory) => ({
          ...payment,
          periodStart: new Date(payment.periodStart).toISOString(),
          periodEnd: new Date(payment.periodEnd).toISOString(),
          paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString() : undefined,
          // Ensure status is one of the expected values
          status: ['pending', 'completed', 'failed', 'paid'].includes(payment.status) 
            ? payment.status 
            : 'pending'
        }));
      }
      
      return data;
    } else {
      throw new Error(response.data?.message || 'Unknown error');
    }
  } catch (error: unknown) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || 'Failed to fetch retainer details'
      : 'An unexpected error occurred';
    console.error('Error fetching retainer details:', errorMessage);
    throw error;
  }
};