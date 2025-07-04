import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/useAuth';
import { SignInFormData } from '@/types/auth/auth';
import { signInUser } from '@/api/auth-api';

const SignIn = () => {
  
  const router = useRouter();
  const { setUserId, setFormData, setEmailVerified, setPhoneVerified } = useAuthStore();
  
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const result = await signInUser(formData);
      
      if (!result.success) {
        setErrorMessage(result.error || 'Sign in failed');
        return;
      }
      
      if (result.data?.user.isSuspended) {
        setErrorMessage('Your account is suspended. Please contact support.');
        return;
      }

      if (!result.data?.user) {
        setErrorMessage('Invalid response from server');
        return;
      }

      if (!result.data?.user) {
        setErrorMessage('Invalid response from server');
        return;
      }
      
      const userData = result.data.user;
      
      setUserId(userData._id);

      setFormData({
        name: userData.name,
        role: userData.role,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        userId: userData._id
      });
      
      setEmailVerified(userData.isEmailVerified);
      setPhoneVerified(userData.isPhoneVerified);
      

      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.isEmailVerified) {
        router.push('/');
      } else if (!userData.isEmailVerified) {
        router.push('/account/verification');
      }
      
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='pt-10 pb-20 md:pt-20 px-5 md:px-6'>
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
            className='w-full max-w-75 m-auto h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
            required 
          />
          
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full max-w-75 m-auto h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
            required 
          />
          
          <div className='w-full flex flex-col gap-4 mt-2'>
            <button
              type="submit"
              disabled={isSubmitting}
              className='cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold disabled:opacity-70'
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center mt-2">
              <Link href="/account/forgot-password" className='text-xs md:text-sm font-medium text-boldblue underline cursor-pointer'>
                Forgot Password?
              </Link>
            </div>
            
            <p className='text-center text-xs md:text-sm font-medium mt-2'>
              {"Don't"} have an account? <Link href="/account/sign-up" className='text-boldblue underline cursor-pointer'>Create Account</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignIn;