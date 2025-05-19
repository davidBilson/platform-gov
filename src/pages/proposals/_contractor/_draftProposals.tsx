import Link from 'next/link';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { format } from 'date-fns';
import { Application } from '@/types/proposals';

interface DraftProposalsProps {
  applications: Application[];
}

const DraftProposals: React.FC<DraftProposalsProps> = ({ applications = [] }) => {

  const truncateDescription = (text: string | undefined, maxLength = 200): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (error) {
        console.log(error)
      return 'Invalid date';
    }
  };

  // Function to handle job details whether it's an object or string ID
  const getJobDetails = (application: Application): {
    jobTitle: string;
    description: string;
    location: string;
    clientName: string;
    clientLogo: string;
    clientId?: string;
  } => {
    if (typeof application?.jobId === 'object' && application?.jobId !== null) {
      return {
        jobTitle: application?.jobId?.jobTitle || 'Job Title',
        description: application?.jobId?.description || 'No description provided',
        location: application?.jobId?.location || 'Remote',
        clientName: application?.jobId?.clientName || 'Client',
        clientLogo: application?.jobId?.clientLogo || 'https://res.cloudinary.com/dhktac9xz/image/upload/v1745753771/profiles/1745753767314-858168824_uft9ll.png',
        clientId: application?.jobId?.clientId || application?.jobId?.userId
      };
    }
    
    // Default values if jobId is just a string
    return {
      jobTitle: 'Job Title',
      description: 'No description provided',
      location: 'Remote',
      clientName: 'Client',
      clientLogo: 'https://res.cloudinary.com/dhktac9xz/image/upload/v1745753771/profiles/1745753767314-858168824_uft9ll.png',
    };
  };

  // Convert availability from enum values to display text
  const getAvailabilityDisplay = (availability?: string): string => {
    const availabilityMap: Record<string, string> = {
      'immediate': 'Immediately',
      'one_week': 'Within one week',
      'two_weeks': 'Within two weeks',
      'one_month': 'Within one month',
      'custom': 'Custom'
    };
    
    return availability ? availabilityMap[availability] || 'Full Time' : 'Full Time';
  };

  return (
    <section className='w-full max-w-275 m-auto border-b border-b-skyblue pb-10 mb-7.5'>
      <h2 className='pb-5 mb-7.5 text-darkgray border-b border-b-deepskyblue'>Draft Proposals</h2>
      
      {applications.length === 0 ? (
        <section className="p-5 bg-gray-50 rounded-lg border border-lightblue">
        <p className="text-center text-gray-600">No draft proposals</p>
      </section>
      ) : (
        applications.map((application) => {
          const jobDetails = getJobDetails(application);
          
          return (
            <article key={application?._id} className="">
              <p className='text-xs text-boldblue font-semibold mb-5'>
                Draft saved {formatDate(application?.createdAt)}
              </p>
              
              <h3 className="text-xl font-semibold mb-3.75">
                {jobDetails?.jobTitle}
              </h3>
              
              <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
                <div className="flex items-center gap-1.25">
                  <FaRegHourglass size={15} />
                  {`Hourly | $${application?.proposedRate || 'N/A'}`} | {getAvailabilityDisplay(application?.availability)}
                </div>
                
                <div className="flex items-center gap-1.25">
                  <FaLocationDot size={15} />
                  {jobDetails.location}
                </div>
              </div>

              <p className="text-gray-600 mb-3.75">
                {truncateDescription(jobDetails?.description)}
              </p>

              <div className='flex items-center flex-wrap gap-2.5 mb-3.75'>
                <Link
                  href={`/job/apply?id=${typeof application?.jobId === 'object' && application?.jobId !== null ? application?.jobId?._id : application?.jobId}`}
                  className='text-boldblue border border-boldblue rounded-lg py-2.5 px-5 transition transform active:scale-95 hover:bg-boldblue hover:text-white duration-300 ease-in-out'
                >
                  Edit Proposal
                </Link>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-8.75 h-8.75 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                  <img 
                    src={jobDetails?.clientLogo} 
                    alt={jobDetails?.clientName} 
                    width={35} 
                    height={35} 
                    className="rounded-full" 
                  />
                </div>
                <Link 
                  href={jobDetails?.clientId ? `/client-profile/${jobDetails?.clientId}` : '#'}
                  className="font-semibold text-sm hover:underline"
                >
                  {jobDetails?.clientName}
                </Link>
              </div>
            </article>
          );
        })
      )}
      
    </section>
  );
};

export default DraftProposals;