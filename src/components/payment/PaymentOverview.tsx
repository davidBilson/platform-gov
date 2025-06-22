// components/payment/PaymentOverview.tsx
import { useState, useEffect } from 'react';
// import { getPaymentStatus } from '@/api/payment-api';

export const PaymentOverview = () => {
  const [status, ] = useState({
    available: 0,
    pending: 0,
    inProgress: 0,
    inReview: 0
  });

  useEffect(() => {
    const fetchStatus = async () => {
      // const data = await getPaymentStatus();
      // setStatus(data);
    };
    fetchStatus();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border border-lightblue/20">
        <p className="text-mediumgray">Available</p>
        <p className="text-2xl font-bold text-boldblue">${status.available}</p>
      </div>
      {/* Repeat for pending, inProgress, inReview */}
    </div>
  );
};