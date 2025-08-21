import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { fetchJob } from '@/api/job-api';
import { fundProject, getPlatformFee } from '@/api/payment/payment-api';
import useAuthStore from '@/store/useAuth';
import { toast } from 'react-toastify';

const FundProjectPage = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { userId } = useAuthStore();
  
  interface Job {
    jobTitle: string;
    description: string;
    jobCategory: string;
    employmentType: string;
    location: string;
    startDate?: string | null;
    requiredSkills?: string[];
    paymentType: 'fixed-price' | 'retainer' | 'hourly' | 'commission';
    price: number;
    retainerAmount?: number;
    retainerFrequency?: string;
    userId: { _id: string } | null;
    status: string;
    isFunded?: boolean;
  }

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [clientFee, setClientFee] = useState(0);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !userId) return;

      try {
        const jobData = await fetchJob(jobId as string);
        if (!jobData) {
          toast.error('Job not found');
          setLoading(false);
          return;
        }
        setJob(jobData);
        setIsAuthorized(jobData?.userId?._id === userId);

      } catch (err) {
        toast.error('Failed to fetch job details');
        setLoading(false);
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, userId]);

  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const response = await getPlatformFee();

        if (response && response.success) {
          setClientFee(response.clientFee / 100 || 0.05);
        } else {
          console.error('Failed to fetch platform fee:');
          setClientFee(0.05);
        }

      } catch (err) {
        console.error('Error fetching platform fee:', err);
        setClientFee(0.05);
      }
    };

    fetchPlatformFee();
  }, []);

  const calculateFundingAmount = () => {
    if (!job) return 0;

    switch (job.paymentType) {
      case 'fixed-price': return job.price;
      case 'retainer': return job.retainerAmount || 0;
      case 'hourly': return job.price * 10;
      default: return 0;
    }
  };

  const getFundingDescription = () => {
    if (!job) return '';

    switch (job.paymentType) {
      case 'fixed-price':
        return 'Total project amount will be held in escrow until completion';
      case 'retainer':
        return `First ${job.retainerFrequency} payment of ${job.retainerAmount}`;
      case 'hourly':
        return 'Initial funding for estimated 10 hours of work';
      default:
        return 'Total project amount will be held in escrow until completion';
    }
  };

  const handleFundProject = async () => {
    if (!jobId) return;
    setFundingLoading(true);

    try {
      const response = await fundProject(jobId as string, userId);
      if (response.success) {
        toast.success('Project funded successfully!');
        router.push('/job/manage');
      } else {
        console.log(response, response.message)
        toast.error(response.message || 'Funding failed');
      }
    } catch (err) {
      toast.error('Error funding the project');
      console.error('Error funding project:', err);
    } finally {
      setFundingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h2>
          <p className="text-mediumgray mb-4">You are not authorized to fund this project</p>
          <button
            onClick={() => router.back()}
            className="bg-boldblue text-white py-2 px-4 rounded-lg hover:bg-boldblue/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-mediumgray mb-4">The requested project could not be found</p>
          <button
            onClick={() => router.back()}
            className="bg-boldblue text-white py-2 px-4 rounded-lg hover:bg-boldblue/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fundingAmount = calculateFundingAmount();
  const platformFee = fundingAmount * clientFee;
  const totalAmount = fundingAmount + platformFee;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Fund Project</h1>
          <p className="text-mediumgray">
            Review project details and confirm funding to activate your contract with secure escrow protection.
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-8">

            {/* Project Details */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-boldblue to-boldblue rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-darkgray">Project Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-darkgray text-xl mb-3">{job.jobTitle}</h3>
                  <p className="text-mediumgray leading-relaxed">{job.description}</p>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-skyblue/5 to-skyblue/5 rounded-xl border border-lightblue/20">
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Category</span>
                    <p className="text-darkgray font-semibold">{job.jobCategory}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Type</span>
                    <p className="text-darkgray font-semibold">{job.employmentType}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Location</span>
                    <p className="text-darkgray font-semibold">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Start Date</span>
                    <p className="text-darkgray font-semibold">
                      {job.startDate ? new Date(job.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'TBD'}
                    </p>
                  </div>
                </div>

                {/* Required Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide mb-2 block">Required Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-lightblue/20 text-boldblue text-sm font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-darkgray">Payment & Funding</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">

                {/* Payment Type */}
                <div className="bg-gradient-to-br from-skyblue/5 to-faintskyblue/5 rounded-xl p-6 border border-lightblue/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-mediumgray">Payment Type</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-boldblue to-boldblue text-white text-sm font-medium rounded-full capitalize">
                      {job.paymentType.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-mediumgray text-sm">{getFundingDescription()}</p>
                </div>

                {/* Funding Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-darkgray">Funding Breakdown</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                      <span className="text-mediumgray">
                        {job.paymentType === 'retainer'
                          ? `${job.retainerFrequency} payment`
                          : job.paymentType === 'hourly'
                            ? 'Initial funding (10 hrs)'
                            : 'Project amount'
                        }
                      </span>
                      <span className="font-semibold text-darkgray">${fundingAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                      <span className="text-mediumgray">Platform fee ({clientFee * 100}%)</span>
                      <span className="font-semibold text-darkgray">${platformFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-boldblue to-boldblue rounded-lg">
                      <span className="font-bold text-white">Total Amount</span>
                      <span className="font-bold text-white text-lg">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleFundProject}
                  disabled={fundingLoading}
                  className={`group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold rounded-xl cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30 ${fundingLoading
                      ? 'bg-mediumgray text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-aquagreen to-aquagreen text-white hover:shadow-xl transform hover:scale-105'
                    }`}
                >
                  {fundingLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="mr-2">Confirm Funding</span>
                      <span className="font-bold">${totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center text-sm text-mediumgray mt-6">
                <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your payment information is protected with bank-level security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundProjectPage;