import React from 'react'
import Logo from './logo'

const LoadingAnimation = () => {
  return (
    <div className='flex items-center justify-center animate-pulse h-full w-full'>
        <Logo />
    </div>
  )
}

export default LoadingAnimation