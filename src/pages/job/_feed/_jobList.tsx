import React from 'react';
import { format } from 'date-fns';
import { JobListProps } from '@/types/jobs';
import { FaRegHourglass } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import Link from 'next/link';

const JobList: React.FC<JobListProps> = ({ job }) => {
  // Calculate time since job was posted
  const postedTime = format(new Date(job.createdAt), 'M/d/yyyy h:mm a');
  
  // Format payment information based on payment type
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

  // Truncate description if it's too long
  const truncateDescription = (text: string, maxLength = 200): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <section className="border-b border-b-lightblue pt-7.5 pb-10">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <p className='text-xs font-semibold text-boldblue'>Posted {postedTime}</p>
        <div className='text-boldblue'>
          {/* when user clicks on apply, it should navigate to /job/apply and take the job._id with it to that route */}
          <Link href={`/job/apply?id=${job._id}`} className="text-sm font-bold mr-2 transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer">Apply</Link> | 
          <button className="text-sm font-bold ml-2 transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer">Save</button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3.75">{job.jobTitle}</h3>
      
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
      
      <p className="text-gray-600 mb-4">
        {truncateDescription(job.description)}
      </p>
      
      <div className="flex flex-wrap gap-5.5 mb-3.75">
        {job.requiredSkills.map((skill, index) => (
          <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1">
            {skill}
          </span>
        ))}
        
        {job.requiredCertifications.map((cert, index) => (
          <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-3 py-1">
            {cert}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-5">
        <div className="w-8.75 h-8.75 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
          {
            job.clientLogo &&
            <img src={job.clientLogo} alt={job.clientName} width={35} height={35} className="rounded-full" />
          }
        </div>
        <Link href="" className="font-semibold text-sm hover:underline">{job.clientName}</Link>
      </div>
    </section>
  );
};

export default JobList;