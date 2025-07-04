import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const initPayAmount = async (contractId: string, amount: number, clientId: string) => {
    try {
        const endPoint = (process.env.NEXT_PUBLIC_INIT_PAY_AMOUNT ?? "").replace(':id', contractId) || "";
        const response = await axios.put(`${BASE_URL}${endPoint}`, {
            amount,
            clientId
        });
        return response.data;
    } catch (error) {
        console.error('Error initializing payment amount:', error);
        throw error;
    }
};

export const editContractPrice = async (params: {
    jobId: string;
    userId?: string;
    price?: number;
    retainerAmount?: number;
  }) => {
    try {
      const { jobId, userId, price, retainerAmount } = params;
      
      const endPoint = (process.env.NEXT_PUBLIC_EDIT_CONTRACT ?? "").replace(':id', jobId) || "";
      
      const response = await axios.put(`${BASE_URL}${endPoint}`, {
        userId,
        price: price || retainerAmount
      });
  
      return response.data;
    } catch (error) {
      console.error('Error editing contract price:', error);
      throw error;
    }
  };

export const startContract = async (contractId: string, clientId: string) => {
    try {
        const endPoint = (process.env.NEXT_PUBLIC_START_CONTRACT ?? "").replace(':id', contractId) || "";
        const response = await axios.put(`${BASE_URL}${endPoint}?clientId=${clientId}`);
        return response.data;
    } catch (error) {
        console.error('Error starting contract:', error);
        throw error;
    }
}

export const confirmPayAmount = async (contractId: string, contractorId: string) => {
    try {
        const endPoint = (process.env.NEXT_PUBLIC_CONFIRM_PAY_AMOUNT ?? "").replace(':id', contractId) || "";
        const response = await axios.put(`${BASE_URL}${endPoint}`, {
            contractorId
        });
        return response.data;
    } catch (error) {
        console.error('Error confirming payment amount:', error);
        throw error;
    }
};

export const handleInstantPayment = async ({
  contractId,
  userId,
  amount,
  hasPaymentMethod,
  setIsLoading,
  onSuccess,
  stripe = null
}: {
  contractId: string;
  userId: string;
  amount: number;
  hasPaymentMethod: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  stripe?: any;
}) => {
  // Validate payment method
  if (!hasPaymentMethod) {
    toast.error('Please add a payment method before proceeding');
    return;
  }

  setIsLoading(true);

  try {
    // Make API call
    const endPoint = (process.env.NEXT_PUBLIC_PAY_INSTANTLY ?? "") || "";

    const response = await axios.post(`${BASE_URL}${endPoint}`, {
      contractId,
      userId,
      amount
    });

    const data = response.data;

    if (data.success) {
      toast.success('Payment processed successfully!');
      onSuccess?.();
    } else if (data.requires_action) {
      // Handle 3D Secure authentication
      if (!stripe) {
        throw new Error('Stripe instance required for authentication');
      }

      const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret);

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      toast.success('Payment authenticated successfully!');
      onSuccess?.();
    } else {
      throw new Error(data.message || 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    
    // Handle axios error response
    if ((error as any).response) {
      toast.error((error as any).response.data.message || 'Payment processing failed');
    } else if ((error as any).request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error((error as any).message || 'Payment processing failed');
    }
  } finally {
    setIsLoading(false);
  }
};

export const getRetainerContractPayments = async (contractId: string) => {
  try {
    const endPoint = (process.env.NEXT_PUBLIC_GET_RETAINER_CONTRACT_PAYMENTS ?? "").replace(':id', contractId) || "";
    const response = await axios.get(`${BASE_URL}${endPoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching retainer contract payments:', error);
    throw error;
  }
};