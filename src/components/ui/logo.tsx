import React from 'react';
import Image from 'next/image';
import GovlinkLogo from '@/assets/logo.svg'
import Link from 'next/link';


const Logo = () => {
  return (
    <Link href='/' className='flex items-center'>
      <Image src={GovlinkLogo} alt='GovLink Global' width={80} height={90} />
    </Link>
  )
}

export default Logo;