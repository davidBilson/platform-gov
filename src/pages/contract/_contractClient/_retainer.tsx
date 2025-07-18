import React, { useState, useEffect } from 'react';
import {
  startRetainerContract,
  getRetainerDetails,
  RetainerData,
} from '@/api/contract/retainer-api';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';
import { getRetainerContractPayments } from '@/api/payment/time-and-commission-based-payment';

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
  contractStatus: string;
  initializeContract: any;
  // Add new prop for refreshing payments
  refreshTrigger?: number;
}

interface PaymentTransaction {
  id: string;
  type: string;
  amount: number;
  netAmount: number;
  fee: number;
  status: string;
  createdAt: string;
  description: string;
}

const ClientRetainer = ({ 
  job, 
  mutualContractId, 
  contractStatus, 
  initializeContract,
  refreshTrigger = 0 
}: RetainerProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [retainerData, setRetainerData] = useState<RetainerData | null>(null);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [starting, setStarting] = useState<boolean>(false);
  const { userId } = useAuthStore();

  useEffect(() => {
    console.log(contractStatus);
  }, [contractStatus])

  const fetchPaymentTransactions = async () => {
    if (!mutualContractId) return;
    
    try {
      const paymentsData = await getRetainerContractPayments(mutualContractId);
      setPaymentTransactions(paymentsData.data.transactions || []);
    } catch (error) {
      console.error('Error fetching payment transactions:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (mutualContractId) {
        try {
          setLoading(true);
          
          const [paymentsData, ] = await Promise.all([
            getRetainerContractPayments(mutualContractId),
            fetchRetainerData()
          ]);

          setPaymentTransactions(paymentsData.data.transactions || []);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [mutualContractId]);

  useEffect(() => {
    if (refreshTrigger > 0 && mutualContractId) {
      fetchPaymentTransactions();
    }
  }, [refreshTrigger, mutualContractId]);

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
      initializeContract;
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

  const getStatusDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  // Filter to only show completed transactions
  const completedTransactions = paymentTransactions.filter(
    transaction => transaction.status.toLowerCase() === 'completed'
  );

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

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="border-b border-b-deepskyblue">
            <tr>
              <th className="py-3 px-2 sm:px-4 text-left text-boldblue font-semibold text-sm">
                <span className="block sm:hidden">Desc.</span>
                <span className="hidden sm:block">Description</span>
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-boldblue font-semibold text-sm">Amount</th>
              <th className="py-3 px-2 sm:px-4 text-left text-boldblue font-semibold text-sm">Status</th>
              <th className="py-3 px-2 sm:px-4 text-left text-boldblue font-semibold text-sm">
                <span className="block sm:hidden">Date</span>
                <span className="hidden sm:block">Date</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {completedTransactions && completedTransactions.length > 0 ? (
              completedTransactions.map((transaction: PaymentTransaction, index: number) => (
                <tr key={transaction.id} className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}>
                  <td className="py-3 px-2 sm:px-4 text-boldblue">
                    <div className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-semibold text-boldblue">
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status.toLowerCase() === 'completed' 
                        ? 'bg-aquagreen/10 text-aquagreen border border-aquagreen/20' 
                        : transaction.status.toLowerCase() === 'pending'
                        ? 'bg-faintskyblue text-deepskyblue border border-faintskyblue/20'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {getStatusDisplay(transaction.status)}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-boldblue">
                    <div className="text-xs sm:text-sm">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-boldblue/60">
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="w-8 h-8 text-boldblue/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">No completed payment transactions available</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {contractStatus === 'completed' &&
        <p className="text-aquagreen">This contract has ended</p>
      }
    </section>
  );
};

export default ClientRetainer;