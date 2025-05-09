import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import RateUserModal from '@/components/ui/rateUserModal';
// import RatingStars from '@/components/ui/rating';
import ProfilePicture from '@/components/ui/profilePicture';
import { format } from 'date-fns';
import SignContractModal from '../_signContractModal';
import LoadingAnimation from '@/components/ui/loading';
import useAuthStore from '@/store/useAuth';
import { getHiringOffer, acceptHiringOffer, getContractorSignature } from '@/api/contract';
import { toast } from 'react-toastify';

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
  clientLogo?: string;
  clientName?: string;
  clientIndustry?: string;
  clientSpecializations?: string[];
}

interface HiringDocument {
  jobId: { description: string };
  offerDetails: {
    rate: number;
    paymentType: string;
    employmentType: string;
    startDate: string;
  };
  clientNotes: string;
  applicationId: { coverLetter: string };
  status: string; // Added status property
}

interface DetailsProps {
  job: Job;
  jobId: string;
  applicationId: string;
}
const Details = ({ job, jobId, applicationId }: DetailsProps) => {

  const [contractSigned, setContractSigned] = useState(false);
  const [showRateUserModal, setShowRateUserModal] = useState(false);
  const [showSignContractModal, setShowSignContractModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [hiringOffer, setHiringOffer] = useState<HiringDocument>();
  const [hiringId, setHiringId] = useState<string>('');
  
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

    if (!userId || role !== 'contractor'){
      return;
    }

    const fetchHiringOffer = async () => {
      try {
        setLoading(true);
        const offer = await getHiringOffer(jobId, applicationId);
        setHiringOffer(offer);
        setHiringId(offer._id);
      } catch (error) {
        toast.error('Failed to load hiring offer');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiringOffer();
  }, [jobId, applicationId]);


  const acceptJob = async () => {
    try {
      await acceptHiringOffer({ hiringId, contractorId: userId });
      toast.success('Job accepted successfully');
    } catch (error) {
      toast.error('Failed to accept job');
      console.error(error);
    }
  };

  const checkSignatureStatus = async () => {
;
    const contractorId = userId;
    
    const isSigned = await getContractorSignature(hiringId, contractorId);
    
    if (isSigned) {
      setContractSigned(true);
    } else {
      console.log('Contractor has not signed yet');
    }
  };

  useEffect(() => {
    if (hiringId) {
      checkSignatureStatus();
    }
  }, [hiringId]);

  

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
    <section className='w-full max-w-275 m-auto pb-64'>
      
      <div className="pt-7.5">

        {/* <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mb-3.75">
          <p className='text-xs font-semibold text-boldblue'><strong>Contract Start:</strong> 12/12/2025 {" | "}</p>
          <p className='text-xs font-semibold text-boldblue'><strong>Contract Renewed:</strong> 12/12/2025 {" | "}</p>
          <p className='text-xs font-semibold text-boldblue'><strong>Contract End:</strong> 12/12/2025 {" | "}</p>
        </div> */}
        
        <p className='font-bold text-sm text-boldblue'>Posted {postedDate}</p>
        
        <h1 className="text-xl font-bold mb-3.75">{job?.jobTitle ?? ""}</h1>
        
        <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
          <div className="flex items-center gap-1.25">
            <FaRegHourglass size={15} />
            {job?.paymentType ?? ""} | {job?.employmentType ?? ""}
          </div>
          
          <div className="flex items-center gap-1.25">
            <FaLocationDot size={15} />
            {job?.location ?? ""}
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
                      {job?.requiredSkills?.length && index !== job.requiredSkills.length - 1 && ', '}
                    </span>
                  ))}
                </>
              ) : (
                <p className="text-gray-400">No specializations specified</p>
              )
            }
          </div>
        </div>
        
        {/* <div>
          <h3 className="font-semibold mb-3.75">Security Clearance</h3>
          <div className="flex flex-wrap gap-3">
            <span className="text-boldblue border border-boldblue font-semibold text-xs rounded-full px-3 py-1">
              Top Secret
            </span>
          </div>
        </div> */}

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

          {/* <button 
            onClick={() => setShowRateUserModal(true)} 
            className="bg-deepskyblue  text-sm text-white font-semibold py-2.5 px-5 rounded-lg transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer">
            Rate this client
          </button> */}

          {/* if rating exists - show this otherwise show the button above */}

          {/* <div className='flex flex-col gap-2.5 bg-skyblue rounded-lg w-full max-w-86.25 p-5'>
            <h3 className='font-bold text-[15px]'>Your Feedback To Client</h3>
            <RatingStars rating={4} />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque repellat sequi dolor nesciunt omnis ad.</p>
          </div> */}

        </article>
      </div>

    </section>

    {showRateUserModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <RateUserModal userToRate='Client' onClose={handleClose} />
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
          />
          <span className="h-fit w-fit">
            {contractSigned ? "Documents Signed" : "Sign Documents"}
          </span>
        </button>
        
        <button
          onClick={acceptJob}
          disabled={!contractSigned && hiringOffer?.status !== "offered"}
          className={`transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 text-xs md:text-sm font-semibold rounded-lg border ${
            contractSigned && hiringOffer?.status == "offered"
            ? 'cursor-pointer bg-boldblue border-boldblue text-white'
              : 'bg-white border-lightblue text-lightblue cursor-not-allowed'
          }`}
        >
          {hiringOffer?.status == "accepted" ? "Job Accepted" : hiringOffer?.status == "offered" ? "Accept Job": hiringOffer?.status}
        </button>
      </div>
    </>
  )
}

export default Details;