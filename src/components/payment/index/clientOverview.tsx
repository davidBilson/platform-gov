import React, { useState } from 'react';

// Define interfaces for different payment types
interface BasePayment {
  id: number;
  projectTitle: string;
  freelancer: string;
  amount: number;
  milestone: string;
  status: string;
}

interface AvailablePayment extends BasePayment {
  escrowDate: string;
  daysInEscrow: number;
  status: 'available';
}

interface ProgressPayment extends BasePayment {
  progress: number;
  estimatedCompletion: string;
  status: 'in-progress';
}

interface PendingReviewPayment extends BasePayment {
  submittedDate: string;
  reviewDeadline: string;
  daysToReview: number;
  status: 'pending-review';
}

interface ReleasedPayment extends BasePayment {
  releasedDate: string;
  releaseMethod: string;
  status: 'released';
}

interface DisputePayment extends BasePayment {
  disputeDate: string;
  disputeReason: string;
  daysSinceDispute: number;
  status: 'in-dispute';
}

// Union type for all payment types
type Payment = AvailablePayment | ProgressPayment | PendingReviewPayment | ReleasedPayment | DisputePayment;

// Interface for mock data structure
interface MockData {
  available: AvailablePayment[];
  inProgress: ProgressPayment[];
  pendingReview: PendingReviewPayment[];
  released: ReleasedPayment[];
  inDispute: DisputePayment[];
}

interface Tab {
  id: keyof MockData;
  label: string;
  count: number;
  actionRequired?: boolean;
}

type ActiveTab = keyof MockData;

// Individual Card Components
const AvailableCard = ({ payment }: { payment: AvailablePayment }) => (
  <div className="bg-white rounded-xl border border-lightblue/20 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{payment.projectTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Freelancer: {payment.freelancer}</p>
        <p className="text-sm text-mediumgray">Milestone: {payment.milestone}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-boldblue">${payment.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-skyblue/20 text-boldblue rounded-full text-xs font-medium mt-2">
          Available
        </span>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-lightgray/50">
      <div className="text-sm text-mediumgray">
        <span className="font-medium">In escrow:</span> {payment.daysInEscrow} days
      </div>
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-lightgray/20 text-mediumgray rounded-lg hover:bg-lightgray/30 transition-colors text-sm">
          Reassign
        </button>
        <button className="px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-deepskyblue transition-colors text-sm">
          Release Early
        </button>
      </div>
    </div>
  </div>
);

const ProgressCard = ({ payment }: { payment: ProgressPayment }) => (
  <div className="bg-white rounded-xl border border-lightblue/20 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{payment.projectTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Freelancer: {payment.freelancer}</p>
        <p className="text-sm text-mediumgray">Milestone: {payment.milestone}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-boldblue">${payment.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium mt-2">
          In Progress
        </span>
      </div>
    </div>
    
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-darkgray">Progress</span>
        <span className="text-sm font-medium text-boldblue">{payment.progress}%</span>
      </div>
      <div className="w-full bg-lightgray rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-boldblue to-deepskyblue h-2 rounded-full transition-all duration-300"
          style={{ width: `${payment.progress}%` }}
        />
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-lightgray/50">
      <div className="text-sm text-mediumgray">
        <span className="font-medium">Est. completion:</span> {new Date(payment.estimatedCompletion).toLocaleDateString()}
      </div>
      <button className="px-4 py-2 bg-lightgray/20 text-mediumgray rounded-lg hover:bg-lightgray/30 transition-colors text-sm">
        View Progress
      </button>
    </div>
  </div>
);

const PendingReviewCard = ({ payment }: { payment: PendingReviewPayment }) => (
  <div className="bg-white rounded-xl border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{payment.projectTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Freelancer: {payment.freelancer}</p>
        <p className="text-sm text-mediumgray">Milestone: {payment.milestone}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-boldblue">${payment.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mt-2">
          Review Required
        </span>
      </div>
    </div>
    
    <div className="bg-yellow-50 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-8.138 8.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-sm font-medium text-yellow-800">Action Required</span>
      </div>
      <p className="text-sm text-yellow-700">Work submitted on {new Date(payment.submittedDate).toLocaleDateString()}</p>
      <p className="text-sm text-yellow-700">{payment.daysToReview} days remaining to review</p>
    </div>
    
    <div className="flex space-x-3">
      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
        Approve & Release
      </button>
      <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
        Request Changes
      </button>
    </div>
  </div>
);

const ReleasedCard = ({ payment }: { payment: ReleasedPayment }) => (
  <div className="bg-white rounded-xl border border-lightblue/20 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{payment.projectTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Freelancer: {payment.freelancer}</p>
        <p className="text-sm text-mediumgray">Milestone: {payment.milestone}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-green-600">${payment.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-2">
          Released
        </span>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-lightgray/50">
      <div className="text-sm text-mediumgray">
        <span className="font-medium">Released:</span> {new Date(payment.releasedDate).toLocaleDateString()}
        <span className="ml-2">via {payment.releaseMethod}</span>
      </div>
      <button className="px-4 py-2 bg-lightgray/20 text-mediumgray rounded-lg hover:bg-lightgray/30 transition-colors text-sm">
        View Receipt
      </button>
    </div>
  </div>
);

const DisputeCard = ({ payment }: { payment: DisputePayment }) => (
  <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-darkgray mb-1">{payment.projectTitle}</h3>
        <p className="text-sm text-mediumgray mb-2">Freelancer: {payment.freelancer}</p>
        <p className="text-sm text-mediumgray">Milestone: {payment.milestone}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-red-600">${payment.amount.toLocaleString()}</div>
        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium mt-2">
          In Dispute
        </span>
      </div>
    </div>
    
    <div className="bg-red-50 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-8.138 8.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-sm font-medium text-red-800">Under Review</span>
      </div>
      <p className="text-sm text-red-700">Dispute filed: {new Date(payment.disputeDate).toLocaleDateString()}</p>
      <p className="text-sm text-red-700">Reason: {payment.disputeReason}</p>
      <p className="text-sm text-red-700">{payment.daysSinceDispute} days since dispute</p>
    </div>
    
    <div className="flex space-x-3">
      <button className="flex-1 px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-deepskyblue transition-colors text-sm font-medium">
        View Details
      </button>
      <button className="flex-1 px-4 py-2 bg-lightgray/20 text-mediumgray rounded-lg hover:bg-lightgray/30 transition-colors text-sm">
        Contact Support
      </button>
    </div>
  </div>
);

const ClientOverview = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pendingReview');

  const mockData: MockData = {
    available: [],
    inProgress: [],
    pendingReview: [],
    released: [],
    inDispute: []
  };

  const tabs: Tab[] = [
    { id: 'pendingReview', label: 'Pending Review', count: mockData.pendingReview.length, actionRequired: true },
    { id: 'available', label: 'Available', count: mockData.available.length },
    { id: 'inProgress', label: 'In Progress', count: mockData.inProgress.length },
    { id: 'released', label: 'Released', count: mockData.released.length },
    { id: 'inDispute', label: 'In Dispute', count: mockData.inDispute.length }
  ];

  const getTotalEscrow = (): number => {
    return [...mockData.available, ...mockData.inProgress, ...mockData.pendingReview, ...mockData.inDispute]
      .reduce((total: number, payment: Payment) => total + payment.amount, 0);
  };

  const getTotalReleased = (): number => {
    return mockData.released.reduce((total: number, payment: ReleasedPayment) => total + payment.amount, 0);
  };

  const renderTabContent = () => {
    const data = mockData[activeTab];
    
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-lightgray rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-darkgray mb-2">No payments found</h3>
          <p className="text-mediumgray">There are no payments in this category at the moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.map((payment: Payment) => {
          switch (activeTab) {
            case 'available':
              return <AvailableCard key={payment.id} payment={payment as AvailablePayment} />;
            case 'inProgress':
              return <ProgressCard key={payment.id} payment={payment as ProgressPayment} />;
            case 'pendingReview':
              return <PendingReviewCard key={payment.id} payment={payment as PendingReviewPayment} />;
            case 'released':
              return <ReleasedCard key={payment.id} payment={payment as ReleasedPayment} />;
            case 'inDispute':
              return <DisputeCard key={payment.id} payment={payment as DisputePayment} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const handleTabClick = (tabId: ActiveTab): void => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue/5 to-faintskyblue/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-boldblue mb-3">Overview</h1>
          <p className="text-mediumgray">Manage your project funds and freelancer payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-lightblue/20 p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-darkgray mb-2">Total in Escrow</h3>
                <div className="text-3xl font-bold text-boldblue">${getTotalEscrow().toLocaleString()}</div>
                <p className="text-mediumgray text-sm mt-1">Secured funds for active projects</p>
              </div>
              <div className="w-16 h-16 bg-boldblue/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-lightblue/20 p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-darkgray mb-2">Total Released</h3>
                <div className="text-3xl font-bold text-green-600">${getTotalReleased().toLocaleString()}</div>
                <p className="text-mediumgray text-sm mt-1">Paid to freelancers</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-lightblue/20 mb-8">
          <div className="flex border-b border-lightgray/50 overflow-x-auto">
            {tabs.map((tab: Tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer flex-1 min-w-0 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-boldblue border-b-2 border-boldblue bg-gradient-to-t from-skyblue/5 to-transparent'
                    : 'text-mediumgray hover:text-darkgray hover:bg-lightgray/20'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-boldblue text-white'
                      : 'bg-lightgray text-mediumgray'
                  }`}>
                    {tab.count}
                  </span>
                  {tab.actionRequired && tab.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-lightblue/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-darkgray mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-lightblue/20 rounded-xl hover:bg-skyblue/5 transition-colors text-left">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-boldblue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium text-darkgray">Add Funds</span>
              </div>
              <p className="text-sm text-mediumgray">Deposit money to escrow for new projects</p>
            </button>
            
            <button className="p-4 border border-lightblue/20 rounded-xl hover:bg-skyblue/5 transition-colors text-left">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-boldblue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-darkgray">Payment History</span>
              </div>
              <p className="text-sm text-mediumgray">View all transaction records</p>
            </button>
            
            <button className="p-4 border border-lightblue/20 rounded-xl hover:bg-skyblue/5 transition-colors text-left">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-boldblue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-darkgray">Payment Settings</span>
              </div>
              <p className="text-sm text-mediumgray">Manage payment methods and preferences</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-mediumgray">
            Need help with payments?{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;