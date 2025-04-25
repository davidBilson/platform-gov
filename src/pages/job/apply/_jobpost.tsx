import React from 'react';
import { format } from 'date-fns';
import { FaRegHourglass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import Link from 'next/link';
import { Jobs } from '@/types/jobs';

interface JobPostProps {
  job: Jobs;
  onApply: () => void;
}

const JobPost: React.FC<JobPostProps> = ({ job, onApply }) => {
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
        <p className="text-black whitespace-pre-line">{job.description}</p>
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
          <Link href="" className="cursor-pointer hover:underline font-medium">{job.clientName}</Link>
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
            <p className="font-medium">
              {job.clientLocation && job.clientLocation[0] ? 
                `${job.clientLocation[0]?.city}, ${job.clientLocation[0]?.state}` : 
                job.location}
            </p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Specializations</p>
            <p className="font-medium">{job.clientSpecializations?.join(', ')}</p>
          </div>
          
          {job.jobCategory && (
            <div>
              <p className="text-gray-500 text-sm">Job Category</p>
              <p className="font-medium">{job.jobCategory}</p>
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
    </section>
  );
};

export default JobPost;