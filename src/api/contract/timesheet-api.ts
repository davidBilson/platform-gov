// timesheet-api.ts
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
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    toast.success('Work session logged successfully!');
    return response.data;
  } catch (error) {
    console.error('Error stopping work session:', error);
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
    throw error;
  }
};

export const approveTimesheetEntry = async (contractId: string, logId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPROVE_TIMESHEET_ENTRY
      ?.replace(':contractId', contractId)
      .replace(':logId', logId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`
    );
    toast.success('Timesheet entry approved!');
    return response.data;
  } catch (error) {
    console.error('Error approving timesheet entry:', error);
    throw error;
  }
};

export const disputeTimesheetEntry = async (
  contractId: string, 
  logId: string, 
  reason: string
) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_DISPUTE_TIMESHEET_ENTRY
      ?.replace(':contractId', contractId)
      .replace(':logId', logId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      { reason }
    );
    toast.success('Timesheet entry disputed!');
    return response.data;
  } catch (error) {
    console.error('Error disputing timesheet entry:', error);
    throw error;
  }
};