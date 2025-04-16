import axios from 'axios';
import { FormData, SignupResponse } from '@/types/auth';

export const signupUser = async (formData: FormData): Promise<SignupResponse> => {
  try {
    // Uncomment the following lines to simulate a mock API response
    // return { success: true, message: 'Mock signup successful' };
    
    const response = await axios.post<SignupResponse>('', formData);
    return response.data;
  } catch (error) {
    console.error('API Error: ', error);
    throw error;
  }
};