import React from 'react';
import { ContractorListProps } from '@/types/contractors';
import { FaUser } from "react-icons/fa";
import { MdStar, MdStarBorder } from "react-icons/md";
import Image from 'next/image';
import { IoLocationOutline } from 'react-icons/io5';


const ContractorList: React.FC<ContractorListProps> = ({ contractors }) => {
  if (!contractors || contractors.length === 0) {
    return <section>No contractors found</section>;
  }

  // Truncate description if it's too long
  const truncateBio = (text: string, maxLength = 200): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  const renderRating = () => {

    const rating = 4  // mock rating
    const maxRating = 5;

    return (
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => (
          i < rating ? 
            <MdStar key={i} className="text-deepskyblue text-lg" /> : 
            <MdStarBorder key={i} className="text-deepskyblue text-lg" />
        ))}
      </div>
    );
  };

  return (
    <section className="pt-7.5 pb-10 flex flex-col gap-7.5">
        {contractors.map((contractor) => (
          <div 
            key={contractor._id} 
          >

            <div className='flex flex-col md:flex-row items-start gap-4 md:gap-18.25 mb-6 md:mb-10.25'>

                <div className='flex items-center  gap-4.25 w-full md:max-w-[20%] h-26  '>
                  
                  <div className='border border-boldblue rounded-full h-19 w-19 flex items-center justify-center overflow-hidden'>
                    {contractor.profileImage ? (
                      <div className='border border-boldblue rounded-full h-19 w-19 flex items-center justify-center'>
                        <Image
                          src={contractor.profileImage} 
                          alt={`${contractor.primaryPosition} profile`}
                          width={76}
                          height={76}
                          className='h-19 w-19 overflow-hidden rounded-full object-cover flex items-center justify-center'
                          />
                      </div>
                      ) : 
                      <div className='text-white flex items-center justify-center w-16 h-16 md:w-[87px] md:h-[87px] rounded-full bg-boldblue border border-boldblue'>
                        <FaUser size={24} className="md:text-4xl" />
                      </div>
                    }
                  </div>

                  <div className='flex flex-col items-start justify-center gap-1 md:gap-2.5 w-1/2 h-full'>
                    <p className="text-lg md:text-xl font-semibold">
                      {contractor.user.name.split(' ')[0]} {contractor.user.name.split(' ')[1]?.charAt(0)}.
                    </p>
                    <p className='text-xs font-bold'>{contractor.primaryPosition ?? "Profession"}</p>
                    <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} />{contractor.location.state !== "" ? contractor?.location.state : "no location"}</p>
                  </div>

                </div>

                {/* *********** 1b *********** */}
                <div className='w-full md:max-w-[80%] mt-4 md:mt-0'>
                  <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
                    <h3 className='font-bold text-sm text-boldblue'>{contractor.primaryPosition}</h3>
                    {renderRating()}
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
                    {contractor.skills.slice(0, 3).map((skill, index) => (
                      <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {skill}
                      </span>
                    ))}
                    
                    {contractor.expertise.slice(0, 2).map((exp, index) => (
                      <span key={`skill-${index}`} className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {exp}
                      </span>
                    ))}
                    
                    {contractor.certifications.slice(0, 2).map((cert, index) => (
                      <span key={`cert-${index}`} className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
            {/* *********** 2 *********** */}
            <p className="text-sm md:text-base">{truncateBio(contractor.bio)}</p>
          </div>
        ))}
    </section>
  );
};

export default ContractorList;