import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimesheetLogs,
  approveTimesheetEntry,
  disputeTimesheetEntry,
  setContractMaxHours
} from '@/api/contract/timesheet-api';
import { getSingleContract, endContract } from '@/api/contract/contract-api';
import { formatDuration } from '@/utils/contract/format';
import Image from 'next/image';
import { LuClock } from 'react-icons/lu';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

interface WorkSession {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  screenshots?: Array<{
    imagePath: string;
    publicId: string;
    uploadedAt: string;
  }>;
  status: 'pending' | 'approved' | 'disputed' | 'active';
}

const ClientTimesheet = ({
  contractStarted,
  mutualContractId,
  contractStatus,
  refetchContract
}: {
  contractStarted?: boolean
  mutualContractId?: string;
  contractStatus: string;
  refetchContract: any;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputingSessionId, setDisputingSessionId] = useState<string | null>(null);
  const [showSetHoursModal, setShowSetHoursModal] = useState(false);
  const [newMaxHours, setNewMaxHours] = useState('');
  // Add state to track which approve button is loading
  const [approvingSessionId, setApprovingSessionId] = useState<string | null>(null);

  const { userId } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    refetchContract();
  }, [])

  // Query for contract data (including max hours)
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
  const { data: sessions = [] as WorkSession[], isLoading: sessionsLoading } = useQuery({
    queryKey: ['timesheet-logs', mutualContractId],
    queryFn: async () => {
      if (!mutualContractId) return [];
      const response = await getTimesheetLogs(mutualContractId);
      return (response.data || []).filter((s: WorkSession) => s.status !== 'active');
    },
    enabled: !!mutualContractId,
    staleTime: 10000, // 10 seconds
  });

  // Mutation for setting max hours
  const setMaxHoursMutation = useMutation({
    mutationFn: async (hours: number) => {
      if (!mutualContractId) throw new Error('No contract ID');
      return await setContractMaxHours(mutualContractId, hours);
    },
    onSuccess: () => {
      // Invalidate and refetch both contract and sessions data
      queryClient.invalidateQueries({ queryKey: ['contract', mutualContractId] });
      queryClient.invalidateQueries({ queryKey: ['timesheet-logs', mutualContractId] });

      setShowSetHoursModal(false);
      setNewMaxHours('');
      toast.success('Maximum hours set successfully');
    },
    onError: (error) => {
      console.error('Error setting max hours:', error);
      toast.error('Failed to set maximum hours');
    }
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

  const handleSetMaxHours = async () => {
    if (!newMaxHours) return;

    const hours = parseFloat(newMaxHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error('Please enter a valid number of hours');
      return;
    }

    setMaxHoursMutation.mutate(hours);
  };

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
    if (session.duration) {
      const duration = session.duration > 86400 ?
        Math.floor(session.duration / 1000) :
        session.duration;

      return Math.max(duration, 0);
    }

    if (session.startTime && session.endTime) {
      return calculateDuration(session.startTime, session.endTime);
    }

    return 0;
  };

  const isLoading = contractLoading || sessionsLoading;
  const maxHours = contractData?.maxHours ?? null;

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

      {contractStatus === 'completed' && <p className="text-aquagreen mt-7">This contract has ended</p>}
      {contractStatus !== 'completed' && contractStarted &&
        (
          <div className="flex justify-between items-center">

            <button
              onClick={() => setShowSetHoursModal(true)}
              disabled={setMaxHoursMutation.isPending}
              className="px-3 py-2 bg-boldblue text-white shadow-lg rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50"
            >
              {setMaxHoursMutation.isPending ? 'Setting...' : 'Set Max Hours'}
            </button>
          </div>
        )
      }

      {showSetHoursModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text font-semibold mb-4 text-boldblue">Set Maximum Hours</h3>
            <input
              type="number"
              value={newMaxHours}
              onChange={(e) => setNewMaxHours(e.target.value)}
              className="w-full p-2 border border-deepskyblue placeholder:text-boldblue text-boldblue focus:outline-boldblue focus:outline rounded mb-4"
              placeholder="0"
              min="1"
              step="1"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSetHoursModal(false);
                  setNewMaxHours('');
                }}
                disabled={setMaxHoursMutation.isPending}
                className="text-s text-boldblue px-4 py-2 border border-boldblue rounded hover:opacity-70 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSetMaxHours}
                disabled={!newMaxHours || setMaxHoursMutation.isPending}
                className={`text-sm transition duration-300 ease-in-out px-4 py-2 bg-boldblue text-white rounded ${!newMaxHours || setMaxHoursMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-70 cursor-pointer'
                  }`}
              >
                {setMaxHoursMutation.isPending ? 'Setting...' : 'Set Hours'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hours Summary */}
      <div>
        <p className='pb-3.75 text-boldblue font-semibold'>Maximum Hours: {maxHours ?? '0'}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-lightblue/50 p-3 rounded">
            <p className="text-sm text-mediumgray">Total Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions.reduce((total: number, session: WorkSession) => total + normalizeDuration(session), 0)
              )}
            </p>
          </div>

          <div className="bg-aquagreen/20 p-4 rounded">
            <p className="text-sm text-mediumgray">Approved Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions
                  .filter((s: WorkSession) => s.status === 'approved')
                  .reduce((total: number, session: WorkSession) => total + normalizeDuration(session), 0)
              )}
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-mediumgray">Pending Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions
                  .filter((s: WorkSession) => s.status === 'pending')
                  .reduce((total: number, session: WorkSession) => total + normalizeDuration(session), 0)
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

                {session.screenshots && session.screenshots.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {session.screenshots.map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 border rounded overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(screenshot.imagePath)}
                      >
                        <Image
                          src={screenshot.imagePath}
                          alt={`Screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                            console.error(`Failed to load image: ${screenshot.imagePath}`);
                          }}
                        />
                      </div>
                    ))}
                  </div>
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-full max-h-full">
            <button
              className="absolute -top-10 right-0 text-red-500 cursor-pointer text-2xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Enlarged screenshot"
              width={800}
              height={600}
              className="object-contain max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTimesheet;