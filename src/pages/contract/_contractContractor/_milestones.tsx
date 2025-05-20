// CONTRACTOR
import React, { useState, useEffect } from 'react';
import { getMilestones, completeMilestone } from '@/api/contract/milestone-api';

interface Milestone {
  _id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface ContractorMilestonesProps {
  mutualContractId?: string;
  clientId?: string;
  contractorId?: string;
  jobId?: string;
}

const ContractorMilestones = ({ 
  mutualContractId,
}: ContractorMilestonesProps) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

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
    fetchMilestones();
  }, [mutualContractId]);

  const handleComplete = async (milestoneId: string) => {
    try {
      if (mutualContractId) {
        await completeMilestone(mutualContractId, milestoneId);
        await fetchMilestones();
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (!mutualContractId) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No mutual contract established yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Milestone tracking will be available once the client creates a contract
        </p>
      </section>
    );
  }

  if (milestones.length === 0) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No milestones created yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          The client {"hasn't"} created any milestones for this contract
        </p>
      </section>
    );
  }

  return (
    <>
      <section>
        <h2 className='font-semibold text-xl mb-7.5'>Milestone timeline</h2>
        
        <section className='flex items-start flex-col gap-5'>
          {milestones.map((milestone) => (
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
              {milestone.status === 'pending' && (
                <button 
                  onClick={() => handleComplete(milestone._id)}
                  className="px-3 py-1 bg-aquagreen hover:opacity-70 transition text-white rounded-lg text-sm mt-2"
                >
                  Mark Complete
                </button>
              )}
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default ContractorMilestones;