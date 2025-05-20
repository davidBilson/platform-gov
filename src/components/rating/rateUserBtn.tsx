import useAuthStore from '@/store/useAuth'
import React from 'react'

const RateUserBtn = () => {

  const { userId, role } = useAuthStore();

  return (
    <button 
    className="bg-deepskyblue  text-sm text-white font-semibold py-3 px-10 rounded-full transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer">
    Rate this {userId && role == 'contractor' ? 'Client' : 'Contractor'}
  </button> 
  )
}

export default RateUserBtn