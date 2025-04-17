import axios from 'axios';
import { FormData, SignupResponse, LoginFormData, LoginResponse } from '@/types/auth';

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

export const loginUser = async (loginData: LoginFormData): Promise<LoginResponse> => {
  try {
    // For development, you can uncomment this return to bypass the actual API call
    // return { 
    //   success: true, 
    //   token: 'mock-jwt-token',
    //   user: {
    //     id: '123',
    //     email: loginData.email,
    //     first_name: 'John',
    //     last_name: 'Doe',
    //     userType: 'client'
    //   }
    // };
    
    const response = await axios.post<LoginResponse>('/api/login', loginData);
    
    // Store token if returned (common auth pattern)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      // Optional: set axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};