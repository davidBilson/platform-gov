import Link from 'next/link'
import React from 'react'

const BankDetailsLink = () => {
  return (
    <Link className='cursosr-pointer bg-aquagreen/10 text-aquagreen rounded-lg px-2 py-1' href={'/payment/payout-setup'}>Setup Bank Account for Receiving Payments</Link>
)
}

export default BankDetailsLink