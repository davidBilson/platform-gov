import React, { useEffect, useState } from 'react';
import Proposal from './_proposal';
import { toast } from 'react-toastify';
import useAuthStore from '@/store/useAuth';
import { fetchJobApplications } from '@/api/job-api';
import { JobApplicationsResponse } from '@/types/proposals';
import { truncateDescription } from '@/utils/truncateDescription';
import { JobDetailsProps, JobApplication, ProposalData } from '@/types/proposalsList';
import { updateJobApplicationStatus } from '@/api/status-api';
import ProfileCard from '@/components/profile/ProfileCard';

const ProposalsList = ({ jobId }: JobDetailsProps) => {
  
  const [proposals, setProposals] = useState<JobApplicationsResponse | null>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const { userId, role } = useAuthStore();

  const handleViewProposal = (proposal: JobApplication) => {

    if (userId && role === "contractor") {
      toast.error('You cannot view this!');
      return;
    }
    
    if (userId && proposal.freelancerProfileId) {

      updateJobApplicationStatus({applicationId: proposal._id, status: "viewed"})

      setSelectedProposal({
        applicationId: proposal._id,
        jobId: proposal.jobId,
        contractorId: proposal.freelancerId,
        contractorName: proposal?.freelancerProfileId?.user?.name || '',
        contractorProfilePicture: proposal.freelancerProfileId.profileImage || '',
        name: proposal.freelancerProfileId.user?.name || '',
        title: proposal.freelancerProfileId.primaryPosition || '',
        skills: proposal.freelancerProfileId.skills || [],
        expertise: proposal.freelancerProfileId.expertise || [],
        certifications: proposal.freelancerProfileId.certifications || [],
        primaryPosition: proposal.freelancerProfileId.primaryPosition || '',
        location: `${proposal.freelancerProfileId.location?.state || ''}, ${proposal.freelancerProfileId.location?.country || ''}`.trim().replace(/^,\s*|\s*,/g, ''),
        coverLetter: proposal.coverLetter || '',
        proposedRate: proposal.proposedRate || 0,
        workHistory: []
      });

      setShowProposal(true);
    }
  };

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
  
  const handleClose = () => {
    setShowProposal(false);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!proposals || proposals?.data.length < 1) {
    return (
      <section className='p-6 text-center flex flex-col items-center justify-center gap-2.5'>
        <h2 className='text-lg text-center text-boldblue font-semibold'>📨 No proposals yet.</h2>
        <p className='text-center text-sm'>Check back later to see if any contractor apply.</p>
      </section>
    );
  }

  return (
    <section className='flex flex-col items-start gap-12 pb-20'>    
      {(proposals?.data as JobApplication[]).map((proposal: JobApplication) => {
        const truncatedCoverLetter = truncateDescription(proposal?.coverLetter || '');
        return (
          <section 
            key={proposal._id} 
            onClick={() => handleViewProposal(proposal)} 
            className='cursor-pointer w-full'
          >

            <ProfileCard data={proposal} />
            <p className="text-sm md:text-base">{truncatedCoverLetter}</p>
          </section>
        );
      })}

      {showProposal && selectedProposal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={handleOverlayClick}
        >
          <div 
            className="w-full md:max-w-3/6 h-screen bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            data-aos="fade-left"
          >
            <Proposal 
              handleClose={handleClose} 
              proposalData={selectedProposal}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProposalsList;