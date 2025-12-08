import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import useAuthStore from '@/store/useAuth';
import { SignupFormData, SignupApiResponse, ErrorResponse } from '@/types/auth/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PhoneInput from '@/components/PhoneInput';

const Signup = () => {

  const router = useRouter();

  const { type } = router.query;

  const { setFormData: setStoreFormData, setUserId, setVerificationStep } = useAuthStore();

  const [formData, setLocalFormData] = useState<SignupFormData>({
    role: 'contractor',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    console.log("Phone Number: ", formData.phoneNumber)
  }, [formData.phoneNumber])

  useEffect(() => {
    if (type === 'client') {
      setLocalFormData((prev) => ({
        ...prev,
        role: type
      }))
    }
  }, [type])

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

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {

      const formDataForStore = {
        role: formData.role,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };

      setStoreFormData(formDataForStore);

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
          role: formData.role,
        }
      );

      const responseData = res.data;

      if (responseData.data?.userId) {

        setUserId(responseData.data.userId);

        setStoreFormData({
          ...formDataForStore,
          userId: responseData.data.userId,
        });
        setVerificationStep('email');

        await router.push('/account/verification');

        return;
      }

      if (!responseData.data?.userId) {
        console.warn('Response received but userId is missing:', responseData);
        setErrorMessage('Account creation failed. Please try again.');
        setIsSubmitting(false);
      }

    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const errorResponseData = axiosError.response.data as ErrorResponse;
          const errorMsg = errorResponseData.message || 'An error occurred during signup';
          setErrorMessage(errorMsg);

          // Show toast for server errors
          if (axiosError.response.status >= 500) {
            toast.error('Server error. Please try again later.');
          }
        } else if (axiosError.request) {
          const errorMsg = 'No response from server. Please check your connection.';
          setErrorMessage(errorMsg);
          toast.error('Connection error. Please check your internet connection.');
        } else {
          const errorMsg = 'Failed to process your request. Please try again.';
          setErrorMessage(errorMsg);
          toast.error('Request failed. Please try again.');
        }
      } else {
        const err = error as Error;
        const errorMsg = err.message || 'An unexpected error occurred';
        setErrorMessage(errorMsg);
        toast.error('An unexpected error occurred. Please try again.');
      }

      setIsSubmitting(false);
    }
  };

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
    <main className='pt-10 pb-20 md:pt-20 px-5 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6 md:mb-10'>Create Account</h1>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div className='flex items-center justify-center gap-10 md:gap-20 mb-6 md:mb-10'>
            <label className='flex items-center gap-1.25'>
              <input
                type="radio"
                name="role"
                value="contractor"
                checked={formData.role === 'contractor'}
                onChange={handleChange}
                style={radioStyle}
                className="checked:after:content-[''] checked:after:absolute checked:after:top-[3px] checked:after:left-[3px] checked:after:w-[12px] checked:after:h-[12px] checked:after:rounded-full checked:after:bg-boldblue"
              />
              <span className='text-sm'>
                Consultant
              </span>
            </label>
            <label className='flex items-center gap-1.25'>
              <input
                type="radio"
                name="role"
                value="client"
                checked={formData.role === 'client'}
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
                className='w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
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
                className='w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
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
                className='w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
                required
              />
            </div>

            <div>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(value) => {
                  setLocalFormData(prev => ({
                    ...prev,
                    phoneNumber: value
                  }));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder='Phone'
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
                placeholder='Password (min 6 characters)'
                className='w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
                required
                minLength={6}
              />
            </div>

            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm password'
                className='w-full h-12.5 bg-white border border-boldblue rounded-lg py-4 pl-5 text-boldblue text-sm font-medium focus:outline focus:outline-boldblue placeholder:font-medium'
                required
              />
            </div>

            <div className='md:col-span-2 w-full h-12.5 flex items-center justify-center'>
              <button
                type="submit"
                disabled={isSubmitting}
                className='cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out px-5 py-[11px] min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold disabled:opacity-70'
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>

          <p className='text-center text-xs md:text-sm font-medium'>Already have an account? <Link href="/account/sign-in" className='text-boldblue underline cursor-pointer'>Sign in</Link></p>
        </form>
      </section>
    </main>
  );
};

export default Signup;