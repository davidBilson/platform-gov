import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios, { AxiosError } from 'axios';

type UserType = 'contractor' | 'client';

interface SignupFormData {
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userId?: string;
}

interface SignupApiResponse {
  status: string;
  message: string;
  data?: {
    userId: string;
    email?: string;
    phoneNumber?: string;
  };
}

interface ErrorResponse {
  message?: string;
}

interface AuthStore {
  setFormData: (data: SignupFormData) => void;
  setUserId: (id: string) => void;
  setVerificationStep: (step: string) => void;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const { setFormData: setStoreFormData, setUserId, setVerificationStep } = useAuthStore() as AuthStore;
  
  const [formData, setLocalFormData] = useState<SignupFormData>({
    userType: 'contractor',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    
    setLocalFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? e.target.value : value
    }));
    
    if (errorMessage) setErrorMessage('');
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Store data in Zustand
      setStoreFormData(formData);
      
      // Ensure environment variables are properly typed or use defaults
      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const signupEndpoint = process.env.NEXT_PUBLIC_SIGNUP;
      
      const res = await axios.post<SignupApiResponse>(
        `${apiHost}${signupEndpoint}`, 
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.userType,
        }
      );
      
      const responseData = res.data;
      
      // Check if we have a userId in the response
      if (!responseData.data?.userId) {
        console.warn('Response received but userId is missing:', responseData);
        throw new Error('User ID not received from server');
      }
      
      // Store user ID for verification
      setUserId(responseData.data.userId);
      
      // Update Zustand store with user data
      setStoreFormData({
        ...formData,
        userId: responseData.data.userId,
      });
      
      // Set verification step to email verification
      setVerificationStep('email');
      
      // Redirect to verification page
      router.push('/auth/verification');
      
    } catch (error) {
      // If there's an error, check for specific messages like "Email already in use"
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
          const errorResponseData = axiosError.response.data as ErrorResponse;
          setErrorMessage(errorResponseData.message || 'An error occurred during signup');
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

  // Inline styles with proper TypeScript typing
  const radioStyle: React.CSSProperties = {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #0B5F94',
    backgroundColor: '#fff',
    position: 'relative',
    cursor: 'pointer',
  };

  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6 md:mb-10'>Create Account</h1>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div className='flex items-center justify-center gap-10 md:gap-20 mb-6 md:mb-10'>
            <label className='flex items-center gap-[5px]'>
              <input 
                type="radio" 
                name="userType" 
                value="contractor"
                checked={formData.userType === 'contractor'}
                onChange={handleChange}
                style={radioStyle}
                className="checked:after:content-[''] checked:after:absolute checked:after:top-[3px] checked:after:left-[3px] checked:after:w-[12px] checked:after:h-[12px] checked:after:rounded-full checked:after:bg-boldblue"
              />
              <span className='text-sm'>
                Contractor
              </span>
            </label>
            <label className='flex items-center gap-[5px]'>
              <input 
                type="radio" 
                name="userType" 
                value="client"
                checked={formData.userType === 'client'}
                onChange={handleChange}
                style={radioStyle}
                className="checked:after:content-[''] checked:after:absolute checked:after:top-[3px] checked:after:left-[3px] checked:after:w-[12px] checked:after:h-[12px] checked:after:rounded-full checked:after:bg-boldblue"
              />
              <span className='text-sm'>
                Client
              </span>
            </label>
          </div>
          
          {/* Form Inputs - Responsive Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-4 md:gap-y-10 mb-6 md:mb-10">
            <div>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                placeholder='First name' 
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>

            <div>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                placeholder='Last name' 
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>

            <div>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required
              />
            </div>

            <div>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='Phone'
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>
            
            <div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder='Password'
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>
            
            <div className='w-full h-[50px] flex items-center'>
              <button
                type="submit"
                disabled={isSubmitting}
                className='px-5 py-[11px] min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer'
              >
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </div>

          <p className='text-center text-xs md:text-sm font-medium'>Already have an account? <Link href="/auth/sign-in" className='text-boldblue underline cursor-pointer'>Sign in</Link></p>
        </form>
      </section>
    </main>
  );
};

export default Signup;