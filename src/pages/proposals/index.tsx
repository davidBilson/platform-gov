import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActiveProposals from './_activeProposals';
import PendingProposals from './_pendingProposals';
import DraftProposals from './_draftProposals';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';


// Define interfaces based on your mongoose schema
interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

interface JobDetails {
  _id: string;
  userId: string;
  clientId?: string;
  clientName: string;
  clientLogo: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  employmentType: string;
  paymentType: string;
  price: number;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number;
  status: string;
  createdAt: string;
}

interface ProposedMilestone {
  description: string;
  price: number;
  dueDate: string;
}

interface Interview {
  scheduledDate: string;
  meetingLink: string;
  notes: string;
  completed: boolean;
}

interface Application {
  _id: string;
  jobId: JobDetails;
  freelancerId: string;
  freelancerProfileId: string;
  coverLetter: string;
  proposedRate: number;
  proposedMilestones: ProposedMilestone[];
  proposedRetainerAmount?: number;
  proposedRetainerFrequency?: string;
  proposedRetainerDuration?: number;
  availableStartDate?: string;
  availability: string;
  customAvailabilityNote?: string;
  relevantSkills: string[];
  relevantExperience?: string;
  attachments: Attachment[];
  certificationAcknowledgment: boolean;
  status: string;
  clientNotes?: string;
  interviews: Interview[];
  messageThreadId?: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  lastStatusChangeAt: string;
  draftExpiresAt: string | null;
}

const Proposals = () => {

  const { userId } = useAuthStore()

  const [applications, setApplications] = useState({
    pending: [],
    active: [],
    draft: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        setLoading(true);

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endPoint = process.env.NEXT_PUBLIC_GET_JOB_APPLICATION_BY_CONTRACTOR_ID?.replace(':id', userId);
        
        const response = await axios.get(
          `${baseURL}${endPoint}`
        );

        console.log(response)

        if (response.data.success) {
          // Filter applications by status
          const pendingApplications = response.data.data.filter((app: Application) => app.status === 'pending');
          const activeApplications = response.data.data.filter((app: Application) => app.status === 'active');
          const draftApplications = response.data.data.filter((app: Application) => app.status === 'draft');
          
          setApplications({
            pending: pendingApplications,
            active: activeApplications,
            draft: draftApplications
          });
        } else {
          toast.error('Failed to fetch applications');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        toast.error('Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, [userId]);



    // Handle the loading state
    if (loading) {
      return (
        <section className='h-screen w-full fixed top-0 left-0 z-50  flex items-center justify-end'>
          <section className='w-full h-screen  p-4 md:p-7.5 overflow-y-auto'>
            <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
            </div>
          </section>
        </section>
      );
    }

  return (
    
    <main className='p-5 pb-20 md:p-6'>
      <ActiveProposals applications={applications.active} />
      <PendingProposals applications={applications.pending} />
      <DraftProposals applications={applications.draft} />
    </main>

  );
};

export default Proposals;