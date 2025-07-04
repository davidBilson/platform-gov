
import axios from 'axios';
import { toast } from 'react-toastify';

interface HireContractorParams {
  jobId: string | null;
  userId: string | null;
  contractorId: string | null;
  applicationId: string | null;
  rate: string;
  paymentType?: string;
  employmentType: string;
  startDate: Date | null;
  selectedFiles: File[];
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const submitHireContract = async ({
  jobId,
  rate,
  userId,
  contractorId,
  applicationId,
  paymentType,
  employmentType,
  startDate,
  selectedFiles
}: HireContractorParams): Promise<boolean> => {
  try {
    if (!startDate) {
      toast.error('Please select a start date');
      return false;
    }

    if (!rate) {
      toast.error('Please enter a rate');
      return false;
    }

    const formDataToSend = new FormData();
    
    // Append all required fields
    formDataToSend.append('jobId', jobId || '');
    formDataToSend.append('clientId', userId || '');
    formDataToSend.append('contractorId', contractorId || '');
    formDataToSend.append('applicationId', applicationId || '');
    formDataToSend.append('rate', rate);
    formDataToSend.append('paymentType', paymentType || '');
    formDataToSend.append('employmentType', employmentType);
    formDataToSend.append('startDate', startDate.toISOString());
    formDataToSend.append('clientNotes', '');

    // Append file if exists
    if (selectedFiles.length > 0) {
      formDataToSend.append('documents', selectedFiles[0]);
    }

    const endPoint = process.env.NEXT_PUBLIC_SEND_HIRING_CONTRACT;

    const response = await axios.post(`${baseURL}${endPoint}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      toast.success('Contract sent successfully!');
      return true;
    } else {
      toast.error(response.data.message || 'Failed to send contract');
      return false;
    }
  } catch (err: unknown) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.message || 'Failed to send contract');
    } else {
      toast.error('An unknown error occurred');
    }
    return false;
  }
};

export const getHiringOffer = async (jobId: string, applicationId: string)  => {
  // Validate required parameters
  if (!jobId || !applicationId) {
    return {
      success: false,
      data: null,
      error: {
        message: 'Missing required parameters: jobId or applicationId',
        status: 400
      }
    };
  }

  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_HIRING_OFFER;
    
    if (!endPoint) {
      console.error('API endpoint not defined in environment variables');
      return {
        success: false,
        data: null,
        error: {
          message: 'API configuration error',
          status: 500
        }
      };
    }
    
    const response = await axios.post(`${baseURL}${endPoint}`,
      { jobId, applicationId },
      { timeout: 10000 } // Add timeout to prevent hanging requests
    );
    
    return {
      success: true,
      data: response.data.data,
      error: null
    };
  } catch (error) {
    console.error('Error fetching hiring offer:', error);
    
    // Return a structured error response
    return {
      success: false,
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: axios.isAxiosError(error) && error.response ? error.response.status : 500
      }
    };
  }
};

export const acceptHiringOffer = async (
  { hiringId, contractorId }: { hiringId: string, contractorId: string }
): Promise<boolean> => {
  // Validate required parameters
  if (!hiringId || !contractorId) {
    toast.error('Missing required information to accept offer');
    return false;
  }

  try {
    const endPoint = process.env.NEXT_PUBLIC_ACCEPT_HIRING_CONTRACT?.replace(':id', hiringId);
    
    if (!endPoint) {
      toast.error('API configuration error');
      return false;
    }
    
    const response = await axios.put(`${baseURL}${endPoint}`, 
      { contractorId },
      { timeout: 10000 } // Add timeout to prevent hanging requests
    );

    if (response.data.success) {
      return true;
    }
    
    toast.error(response.data.message || 'Failed to accept offer');
    return false;
  } catch (err) {
    console.error('Error accepting hiring offer:', err);
    
    if (axios.isAxiosError(err)) {
      // Handle specific error cases
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again later.');
      } else if (err.response?.status === 404) {
        toast.error('Hiring offer not found or already processed');
      } else {
        toast.error(err.response?.data?.error || 'Failed to accept offer');
      }
    } else {
      toast.error('An unknown error occurred');
    }
    return false;
  }
};

export const contractorSignHiringOffer = async (hiringId: string, contractorId: string): Promise<boolean> => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_CONTRACTOR_SIGN_HIRING_OFFER?.replace(':id', hiringId);
    await axios.put(`${baseURL}${endPoint}`, { contractorId });
    return true;
  } catch (err) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data?.error || 'Failed to sign contract');
    } else {
      console.error('An unknown error occurred');
    }
    return false;
  }
};

export const getContractorSignature =async (hiringId: string, contractorId: string): Promise<boolean> => {
  if (!hiringId || !contractorId) {
    console.error('Missing required parameters for getContractorSignature');
    return false;
  }

  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_CONTRACTOR_OFFER_SIGNATURE?.replace(':id', hiringId);
    
    if (!endPoint) {
      console.error('API endpoint not defined in environment variables');
      return false;
    }
    
    const response = await axios.get(`${baseURL}${endPoint}`, {
      params: { contractorId },
      timeout: 8000 // Add timeout to prevent hanging requests
    });
    
    return response.data.data.contractorSigned || false;
  } catch (err) {
    console.error('Error checking contractor signature:', err);
    
    // Don't show toast for this function as it's not user-critical
    return false;
  }
};

export const getClientHiringOffers = async (clientId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_CLIENT_HIRING_OFFERS?.replace(':id', clientId);
    const response = await axios.get(`${baseURL}${endpoint}`);

    if (!response.data.success || !response.data.data) {
      console.error(response.data.message || 'Failed to fetch hiring offers');
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching client hiring offers:', error);
    
    return null;
  }
};