// components/Milestones/ContractorMilestones.tsx
import React, { useState, useEffect } from 'react';
import { getMilestones, completeMilestone, 
  // disputeMilestone 
} from '@/api/milestone-api';
import { toast } from 'react-toastify';
// import DisputeModal from './_disputeModal';

interface Milestone {
  _id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
}

const ContractorMilestones = ({ mutualContractId }: { mutualContractId?: string }) => {
  // const [showDisputeModal, setShowDisputeModal] = useState(false);
  // const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const fetchMilestones = async () => {
    try {
      const response = await getMilestones(mutualContractId);
      setMilestones(response.data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast.error('Failed to load milestones');
    }
  };

  useEffect(() => {
    if (mutualContractId) {
      fetchMilestones();
    }
  }, [mutualContractId]);

  const handleComplete = async (milestoneId: string) => {
    try {
      await completeMilestone(mutualContractId, milestoneId);
      await fetchMilestones();
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  // const handleOpenDispute = (milestone: Milestone) => {
  //   setSelectedMilestone(milestone);
  //   setShowDisputeModal(true);
  // };

  // const handleDisputeSubmit = async (reason: string) => {
  //   if (!selectedMilestone) return;
  //   try {
  //     await disputeMilestone(mutualContractId, selectedMilestone._id, reason);
  //     await fetchMilestones();
  //     setShowDisputeModal(false);
  //   } catch (error) {
  //     console.error('Error disputing milestone:', error);
  //   }
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusActions = (milestone: Milestone) => {
    if (milestone.status === 'pending') {
      return (
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => handleComplete(milestone._id)}
            className="px-3 py-1 bg-aquagreen hover:opacity-70 transition duration-300 ease-in-out cursor-pointer  text-white rounded-lg text-sm"
          >
            Mark Complete
          </button>
          {/* <button 
            onClick={() => handleOpenDispute(milestone)}
            className="px-3 py-1 bg-deepskyblue hover:opacity-70 transition duration-300 ease-in-out cursor-pointer  text-skyblue rounded-lg text-sm"

          >
            Dispute
          </button> */}
        </div>
      );
    }
    return null;
  };

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
    
      </section>

      {/* {showDisputeModal && selectedMilestone && (
        <div 
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
          onClick={(e) => e.target === e.currentTarget && setShowDisputeModal(false)}
        >
          <DisputeModal
            milestone={selectedMilestone}
            onClose={() => setShowDisputeModal(false)}
            onSubmit={handleDisputeSubmit}
          />
        </div>
      )} */}
    </>
  );
};

export default ContractorMilestones;