import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse {
  success: boolean;
  message?: string;
}

const Forgotpassword = () => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post<ApiResponse>('/api/auth/forgot-password', { email });
      if (!response.data.success) return;
      setIsCodeSent(true);
      setIsLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error)
      setError('Failed to send recovery code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post<ApiResponse>('/api/auth/verify-code', { email, code });
      if (response) return;
      // Redirect to password reset page or handle next step
      window.location.href = `/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}`;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error)
      setError('Invalid code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post<ApiResponse>('/api/auth/resend-code', { email });
      if (!response.data.success) return;
      setIsLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error)
      setError('Failed to resend code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCode(e.target.value);
  };

  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Forgot Password</h1>

        <p className="text-xl text-center mb-6">
          {isCodeSent 
            ? `Enter the recovery code sent to ${email}` 
            : 'Enter your email to receive a recovery code'}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="flex flex-col gap-4 md:gap-6" onSubmit={isCodeSent ? handleCodeVerification : handleEmailSubmit}>
          <div className="mb-4">
            {isCodeSent ? (
              <input
                type="text" 
                id="code" 
                name="code" 
                value={code}
                onChange={handleCodeChange}
                placeholder='Recovery code'
                className="w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                required
              />
            ) : (
              <input
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder='Email'
                className="w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                required
              />
            )}
          </div>
          
          {isCodeSent && (
            <p className="text-center mt-2">
              <span 
                className="text-sm cursor-pointer"
                onClick={handleResendCode}
              >
                {"Didn't"} get a code? Resend
              </span>
            </p>
          )}
          
          <button
            type="submit"
            className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isCodeSent ? 'Verify' : 'Submit'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Forgotpassword;