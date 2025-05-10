// components/Milestones/ClientMilestones.tsx
import React, { useState, useEffect } from 'react';
// import { LuTrash } from "react-icons/lu";
import AddNewMilestoneModal from './_addMilestoneModal';
import { getMilestones, approveMilestone, markMilestonePaid, 
  // disputeMilestone 
} from '@/api/milestone-api';
import { toast } from 'react-toastify';
// import DisputeModal from './_disputeModal';
import useAuthStore from '@/store/useAuth';

interface Milestone {
  _id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  completionDate?: string;
}

const ClientMilestones = ({ mutualContractId }: { mutualContractId: string }) => {
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  // const [showDisputeModal, setShowDisputeModal] = useState(false);
  // const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const { role } = useAuthStore()

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

  const handleApprove = async (milestoneId: string) => {
    try {
      await approveMilestone(mutualContractId, milestoneId);
      await fetchMilestones();
    } catch (error) {
      console.error('Error approving milestone:', error);
    }
  };

  const handleMarkPaid = async (milestoneId: string) => {
    try {
      await markMilestonePaid(mutualContractId, milestoneId);
      await fetchMilestones();
    } catch (error) {
      console.error('Error marking milestone as paid:', error);
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
    switch (milestone.status) {
      case 'completed':
        return (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleApprove(milestone._id)}
              className="px-3 py-1 bg-aquagreen text-white rounded text-sm"
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
      case 'approved':
        return (
          <button 
            onClick={() => handleMarkPaid(milestone._id)}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm mt-2"
          >
            Mark as Paid
          </button>
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
                    {/* <button className='w-fit h-fit'>
                      <LuTrash size={20} />
                    </button> */}
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

        {role === 'client' && (
          <button 
            onClick={() => setShowNewMilestoneModal(true)}
            className='transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer
            bg-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold mt-5'
          >
            Add Milestone
          </button>
        )}
      </section>

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

export default ClientMilestones;