import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Define types for form data and errors
type UserType = 'contractor' | 'client';

interface FormData {
  userType: UserType;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface FormErrors {
  email: string;
  phone_number: string;
  password: string;
}

// API response type
interface SignupResponse {
  success: boolean;
  message: string;
  // Add other fields as needed based on your API
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userType: 'contractor',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    phone_number: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validate email with regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  // Validate password - at least 8 characters
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? e.target.value : value
    }));

    // Validate fields as user types
    if (name === 'email') {
      setFormErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }));
    } else if (name === 'phone_number') {
      setFormErrors(prev => ({
        ...prev,
        phone_number: validatePhone(value) ? '' : 'Please enter a valid phone number'
      }));
    } else if (name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        password: validatePassword(value) ? '' : 'Password must be at least 8 characters'
      }));
    }
  };

  // Check if form is valid
  useEffect(() => {
    const { first_name, last_name, email, phone_number, password } = formData;
    const isValid = 
      first_name.trim() !== '' &&
      last_name.trim() !== '' &&
      email.trim() !== '' &&
      phone_number.trim() !== '' &&
      password.trim() !== '' &&
      validateEmail(email) &&
      validatePhone(phone_number) &&
      validatePassword(password);
    
    setIsFormValid(isValid);
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API request - remove the return for actual implementation
      return;
      const response = await axios.post<SignupResponse>('/api/signup', formData);
      console.log('Signup successful:', response.data);
      // Handle successful signup (redirect, show success message, etc.)
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Signup error:', error);
      // Handle errors (display error message, etc.)
      return;
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='pt-10 md:pt-20 px-3 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6 md:mb-10'>Create Account</h1>
        
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
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid #0B5F94',
                  backgroundColor: '#fff',
                  position: 'relative',
                  cursor: 'pointer',
                }}
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
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid #0B5F94',
                  backgroundColor: '#fff',
                  position: 'relative',
                  cursor: 'pointer',
                }}
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
                id="first_name" 
                name="first_name" 
                value={formData.first_name}
                onChange={handleChange}
                placeholder='First name' 
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>

            <div>
              <input 
                type="text" 
                id="last_name" 
                name="last_name" 
                value={formData.last_name}
                onChange={handleChange}
                placeholder='Last name' 
                className='w-full h-[50px] bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium'
                required 
              />
            </div>

            <div className="relative">
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                className={`w-full h-[50px] bg-white border ${formErrors.email && formData.email ? 'border-red-500' : 'border-boldblue'} rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
                required
              />
              {formErrors.email && formData.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <input 
                type="tel" 
                id="phone_number" 
                name="phone_number" 
                value={formData.phone_number}
                onChange={handleChange}
                placeholder='Phone'
                className={`w-full h-[50px] bg-white border ${formErrors.phone_number && formData.phone_number ? 'border-red-500' : 'border-boldblue'} rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
                required 
              />
              {formErrors.phone_number && formData.phone_number && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone_number}</p>
              )}
            </div>
            
            <div className="relative">
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder='Password'
                className={`w-full h-[50px] bg-white border ${formErrors.password && formData.password ? 'border-red-500' : 'border-boldblue'} rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
                required 
              />
              {formErrors.password && formData.password && (
                <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <div className='w-full h-[50px] flex items-center'>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-5 py-[11px] min-w-[120px] ${isFormValid ? 'bg-boldblue' : 'bg-gray-400'} rounded-lg text-white text-sm font-semibold ${isFormValid ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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