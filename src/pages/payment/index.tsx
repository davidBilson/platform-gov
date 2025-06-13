import React, { useState } from 'react';
import ProgressCard from '@/components/payment/index/in-progress'; 
import ReviewCard from '@/components/payment/index/in-review';
import PendingCard from '@/components/payment/index/pending'; 
import AvailableCard from '@/components/payment/index/available';

// Define interfaces for different payment types
interface BasePayment {
  id: number;
  projectTitle: string;
  client: string;
  amount: number;
  milestone: string;
  status: string;
}

interface ProgressPayment extends BasePayment {
  progress: number;
  dueDate: string;
  status: 'in-progress';
}

interface ReviewPayment extends BasePayment {
  submittedDate: string;
  reviewDays: number;
  status: 'in-review';
}

interface PendingPayment extends BasePayment {
  pendingReason: string;
  waitingDays: number;
  status: 'pending';
}

interface AvailablePayment extends BasePayment {
  completedDate: string;
  status: 'available';
}

// Union type for all payment types
type Payment = ProgressPayment | ReviewPayment | PendingPayment | AvailablePayment;

// Interface for mock data structure
interface MockData {
  inProgress: ProgressPayment[];
  inReview: ReviewPayment[];
  pending: PendingPayment[];
  available: AvailablePayment[];
}

// Interface for tab configuration
interface Tab {
  id: keyof MockData;
  label: string;
  count: number;
}

// Type for active tab state
type ActiveTab = keyof MockData;

const PaymentIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('available');

  // Mock data for different payment statuses
  const mockData: MockData = {
    inProgress: [
      {
        id: 1,
        projectTitle: "E-commerce Platform Development",
        client: "TechCorp Solutions",
        amount: 2500,
        milestone: "Frontend Development",
        progress: 75,
        dueDate: "2025-06-20",
        status: "in-progress"
      },
      {
        id: 2,
        projectTitle: "Mobile App UI/UX Design",
        client: "StartupXYZ",
        amount: 1800,
        milestone: "Design System Creation",
        progress: 45,
        dueDate: "2025-06-25",
        status: "in-progress"
      }
    ],
    inReview: [
      {
        id: 3,
        projectTitle: "Database Migration Project",
        client: "Enterprise Corp",
        amount: 3200,
        milestone: "Data Migration Complete",
        submittedDate: "2025-06-10",
        reviewDays: 3,
        status: "in-review"
      },
      {
        id: 4,
        projectTitle: "API Integration",
        client: "FinTech Solutions",
        amount: 1500,
        milestone: "Payment Gateway Integration",
        submittedDate: "2025-06-12",
        reviewDays: 1,
        status: "in-review"
      }
    ],
    pending: [
      {
        id: 5,
        projectTitle: "Website Redesign",
        client: "Marketing Agency",
        amount: 2200,
        milestone: "Final Revisions",
        pendingReason: "Client feedback pending",
        waitingDays: 5,
        status: "pending"
      },
      {
        id: 6,
        projectTitle: "Mobile App Development",
        client: "Health Startup",
        amount: 4500,
        milestone: "Beta Testing Phase",
        pendingReason: "Additional requirements discussion",
        waitingDays: 2,
        status: "pending"
      }
    ],
    available: [
      {
        id: 7,
        projectTitle: "Corporate Website",
        client: "Business Solutions Inc",
        amount: 2800,
        milestone: "Project Completion",
        completedDate: "2025-06-08",
        status: "available"
      },
      {
        id: 8,
        projectTitle: "Dashboard Analytics",
        client: "Data Analytics Co",
        amount: 1950,
        milestone: "Final Delivery",
        completedDate: "2025-06-05",
        status: "available"
      },
      {
        id: 9,
        projectTitle: "E-learning Platform",
        client: "Education Tech",
        amount: 3500,
        milestone: "Platform Launch",
        completedDate: "2025-06-01",
        status: "available"
      }
    ]
  };

  const tabs: Tab[] = [
    { id: 'available', label: 'Available', count: mockData.available.length },
    { id: 'inProgress', label: 'In Progress', count: mockData.inProgress.length },
    { id: 'inReview', label: 'In Review', count: mockData.inReview.length },
    { id: 'pending', label: 'Pending', count: mockData.pending.length }
  ];

  const getTotalAvailable = (): number => {
    return mockData.available.reduce((total: number, payment: AvailablePayment) => total + payment.amount, 0);
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
            case 'inProgress':
              return <ProgressCard key={payment.id} payment={payment as ProgressPayment} />;
            case 'inReview':
              return <ReviewCard key={payment.id} payment={payment as ReviewPayment} />;
            case 'pending':
              return <PendingCard key={payment.id} payment={payment as PendingPayment} />;
            case 'available':
              return <AvailableCard key={payment.id} payment={payment as AvailablePayment} />;
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
          <h1 className="text-3xl font-bold text-boldblue mb-3">Payment Overview</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-lightblue/20 mb-8">
          <div className="flex border-b border-lightgray/50 overflow-x-auto">
            {tabs.map((tab: Tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer flex-1 min-w-0 px-6 py-4 text-sm font-medium transition-all duration-200 ${
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
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>

          {activeTab === 'available' && mockData.available.length > 0 && (
            <div className="mx-6 mb-6">
              <div className="bg-gradient-to-r from-boldblue to-boldblue rounded-xl p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Total Available</h3>
                    <div className="text-3xl font-bold">${getTotalAvailable().toLocaleString()}</div>
                    <p className="text-white/80 text-sm">Ready to withdraw</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="cursor-pointer flex-1 bg-white text-boldblue font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Get Paid Now
                  </button>
                  <button className="cursor-pointer flex-1 bg-white/20 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Payment Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-mediumgray">
            Questions about payments?{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentIndex;