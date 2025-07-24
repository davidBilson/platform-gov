'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import GovlinkLogo from '@/assets/logo.svg';
import useAuthStore from '@/store/useAuth';

const Logo = () => {
  const router = useRouter();
  const { userId } = useAuthStore();;

  const handleClick = () => {
    if (userId) {
      router.push('/feed');
      return;
    }
    router.push('/');
  };

  return (
    <div onClick={handleClick} className='flex items-center cursor-pointer'>
      <Image src={GovlinkLogo} alt='GovLink Global' width={80} height={90} />
    </div>
  );
};

export default Logo;
