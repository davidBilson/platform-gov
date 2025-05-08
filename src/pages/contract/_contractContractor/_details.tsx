import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import RateUserModal from '@/components/ui/rateUserModal';
// import RatingStars from '@/components/ui/rating';
import ProfilePicture from '@/components/ui/profilePicture';
import { format } from 'date-fns';
import SignContractModal from '../_contractorContracts/_signContractModal';

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

const Details = ({ job }: { job: Job }) => {

  const [showRateUserModal, setShowRateUserModal] = useState(false);
  const [showSignContractModal, setShowSignContractModal] = useState(false);

  const handleClose = () => {
    setShowRateUserModal(false);
    setShowSignContractModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const postedDate = job?.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';

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
        <SignContractModal jobId='id' onClose={handleClose} />
      </div>
    )}



      {/* action buttons */}
      <div className="flex items-center justify-center gap-2.5 md:gap-7.5 py-7.5 px-6 fixed bottom-0 right-0 bg-skyblue w-full border-t border-t-boldblue">
        <button 
          onClick={() => setShowSignContractModal(true)}
          className='flex items-center justify-center gap-2 p-2 rounded-lg border border-boldblue bg-white transition transform active:scale-95 hover:shadow-lg duration-300 ease-in-out cursor-pointer text-xs md:text-sm font-semibold'
        > 
            <img src="/assets/documents_logo.svg" alt="document_logo" />
            <span className="h-fit w-fit">Sign Documents</span>
        </button>
        
        <button
          // onClick={handleSubmit}
          className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
        >
          Accept Job
        </button>
      </div>
    </>
  )
}

export default Details;