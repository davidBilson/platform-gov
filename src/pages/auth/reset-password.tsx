import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

interface ApiResponse {
  success: boolean;
  status?: string;
  message?: string;
}

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const router = useRouter();
  
  useEffect(() => {
    // Make sure we have the query params before proceeding
    if (!router.isReady) return;
    
    const { email, token } = router.query;
    
    // Redirect to forgot password page if no email or token is provided
    if (!email || !token) {
      router.push('/auth/forgot-password');
      return;
    }
    
    // Verify token on component mount
    const verifyToken = async () => {
      setIsVerifying(true);
      try {
        const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_VERIFY_RESET_TOKEN;
        // Use the raw query values without additional encoding/decoding
        await axios.post<ApiResponse>(`${apiHost}${endpoint}`, { 
          email: email as string, 
          resetToken: token as string 
        });
        
        // If verification succeeds, clear the verifying state
        setIsVerifying(false);
      } catch (err) {
        console.error('Token verification error:', err);
        const axiosError = err as AxiosError<ApiResponse>;
        
        setError(axiosError.response?.data?.message || 'Invalid or expired reset link. Please request a new password reset.');
        // Redirect after a delay
        setTimeout(() => {
          router.push('/auth/forgot-password');
        }, 3000);
      }
    };
    
    verifyToken();
  }, [router.isReady, router.query, router]);
  
  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordErrors(validatePassword(password));
  };
  
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const { email, token } = router.query;
    
    // Make sure we have the query params before proceeding
    if (!email || !token) {
      setError('Missing required reset information. Please go back to the forgot password page.');
      return;
    }
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
        const apiHost = process.env.NEXT_PUBLIC_BASE_URL;
      const endpoint = process.env.NEXT_PUBLIC_RESET_PASSWORD;
        
      const response = await axios.post<ApiResponse>(`${apiHost}${endpoint}`, {
        email: email as string,
        resetToken: token as string,
        newPassword
      });
      
      if (response.data.success) {
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const axiosError = err as AxiosError<ApiResponse>;
      setError(axiosError.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isVerifying) {
    return (
      <main className='pt-10 md:pt-20 px-5 md:px-6'>
        <section className='w-full max-w-2xl m-auto'>
          <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Reset Password</h1>
          <p className="text-center">Verifying your reset link...</p>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </section>
      </main>
    );
  }
  
  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Reset Password</h1>

        <p className="text-xl text-center mb-6">
          Enter your new password
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form className="flex flex-col gap-4 md:gap-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative mb-6">
              <input
                type="password" 
                id="new_password" 
                name="new_password" 
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder='New Password'
                className={`w-full max-w-75 block m-auto h-12.5 bg-white border ${
                  passwordErrors.length > 0 ? 'border-red-300' : 'border'
                } rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium`}
                required
              />
              {/* {passwordErrors.length > 0 && (
                <div className="text-xs text-red-500 mt-1 max-w-75 mx-auto">
                  <ul className="list-disc pl-5">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
            
            <input
              type="password" 
              id="confirm_password" 
              name="confirm_password" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder='Confirm Password'
              className={`w-full max-w-75 block m-auto h-12.5 bg-white border ${
                confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border'
              } rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium`}
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1 max-w-75 mx-auto">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:bg-gray-400"
            disabled={isLoading || passwordErrors.length > 0 || newPassword !== confirmPassword}
          >
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;