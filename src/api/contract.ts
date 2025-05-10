
import axios from 'axios';
import { toast } from 'react-toastify';

interface HireContractorParams {
  jobId: string | null;
  userId: string | null;
  contractorId: string | null;
  applicationId: string | null;
  rate: string;
  employmentType: 'one-time' | 'full-time' | 'part-time';
  startDate: Date | null;
  selectedFiles: File[];
}

interface AcceptHiringOfferParams {
  contractorId: string;
  hiringId: string;
  contractorNotes?: string;
  selectedFiles?: File[];
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const submitHireContract = async ({
  jobId,
  userId,
  contractorId,
  applicationId,
  rate,
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
    
    // Required fields
    formDataToSend.append('jobId', jobId || '');
    formDataToSend.append('clientId', userId || '');
    formDataToSend.append('contractorId', contractorId || '');
    formDataToSend.append('applicationId', applicationId || '');
    formDataToSend.append('clientNotes', '');
    formDataToSend.append('rate', rate);
    formDataToSend.append('employmentType', employmentType);
    formDataToSend.append('startDate', startDate.toISOString());


    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formDataToSend.append('documents', file);
      });
    }

    for (const pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const endPoint = process.env.NEXT_PUBLIC_SEND_HIRING_CONTRACT;

    await axios.post(`${baseURL}${endPoint}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Contract sent successfully!');
    return true;
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      toast.error(err.message);
    } else if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.message || 'Failed to send contract');
    } else {
      toast.error('An unknown error occurred');
    }
    return false;
  }
};



export const getHiringOffer = async (jobId: string, applicationId: string) => {
  try {

    const endPoint = process.env.NEXT_PUBLIC_GET_HIRING_OFFER;

    const response = await axios.post(`${baseURL}${endPoint}`,
      {
        jobId,
        applicationId
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hiring offer:', error);
  }
};

// Accept hiring offer (updated)
export const acceptHiringOffer = async ({
  hiringId,
  contractorId,
  contractorNotes = '',
  selectedFiles = []
}: AcceptHiringOfferParams): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('contractorId', contractorId);
    formData.append('contractorNotes', contractorNotes);
    
    selectedFiles.forEach(file => formData.append('documents', file));

    const endPoint = process.env.NEXT_PUBLIC_ACCEPT_HIRING_CONTRACT?.replace(':id', hiringId);
    await axios.put(`${baseURL}${endPoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('Hiring offer accepted successfully!');
    return true;
  } catch (err) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.error || 'Failed to accept offer');
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
      toast.error(err.response?.data?.error || 'Failed to sign contract');
    } else {
      toast.error('An unknown error occurred');
    }
    return false;
  }
};

export const getContractorSignature = async (hiringId: string, contractorId: string): Promise<boolean> => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_CONTRACTOR_OFFER_SIGNATURE?.replace(':id', hiringId);
    const response = await axios.get(`${baseURL}${endPoint}`, {
      params: { contractorId }
    });
    return response.data.data.contractorSigned || false;
  } catch (err) {
    console.error('Error checking contractor signature:', err);
    return false;
  }
};


export const getClientHiringOffers = async (clientId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_CLIENT_HIRING_OFFERS?.replace(':id', clientId);
    const response = await axios.get(`${baseURL}${endpoint}`);

    if (!response.data.success || !response.data.data) {
      toast.error(response.data.message || 'Failed to fetch hiring offers');
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching client hiring offers:', error);
    
    return null;
  }
};