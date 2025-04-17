// src/pages/auth/signin.tsx or src/app/auth/signin/page.tsx
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { LoginFormData, FormErrors } from '@/types/auth';
import { validateEmail } from '@/utils/validation';
import { useLoginFormValidation } from '@/hooks/useLoginFormValidation';
import { loginUser } from '@/services/authService';

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    phone_number: '', // Included to match the type but not used in login
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Use custom hook for form validation
  const isFormValid = useLoginFormValidation(formData, formErrors);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate fields as user types
    if (name === 'email') {
      setFormErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }));
    } else if (name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        password: value.length > 0 ? '' : 'Password is required'
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      await loginUser(formData);
      // Handle successful login (redirect to dashboard, etc.)
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show error message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='pt-10 md:pt-20 px-3 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6 md:mb-10'>Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-10">
          <input
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className={`w-full max-w-[300px] m-auto h-[50px] bg-white border ${formErrors.email && formData.email ? 'border-red-500' : 'border-boldblue'} rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
            required
          />
          
          <input
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className={`w-full max-w-[300px] m-auto h-[50px] bg-white border ${formErrors.password && formData.password ? 'border-red-500' : 'border-boldblue'} rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
            required 
          />
          
          <div className='w-full flex flex-col gap-4 mt-2'>
            <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer`}
              >
              {isSubmitting ? 'Please wait...' : 'Login'}
            </button>
            
            <div className="text-center mt-5">
              <Link href="/auth/forgot-password" className='text-xs md:text-sm font-medium text-boldblue underline cursor-pointer'>
                Forgot Password?
              </Link>
            </div>
            
            <p className='text-center text-xs md:text-sm font-medium mt-2'>
              {"Don't"} have an account yet? <Link href="/auth/sign-up" className='text-boldblue underline cursor-pointer'>Create Account</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;