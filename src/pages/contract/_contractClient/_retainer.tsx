import React, { useState, useEffect } from 'react';
import { 
  startRetainerContract, 
  getRetainerDetails,
  RetainerData,
  RetainerPaymentHistory
} from '@/api/contract/retainer-api';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

interface Job {
  _id: string;
  paymentType: string;
  retainerAmount: number;
  retainerFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  retainerDuration: string;
}

interface RetainerProps {
  job: Job;
  mutualContractId: string;
}

const ClientRetainer = ({ job, mutualContractId }: RetainerProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [retainerData, setRetainerData] = useState<RetainerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [starting, setStarting] = useState<boolean>(false);
  const { userId } = useAuthStore();

  // Fetch retainer data when component mounts or contract ID changes
  useEffect(() => {
    if (mutualContractId) {
      fetchRetainerData();
    } else {
      setLoading(false);
    }
  }, [mutualContractId]);

  const fetchRetainerData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getRetainerDetails(mutualContractId, userId);
      setRetainerData(data);
    } catch (error) {
      console.error('Error fetching retainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRetainer = async (): Promise<void> => {
    
    if (!mutualContractId) {
      toast.warn('contractor has not signed contract');
      return;
    };
    
    try {
      setStarting(true);
      await startRetainerContract(mutualContractId, userId);
      await fetchRetainerData();
    } catch (error) {
      console.error('Error starting retainer:', error);
    } finally {
      setStarting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      console.log(e)
      return 'Invalid date';
    }
  };

  const formatPeriod = (start: string, end: string): string => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <section className="w-full p-6 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <section className="relative mb-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="bg-skyblue border border-lightblue text-boldblue w-30 px-2 py-1 rounded-sm outline-none hover:opacity-70 transition duration-300 ease-in-out cursor-pointer text-xs"
        >
          {showDetails ? 'Hide Job Details' : 'View Job Details'}
        </button>
        
        {showDetails && (
          <article className="border border-boldblue w-fit h-fit text-sm text-boldblue p-3 rounded-sm absolute top-10 z-10 bg-white flex flex-col gap-2">
            <p><span className="font-bold">Payment Type:</span> {job.paymentType}</p>
            <p><span className="font-bold">Amount:</span> ${job.retainerAmount}</p>
            <p><span className="font-bold">Frequency:</span> {job.retainerFrequency}</p>
            <p><span className="font-bold">Duration:</span> {job.retainerDuration}</p>
          </article>
        )}
      </section>

      {!retainerData?.startDate && (
        <div className="bg-lightblue/10 border border-lightblue rounded-lg p-4 mb-6">
          <p className="text-sm text-boldblue mb-4">
            ⚠️ Important: Clicking the {'"Start Job"'} button below will activate this retainer contract. 
            From that moment, your billing cycle begins based on the agreed frequency — whether weekly, 
            bi-weekly, or monthly — and you will be automatically charged at the end of each billing period.
          </p>
          <button
            onClick={handleStartRetainer}
            disabled={starting}
            className={`cursor-pointer ${
              starting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-boldblue hover:opacity-70'
            } text-white px-4 py-2 rounded text-sm transition duration-300 ease-in-out`}
          >
            {starting ? 'Starting...' : 'Start Job'}
          </button>
        </div>
      )}

      <table className="w-full bg-white">
        <thead>
          <tr className="border-b border-b-boldblue">
            <th className="py-2 px-4 text-left">Billing Period</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {retainerData?.paymentHistory && retainerData.paymentHistory.length > 0 ? (
            retainerData.paymentHistory.map((payment: RetainerPaymentHistory, i: number) => (
              <tr key={i} className="border-b border-b-lightblue py-2.5 mb-2.5">
                <td className="py-2.5 px-4">
                  {formatPeriod(payment.periodStart, payment.periodEnd)}
                </td>
                <td className="py-2.5 px-4">${payment.amount}</td>
                <td className="py-2.5 px-4">
                  <span className={`${
                    payment.status === 'paid' || payment.status === 'completed'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }`}>
                    {payment.status === 'paid' || payment.status === 'completed' ? '✓ Paid' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-500">
                No payment history available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default ClientRetainer;