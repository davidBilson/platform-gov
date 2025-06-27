import React, { useState, useEffect, useRef } from 'react';
import { 
  startWorkSession, 
  stopWorkSession, 
  getTimesheetLogs, 
  logHoursManually
} from '@/api/contract/timesheet-api';
import { AxiosError } from 'axios';
import useAuthStore from '@/store/useAuth';
import { formatDuration } from '@/utils/contract/format';
import Image from 'next/image';
import { LuClock, LuPlay } from 'react-icons/lu';
import { FaStopCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { getSingleContract } from '@/api/contract/contract-api';

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

const ContractorTimesheet = ({ mutualContractId, contractStatus }: { mutualContractId?: string; contractStatus: string; }) => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { userId } = useAuthStore();

  const [showManualLogModal, setShowManualLogModal] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualScreenshots, setManualScreenshots] = useState<File[]>([]);
  const [maxHours, setMaxHours] = useState<number | null>(null);
  const [loggedHours, setLoggedHours] = useState(0);

  const fetchSessions = async () => {
    if (!mutualContractId) return;
    
    try {

      setIsLoading(true);
      const response = await getTimesheetLogs(mutualContractId);
      setSessions(response.data || []);
      
      const totalHours = (response.data || []).reduce((total: number, session: WorkSession) => {
        const normalizedDuration = normalizeDuration(session);
        return total + normalizedDuration;
      }, 0) / 3600;
      
      setLoggedHours(totalHours);

      const contractResponse = await getSingleContract({ mutualContractId });
      if (contractResponse.success && contractResponse.data) {
        setMaxHours(contractResponse.data.maxHours || null);
      }
      
      const active = response.data.find((s: WorkSession) => s.status === 'active');
      
      if (active) {
        setMaxHours(response.data.maxHours)
        setActiveSession(active);
        const initialDuration = calculateDuration(active.startTime);
        setElapsedTime(initialDuration);
        startLiveTimer(active.startTime);
      }

    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogHoursManually = async () => {
    if (!mutualContractId || !userId || !manualHours) return;
  
  try {
    const hours = parseFloat(manualHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error('Please enter a valid number of hours (greater than 0)');
      return;
    }

    // Check max hours before sending to backend
    if (maxHours !== null && (loggedHours + hours) > maxHours) {
      toast.error(`Cannot log ${hours} hours. This would exceed the maximum of ${maxHours} hours. Current logged: ${loggedHours.toFixed(2)} hours.`);
      return;
    }

    const formData = new FormData();
    formData.append('hours', hours.toString());
    formData.append('description', manualDescription);
    formData.append('userId', userId);
      
      manualScreenshots.forEach((file, index) => {
        formData.append('screenshots', file, `manual-screenshot-${index}-${Date.now()}-${file.name}`);
      });
  
      await logHoursManually(mutualContractId, formData);
      
      setShowManualLogModal(false);
      setManualHours('');
      setManualDescription('');
      setManualScreenshots([]);
      await fetchSessions(); // Refresh the sessions
      toast.success(`${hours} hours logged manually!`);
  
    } catch (error) {
      console.error('Error logging hours manually:', error);
      
      // More specific error handling
      if (error instanceof Error && 'response' in error && (error as AxiosError<{ message: string }>).response?.data?.message) {
        if (error instanceof AxiosError && error.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      } else if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error('Invalid request. Please check your input.');
      } else if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error('Contract not found or invalid.');
      } else {
        toast.error('Failed to log hours manually. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchSessions();
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [mutualContractId]);

  const startLiveTimer = (startTimeStr: string) => {
    const startTime = new Date(startTimeStr).getTime();
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const duration = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(duration);
    }, 1000);
  };

  const handleStartSession = async () => {
    if (!mutualContractId || !userId) return;
    
    try {
      const response = await startWorkSession(mutualContractId, userId);
      setActiveSession(response.data);
      setElapsedTime(0);
      startLiveTimer(response.data.startTime);
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
      
      screenshotFiles.forEach((file, index) => {
        formData.append('screenshots', file, `screenshot-${index}-${Date.now()}-${file.name}`);
      });

      await stopWorkSession(mutualContractId, activeSession._id, formData);
      setActiveSession(null);
      setNotes('');
      setScreenshotFiles([]);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  const handleAddScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });
      
      if (validFiles.length < files.length) {
        console.warn('Some files were skipped due to invalid type or size');
      }
      
      setScreenshotFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
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
      return Math.max(session.duration, 0);
    }
    
    if (session.startTime && session.endTime) {
      return calculateDuration(session.startTime, session.endTime);
    }
    
    return 0;
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
      <div>
        <p className='pb-3.75 text-boldblue font-semibold'>Maximum Hours: {maxHours ?? '0'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-lightblue/50 p-3 rounded">
              <p className="text-sm text-mediumgray">Total Hours</p>
              <p className="text-xl font-semibold">
                {formatDuration(
                    sessions.reduce((total, session) => total + normalizeDuration(session), 0)
                )}
              </p>
          </div>

          <div className="bg-aquagreen/20 p-4 rounded">
            <p className="text-sm text-mediumgray">Approved Hours</p>
            <p className="text-xl font-semibold">
                {formatDuration(
                    sessions
                        .filter(s => s.status === 'approved')
                        .reduce((total, session) => total + normalizeDuration(session), 0)
                )}
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-mediumgray">Pending Hours</p>
            <p className="text-xl font-semibold">
                {formatDuration(
                    sessions
                        .filter(s => s.status === 'pending')
                        .reduce((total, session) => total + normalizeDuration(session), 0)
                )}
            </p>
          </div>

        </div>
      </div>
      <div className='flex items-center flex-wrap gap-3.75'>
        {contractStatus === 'completed' ? (
          <p className="text-aquagreen">This contract has ended</p>
        ) : maxHours !== null && loggedHours >= maxHours ? (
          <div className="bg-red-50 p-3 rounded text-center">
            <p className="text-red-800">Maximum hours reached</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowManualLogModal(true)}
              className="px-4 py-2 bg-boldblue text-white text-sm rounded-md hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
            >
              Log Hours Manually
            </button>
          </div>
        )}
        {/* {!activeSession && <button
            onClick={handleStartSession}
            className="px-4 py-2 flex items-center justify-center bg-aquagreen text-white text-sm rounded hover:bg-aquagreen hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
          >
            <LuPlay className="mr-2" />
            Start Work Session
          </button>} */}
      </div>

      {showManualLogModal && (
        <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text font-semibold mb-4 text-boldblue">Log Hours Manually</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-boldblue">Hours</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                className="w-full p-2 border border-deepskyblue placeholder:text-boldblue text-boldblue focus:outline-boldblue focus:outline rounded mb-4"
                placeholder="Enter hours worked"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-boldblue">Description</label>
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                className="w-full p-2 border border-deepskyblue placeholder:text-boldblue text-boldblue focus:outline-boldblue focus:outline rounded mb-4"
                rows={3}
                placeholder="What did you work on?"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-boldblue">Screenshots (Optional)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {manualScreenshots.map((file, index) => (
                  <div key={index} className="relative w-16 h-16 rounded group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setManualScreenshots(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-70 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="w-full border-2 border-dashed border-deepskyblue rounded flex items-center justify-center cursor-pointer p-2">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setManualScreenshots(prev => [...prev, ...Array.from(e.target.files!)]);
                    }
                  }}
                />
                <span className="text-sm text-boldblue">Add Screenshots</span>
              </label>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowManualLogModal(false)}
                className="px-4 py-2 border border-boldblue text-boldblue rounded hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogHoursManually}
                disabled={!manualHours}
                className={`px-4 py-2 bg-boldblue hover:opacity-70 transition duration-300 ease-in-out cursor-pointer text-white rounded ${
                  !manualHours ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Log Hours
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        {activeSession ? (
          <div className="space-y-4 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-semibold text-sm text-boldblue">Tracking time...</span>
              </div>
              <div className="font-mono font-bold text-boldblue">
                {formatDuration(elapsedTime)}
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
              <label className="block text-sm font-bold text-boldblue">Screenshots</label>
              <div className="flex flex-wrap gap-2">
                {screenshotFiles.map((file, index) => (
                  <div key={index} className="relative w-24 h-24  rounded group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeScreenshot(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-boldblue rounded flex items-center justify-center cursor-pointer">
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
              className={`hover:opacity-70 text-sm font-semibold transition duration-300 ease-in-out cursor-pointer flex items-center justify-center w-full py-2  rounded ${
                !notes.trim() ? 'border border-deepskyblue cursor-not-allowed text-darkgray' : 'border border-deepskyblue cursor-not-allowed text-red-600'
              }`}
            >
              <FaStopCircle className="mr-2" color='red' />
              Stop Work Session
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      
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
                    {session.endTime && (
                      <p className="text-sm text-mediumgray flex items-center">
                          <LuClock className="mr-1" size={14} />
                          {formatDuration(normalizeDuration(session))}
                      </p>
                    )}
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
              </div>
            ))}
          </div>
        )}
      </div>

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

export default ContractorTimesheet;