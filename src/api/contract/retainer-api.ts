import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const startRetainerContract = async (contractId: string) => {
  try {
    const endpoint = '/api/contracts/:id/retainer/start'.replace(':id', contractId);
    const response = await axios.put(`${baseURL}${endpoint}`);
    toast.success('Retainer contract started!');
    return response.data;
  } catch (error) {
    toast.error('Failed to start retainer contract');
    throw error;
  }
};

export const submitWorkSummary = async (contractId: string, summaryText: string) => {
  try {
    const endpoint = '/api/contracts/:id/retainer/summary'.replace(':id', contractId);
    const response = await axios.post(`${baseURL}${endpoint}`, { summaryText });
    toast.success('Work summary submitted!');
    return response.data;
  } catch (error) {
    toast.error('Failed to submit work summary');
    throw error;
  }
};

export const getRetainerDetails = async (contractId: string) => {
  try {
    const endpoint = '/api/contracts/:id/retainer'.replace(':id', contractId);
    const response = await axios.get(`${baseURL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching retainer details:', error);
    throw error;
  }
};