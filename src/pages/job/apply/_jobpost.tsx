import { format } from 'date-fns';
import { FaRegHourglass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdStar, MdStarBorder } from "react-icons/md";
import Link from 'next/link';
import { Jobs } from '@/types/jobs';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getUserRatings } from '@/api/rating-api';

interface JobPostProps {
  job: Jobs;
  onApply: () => void;
}

// Define a type for location object
interface LocationObject {
  city?: string;
  state?: string;
}

interface Rating {
  _id: string;
  contractId: string;
  jobId: string | { jobTitle: string };
  reviewer: string | { _id: string; name: string };
  reviewee: string | { _id: string; name: string };
  role: 'client' | 'contractor';
  rating: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

const JobPost: React.FC<JobPostProps> = ({ job, onApply }) => {
  const [clientRatings, setClientRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState<boolean>(false);

  // Format the date
  const postedDate = job.createdAt ? format(new Date(job.createdAt), 'MMMM d, yyyy') : 'Recently';
  
  // Format payment information based on payment type
  const getPaymentInfo = () => {
    if (job.paymentType === 'hourly') {
      return `Hourly | $${job.price}`;
    } else if (job.paymentType === 'fixed-price') {
      return `Fixed Price | $${job.price}`;
    } else if (job.paymentType === 'retainer' && job.retainerAmount && job.retainerFrequency) {
      return `Retainer | $${job.retainerAmount}/${job.retainerFrequency.toLowerCase()}`;
    }
    return '';
  };

  // Helper function to safely get client location
  const getClientLocation = (): string => {
    if (Array.isArray(job.clientLocation) && job.clientLocation.length > 0) {
      const locationObj = job.clientLocation[0] as unknown as LocationObject;
      if (locationObj && typeof locationObj === 'object' && 'country' in locationObj && 'state' in locationObj) {
        return `${locationObj.state}${locationObj.state && ','} ${locationObj.country}`;
      }
    }
    return job.location;
  };

  // Function to get client ratings
  const getClientRatings = useCallback(async (clientId: string): Promise<void> => {
    try {
      setRatingsLoading(true);
      const ratings = await getUserRatings(clientId, 'client');
      const processedRatings = (ratings || []).map(rating => ({
        ...rating,
        _id: rating._id || '',
        createdAt: rating.createdAt ? String(rating.createdAt) : '',
        updatedAt: rating.updatedAt ? String(rating.updatedAt) : '',
      }));
      setClientRatings(processedRatings);
    } catch (error) {
      console.error('Error fetching client ratings:', error);
      setClientRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  }, []);

  // Fetch client ratings on component mount
  useEffect(() => {
    const clientId = job.userId?._id || job.userId;
    
    if (clientId) {
      getClientRatings(String(clientId));
    }
  }, [job.userId, getClientRatings]);

  // Calculate overall client rating
  const overallRating = useMemo((): { average: number; count: number } => {
    if (!clientRatings || clientRatings.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const sum = clientRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / clientRatings.length;
    
    return { 
      average: Math.round(average * 10) / 10,
      count: clientRatings.length 
    };
  }, [clientRatings]);

  // Helper function to render star ratings
  const renderRating = useCallback((rating: number, maxRating: number = 5, showCount: boolean = false) => {
    const filledStars = Math.floor(rating);
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {Array.from({ length: maxRating }).map((_, i) => (
            i < filledStars ? 
              <MdStar key={i} className="text-deepskyblue text-lg" /> : 
              <MdStarBorder key={i} className="text-deepskyblue text-lg" />
          ))}
        </div>
        {showCount && (
          <span className="text-sm text-gray-600 ml-1">
            ({rating.toFixed(1)})
          </span>
        )}
      </div>
    );
  }, []);

  return (
    <section className='w-full max-w-275 m-auto pb-64'>
      {/* Header section */}
      <div className="pt-7.5">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3.75">
          <p className='text-xs font-semibold text-boldblue'>Posted {postedDate}</p>
        </div>
        
        <h1 className="text-3xl font-bold mb-3.75">{job.jobTitle}</h1>
        
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
      <div className="pb-7.5 border-b border-b-gray-300">
        <p className="text-black whitespace-pre-line">{String(job.description)}</p>
      </div>
      
      {/* Skills and Certifications section */}
      <div className="py-7.5 border-b border-b-gray-300">
        <div className="mb-3.75">
          <h3 className="font-semibold mb-3.75">Required Skills</h3>
          <div className="flex flex-wrap gap-3">
            {job.requiredSkills.map((skill, index) => (
              <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {job.requiredCertifications && job.requiredCertifications.length > 0 && (
          <div className="mb-3.75">
            <h3 className="font-semibold mb-3.75">Required Certifications</h3>
            <div className="flex flex-wrap gap-3">
              {job.requiredCertifications.map((cert, index) => (
                <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-3 py-1">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {job.requiresRegisteredLobbyist && (
          <div>
            <h3 className="font-semibold mb-3.75">Additional Requirements</h3>
            <div className="flex flex-wrap gap-3">
              <span className="text-boldblue border border-boldblue font-semibold text-xs rounded-full px-3 py-1">
                Requires Registered Lobbyist
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Client Information */}
      <div className="py-7.5">
        <h2 className="font-semibold mb-3.75">Client Information</h2>
        
        <div className="flex items-center gap-5 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {job.clientLogo && (
              <img src={job.clientLogo} alt={job.clientName} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col">
            <Link href="" className="cursor-pointer hover:underline font-medium">{job.clientName}</Link>
            {/* Client Rating */}
            <div className="flex items-center gap-2 mt-1">
              {ratingsLoading ? (
                <span className="text-xs text-gray-500">Loading ratings...</span>
              ) : overallRating.count > 0 ? (
                <>
                  {renderRating(overallRating.average)}
                  <span className="text-xs text-gray-600">
                    ({overallRating.average.toFixed(1)}) • {overallRating.count} review{overallRating.count !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500">No reviews yet</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-500 text-sm">Industry</p>
            <p className="font-medium">{job.clientIndustry}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Company Size</p>
            <p className="font-medium">{job.clientCompanySize} employees</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Location</p>
            <p className="font-medium">{getClientLocation()}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Specializations</p>
            <p className="font-medium">{job.clientSpecializations?.join(', ')}</p>
          </div>
          
          {job.jobCategory && (
            <div>
              <p className="text-gray-500 text-sm">Job Category</p>
              <p className="font-medium">{String(job.jobCategory)}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Apply button at bottom */}
      <div>
        <button 
          onClick={onApply} 
          className="bg-boldblue text-white font-semibold py-3 px-10 rounded-lg transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer"
        >
          Apply
        </button>
      </div>

      {/* Client Ratings Section */}
      {clientRatings.length > 0 && (
        <section className='my-7'>
          <h3 className='font-semibold mb-4'>Recent Reviews</h3>
          <div className='space-y-4'>
            {clientRatings.slice(0, 3).map((rating, index) => (
              <div key={rating._id || index} className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-semibold'>
                    {typeof rating.reviewer === 'object' && rating.reviewer !== null && 'name' in rating.reviewer 
                      ? (rating.reviewer as { name: string }).name 
                      : rating.reviewer}
                  </h4>
                  <span className='text-sm text-gray-500'>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className='mb-3.75'>
                  {typeof rating.jobId === 'object' && rating.jobId !== null && 'jobTitle' in rating.jobId 
                    ? (rating.jobId as { jobTitle: string }).jobTitle 
                    : ''}
                </p>
                <div className='flex items-center gap-2 mb-2'>
                  {renderRating(rating.rating)}
                </div>
                {rating.comments && (
                  <p className='text-sm text-gray-700'>{rating.comments}</p>
                )}
              </div>
            ))}
            
            {clientRatings.length > 3 && (
              <div className='text-center'>
                <button className='text-boldblue text-sm font-semibold hover:underline'>
                  View all {clientRatings.length} reviews
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
};

export default JobPost;