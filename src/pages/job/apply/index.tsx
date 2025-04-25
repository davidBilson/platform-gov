import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import React from 'react'
import JobPostApplication from './_jobPostApplication';

const JobApplication = () => {

  const { userId, role } = useAuthStore();

  if (!userId) {
    return <div>
      <p className='text-sm p-6 text-red-500 text-center'>Unauthorized access! Proceed to <Link className='underline font-semibold cursor-pointer' href={"/auth/sign-in"}>Login.</Link></p>
    </div>
  }

  if (userId && role === "client") {
    return <div>
      <p className='text-sm p-6 text-red-500 text-center'>Unauthorized access! Sign up as a contractor to apply.</p>
    </div>
  }
if (userId && role === "contractor") {

  return (
    <>
      <JobPostApplication />
    </>
  )
}
}

export default JobApplication;