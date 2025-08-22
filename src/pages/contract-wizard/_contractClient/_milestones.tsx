// Add this debug version to help identify the exact issue
import React, { useState, useEffect } from 'react';
import AddNewMilestoneModal from './_addMilestoneModal';
import { getMilestones, approveMilestone } from '@/api/contract/milestone-api';
import useAuthStore from '@/store/useAuth';
import { endContract } from '@/api/contract/contract-api';
import PaymentModal from '@/components/payment/PaymentModal';

interface Milestone {
  _id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  completionDate?: string;
}

const ClientMilestones = ({
  jobId,
  mutualContractId,
  contractStatus,
  isLoading = false
}: {
  jobId: string;
  mutualContractId?: string;
  contractStatus: string;
  isLoading?: boolean;
}) => {
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneFetchAttempted, setMilestoneFetchAttempted] = useState(false);
  const { role, userId } = useAuthStore()
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // DEBUG: Log all props changes
  useEffect(() => {
    console.log('🔍 ClientMilestones Props Debug:', {
      jobId,
      mutualContractId,
      contractStatus,
      isLoading,
      milestoneFetchAttempted
    });
  }, [jobId, mutualContractId, contractStatus, isLoading, milestoneFetchAttempted]);

  const fetchMilestones = async () => {
    console.log('🚀 Attempting to fetch milestones for contractId:', mutualContractId);
    
    if (!mutualContractId) {
      console.log('❌ No mutualContractId provided, skipping fetch');
      return;
    }

    try {
      setMilestoneFetchAttempted(true);
      console.log('📡 Making API call to getMilestones...');
      
      const response = await getMilestones(mutualContractId);
      console.log('📦 getMilestones response:', response);
      
      const milestonesData = response.data || [];
      console.log('✅ Setting milestones:', milestonesData);
      
      setMilestones(milestonesData);
    } catch (error) {
      console.error('💥 Error fetching milestones:', error);
      // Reset fetch attempted flag on error so user can try again
      setMilestoneFetchAttempted(false);
    }
  };

  // Main effect to fetch milestones when mutualContractId becomes available
  useEffect(() => {
    console.log('🔄 useEffect triggered - mutualContractId:', mutualContractId);
    
    if (mutualContractId && !milestoneFetchAttempted) {
      console.log('✨ Conditions met, calling fetchMilestones');
      fetchMilestones();
    } else if (!mutualContractId) {
      console.log('⏳ Waiting for mutualContractId...');
      // Reset milestones if no contract ID
      setMilestones([]);
      setMilestoneFetchAttempted(false);
    } else if (milestoneFetchAttempted) {
      console.log('⚠️ Fetch already attempted, skipping...');
    }
  }, [mutualContractId]);

  // Separate effect to handle re-fetching when needed
  useEffect(() => {
    if (mutualContractId && milestoneFetchAttempted && milestones.length === 0) {
      console.log('🔁 Re-attempting milestone fetch due to empty results');
      setTimeout(() => {
        setMilestoneFetchAttempted(false);
      }, 1000); // Small delay before allowing retry
    }
  }, [mutualContractId, milestoneFetchAttempted, milestones.length]);

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
          </div>
        );
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

  // Show loading state
  if (isLoading) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">Loading contract details...</p>
        <div className="text-center text-xs text-gray-400 mt-2">
          Debug: isLoading={isLoading ? 'true' : 'false'}, contractId={mutualContractId || 'null'}
        </div>
      </section>
    );
  }

  // Show when no contract established
  if (!mutualContractId) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No mutual contract established yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Milestone tracking will be available once the contractor accepts the contract
        </p>
        <div className="text-center text-xs text-gray-400 mt-2">
          Debug: contractId={mutualContractId || 'null'}, attempted={milestoneFetchAttempted ? 'true' : 'false'}
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <h2 className='font-semibold text-xl mb-7.5'>Milestone timeline</h2>
        
        <div className="text-xs text-gray-400 mb-4">
          Debug: contractId={mutualContractId}, milestones={milestones.length}, 
          attempted={milestoneFetchAttempted ? 'true' : 'false'}
        </div>

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
            <div>
              <p>No milestones yet</p>
              {/* {milestoneFetchAttempted && (
                <button 
                  onClick={() => {
                    setMilestoneFetchAttempted(false);
                    setTimeout(fetchMilestones, 100);
                  }}
                  className="text-xs text-blue-500 underline mt-2"
                >
                  Retry fetching milestones
                </button>
              )} */}
            </div>
          )}
        </section>

        {role === 'client' && contractStatus !== 'completed' && (
          <button
            disabled={contractStatus === 'completed'}
            onClick={() => setShowNewMilestoneModal(true)}
            className='disabled:cursor-not-allowed disabled:opacity-70 transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer
            bg-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold mt-5'
          >
            {contractStatus === 'completed' ? 'Contract Completed' : 'Add Milestone'}
          </button>
        )}
      </section>

      {contractStatus === 'completed' && <p className="text-aquagreen mt-7">This contract has ended</p>}

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