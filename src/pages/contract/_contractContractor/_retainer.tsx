// this is for retainer contracts
import React from 'react'

const Retainer = () => {
  return (
    <div className="">
    <table className="w-full max-w-151.25 bg-white ">
      <thead>
        <tr className="border-b border-b-boldblue">
          <th className="py-2 px-4 text-left">Week</th>
          <th className="py-2 px-4 text-left">Amount</th>
          <th className="py-2 px-4 text-left">Paid</th>
        </tr>
      </thead>
      <tbody className='text-sm'>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-b border-b-lightblue py-2.5 mb-2.5">
            <td className="py-2.5">11/12/2025 - 12/30/2025</td>
            <td className="py-2.5">$500</td>
            <td className="py-2.5">
              <span className="text-green-500">✓</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Retainer