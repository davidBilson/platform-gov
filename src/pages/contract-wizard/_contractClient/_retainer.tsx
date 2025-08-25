import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimesheetLogs,
  approveTimesheetEntry,
  disputeTimesheetEntry
} from '@/api/contract/timesheet-api';
import { getSingleContract, endContract } from '@/api/contract/contract-api';
import { formatDuration } from '@/utils/contract/format';
import { LuClock } from 'react-icons/lu';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

interface Job {
  _id: string;
  paymentType: string;
  retainerAmount: number;
  retainerFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  retainerDuration: string;
}

interface WorkSession {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  status: 'pending' | 'approved' | 'disputed' | 'active';
}

interface RetainerProps {
  job: Job;
  mutualContractId: string;
  contractStatus: string;
  contractStarted?: boolean;
  refetchContract: any;
}

const ClientRetainer = ({ 
  job, 
  mutualContractId, 
  contractStatus,
  contractStarted,
  refetchContract
}: RetainerProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputingSessionId, setDisputingSessionId] = useState<string | null>(null);
  // Add state to track which approve button is loading
  const [approvingSessionId, setApprovingSessionId] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    refetchContract();
  }, []);

  // Query for contract data
  const { data: contractData, isLoading: contractLoading } = useQuery({
    queryKey: ['contract', mutualContractId],
    queryFn: async () => {
      if (!mutualContractId) return null;
      const response = await getSingleContract({ mutualContractId });
      return response.success ? response.data : null;
    },
    enabled: !!mutualContractId,
    staleTime: 30000,
  });

  // Query for timesheet sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<WorkSession[]>({
    queryKey: ['timesheet-logs', mutualContractId],
    queryFn: async (): Promise<WorkSession[]> => {
      if (!mutualContractId) return [];
      const response = await getTimesheetLogs(mutualContractId);
      return (response.data || []).filter((s: WorkSession) => s.status !== 'active');
    },
    enabled: !!mutualContractId,
    staleTime: 10000, // 10 seconds
  });

  // Mutation for approving timesheet entry
  const approveMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!mutualContractId || !userId) throw new Error('Missing required data');
      setApprovingSessionId(sessionId);
      return await approveTimesheetEntry(mutualContractId, sessionId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheet-logs', mutualContractId] });
      setApprovingSessionId(null);
      refetchContract();
    },
    onError: (error) => {
      console.error('Error approving session:', error);
      setApprovingSessionId(null);
    }
  });

  // Mutation for disputing timesheet entry
  const disputeMutation = useMutation({
    mutationFn: async ({ sessionId, reason }: { sessionId: string; reason: string }) => {
      if (!mutualContractId || !userId) throw new Error('Missing required data');
      return await disputeTimesheetEntry(mutualContractId, sessionId, reason, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheet-logs', mutualContractId] });
      setDisputingSessionId(null);
      setDisputeReason('');
    },
    onError: (error) => {
      console.error('Error disputing session:', error);
    }
  });

  // Mutation for ending contract
  const endContractMutation = useMutation({
    mutationFn: async () => {
      if (!mutualContractId || !userId) throw new Error('Missing required data');
      return await endContract(mutualContractId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', mutualContractId] });
    },
    onError: (error) => {
      console.error('Error ending contract:', error);
      toast.error('Failed to end contract');
    }
  });

  const handleApprove = (sessionId: string) => {
    approveMutation.mutate(sessionId);
  };

  const handleDispute = () => {
    if (!disputingSessionId || !disputeReason.trim()) return;
    disputeMutation.mutate({ sessionId: disputingSessionId, reason: disputeReason });
  };

  const calculateDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const diffMs = endTime - startTime;

    const seconds = Math.floor(diffMs / 1000);
    return Math.max(seconds, 0);
  };

  const normalizeDuration = (session: WorkSession): number => {
    // If duration is provided and is a valid number, use it (assuming it's in seconds)
    if (session.duration && typeof session.duration === 'number' && session.duration > 0) {
      return Math.max(session.duration, 0);
    }
  
    // If we have both start and end times, calculate duration
    if (session.startTime && session.endTime) {
      return calculateDuration(session.startTime, session.endTime);
    }
  
    // For active sessions without endTime, calculate current duration
    if (session.startTime && session.status === 'active') {
      return calculateDuration(session.startTime);
    }
  
    return 0;
  };

  // Calculate total hours - just add approved + disputed + pending (matching ContractorRetainer)
  const calculateTotalHours = () => {
    const totalSeconds = (sessions || [])
      .filter(s => s.status === 'approved' || s.status === 'disputed' || s.status === 'pending')
      .reduce((total, session) => {
        return total + normalizeDuration(session);
      }, 0);
    
    return totalSeconds;
  };

  const isLoading = contractLoading || sessionsLoading;

  if (!mutualContractId) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No mutual contract established yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Time tracking will be available once the contractor starts working
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
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

      {contractStatus === 'completed' && <p className="text-aquagreen mt-7">This contract has ended</p>}

      {/* Hours Summary */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-lightblue/50 p-3 rounded">
            <p className="text-sm text-mediumgray">Total Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(calculateTotalHours())}
            </p>
          </div>

          <div className="bg-aquagreen/20 p-4 rounded">
            <p className="text-sm text-mediumgray">Approved Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                (sessions || [])
                  .filter(s => s.status === 'approved')
                  .reduce((total, session) => total + normalizeDuration(session), 0)
              )}
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-mediumgray">Pending Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                (sessions || [])
                  .filter(s => s.status === 'pending')
                  .reduce((total, session) => total + normalizeDuration(session), 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Work Diary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-boldblue mb-7.5">Work Diary</h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No work sessions yet</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: WorkSession) => (
              <div key={session._id} className="border-b border-lightblue pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-xs mb-2 text-boldblue">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-mediumgray flex items-center">
                      <LuClock className="mr-1" size={14} />
                      {formatDuration(normalizeDuration(session))}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 font-semibold rounded ${session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'approved' ? 'bg-aquagreen/10 text-aquagreen' :
                      session.status === 'disputed' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-boldblue'
                    }`}>
                    {session.status}
                  </span>
                </div>

                {session.notes && (
                  <p className="mt-2 text-sm">{session.notes}</p>
                )}

                {session.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(session._id)}
                      disabled={approvingSessionId === session._id}
                      className="px-3 py-1 bg-aquagreen text-white rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50"
                    >
                      {approvingSessionId === session._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setDisputingSessionId(session._id)}
                      disabled={disputeMutation.isPending}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50"
                    >
                      Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {disputingSessionId && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Dispute Work Session</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Reason for dispute..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDisputingSessionId(null);
                  setDisputeReason('');
                }}
                disabled={disputeMutation.isPending}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                disabled={!disputeReason.trim() || disputeMutation.isPending}
                className={`px-4 py-2 bg-red-500 text-white rounded ${!disputeReason.trim() || disputeMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-70 cursor-pointer'
                  }`}
              >
                {disputeMutation.isPending ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRetainer;