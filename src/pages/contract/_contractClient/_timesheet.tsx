// ClientTimesheet.tsx
import React, { useState, useEffect } from 'react';
import { 
  getTimesheetLogs, 
  approveTimesheetEntry, 
  disputeTimesheetEntry 
} from '@/api/contract/timesheet-api';
import { formatDuration } from '@/utils/contract/format';
import Image from 'next/image';
import { LuClock } from 'react-icons/lu';
// import useAuthStore from '@/store/useAuth';

interface WorkSession {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  screenshots?: {
    imagePath: string;
    publicId: string;
    uploadedAt: string;
  }[];
  status: 'pending' | 'approved' | 'disputed' | 'active';
}

const ClientTimesheet = ({ mutualContractId }: { mutualContractId?: string }) => {
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputingSessionId, setDisputingSessionId] = useState<string | null>(null);
  // const { userId } = useAuthStore();

  const fetchSessions = async () => {
    if (!mutualContractId) return;
    
    try {
      setIsLoading(true);
      const response = await getTimesheetLogs(mutualContractId);
      // Filter out active sessions (only show completed ones)
      setSessions((response.data || []).filter((s: WorkSession) => s.status !== 'active'));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mutualContractId]);

  const handleApprove = async (sessionId: string) => {
    if (!mutualContractId) return;
    
    try {
      await approveTimesheetEntry(mutualContractId, sessionId);
      fetchSessions();
    } catch (error) {
      console.error('Error approving session:', error);
    }
  };

  const handleDispute = async () => {
    if (!mutualContractId || !disputingSessionId || !disputeReason) return;
    
    try {
      await disputeTimesheetEntry(mutualContractId, disputingSessionId, disputeReason);
      setDisputingSessionId(null);
      setDisputeReason('');
      fetchSessions();
    } catch (error) {
      console.error('Error disputing session:', error);
    }
  };

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
      {/* Weekly Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions.reduce((total, session) => total + (session.duration || 0), 0)
              )}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-gray-500">Approved Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions
                  .filter(s => s.status === 'approved')
                  .reduce((total, session) => total + (session.duration || 0), 0)
              )}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-gray-500">Pending Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions
                  .filter(s => s.status === 'pending')
                  .reduce((total, session) => total + (session.duration || 0), 0)
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Work Diary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Work Diary</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No work sessions yet</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <LuClock className="mr-1" size={14} />
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
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
                      <div key={index} className="relative w-16 h-16 border rounded overflow-hidden">
                        <Image
                          src={screenshot.imagePath}
                          alt={`Screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {session.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(session._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setDisputingSessionId(session._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                disabled={!disputeReason.trim()}
                className={`px-4 py-2 bg-red-500 text-white rounded ${
                  !disputeReason.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTimesheet;