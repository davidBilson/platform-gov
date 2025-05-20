import React, { useState, useEffect } from 'react';
import { Job } from '@/types/jobs';
import { submitWorkSummary, getRetainerDetails } from '@/api/contract/retainer-api';


interface RetainerProps {
  job: Job;
  mutualContractId: string;
}

const ClientRetainer = ({ job, mutualContractId }: RetainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [retainerData, setRetainerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mutualContractId) {
      fetchRetainerData();
    }
  }, [mutualContractId]);

  const fetchRetainerData = async () => {
    try {
      const data = await getRetainerDetails(mutualContractId);
      setRetainerData(data);
    } catch (error) {
      console.error('Error fetching retainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRetainer = async () => {
    try {
      await startRetainerContract(mutualContractId);
      await fetchRetainerData();
    } catch (error) {
      console.error('Error starting retainer:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPeriod = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <section className="w-full">
      <section className="relative mb-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="bg-skyblue border border-boldblue text-boldblue w-30 px-2 py-1 rounded-sm outline-none hover:opacity-70 transition duration-300 ease-in-out cursor-pointer text-xs"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-4">
            ⚠️ Important: Clicking the {'"Start Job"'} button below will activate this retainer contract. 
            From that moment, your billing cycle begins based on the agreed frequency — whether weekly, 
            bi-weekly, or monthly — and you will be automatically charged at the end of each billing period.
          </p>
          <button
            onClick={handleStartRetainer}
            className="bg-boldblue hover:bg-boldblue text-white px-4 py-2 rounded text-sm"
          >
            Start Job
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
          {retainerData?.paymentHistory?.map((payment: any, i: number) => (
            <tr key={i} className="border-b border-b-lightblue py-2.5 mb-2.5">
              <td className="py-2.5 px-4">
                {formatPeriod(payment.periodStart, payment.periodEnd)}
              </td>
              <td className="py-2.5 px-4">${payment.amount}</td>
              <td className="py-2.5 px-4">
                <span className={`${payment.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {payment.status === 'paid' ? '✓ Paid' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ClientRetainer;