// client
// components/Milestones/ClientMilestones.tsx
import React, { useState, useEffect } from 'react';
// import { LuTrash } from "react-icons/lu";
import AddNewMilestoneModal from './_addMilestoneModal';
import { getMilestones, approveMilestone, markMilestonePaid } from '@/api/contract/milestone-api';
// import DisputeModal from './_disputeModal';
import useAuthStore from '@/store/useAuth';
import { endContract } from '@/api/contract/contract-api';
import PaymentModal from '@/components/payment/PaymentModal';
import FundProjectBtn from '@/components/payment/FundProjectBtn';

interface Milestone {
  _id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  completionDate?: string;
}

const ClientMilestones = ({ jobIsFunded, jobId, mutualContractId, contractStatus }: { jobId: string; jobIsFunded?: boolean; mutualContractId?: string; contractStatus: string; }) => {
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const { role, userId } = useAuthStore()
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchMilestones = async () => {
    try {
      if (mutualContractId) {
        const response = await getMilestones(mutualContractId);
        setMilestones(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  useEffect(() => {
    if (mutualContractId) {
      fetchMilestones();
    }
  }, [mutualContractId]);

  const handleApprove = async (milestoneId: string) => {
    try {
      if (mutualContractId) {
        await approveMilestone(mutualContractId, milestoneId);
        await fetchMilestones();
      }
    } catch (error) {
      console.error('Error approving milestone:', error);
    }
  };

  const handleMarkPaid = async (milestoneId: string) => {
    try {
      if (mutualContractId) {
        await markMilestonePaid(mutualContractId, milestoneId);
        await fetchMilestones();
      }
    } catch (error) {
      console.error('Error marking milestone as paid:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusActions = (milestone: Milestone) => {
    switch (milestone.status) {
      case 'completed':
        return (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleApprove(milestone._id)}
              className="px-3 py-1 bg-aquagreen text-white rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
            >
              Approve
            </button>
            {/* <button 
              onClick={() => handleOpenDispute(milestone)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Dispute
            </button> */}
          </div>
        );
      // case 'approved':
      //   return (
      //     <button 
      //       onClick={() => handleMarkPaid(milestone._id)}
      //       className="px-3 py-1 bg-purple-500 text-white rounded text-sm mt-2 hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
      //     >
      //       Mark as Paid
      //     </button>
      //   );
      case 'pending':
        return milestone.completionDate && (
          <p className="text-xs text-gray-500 mt-1">
            Completed on {formatDate(milestone.completionDate)}
          </p>
        );
      default:
        return null;
    }
  };

  if (!mutualContractId) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No mutual contract established yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">Milestone tracking will be available once the contractor accepts the contract</p>
      </section>
    );
  }

  return (
    <>
      <section>
        <h2 className='font-semibold text-xl mb-7.5'>Milestone timeline</h2>
 
          <section className='flex items-start flex-col gap-5'>
            {milestones.length > 0 ? (
              milestones.map((milestone) => (
                <div key={milestone._id} className='flex flex-col items-start gap-2.5 w-full'>
                  <div className='flex items-center justify-between w-full border-b border-b-lightblue pb-2.5'>
                    <h3 className='font-semibold'>{milestone.name}</h3>
                  </div>
                  {milestone.description && <p className='text-sm'>{milestone.description}</p>}
                  <p>${milestone.amount.toFixed(2)}</p>
                  <p className='font-semibold text-sm'>Due {formatDate(milestone.dueDate)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    milestone.status === 'completed' ? 'bg-blue-100 text-boldblue' :
                    milestone.status === 'approved' ? 'bg-green-100 text-aquagreen' :
                    milestone.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {milestone.status}
                  </span>
                  {getStatusActions(milestone)}
                </div>
              ))
            ) : (
              <p>No milestones yet</p>
            )}
          </section>

        {role === 'client' && jobIsFunded && contractStatus !== 'completed' && (
          <button 
            disabled={contractStatus === 'completed' && true}
            onClick={() => setShowNewMilestoneModal(true)}
            className='disabled:cursor-not-allowed disabled:opacity-70 transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer
            bg-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold mt-5'
          >
            { contractStatus === 'completed' ? 'Contract Completed' : 'Add Milestone' }
          </button>
        )}
      </section>
      
      {!jobIsFunded &&
      <>
        <p>Fund project before you can start contract</p>
        <FundProjectBtn onClick={() => setShowPaymentModal(true)} />
      </>
      }
      {contractStatus === 'completed' && <p className="text-aquagreen mt-7">This contract has ended</p>}
      {contractStatus !== 'completed' && jobIsFunded &&
        <button
          disabled={!jobIsFunded}
          onClick={() => endContract(mutualContractId, userId)}
          className="disabled:cursor-not-allowed disabled:opacity-50 mt-7.5 px-3 py-2 bg-red-700 text-white shadow-lg rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
        >
          End Contract
        </button>
      }

      {showPaymentModal && (
        <PaymentModal
          jobId={jobId}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showNewMilestoneModal && (
        <div 
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
          onClick={(e) => e.target === e.currentTarget && setShowNewMilestoneModal(false)}
        >
          <AddNewMilestoneModal 
            contractId={mutualContractId} 
            onClose={() => setShowNewMilestoneModal(false)} 
            onMilestoneAdded={fetchMilestones}
          />
        </div>
      )}
    </>
  );
};

export default ClientMilestones;