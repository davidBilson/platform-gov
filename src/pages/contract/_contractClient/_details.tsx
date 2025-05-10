import { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import RateUserModal from '@/components/rating/rateUserModal';
import { format } from 'date-fns';
import LoadingAnimation from '@/components/ui/loading';
import ProfileCard from '@/components/profile/ProfileCard';

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

interface FreelancerProfile {
  profileImage?: string;
  user?: {
    name?: string;
  };
  primaryPosition?: string;
  location?: {
    city?: string;
    country?: string;
  };
  skills?: string[];
  expertise?: string[];
  certifications?: string[];
}

interface ApplicationDetail {
  freelancerId: string;
  freelancerProfileId: FreelancerProfile;
}

interface DetailsProps {
  applicationDetail?: ApplicationDetail;
  job: Job;
  jobId: string;
}

const Details = ({applicationDetail, job }: DetailsProps) => {

  const [showRateUserModal, setShowRateUserModal] = useState(false);
  const postedDate = job?.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';

  const handleClose = () => {
    setShowRateUserModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  

  if (!job) {
    return <div className='flex items-center justify-center h-[60vh]'><LoadingAnimation /></div>
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

        <p className='font-semibold text-xs text-boldblue'>Posted {postedDate}</p>
        
        <h1 className="text-xl font-bold my-3.75">{job?.jobTitle ?? ""}</h1>
        
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
      <div className="pb-7.5 border-b border-b-deepskyblue mb-7.5">
        <p className="text-black whitespace-pre-line">{job?.description ?? ""}</p>
        <div className='flex items-center gap-2.5 mt-3.25'>
          <span className='px-2.5 py-1.25 text-xs text-boldblue font-semibold border border-boldblue rounded-full'>{job?.jobCategory ?? ""}</span>
        </div>
      </div>
      
      {/* Skills and Certifications section */}
      {/* <div className="py-7.5 border-b border-b-deepskyblue">
      </div>
         */}

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

        {/* 
          <div>
            <h3 className="font-semibold mb-3.75">Security Clearance</h3>
            <TopSecret />
          </div> 
        */}

      </div>
      
      <div className="py-7.5 mt-7.5 border-y border-y-deepskyblue">
        <h2 className="font-semibold mb-3.75">Contractor/Consultant Information</h2>
        <article className='flex flex-wrap justify-between items-start gap-5'>
          <section>
            {applicationDetail && <ProfileCard data={applicationDetail} />}
          </section>
        </article>
      </div>

    </section>
    {showRateUserModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <RateUserModal userToRate='Contractor' onClose={handleClose} />
      </div>
    )}
    </>
  )
}

export default Details;