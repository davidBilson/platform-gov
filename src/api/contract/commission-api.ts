import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface CommissionPaymentHistory {
    amount: number;
    paymentDate?: string;
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed' | 'paid';
    periodStart: string;
    periodEnd: string;
  }
  
  export interface CommissionData {
    amount?: number;
    nextPaymentDate?: string;
    lastPaymentDate?: string;
    paymentHistory?: CommissionPaymentHistory[];
    startDate?: string;
  }

  export const getCommissionDetails = async (contractId: string, userId: string) => {
    try {
      if (!contractId) {
        throw new Error('Contract ID is required');
      }
      
      const endpoint = process.env.NEXT_PUBLIC_GET_COMMISSION_DETAILS?.replace(':id', contractId);
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
          data.paymentHistory = (data.paymentHistory as CommissionPaymentHistory[]).map((payment: CommissionPaymentHistory) => ({
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