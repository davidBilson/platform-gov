import React, { useEffect, useState } from 'react';
import ProfilePicture from '@/components/ui/profilePicture';
import { IoLocationOutline } from 'react-icons/io5';
import Proposal from './_proposal';
import { toast } from 'react-toastify';
import useAuthStore from '@/store/useAuth';
import { fetchJobApplications } from '@/api/job-api';
import { JobApplicationsResponse } from '@/types/proposals';
import { truncateDescription } from '@/utils/truncateDescription';

interface JobDetailsProps {
  jobId?: string | string[];
}

const ProposalsList = ({jobId}: JobDetailsProps)  => {

  const [proposals, setProposals] = useState<JobApplicationsResponse | null>(null);
  const [showProposal, setShowProposal ] = useState(false);
  const { userId, role } = useAuthStore();

  useEffect(() => {
    const loadProposals = async () => {
      if (jobId) {
        try {
          const data = await fetchJobApplications(jobId as string);
          setProposals(data);
        } catch (error) {
          console.error('Error loading proposals:', error);
          toast.error('Failed to load proposals');
        }
      }
    };

    loadProposals();
  }, [jobId]);
    
    // Function to show the application form
    const handleViewProposal = () => {
      if (userId && role === "contractor") {
        return toast.error('You cannot view this!')
      }
      if (userId) {
        setShowProposal(true);
      }
    };
  
    // Function to close the application form
    const handleClose = () => {
      setShowProposal(false);
    };
    
    // Function to close when clicking overlay
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };
    


  if (!proposals || proposals?.data.length < 1) {
    return <section className='p-6 text-center flex flex-col items-center justify-center gap-2.5'>
      <h2 className='text-lg text-center text-boldblue font-semibold'>📨 No proposals yet.</h2>
      <p className='text-center text-sm'>Check back later to see if any contractor apply.</p>
    </section>
  }

  if (proposals && proposals?.data.length > 0 ) {
  return (
    <section className='flex flex-col items-start gap-12'>    
      {proposals?.data.map((proposal) => {
      const truncatedCoverLetter = truncateDescription(proposal?.coverLetter)
      return  (

      <section key={proposal._id} onClick={handleViewProposal} className='cursor-pointer w-full'>
          <div className='flex flex-col lg:grid lg:grid-cols-10 lg:grid-rows-1 mb-6 md:mb-10.25 w-full'>
              
              <div className='lg:col-span-3 lg:row-span-1 flex items-center gap-4 h-26'>
                <div>
                  <ProfilePicture source={proposal?.freelancerProfileId?.profileImage} alt={proposal?.freelancerProfileId?.user?.name} />
                </div>
                <div className='flex flex-col items-start justify-center gap-1 md:gap-2.5 w-1/2 h-full'>
                  <p className="text-lg md:text-xl font-semibold">{proposal?.freelancerProfileId?.user?.name}</p>
                  <p className='text-xs font-bold'>{proposal?.freelancerProfileId?.primaryPosition}</p>
                  <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} /> {proposal?.freelancerProfileId?.location?.state}, {proposal?.freelancerProfileId?.location?.country}</p>
                </div>
              </div>

              <div className='lg:col-span-7 lg:row-span-1 mt-4 md:mt-0 flex flex-col items-start justify-center'>
                <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
                  <h3 className='font-bold text-sm text-boldblue'>{proposal?.freelancerProfileId?.primaryPosition}</h3>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
                  {proposal?.freelancerProfileId?.skills?.map((skill, index) => (
                    <span 
                      key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {skill}
                    </span>
                  ))}
                  
                  {proposal?.freelancerProfileId?.expertise?.map((exp, index) => (
                    <span 
                      key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {exp}
                    </span>
                  ))}
                  
                  {proposal?.freelancerProfileId?.certifications?.map((cert, index) => (
                    <span
                      key={`cert-${index}`} 
                      className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
          </div>

          <p className="text-sm md:text-base">{truncatedCoverLetter}</p>
          
          </section>
      )})}

          {showProposal && (
            <div 
              className='fixed inset-0 bg-black/50 z-50 flex items-center justify-end transition-opacity duration-300 ease-in-out'
              onClick={handleOverlayClick}
            >
              <div 
                className="w-full md:max-w-3/6 h-screen bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{
                  animation: 'slideIn 0.3s forwards'
                }}
              >
                <Proposal handleClose={handleClose} />
              </div>
            </div>
          )}
      </section>
    )
  }
}

export default ProposalsList