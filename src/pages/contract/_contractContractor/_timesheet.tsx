// ContractorTimesheet.tsx
import React, { useState, useEffect } from 'react';
import { 
  startWorkSession, 
  stopWorkSession, 
  getTimesheetLogs 
} from '@/api/contract/timesheet-api';
import useAuthStore from '@/store/useAuth';
import { formatDuration } from '@/utils/contract/format';
import Image from 'next/image';
import { LuClock, LuPlay } from 'react-icons/lu';
import { FaStopCircle } from "react-icons/fa";

interface WorkSession {
  _id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  screenshots?: {
    imagePath: string;
    publicId: string;
    uploadedAt: string;
  }[];
  status: 'active' | 'pending' | 'approved' | 'disputed';
}

const ContractorTimesheet = ({ mutualContractId }: { mutualContractId?: string }) => {
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const { userId } = useAuthStore();

  const fetchSessions = async () => {
    if (!mutualContractId) return;
    
    try {
      setIsLoading(true);
      const response = await getTimesheetLogs(mutualContractId);
      setSessions(response.data || []);
      
      // Check for active session
      const active = response.data.find((s: WorkSession) => s.status === 'active');
      if (active) setActiveSession(active);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mutualContractId]);

  const handleStartSession = async () => {
    if (!mutualContractId || !userId) return;
    
    try {
      const response = await startWorkSession(mutualContractId, userId);
      setActiveSession(response.data);
      fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleStopSession = async () => {
    if (!mutualContractId || !activeSession?._id || !userId) return;
    
    try {
      const formData = new FormData();
      formData.append('notes', notes);
      formData.append('userId', userId);
      
      // Append all screenshot files
      screenshotFiles.forEach((file) => {
        formData.append('screenshots', file);
      });

      await stopWorkSession(mutualContractId, activeSession._id, formData);
      setActiveSession(null);
      setNotes('');
      setScreenshotFiles([]);
      fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  const handleAddScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setScreenshotFiles(prev => [...prev, ...files]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
  };

  const calculateDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    return Math.floor((endTime - startTime) / 1000);
  };

  if (!mutualContractId) {
    return (
      <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No mutual contract established yet</p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Time tracking will be available once the client creates a contract
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Tracking Control */}
      <div className="bg-white p-4 rounded-lg shadow">
        {activeSession ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-medium">Tracking time...</span>
              </div>
              <div className="text-xl font-mono">
                {formatDuration(calculateDuration(activeSession.startTime))}
              </div>
            </div>
            
            <textarea
              className="w-full text-sm p-5 resize-none border border-deepskyblue focus:outline-deepskyblue focus:outline rounded"
              placeholder="What are you working on?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Screenshots</label>
              <div className="flex flex-wrap gap-2">
                {screenshotFiles.map((file, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeScreenshot(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple
                    onChange={handleAddScreenshot}
                  />
                  <span className="text-3xl">+</span>
                </label>
              </div>
              <p className="text-xs text-gray-500">Max 5 screenshots (5MB each)</p>
            </div>
            
            <button
              onClick={handleStopSession}
              disabled={!notes.trim()}
              className={`hover:opacity-70 transition duration-300 ease-in-out cursor-pointer flex items-center justify-center w-full py-2 text-white rounded ${
                !notes.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              <FaStopCircle className="mr-2" />
              Stop Work Session
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartSession}
            className="flex items-center justify-center w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <LuPlay className="mr-2" />
            Start Work Session
          </button>
        )}
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
                    {session.endTime && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <LuClock className="mr-1" size={14} />
                        {formatDuration(session.duration || calculateDuration(session.startTime, session.endTime))}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'approved' ? 'bg-green-100 text-green-800' :
                    session.status === 'disputed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorTimesheet;