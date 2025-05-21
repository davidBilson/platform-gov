import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const startWorkSession = async (contractId: string, userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_START_WORK_SESSION
      ?.replace(':contractId', contractId);
    
    const response = await axios.post(
      `${baseURL}${endpoint}`,
      { userId }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting work session:', error);
    toast.error('Failed to start work session');
    throw error;
  }
};

export const stopWorkSession = async (
  contractId: string, 
  sessionId: string, 
  formData: FormData
) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_STOP_WORK_SESSION
      ?.replace(':contractId', contractId)
      .replace(':sessionId', sessionId);
    
    // Debug log FormData contents
    console.log('FormData being sent:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add longer timeout for file uploads
        timeout: 60000 // 60 seconds
      }
    );
    toast.success('Work session logged successfully!');
    return response.data;
  } catch (error: unknown) {
    console.error('Error stopping work session:', error);
    
    // More detailed error reporting
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      toast.error(`Failed to stop session: ${error.response.data?.message || error.response.statusText}`);
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('Server did not respond. Check your connection.');
    } else if (error instanceof Error) {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      toast.error(`Error: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
    
    throw error;
  }
};

export const getTimesheetLogs = async (contractId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_TIMESHEET_LOGS
      ?.replace(':contractId', contractId);
    
    const response = await axios.get(
      `${baseURL}${endpoint}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching timesheet logs:', error);
    toast.error('Failed to load timesheet logs');
    throw error;
  }
};

export const approveTimesheetEntry = async (contractId: string, logId: string, userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPROVE_TIMESHEET_ENTRY
      ?.replace(':contractId', contractId)
      .replace(':logId', logId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      { userId }
    );
    toast.success('Timesheet entry approved!');
    return response.data;
  } catch (error) {
    console.error('Error approving timesheet entry:', error);
    toast.error('Failed to approve timesheet entry');
    throw error;
  }
};

export const disputeTimesheetEntry = async (
  contractId: string, 
  logId: string, 
  reason: string,
  userId: string
) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_DISPUTE_TIMESHEET_ENTRY
      ?.replace(':contractId', contractId)
      .replace(':logId', logId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      { reason, userId }
    );
    toast.success('Timesheet entry disputed!');
    return response.data;
  } catch (error) {
    console.error('Error disputing timesheet entry:', error);
    toast.error('Failed to dispute timesheet entry');
    throw error;
  }
};