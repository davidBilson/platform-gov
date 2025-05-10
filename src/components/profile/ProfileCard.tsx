import Link from 'next/link';
import { IoLocationOutline } from 'react-icons/io5';
import ProfilePicture from './profilePicture';

interface ProfileCardProps {
  data: {
    freelancerId: string;
    freelancerProfileId: {
      profileImage?: string;
      user?: {
        name?: string;
      };
      primaryPosition?: string;
      location?: {
        state?: string;
        country?: string;
      };
      skills?: string[];
      expertise?: string[];
      certifications?: string[];
    };
  };
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ data, className = '' }) => {
  

  return (
    <div className={`flex flex-col lg:grid lg:grid-cols-10 lg:grid-rows-1 mb-6 md:mb-10.25 w-full ${className}`}>
      {/* Left Section - Profile Info */}
      <div className='lg:col-span-3 lg:row-span-1 flex items-center gap-4 h-26'>
        <div>
          <ProfilePicture
            source={data?.freelancerProfileId?.profileImage ?? ""} 
            alt={data?.freelancerProfileId?.user?.name || 'Freelancer'} 
          />
        </div>
        <div className='flex flex-col items-start justify-center gap-1 md:gap-2.5 w-1/2 h-full'>
          <Link 
            onClick={(e) => e.stopPropagation()} 
            href={`/profile/${data?.freelancerId}`} 
            className="text-lg md:text-xl font-semibold hover:cursor-pointer hover:underline"
          >
            {data?.freelancerProfileId?.user?.name}
          </Link>
          <p className='text-xs font-bold'>
            {data?.freelancerProfileId?.primaryPosition}
          </p>
          {data?.freelancerProfileId?.location && (
            <p className='text-xs font-bold flex items-center gap-1'>
              <IoLocationOutline size={20} /> 
              {data?.freelancerProfileId.location.state}, {data?.freelancerProfileId.location.country}
            </p>
          )}
        </div>
      </div>

      {/* Right Section - Skills and Expertise */}
      <div className='lg:col-span-7 lg:row-span-1 mt-4 md:mt-0 flex flex-col items-start justify-center'>
        <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
          {data?.freelancerProfileId?.primaryPosition && (
            <h3 className='font-bold text-sm text-boldblue'>
              {data?.freelancerProfileId.primaryPosition}
            </h3>
          )}
        </div>
        
        {(data?.freelancerProfileId?.skills || data?.freelancerProfileId?.expertise || data?.freelancerProfileId?.certifications) && (
          <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
            {data?.freelancerProfileId?.skills?.map((skill, index) => (
              <span 
                key={`skill-${index}`} 
                className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1"
              >
                {skill}
              </span>
            ))}
            
            {data?.freelancerProfileId?.expertise?.map((exp, index) => (
              <span 
                key={`expertise-${index}`} 
                className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1"
              >
                {exp}
              </span>
            ))}
            
            {data?.freelancerProfileId?.certifications?.map((cert, index) => (
              <span
                key={`cert-${index}`} 
                className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1"
              >
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;