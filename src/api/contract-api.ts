import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const createContract = async (contractData: {
  hiringId: string;
  clientId?: string;
  contractorId: string;
})  => {
  // Validate required parameters
  if (!contractData.hiringId || !contractData.contractorId) {
    toast.error('Missing Info');
    throw new Error('Missing required parameters');
  }

  try {
    const endpoint = process.env.NEXT_PUBLIC_CREATE_CONTRACT;
    
    if (!endpoint) {
      toast.error('API configuration error');
      throw new Error('API endpoint not defined');
    }
    
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


// export const getSingleContract = async (contractData: {
//   jobId: string;
//   clientId: string;
//   contractorId: string;
// }) => {
//   try {
//     const endpoint = process.env.NEXT_PUBLIC_GET_SINGLE_CONTRACT; // Make sure to add this to your env
//     const response = await axios.post(
//       `${baseURL}${endpoint}`,
//       contractData
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching contract:', error);
//     if (axios.isAxiosError(error)) {
//       console.error(error.response?.data?.message || 'Failed to fetch contract');
//     } else {
//       console.error('An unknown error occurred');
//     }
//     throw error;
//   }
// };

export const getSingleContract = async (contractData: {
    jobId: string;
    clientId: string;
    contractorId: string;
  }) => {
  // Validate required parameters
  if (!contractData.jobId || !contractData.clientId || !contractData.contractorId) {
    console.warn('getSingleContract called with missing parameters:', 
      JSON.stringify({
        hasJobId: !!contractData.jobId,
        hasClientId: !!contractData.clientId,
        hasContractorId: !!contractData.contractorId
      })
    );
    
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
      console.error('GET_SINGLE_CONTRACT endpoint not defined in environment variables');
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
    console.error('Error fetching contract:', error);
    
    // Return a structured error response
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
