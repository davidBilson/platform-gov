
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { format } from 'date-fns';
import LoadingAnimation from '@/components/ui/loading';
import ProfileCard from '@/components/profile/ProfileCard';
import RateUserBtn from '@/components/rating/rateUserBtn';

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
  contract?: any;
}

const Details = ({applicationDetail, job, contract }: DetailsProps) => {

  const postedDate = job?.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';




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

  if (!job) {
    return <div className='flex items-center justify-center h-[60vh]'><LoadingAnimation /></div>
  }

  return (
    <>
     <section className='w-full m-auto pb-64'>
      
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
      <div className="pb-7.5 border-b border-b-deepskyblue mb-7.5">
        <p className="text-black whitespace-pre-line">{job?.description ?? ""}</p>
        <div className='flex items-center gap-2.5 mt-3.25'>
          <span className='px-2.5 py-1.25 text-xs text-boldblue font-semibold border border-boldblue rounded-full'>{job?.jobCategory ?? ""}</span>
        </div>
      </div>

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
      
      <div className="py-7.5 mt-7.5 border-y border-y-deepskyblue">
        <h2 className="font-semibold mb-3.75">Contractor/Consultant Information</h2>
        <article className='flex flex-wrap lg:flex-nowrap justify-between items-start gap-5'>
          <section>
            {applicationDetail && <ProfileCard data={applicationDetail} />}
          </section>
          {
            contract && contract?.status === 'completed' &&
            <RateUserBtn 
              contract={contract}
              onRatingSubmitted={() => {
                console.log('Rating submitted successfully');
              }}
            />
          }
        </article>
      </div>

    </section>
    </>
  )
}

export default Details;