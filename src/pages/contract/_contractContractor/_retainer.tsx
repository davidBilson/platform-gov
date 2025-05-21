import React, { useState, useEffect } from 'react';
import { Jobs } from '@/types/jobs';
import { submitWorkSummary, getRetainerDetails } from '@/api/contract/retainer-api';

interface RetainerProps {
  job: Jobs | null;
  mutualContractId: string;
}

const ContractorRetainer = ({ job, mutualContractId }: RetainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  interface RetainerData {
    nextPaymentDate?: string;
    paymentHistory?: {
      periodStart: string;
      periodEnd: string;
      amount: number;
      status: 'paid' | 'pending';
    }[];
  }

  const [retainerData, setRetainerData] = useState<RetainerData | null>(null);
  const [summaryText, setSummaryText] = useState('');
  const [, setLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (mutualContractId) {
      fetchRetainerData();
    }
  }, [mutualContractId]);

  useEffect(() => {
    if (retainerData?.nextPaymentDate) {
      const now = new Date();
      const paymentDate = new Date(retainerData.nextPaymentDate);
      const diffInHours = (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      setCanSubmit(diffInHours <= 48); // Within 48 hours window
    }
  }, [retainerData]);

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

  const handleSubmitSummary = async () => {
    try {
      await submitWorkSummary(mutualContractId, summaryText);
      setSummaryText('');
      await fetchRetainerData();
    } catch (error) {
      console.error('Error submitting work summary:', error);
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

  // if (loading) {
  //   return <section className="w-full p-6 flex items-center justify-center">
  //     <LoadingAnimation />
  //   </section>
  // }

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
            <p><span className="font-bold">Payment Type:</span> {job?.paymentType}</p>
            <p><span className="font-bold">Amount:</span> ${job?.retainerAmount}</p>
            <p><span className="font-bold">Frequency:</span> {job?.retainerFrequency}</p>
            <p><span className="font-bold">Duration:</span> {job?.retainerDuration}</p>
          </article>
        )}
      </section>

      <div className="bg-lightblue/10 border border-lightblue rounded-lg p-4 mb-6">
          <p className="text-sm text-boldblue">
            📝 Reminder: You are required to submit your Work Summary no later than one day before your 
            next billing date to ensure your payment is processed on time. Failure to do so may result 
            in payment delays.
          </p>
        </div>

      {canSubmit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Describe the work completed during this period..."
            className="w-full p-2 border border-gray-300 rounded mb-3"
            rows={4}
          />
          <button
            onClick={handleSubmitSummary}
            disabled={!summaryText.trim()}
            className={`px-4 py-2 rounded text-sm ${summaryText.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Submit Work Summary
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
          {retainerData?.paymentHistory?.map((payment: { periodStart: string; periodEnd: string; amount: number; status: 'paid' | 'pending'; }, i: number) => (
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

export default ContractorRetainer;