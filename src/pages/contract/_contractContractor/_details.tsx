import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import ProfilePicture from '@/components/profile/profilePicture';
import RateUserModal from '@/components/rating/rateUserModal';
import SignContractModal from '../_signContractModal';
import LoadingAnimation from '@/components/ui/loading';

import useAuthStore from '@/store/useAuth';
import { getHiringOffer, acceptHiringOffer, getContractorSignature } from '@/api/hiring';
import { createContract } from '@/api/contract/contract-api';
// import { useRouter } from 'next/router';

interface Job {
  createdAt?: string;
  jobTitle?: string;
  paymentType?: string;
  employmentType?: string;
  location?: string;
  description?: string;
  jobCategory?: string;
  requiredCertifications?: string[];
  requiredSkills?: string[];
  price?: number;
  retainerAmount?: number;
  retainerFrequency?: string;
  clientLogo?: string;
  clientName?: string;
  clientIndustry?: string;
  clientSpecializations?: string[];
  userId?: { _id: string };
}

interface HiringDocument {
  _id: string;
  jobId: { description: string };
  offerDetails: {
    rate: number;
    paymentType: string;
    employmentType: string;
    startDate: string;
  };
  clientNotes: string;
  applicationId: { coverLetter: string };
  status: string;
}

interface DetailsProps {
  job: Job;
  jobId: string;
  applicationId: string;
}

const Details = ({ job, jobId, applicationId }: DetailsProps) => {

  // const router = useRouter()
  const [showSignContractModal, setShowSignContractModal] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [showRateUserModal, setShowRateUserModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hiringOffer, setHiringOffer] = useState<HiringDocument | null>(null);
  const [hiringId, setHiringId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  // Add a new state variable for job acceptance status
  const [jobAcceptanceStatus, setJobAcceptanceStatus] = useState<string>('');

  useEffect(() => {
    if (job?.userId?._id) {
      setClientId(job?.userId._id)
    }
  }, [job])
  
  const { userId, role } = useAuthStore();

  const handleClose = () => {
    setShowRateUserModal(false);
    setShowSignContractModal(false);
  };

  const updateContractSigned = (value: boolean) => {
    setContractSigned(value);
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const postedDate = job?.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';

  useEffect(() => {
    let isMounted = true;
    
    // Only fetch if all required data is available
    if (!userId || role !== 'contractor' || !jobId || !applicationId) {
      setLoading(false);
      return;
    }

    const fetchHiringOffer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getHiringOffer(jobId, applicationId);
        
        // Check if component is still mounted before updating state
        if (!isMounted) return;
        
        if (response.success && response.data) {
          setHiringOffer(response.data);
          setHiringId(response.data._id);
          // Set the initial job acceptance status
          setJobAcceptanceStatus(response.data.status);
        } else {
          // Handle case when data is not found but API didn't throw an error
          if (response.error?.status === 404) {
            setError("Hiring offer not found. It may have been removed or is not available.");
          } else {
            setError(response.error?.message || "Failed to load hiring offer data.");
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error in fetchHiringOffer:", error);
        setError("An unexpected error occurred while fetching data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHiringOffer();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [jobId, applicationId, userId, role]);

  // Check signature status when hiringId is available
  useEffect(() => {
    let isMounted = true;
    
    if (!hiringId || !userId) {
      return;
    }

    const checkSignatureStatus = async () => {
      try {
        const isSigned = await getContractorSignature(hiringId, userId);
        
        if (isMounted) {
          setContractSigned(isSigned);
        }
      } catch (err) {
        console.error('Error checking contractor signature:', err);
        // We don't set an error state here as this is not a critical functionality
      }
    };

    checkSignatureStatus();

    return () => {
      isMounted = false;
    };
  }, [hiringId, userId]);

  const acceptJob = async () => {
    // Validate required data before proceeding
    if (!hiringId || !userId) {
      toast.error('Missing required information to accept job');
      return;
    }

    try {

      if (jobAcceptanceStatus === "accepted") {
        toast.info('Job has already been accepted');
        return;
      }
      
      await acceptHiringOffer({ 
        hiringId, 
        contractorId: userId 
      });

      console.log('hiringId: ',hiringId)
      console.log('clientId: ', clientId)
      console.log('userId: ', userId)
      
      if (job?.userId?._id) {
        await createContract({
          hiringId: hiringId, 
          clientId: clientId, 
          contractorId: userId
        });
      }
      
      // Update the job acceptance status state variable
      setJobAcceptanceStatus("accepted");
      
      // Also update the hiringOffer object to keep state consistent
      setHiringOffer(prev => prev ? {...prev, status: "accepted"} : prev);
      
      toast.success('Job accepted successfully');
    } catch (error) {
      console.error("Error accepting job:", error);
      toast.error('Failed to accept job. Please try again later.');
    }
  };

  // Calculate button disabled state correctly using the state variable
  const isJobAlreadyAccepted = jobAcceptanceStatus === "accepted";
  const canAcceptJob = contractSigned && jobAcceptanceStatus === "offered";

  const getPaymentInfo = (): string => {
    if (job.paymentType === 'hourly') {
      return `Hourly | $${job.price}`;
    } else if (job.paymentType === 'fixed-price') {
      return `Fixed Price | $${job.price}`;
    } else if (job.paymentType === 'retainer' && job.retainerAmount && job.retainerFrequency) {
      return `Retainer | $${job.retainerAmount}/${job.retainerFrequency.toLowerCase()}`;
    }
    return '';
  };

  // Render loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <LoadingAnimation />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh] px-4 text-center'>
        <img 
          src="/assets/error_icon.svg" 
          alt="Error" 
          className="w-16 h-16 mb-4"
          onError={(e) => {
            e.currentTarget.src = ""; // Fallback if image doesn't exist
            e.currentTarget.style.display = "none";
          }}
        />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If user is not a contractor, show appropriate message
  if (role !== 'contractor') {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh] px-4 text-center'>
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-600">This hiring offer is only available to contractors.</p>
      </div>
    );
  }

  return (
    <>
    <section className='w-full max-w-275 m-auto pb-64'>
      
      <div className="pt-7.5">
        
        <p className='font-semibold text-xs text-boldblue'>Posted {postedDate}</p>
        
        <h1 className="text-xl font-bold my-3.75">{job?.jobTitle ?? ""}</h1>
        
        <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
          <div className="flex items-center gap-1.25">
            <FaRegHourglass size={15} />
            {getPaymentInfo()} | {job.employmentType}
          </div>
          
          <div className="flex items-center gap-1.25">
            <FaLocationDot size={15} />
            {job.location}
          </div>
        </div>

      </div>
      
      {/* Description section */}
      <div className="pb-7.5 border-b border-b-deepskyblue pb-">
        <p className="text-black whitespace-pre-line">{job?.description ?? ""}</p>
        <div className='flex items-center gap-2.5 mt-3.25'>
          <span className='px-2.5 py-1.25 text-xs text-boldblue font-semibold border border-boldblue rounded-full'>{job?.jobCategory ?? ""}</span>
        </div>
      </div>
      
      {/* Skills and Certifications section */}
      <div className="py-7.5 border-b border-b-deepskyblue">
        
        <div className="mb-3.75">
          <h3 className="font-semibold mb-3.75">Required Certifications</h3>
          <div className="flex flex-wrap gap-3">
            {
              job?.requiredCertifications && job?.requiredCertifications.length > 0 ? (
                <>
                  {job.requiredCertifications.map((certification: string, index: number) => (
                    <span className="bg-aquagreen text-white text-xs rounded-full px-3 py-1" key={index}>
                      {certification}
                      {job?.requiredCertifications?.length && index !== job.requiredCertifications.length - 1 && ', '}
                    </span>
                  ))}
                </>
              ) : (
                <p className="text-gray-400">No specializations specified</p>
              )
            }
          </div>
        </div>

        <div className="mb-3.75">
          <h3 className="font-semibold mb-3.75">Required Skills</h3>
          <div className="flex flex-wrap gap-3">
            {
              job?.requiredSkills && job?.requiredSkills.length > 0 ? (
                <>
                  {job.requiredSkills.map((skill: string, index: number) => (
                    <span className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1" key={index}>
                      {skill}
                      {job?.requiredSkills?.length && index !== job.requiredSkills.length - 1 && ' '}
                    </span>
                  ))}
                </>
              ) : (
                <p className="text-gray-400">No specializations specified</p>
              )
            }
          </div>
        </div>

      </div>
      
      {/* Client Information */}
      <div className="py-7.5 border-b border-b-deepskyblue">
        <h2 className="font-semibold mb-3.75">Client Information</h2>
        
        <article className='flex flex-wrap justify-between items-start gap-5'>
          <section>
            <div className="flex items-center gap-5 mb-4">

              <ProfilePicture source={job?.clientLogo ?? ""} alt={job?.clientName ?? ""} dimension={48} />

              <Link href="" className="cursor-pointer hover:underline font-medium">{job?.clientName ?? ""}</Link>

            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-gray-500 text-sm">Industry</p>
                <p className="font-medium">{job?.clientIndustry ?? ""}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Specializations</p>
                {
                  job?.clientSpecializations && job?.clientSpecializations.length > 0 ? (
                    <div className="font-medium">
                      {job.clientSpecializations.map((specialization: string, index: number) => (
                        <span key={index}>
                          {specialization}
                          {index !== (job?.clientSpecializations?.length ?? 0) - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No specializations specified</p>
                  )
                }
              </div>
            </div>

          </section>

        </article>
      </div>

    </section>

    {showRateUserModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <RateUserModal 
             onClose={handleClose}
             userToRate={""}
             contractId={""}
             jobId={""}
             reviewerId={""}
             revieweeId={""}
             role={"contractor"}
             existingRating={{
                id: '',
                rating: 0,
                comments: ''
             }}
          />
      </div>
    )}

    {showSignContractModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
        {hiringOffer && (
          <SignContractModal
            updateContractSigned={updateContractSigned}
            contractSigned={contractSigned}
            hiringOffer={hiringOffer}
            onClose={handleClose} 
          />
        )}
      </div>
    )}

      {/* action buttons */}
      {hiringOffer && (
        <div className="flex items-center justify-center gap-2.5 md:gap-7.5 py-7.5 px-6 fixed bottom-0 right-0 bg-skyblue w-full border-t border-t-boldblue">
          
          <button 
            onClick={() => !contractSigned && setShowSignContractModal(true)}
            className={`flex items-center justify-center gap-2 rounded-lg border transition transform duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 text-xs md:text-sm font-semibold
              ${contractSigned 
                ? 'border-gray-400 bg-gray-100 opacity-70 cursor-not-allowed text-gray-500' 
                : 'border-boldblue bg-white active:scale-95 hover:shadow-lg cursor-pointer'
              }`
            }
            disabled={contractSigned}
          > 
            <img
              src="/assets/documents_logo.svg" 
              alt="document_logo" 
              className={contractSigned ? 'opacity-60' : ''}
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="h-fit w-fit">
              {contractSigned ? "Documents Signed" : "Sign Documents"}
            </span>
          </button>
          
          <button
            onClick={acceptJob}
            disabled={isJobAlreadyAccepted || !canAcceptJob}
            className={`transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 text-xs md:text-sm font-semibold rounded-lg border ${
              canAcceptJob
                ? 'cursor-pointer bg-boldblue border-boldblue text-white'
                : isJobAlreadyAccepted
                  ? 'bg-gray-100 border-gray-400 text-gray-500 cursor-not-allowed'
                  : 'bg-white border-lightblue text-lightblue cursor-not-allowed'
            }`}
          >
            {isJobAlreadyAccepted ? "Job Accepted" : "Accept Job"}
          </button>
        </div>
      )}
    </>
  )
}

export default Details;