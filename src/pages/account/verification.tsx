import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

type VerificationStep = 'email' | 'phone' | 'completed';

interface AuthStoreState {
  userId: string | null;
  email: string | null;
  role: string | null;
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
    phoneNumber,
    verificationStep,
    setEmailVerified,
    setPhoneVerified,
    setVerificationStep
  } = useAuthStore() as AuthStoreState;

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [phoneCodeSent, setPhoneCodeSent] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      router.replace('/account/sign-up');
    }
  }, [userId, router]);

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) { // Limit to 6 digits
      setVerificationCode(value);
      setError('');
    }
  };

  // APIs for verification
  const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
  const verifyEmailEndpoint = process.env.NEXT_PUBLIC_VERIFY_EMAIL;
  const resendVerificationEmailEndpoint = process.env.NEXT_PUBLIC_RESEND_VERIFICATION_EMAIL;
  const sendPhoneVerificationEndpoint = process.env.NEXT_PUBLIC_SEND_PHONE_VERIFICATION;
  const verifyPhoneEndpoint = process.env.NEXT_PUBLIC_VERIFY_PHONE;
  const resendVerificationPhoneEndpoint = process.env.NEXT_PUBLIC_RESEND_VERIFICATION_PHONE;

  // Validation helper
  const validateVerificationCode = (): boolean => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return false;
    }
    if (verificationCode.length < 4) {
      setError('Verification code must be at least 4 digits');
      return false;
    }
    return true;
  };

  // Handle email verification
  const verifyEmail = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (!validateVerificationCode()) {
      return;
    }

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post<ApiResponse>(`${apiHost}${verifyEmailEndpoint}`, {
        userId,
        code: verificationCode
      });

      setEmailVerified(true);
      toast.success('Email verified successfully!');
      setVerificationCode('');
      setVerificationStep('completed'); //change to phone when twilio is ready

    } catch (err) {
      console.error('Email verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Email verification failed. Please try again.';
        setError(errorMessage);
        // Only toast for network/server errors, not validation errors
        if (err.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
      } else {
        const error = err as Error;
        setError(error.message || 'Email verification failed. Please try again.');
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneVerification = async (e?: MouseEvent<HTMLButtonElement>): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post<ApiResponse>(`${apiHost}${sendPhoneVerificationEndpoint}`, {
        userId
      });

      setPhoneCodeSent(true);
      toast.success('Verification code sent to your phone');

    } catch (err) {
      console.error('Send phone verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Failed to send verification code. Please try again.';
        setError(errorMessage);
        if (err.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
      } else {
        const error = err as Error;
        setError(error.message || 'Failed to send verification code. Please try again.');
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send phone verification when moving to the phone step
  useEffect(() => {
    if (verificationStep === 'phone' && !phoneCodeSent) {
      sendPhoneVerification();
    }
  }, [verificationStep, phoneCodeSent]);

  const verifyPhone = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (!validateVerificationCode()) {
      return;
    }

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post<ApiResponse>(`${apiHost}${verifyPhoneEndpoint}`, {
        userId,
        code: verificationCode
      });

      toast.success('Phone verified successfully!');
      setVerificationStep('completed');
      setVerificationCode('');
      setPhoneVerified(true);

    } catch (err) {
      console.error('Phone verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Phone verification failed. Please try again.';
        setError(errorMessage);
        if (err.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
      } else {
        const error = err as Error;
        setError(error.message || 'Phone verification failed. Please try again.');
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const continueToAccountCreation = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await router.push('/profile/edit');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Navigation failed. Please try again.');
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (): Promise<void> => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Determine which endpoint to use based on the current verification step
      const endpoint = verificationStep === 'email'
        ? resendVerificationEmailEndpoint
        : resendVerificationPhoneEndpoint;

      await axios.post<ApiResponse>(`${apiHost}${endpoint}`, {
        userId
      });

      const successMessage = verificationStep === 'email'
        ? 'Verification code resent to your email'
        : 'Verification code resent to your phone';

      toast.success(successMessage);

      if (verificationStep === 'phone') {
        setPhoneCodeSent(true);
      }

    } catch (err) {
      console.error('Resend verification error:', err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message || 'Failed to resend verification code. Please try again.';
        setError(errorMessage);
        if (err.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
      } else {
        const error = err as Error;
        setError(error.message || 'Failed to resend verification code. Please try again.');
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phoneNum: string | null): string => {
    if (!phoneNum) return '';
    const cleaned = ('' + phoneNum).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNum;
  };

  return (
    <main className='pt-10 pb-20 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Create Account</h1>

        {/* Dynamic message based on current verification step */}
        {verificationStep === 'email' && (
          <p className="text-xl text-center mb-6">
            Enter the verification code sent to {email || "your email"}
          </p>
        )}

        {verificationStep === 'phone' && !phoneCodeSent && (
          <p className="text-xl text-center mb-6">
            Your email has been verified, sending phone verification code...
          </p>
        )}

        {verificationStep === 'phone' && phoneCodeSent && (
          <p className="text-xl text-center mb-6">
            Enter the verification code sent to {formatPhoneNumber(phoneNumber) || "your phone"}
          </p>
        )}

        {verificationStep === 'completed' && (
          <p className="text-xl text-center mb-6">
            Your account is verified! Continue to complete your account setup.
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-75 m-auto">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 md:gap-6">
          {/* Verification code input field - shown for email and phone verification */}
          {(verificationStep === 'email' || (verificationStep === 'phone' && phoneCodeSent)) && (
            <div className="mb-4">
              <input
                type="text"
                id="code"
                name="code"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder='Enter 6 digit code'
                className="w-full max-w-75 block m-auto h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium text-center tracking-widest"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </div>
          )}

          {/* Resend code option - available for both email and phone */}
          {(verificationStep === 'email' || (verificationStep === 'phone' && phoneCodeSent)) && (
            <p className="text-center mt-2">
              <button
                type="button"
                className="text-sm cursor-pointer hover:underline text-boldblue disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={resendVerificationCode}
                disabled={isLoading}
              >
                {"Didn't"} get a code? Resend
              </button>
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
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          )}

          {/* Send phone verification code button */}
          {verificationStep === 'phone' && !phoneCodeSent && (
            <button
              type="button"
              onClick={sendPhoneVerification}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : `Send Code to ${formatPhoneNumber(phoneNumber) || "Phone"}`}
            </button>
          )}

          {/* Phone verification button */}
          {verificationStep === 'phone' && phoneCodeSent && (
            <button
              type="button"
              onClick={verifyPhone}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? 'Verifying...' : 'Verify Phone'}
            </button>
          )}

          {/* Continue to account creation button */}
          {verificationStep === 'completed' && (
            <button
              type="button"
              onClick={continueToAccountCreation}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Continue to account creation'}
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Verification;