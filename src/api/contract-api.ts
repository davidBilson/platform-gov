import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Create a new contract from hiring record
 */
export const createContract = async (contractData: {
  hiringId: string;
  clientId?: string;
  contractorId: string;
}) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_CREATE_CONTRACT
    const response = await axios.post(
      `${baseURL}${endpoint}`,
      contractData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || 'Failed to create contract');
    } else {
      toast.error('An unknown error occurred');
    }
    throw error;
  }
};


export const getSingleContract = async (contractData: {
  hiringId: string;
  clientId?: string;
  contractorId: string;
}) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_SINGLE_CONTRACT; // Make sure to add this to your env
    const response = await axios.post(
      `${baseURL}${endpoint}`,
      contractData
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contract:', error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || 'Failed to fetch contract');
    } else {
      toast.error('An unknown error occurred');
    }
    throw error;
  }
};
