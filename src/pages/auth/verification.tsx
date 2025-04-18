import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // or 'next/navigation' for App Router
import useAuthStore from '@/store/authStore';

const Verification = () => {
  const router = useRouter();
  const { 
    userId, 
    email, 
    phoneNumber, 
    verificationStep, 
    setEmailVerified, 
    setPhoneVerified,
    setVerificationStep
  } = useAuthStore();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Redirect if user hasn't completed the previous steps
  useEffect(() => {
    if (!userId) {
      router.replace('/auth/signup');
    }
  }, [userId, router]);
  
  // Handle verification code input
  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
    // Clear error/success messages when user starts typing
    setError('');
    setSuccess('');
  };
  
  // Handle email verification
  const verifyEmail = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      return setError('Please enter the verification code');
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5050/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          code: verificationCode
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }
      
      // Mark email as verified
      setEmailVerified(true);
      setSuccess('Email verified successfully!');
      setVerificationCode('');
      setVerificationStep('phone');
      
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error.message || 'Email verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sending phone verification code
  const sendPhoneVerification = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5050/api/auth/sendPhoneVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send phone verification code');
      }
      
      setSuccess('Verification code sent to your phone');
      
    } catch (error) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle phone verification
  const verifyPhone = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      return setError('Please enter the verification code');
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5050/api/auth/verifyPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          code: verificationCode
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Phone verification failed');
      }
      
      // Mark phone as verified
      setPhoneVerified(true);
      setSuccess('Phone verified successfully!');
      setVerificationCode('');
      setVerificationStep('completed');
      
    } catch (error) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Phone verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle continue to account creation
  const continueToAccountCreation = (e) => {
    e.preventDefault();
    router.push('/auth/account-setup');
  };
  
  // Handle resend verification code
  const resendVerificationCode = async () => {
    setIsLoading(true);
    
    try {
      // Different endpoints based on verification step
      const endpoint = verificationStep === 'email' 
        ? 'http://localhost:5050/api/auth/resendEmailVerification' 
        : 'http://localhost:5050/api/auth/resendPhoneVerification';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification code');
      }
      
      setSuccess(`Verification code resent to your ${verificationStep === 'email' ? 'email' : 'phone'}`);
      
    } catch (error) {
      console.error('Resend verification error:', error);
      setError(error.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format phone number for display
  const formatPhoneNumber = (phoneNum) => {
    if (!phoneNum) return '';
    const cleaned = ('' + phoneNum).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNum;
  };

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
        
        {verificationStep === 'completed' && (
          <p className="text-xl text-center mb-6">
            Both email and phone verified successfully! Continue to complete your account setup.
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
          {/* Verification code input field - shown for email and phone verification */}
          {(verificationStep === 'email' || (verificationStep === 'phone' && success.includes('sent to your phone'))) && (
            <div className="mb-4">
              <input
                type="text" 
                id="code" 
                name="code"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder='Verification Code'
                className="w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                required
              />
            </div>
          )}
          
          {/* Resend code option */}
          {(verificationStep === 'email' || (verificationStep === 'phone' && success.includes('sent to your phone'))) && (
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
              type="submit"
              onClick={verifyEmail}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          )}
          
          {/* Send phone verification code button */}
          {verificationStep === 'phone' && !success.includes('sent to your phone') && (
            <button
              type="submit"
              onClick={sendPhoneVerification}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : `Send Verification Code to ${formatPhoneNumber(phoneNumber) || "(123) 123-1234"}`}
            </button>
          )}
          
          {/* Phone verification button */}
          {verificationStep === 'phone' && success.includes('sent to your phone') && (
            <button
              type="submit"
              onClick={verifyPhone}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          )}
          
          {/* Continue to account creation button */}
          {verificationStep === 'completed' && (
            <button
              type="submit"
              onClick={continueToAccountCreation}
              className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
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