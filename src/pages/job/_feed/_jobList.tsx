import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { JobListProps } from '@/types/jobs';

const JobList: React.FC<JobListProps> = ({ job }) => {
  // Calculate time since job was posted
  const postedTime = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });
  
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
    <section className="border-t border-gray-200 pt-4">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <p>Posted {postedTime}</p>
        <div>
          <button className="text-blue-500 font-semibold mr-2">Apply</button> | 
          <button className="text-blue-500 font-semibold ml-2">Save</button>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">{job.jobTitle}</h3>
      
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {getPaymentInfo()} | {job.employmentType}
        </div>
        
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        {truncateDescription(job.description)}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requiredSkills.map((skill, index) => (
          <span key={`skill-${index}`} className="bg-blue-500 text-white text-xs rounded-full px-3 py-1">
            {skill}
          </span>
        ))}
        
        {job.requiredCertifications.map((cert, index) => (
          <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-3 py-1">
            {cert}
          </span>
        ))}
      </div>
      
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <span className="font-medium">{job.userRole === 'individual' ? 'Individual' : 'Company'}</span>
      </div>
    </section>
  );
};

export default JobList;