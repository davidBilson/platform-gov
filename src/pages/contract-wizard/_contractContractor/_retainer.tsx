import React, { useState, useEffect, useRef } from 'react';
import {
  // startWorkSession,
  stopWorkSession,
  getTimesheetLogs,
  logHoursManually
} from '@/api/contract/timesheet-api';
import { AxiosError } from 'axios';
import useAuthStore from '@/store/useAuth';
import { formatDuration } from '@/utils/contract/format';
import { LuClock, LuChevronDown } from 'react-icons/lu';
import { FaStopCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
// import { getSingleContract } from '@/api/contract/contract-api';
import { Jobs } from '@/types/jobs';

interface WorkSession {
  _id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  status: 'active' | 'pending' | 'approved' | 'disputed';
}

interface RetainerProps {
  job: Jobs | null;
  mutualContractId: string;
  contractStatus: string;
  contract: any;
  refetchContract: any;
}

const ContractorRetainer = ({ job, mutualContractId, contractStatus, contract, refetchContract }: RetainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { userId } = useAuthStore();

  const [showManualLogModal, setShowManualLogModal] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);

  // Generate hours options from 1 to 40
  const hoursOptions = Array.from({ length: 40 }, (_, i) => i + 1);

  const fetchSessions = async () => {
    if (!mutualContractId) return;

    try {
      setIsLoading(true);
      const response = await getTimesheetLogs(mutualContractId);
      setSessions(response.data || []);

      const active = response.data.find((s: WorkSession) => s.status === 'active');

      if (active) {
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

      const formData = new FormData();
      formData.append('hours', hours.toString());
      formData.append('description', manualDescription);
      formData.append('userId', userId);

      await logHoursManually(mutualContractId, formData);

      setShowManualLogModal(false);
      setManualHours('');
      setManualDescription('');
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
    refetchContract();
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


  const handleStopSession = async () => {
    if (!mutualContractId || !activeSession?._id || !userId) return;

    try {
      const formData = new FormData();
      formData.append('notes', notes);
      formData.append('userId', userId);

      await stopWorkSession(mutualContractId, activeSession._id, formData);
      setActiveSession(null);
      setNotes('');

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
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

  // Calculate total hours - just add approved + disputed + pending
  const calculateTotalHours = () => {
    const totalSeconds = sessions
      .filter(s => s.status === 'approved' || s.status === 'disputed' || s.status === 'pending')
      .reduce((total, session) => {
        return total + normalizeDuration(session);
      }, 0);
    
    return totalSeconds;
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
      <section className="relative mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-skyblue border border-lightblue text-boldblue w-30 px-2 py-1 rounded-sm outline-none hover:opacity-70 transition duration-300 ease-in-out cursor-pointer text-xs"
        >
          {showDetails ? 'Hide Job Details' : 'View Job Details'}
        </button>

        {showDetails && job && (
          <article className="border border-boldblue w-fit h-fit text-sm text-boldblue p-3 rounded-sm absolute top-10 z-10 bg-white flex flex-col gap-2">
            <p><span className="font-bold">Payment Type:</span> {job.paymentType}</p>
            <p><span className="font-bold">Amount:</span> ${job.retainerAmount}</p>
            <p><span className="font-bold">Frequency:</span> {job.retainerFrequency}</p>
            <p><span className="font-bold">Duration:</span> {job.retainerDuration}</p>
          </article>
        )}
      </section>

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
        {contract.isStarted &&
          <div className="flex justify-between gap-2 w-full">
            {
              contractStatus === 'completed' ? (
                <p className="text-aquagreen">This contract has ended</p>
              ) : (
                <></>
              )
            }
            <button
              onClick={() => setShowManualLogModal(true)}
              className="px-4 py-2 bg-boldblue text-white text-sm rounded-md hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
            >
              Log Hours
            </button>
          </div>
        }
      </div>

      {showManualLogModal && (
        <div className="fixed inset-0 bg-black/50 h-screen flex items-center justify-center p-4 z-200">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text font-semibold mb-4 text-boldblue">Log Hours Manually</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-boldblue">Hours</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHoursDropdown(!showHoursDropdown)}
                  className="w-full p-2 border border-deepskyblue text-boldblue focus:outline-boldblue focus:outline rounded mb-4 text-left flex items-center justify-between"
                >
                  <span className={manualHours ? 'text-boldblue' : 'text-boldblue opacity-70'}>
                    {manualHours ? `${manualHours} ${parseInt(manualHours) === 1 ? 'hour' : 'hours'}` : 'Select hours worked'}
                  </span>
                  <LuChevronDown className={`transition-transform ${showHoursDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showHoursDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-deepskyblue rounded max-h-48 overflow-y-auto z-50 shadow-lg">
                    {hoursOptions.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          setManualHours(hour.toString());
                          setShowHoursDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-lightblue/20 text-boldblue text-sm border-b border-lightblue/30 last:border-b-0"
                      >
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowManualLogModal(false);
                  setShowHoursDropdown(false);
                }}
                className="px-4 py-2 border border-boldblue text-boldblue rounded hover:opacity-70 transition duration-300 ease-in-out cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogHoursManually}
                disabled={!manualHours}
                className={`px-4 py-2 bg-boldblue hover:opacity-70 transition duration-300 ease-in-out cursor-pointer text-white rounded ${!manualHours ? 'opacity-50 cursor-not-allowed' : ''
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

            <button
              onClick={handleStopSession}
              disabled={!notes.trim()}
              className={`hover:opacity-70 text-sm font-semibold transition duration-300 ease-in-out cursor-pointer flex items-center justify-center w-full py-2  rounded ${!notes.trim() ? 'border border-deepskyblue cursor-not-allowed text-darkgray' : 'border border-deepskyblue cursor-not-allowed text-red-600'
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorRetainer;