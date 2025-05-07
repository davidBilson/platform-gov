
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
    formDataToSend.append('rate', rate);
    formDataToSend.append('employmentType', employmentType);
    formDataToSend.append('startDate', startDate.toISOString());

    // Optional fields
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formDataToSend.append('documents', file);
      });
    }

    await axios.post('/api/hire-contractor', formDataToSend, {
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