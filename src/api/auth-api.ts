// src/api/auth-api.ts or src/lib/auth-api.ts
import axios, { AxiosError } from 'axios';
import { SignInFormData, SignInApiResponse, ErrorResponse, SignInResponse } from '@/types/auth/auth';

// ************* SIGN IN USER *************

export const signInUser = async (formData: SignInFormData): Promise<SignInResponse> => {
  try {
    
    const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
    const signinEndpoint = process.env.NEXT_PUBLIC_SIGNIN;
    
    const res = await axios.post<SignInApiResponse>(
      `${apiHost}${signinEndpoint}`, 
      {
        email: formData.email,
        password: formData.password,
      }
    );
    
    const responseData = res.data;
    
    if (!responseData.data?.user?._id) {
      console.warn('Response received but user data is missing:', responseData);
      return {
        success: false,
        error: 'Invalid response from server'
      };
    }
    
    return {
      success: true,
      data: responseData.data
    };
    
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      
      if (axiosError.response) {
        const errorResponseData = axiosError.response.data as ErrorResponse;
        errorMessage = errorResponseData.message || 'Invalid email or password';
      } else if (axiosError.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = 'Failed to process your request. Please try again.';
      }
    } else {
      const err = error as Error;
      errorMessage = err.message || 'An unexpected error occurred';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};