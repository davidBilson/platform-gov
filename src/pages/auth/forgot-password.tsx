import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

interface ApiResponse {
  success: boolean;
  message?: string;
  status?: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const router = useRouter();

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_REQUEST_PASSWORD_RESET;
      const response = await axios.post<ApiResponse>(`${apiHost}${endpoint}`, { email });
      
      if (response.data.success) {
        setIsCodeSent(true);
        setSuccessMessage('Reset code sent to your email');
      } else {
        // Even if email doesn't exist, we show the same message for security
        setIsCodeSent(true);
        setSuccessMessage('Reset code sent to your email if it exists in our system');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenVerification = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_VERIFY_RESET_TOKEN;
      const response = await axios.post<ApiResponse>(`${apiHost}${endpoint}`, { 
        email, 
        resetToken 
      });
      
      if (response.data.success) {
        router.push(`/auth/reset-password?email=${email}&token=${resetToken}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      setError(axiosError.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_REQUEST_PASSWORD_RESET;
      const response = await axios.post<ApiResponse>(`${apiHost}${endpoint}`, { email });
      if (response.data.success) {
        setSuccessMessage('Reset code resent to your email');
      }
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setResetToken(e.target.value);
  };

  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Forgot Password</h1>

        <p className="text-xl text-center mb-6">
          {isCodeSent 
            ? `Enter the reset code sent to ${email}` 
            : 'Enter your email to receive a password reset code'}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form className="flex flex-col gap-4 md:gap-6" onSubmit={isCodeSent ? handleTokenVerification : handleEmailSubmit}>
          <div className="mb-4">
            {isCodeSent ? (
              <input
                type="text" 
                id="resetToken" 
                name="resetToken" 
                value={resetToken}
                onChange={handleTokenChange}
                placeholder='6-digit reset code'
                className="w-full max-w-75 block m-auto h-12.5 bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium"
                required
                maxLength={6}
                pattern="\d{6}"
                title="Please enter the 6-digit code"
              />
            ) : (
              <input
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder='Email'
                className="w-full max-w-75 block m-auto h-12.5 bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium"
                required
              />
            )}
          </div>
          
          {isCodeSent && (
            <p className="text-center mt-2">
              <span 
                className="text-sm text-boldblue cursor-pointer hover:underline"
                onClick={handleResendCode}
              >
                {"Didn't"} get a code? <span className="font-semibold">Resend</span>
              </span>
            </p>
          )}
          
          <button
            type="submit"
            className=" cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isCodeSent ? 'Verify' : 'Submit'}
          </button>
        </form>

        {isCodeSent && (
          <p className="text-center mt-6">
            <span 
              className="text-sm text-boldblue cursor-pointer hover:underline"
              onClick={() => setIsCodeSent(false)}
            >
              Use a different email
            </span>
          </p>
        )}
      </section>
    </main>
  );
};

export default ForgotPassword;