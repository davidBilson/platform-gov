// src/pages/auth/signin.tsx or src/app/auth/signin/page.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import useAuthStore from '@/store/authStore';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInApiResponse {
  status: string;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      phoneNumber: string;
      role: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    }
  };
}

interface ErrorResponse {
  message?: string;
}

// Interface for AuthStore to match the zustand structure
interface AuthStore {
  setFormData: (data: {
    role?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    userId?: string;
  }) => void;
  setUserId: (id: string) => void;
  setEmailVerified: (status: boolean) => void;
  setPhoneVerified: (status: boolean) => void;
}

const SignIn = () => {
  const router = useRouter();
  const { setUserId, setFormData, setEmailVerified, setPhoneVerified } = useAuthStore() as AuthStore;
  
  const [formData, setLocalFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errorMessage) setErrorMessage('');
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Ensure environment variables are properly typed or use defaults
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
      
      // Check if we have user data in the response
      if (!responseData.data?.user?._id) {
        console.warn('Response received but user data is missing:', responseData);
        throw new Error('User data not received from server');
      }
      
      const userData = responseData.data.user;
      
      // Update auth store with user data - now including name and role properly
      setUserId(userData._id);
      setFormData({
        name: userData.name,         // Store the user's name
        role: userData.role,         // Store as role (not userType)
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        userId: userData._id         // Also include userId in form data
      });
      
      // Set verification statuses
      setEmailVerified(userData.isEmailVerified);
      setPhoneVerified(userData.isPhoneVerified);
      
      // Redirect based on verification status
      if (!userData.isEmailVerified) {
        router.push('/auth/verification');
      } else {
        // Redirect to home page if verification is complete
        router.push('/profile/create');
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
          const errorResponseData = axiosError.response.data as ErrorResponse;
          setErrorMessage(errorResponseData.message || 'Invalid email or password');
        } else if (axiosError.request) {
          setErrorMessage('No response from server. Please check your connection.');
        } else {
          setErrorMessage('Failed to process your request. Please try again.');
        }
      } else {
        const err = error as Error;
        setErrorMessage(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6 md:mb-10'>Sign In</h1>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-75 m-auto">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className='w-full max-w-75 m-auto h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
            required 
          />
          
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full max-w-75 m-auto h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
            required 
          />
          
          <div className='w-full flex flex-col gap-4 mt-2'>
            <button
              type="submit"
              disabled={isSubmitting}
              className='cursor-pointer active:opacity-70 px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold disabled:opacity-70'
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center mt-2">
              <Link href="/auth/forgot-password" className='text-xs md:text-sm font-medium text-boldblue underline cursor-pointer'>
                Forgot Password?
              </Link>
            </div>
            
            <p className='text-center text-xs md:text-sm font-medium mt-2'>
              {"Don't"} have an account? <Link href="/auth/sign-up" className='text-boldblue underline cursor-pointer'>Create Account</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignIn;