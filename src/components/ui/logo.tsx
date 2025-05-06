import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GovlinkLogo from '@/assets/logo.svg'


const Logo = () => {
  return (
    <Link href='/' className='flex items-center'>
      <Image src={GovlinkLogo} alt='GovLink Global' width={80} height={90} />
    </Link>
  )
}

export default Logo;