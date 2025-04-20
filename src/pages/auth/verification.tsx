import React, { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router'; // or 'next/navigation' for App Router
import useAuthStore from '@/store/authStore';
import axios from 'axios';

// type VerificationStep = 'email' | 'phone' | 'completed';
type VerificationStep = 'email' | 'completed';

interface AuthStoreState {
  userId: string | null;
  email: string | null;
  phoneNumber: string | null;
  verificationStep: VerificationStep;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  setVerificationStep: (step: VerificationStep) => void;
}

interface VerificationData {
  verified: boolean;
  userId?: string;
  email?: string;
  phone?: string;
  timestamp?: string;
  expiresAt?: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  data?: VerificationData;
}

const Verification: React.FC = () => {
  const router = useRouter();
  const { 
    userId, 
    email, 
    // phoneNumber, 
    verificationStep, 
    setEmailVerified, 
    // setPhoneVerified,
    setVerificationStep
  } = useAuthStore() as AuthStoreState;
  
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  useEffect(() => {
    if (!userId) {
      router.replace('/auth/sign-up');
    }
  }, [userId, router]);
  
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setVerificationCode(e.target.value);
    setError('');
    setSuccess('');
  };
  
  // Handle email verification
  const verifyEmail = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const verifyEndpoint = process.env.NEXT_PUBLIC_VERIFY_EMAIL;
        
      await axios.post<ApiResponse>(`${apiHost}${verifyEndpoint}`, {
        userId,
        code: verificationCode
      });
      
      setEmailVerified(true);
      setSuccess('Email verified successfully!');
      setVerificationCode('');
      // Modified: Skip phone verification and go directly to completed
      setVerificationStep('completed');
      
    } catch (err) {
      console.error('Email verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Email verification failed. Please try again.');
      } else {
        const error = err as Error;
        setError(error.message || 'Email verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  /*
  const sendPhoneVerification = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      await axios.post<ApiResponse>('http://localhost:5050/api/auth/sendPhoneVerificationCode', {
        userId
      });
      
      setSuccess('Verification code sent to your phone');
      
    } catch (err) {
      console.error('Phone verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to send verification code. Please try again.');
      } else {
        const error = err as Error;
        setError(error.message || 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyPhone = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }

      await axios.post<ApiResponse>('http://localhost:5050/api/auth/verifyPhone', {
        userId,
        code: verificationCode
      });
      
      setPhoneVerified(true);
      setSuccess('Phone verified successfully!');
      setVerificationCode('');
      setVerificationStep('completed');
      
    } catch (err) {
      console.error('Phone verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Phone verification failed. Please try again.');
      } else {
        const error = err as Error;
        setError(error.message || 'Phone verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  */
  
  const continueToAccountCreation = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.push('/profile/create');
  };
  
  const resendVerificationCode = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_RESEND_VERIFICATION_EMAIL;
      
      await axios.post<ApiResponse>(`${apiHost}${endpoint}`, {
        userId
      });
      
      setSuccess('Verification code resent to your email');
      
    } catch (err) {
      console.error('Resend verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to resend verification code. Please try again.');
      } else {
        const error = err as Error;
        setError(error.message || 'Failed to resend verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  /*
  const formatPhoneNumber = (phoneNum: string | null): string => {
    if (!phoneNum) return '';
    const cleaned = ('' + phoneNum).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNum;
  };
  */

  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Create Account</h1>

        {/* Dynamic message based on current verification step */}
        {verificationStep === 'email' && (
          <p className="text-xl text-center mb-6">
            Enter the verification code sent to {email || "email@email.com"}
          </p>
        )}
        
        {/*
        {verificationStep === 'phone' && !success.includes('sent to your phone') && (
          <p className="text-xl text-center mb-6">
            Your email has been verified, continue to phone verification
          </p>
        )}
        
        {verificationStep === 'phone' && success.includes('sent to your phone') && (
          <p className="text-xl text-center mb-6">
            Enter the verification code sent to {formatPhoneNumber(phoneNumber) || "(123) 123-1234"}
          </p>
        )}
        */}
        
        {verificationStep === 'completed' && (
          <p className="text-xl text-center mb-6">
            Email verified successfully! Continue to complete your account setup.
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        
        {/* Success message */}
        {success && !success.includes('sent to your phone') && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        
        <form className="flex flex-col gap-4 md:gap-6">
          {/* Verification code input field - shown for email verification */}
          {verificationStep === 'email' && (
            <div className="mb-4">
              <input
                type="text" 
                id="code" 
                name="code"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder='Verification Code'
                className="w-full max-w-75 block m-auto h-12.5 bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium"
                required
              />
            </div>
          )}
          
          {/* Resend code option */}
          {verificationStep === 'email' && (
            <p className="text-center mt-2">
              <span 
                className="text-sm cursor-pointer hover:underline text-boldblue"
                onClick={resendVerificationCode}
              >
                {"Didn't"} get a code? Resend
              </span>
            </p>
          )}
          
          {/* Conditional buttons based on verification step */}
          {/* Email verification button */}
          {verificationStep === 'email' && (
            <button
              type="button"
              onClick={verifyEmail}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer transition transform active:scale-95 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          )}
          
          {/*
          // Send phone verification code button
          {verificationStep === 'phone' && !success.includes('sent to your phone') && (
            <button
              type="button"
              onClick={sendPhoneVerification}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : `Send Verification Code to ${formatPhoneNumber(phoneNumber) || "(123) 123-1234"}`}
            </button>
          )}
          
          // Phone verification button
          {verificationStep === 'phone' && success.includes('sent to your phone') && (
            <button
              type="button"
              onClick={verifyPhone}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          )}
          */}
          
          {/* Continue to account creation button */}
          {verificationStep === 'completed' && (
            <button
              type="button"
              onClick={continueToAccountCreation}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out"
            >
              Continue to account creation
            </button>
          )}
        </form>
      </section>
    </main>
  );
};

export default Verification;