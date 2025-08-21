import { BanknoteIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BankDetailsLink = () => {
  return (
    <Link className='cursosr-pointer bg-aquagreen/20 hover:bg-aquagreen/10 text-aquagreen rounded-lg px-5 py-3 flex items-center gap-3 w-fit h-fit' href={'/payment/payout-setup'}>
      Setup Bank Account for Receiving Payments <BanknoteIcon />
    </Link>
  )
}

export default BankDetailsLink