import React, { useState, useEffect } from 'react';
import { 
  getTimesheetLogs, 
  approveTimesheetEntry, 
  disputeTimesheetEntry 
} from '@/api/contract/timesheet-api';
import { formatDuration } from '@/utils/contract/format';
import Image from 'next/image';
import { LuClock } from 'react-icons/lu';
import useAuthStore from '@/store/useAuth';

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputingSessionId, setDisputingSessionId] = useState<string | null>(null);
  const { userId } = useAuthStore();

  const fetchSessions = async () => {
    if (!mutualContractId) return;
    
    try {
      setIsLoading(true);
      const response = await getTimesheetLogs(mutualContractId);
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
    if (!mutualContractId || !userId) return;
    
    try {
      await approveTimesheetEntry(mutualContractId, sessionId, userId);
      fetchSessions();
    } catch (error) {
      console.error('Error approving session:', error);
    }
  };

  const handleDispute = async () => {
    if (!mutualContractId || !disputingSessionId || !disputeReason || !userId) return;
    
    try {
      // Pass both the reason and userId
      await disputeTimesheetEntry(mutualContractId, disputingSessionId, disputeReason, userId);
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
          <div className="bg-lightblue/50 p-3 rounded">
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-xl font-semibold">
              {formatDuration(
                sessions.reduce((total, session) => total + (session.duration || 0), 0)
              )}
            </p>
          </div>
          <div className="bg-aquagreen/20 p-4 rounded">
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
        
        <h3 className="text-lg font-semibold text-boldblue mb-7.5">Work Diary</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No work sessions yet</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="border-b border-lightblue pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-xs mb-2 text-boldblue">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-mediumgray flex items-center">
                      <LuClock className="mr-1" size={14} />
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 font-semibold rounded ${
                    session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                      className="px-3 py-1 bg-aquagreen text-white rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setDisputingSessionId(session._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
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