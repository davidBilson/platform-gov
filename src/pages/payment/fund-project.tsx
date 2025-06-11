import React, { useState } from 'react';

const FundProjectPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock job details
  const jobDetails = {
    _id: "65f8a9b2c1d4e5f6g7h8i9j0",
    jobTitle: "Modern E-commerce Website Development",
    description: "We need a full-stack developer to build a modern, responsive e-commerce platform with React/Next.js frontend and Node.js backend. The project includes user authentication, payment integration, inventory management, and admin dashboard.",
    jobCategory: "Web Development",
    paymentType: 'fixed-price',
    price: 2500,
    retainerAmount: 800,
    retainerFrequency: 'monthly',
    retainerDuration: 6,
    requiredSkills: ["React", "Node.js", "MongoDB", "Stripe API", "TypeScript"],
    requiredCertifications: ["AWS Certified Developer"],
    location: "Remote",
    startDate: "2025-06-15",
    employmentType: "Contract"
  };

  const calculateFundingAmount = () => {
    switch (jobDetails.paymentType) {
      case 'fixed-price':
        return jobDetails.price;
      case 'retainer':
        return jobDetails.retainerAmount || 0;
      case 'hourly':
        return jobDetails.price * 40;
      default:
        return 0;
    }
  };

  const getFundingDescription = () => {
    switch (jobDetails.paymentType) {
      case 'fixed-price':
        return 'Total project amount will be held in escrow until completion';
      case 'retainer':
        return `First ${jobDetails.retainerFrequency} payment of $${jobDetails.retainerAmount}`;
      case 'hourly':
        return 'Initial funding for estimated 40 hours of work';
      default:
        return 'Total project amount will be held in escrow until completion';
    }
  };

  const handleFundProject = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      alert('Project funded successfully!');
    } catch (err) {
      console.log(err)
      setError('Funding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fundingAmount = calculateFundingAmount();
  const platformFee = fundingAmount * 0.03;
  const totalAmount = fundingAmount + platformFee;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Fund Your Project</h1>
          <p className="text-lg text-mediumgray max-w-2xl mx-auto">
            Review project details and confirm funding to activate your contract with secure escrow protection.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-aquagreen text-white rounded-full text-sm font-bold">
              ✓
            </div>
            <div className="w-16 h-1 bg-lightgray mx-2">
              <div className="w-full h-full bg-gradient-to-r from-aquagreen to-boldblue rounded"></div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-boldblue text-white rounded-full text-sm font-bold">
              2
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-8 lg:p-12">
            
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
                  <h3 className="font-bold text-darkgray text-xl mb-3">{jobDetails.jobTitle}</h3>
                  <p className="text-mediumgray leading-relaxed">{jobDetails.description}</p>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-skyblue/5 to-skyblue/5 rounded-xl border border-lightblue/20">
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Category</span>
                    <p className="text-darkgray font-semibold">{jobDetails.jobCategory}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Type</span>
                    <p className="text-darkgray font-semibold">{jobDetails.employmentType}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Location</span>
                    <p className="text-darkgray font-semibold">{jobDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-mediumgray uppercase tracking-wide">Start Date</span>
                    <p className="text-darkgray font-semibold">
                      {new Date(jobDetails.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
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
                      {jobDetails.paymentType.replace('-', ' ')}
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
                        {jobDetails.paymentType === 'retainer' 
                          ? `${jobDetails.retainerFrequency} payment` 
                          : jobDetails.paymentType === 'hourly' 
                          ? 'Initial funding (40 hrs)' 
                          : 'Project amount'
                        }
                      </span>
                      <span className="font-semibold text-darkgray">${fundingAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 px-4 bg-lightgray/30 rounded-lg">
                      <span className="text-mediumgray">Platform fee (3%)</span>
                      <span className="font-semibold text-darkgray">${platformFee.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-boldblue to-boldblue rounded-lg">
                      <span className="font-bold text-white">Total Amount</span>
                      <span className="font-bold text-white text-lg">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Fund Button */}
              <div className="mt-8">
                <button
                  onClick={handleFundProject}
                  disabled={loading}
                  className={`group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold rounded-xl cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-boldblue/30 ${
                    loading 
                      ? 'bg-mediumgray text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-aquagreen to-aquagreen text-white hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {loading ? (
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

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-mediumgray">
            Need help? Contact our{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundProjectPage;