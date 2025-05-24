// contract-api.ts 
import axios from 'axios';
import { toast } from 'react-toastify';
import { Contract } from '@/types/contracts';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const createContract = async (contractData: {
  hiringId: string;
  clientId?: string;
  contractorId: string;
})  => {
  
  console.log('validate hiringId: ', contractData.hiringId)
  console.log('validate clientId: ', contractData.clientId)
  console.log('validate userId: ', contractData.contractorId)

  try {
    const endpoint = process.env.NEXT_PUBLIC_CREATE_CONTRACT;
    
    const response = await axios.post(
      `${baseURL}${endpoint}`,
      contractData,
      { timeout: 10000 }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to create contract';
      toast.error(errorMessage);
      
      // Provide additional information for specific error types
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      }
    } else {
      toast.error('An unknown error occurred while creating the contract');
    }
    
    throw error;
  }
};

// Updated getSingleContract function with better error handling
export const getSingleContract = async (contractData: {
  jobId?: string;
  clientId?: string;
  contractorId: string;
}) => {
  if (!contractData.jobId || !contractData.clientId || !contractData.contractorId) {
    
    return {
      success: false,
      data: null,
      error: {
        message: 'Missing required parameters for contract lookup',
        status: 400
      }
    };
  }

  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_SINGLE_CONTRACT;
    
    if (!endpoint) {
      return {
        success: false,
        data: null,
        error: {
          message: 'API configuration error',
          status: 500
        }
      };
    }
    
    const response = await axios.post(
      `${baseURL}${endpoint}`,
      contractData,
      { 
        timeout: 8000,  // Add timeout to prevent hanging requests
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      data: response.data.data || response.data,
      error: null
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Contract not found',
          status: 404
        }
      };
    }
    
    return {
      success: false,
      data: null,
      error: {
        message: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : error instanceof Error ? error.message : 'Unknown error occurred',
        status: axios.isAxiosError(error) && error.response ? error.response.status : 500,
        code: axios.isAxiosError(error) ? error.code : 'UNKNOWN_ERROR'
      }
    };
  }
};


export const getContracts = async (contractorId: string): Promise<{
  active: Contract[];
  inactive: Contract[];
  completed: Contract[];
} | null> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_CONTRACTS?.replace(':id', contractorId);
    const response = await axios.get(`${baseURL}${endpoint}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching contractor contracts:', error);
    return {
      active: [],
      inactive: [],
      completed: []
    };
  }
};

export const endContract = async (contractId: string, userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_END_CONTRACT
      ?.replace(':contractId', contractId);
    
    const response = await axios.put(`${baseURL}${endpoint}`, { userId });
    
    console.log(response);
    
    toast.info(response.data.message)
    return response.data;
  } catch (error) {
    toast.error(error?.message)
    console.error('Error ending contract:', error);
    throw error;
  }
};