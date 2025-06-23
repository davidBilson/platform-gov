import React, { useState } from 'react';
import ProgressCard from '@/components/payment/index/in-progress'; 
import ReviewCard from '@/components/payment/index/in-review';
import PendingCard from '@/components/payment/index/pending'; 
import AvailableCard from '@/components/payment/index/available';
import { useRouter } from 'next/router';

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

interface Tab {
  id: keyof MockData;
  label: string;
  count: number;
}

type ActiveTab = keyof MockData;

const ContractorOverview = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('available');

  const mockData: MockData = {
    inProgress: [],
    inReview: [],
    pending: [],
    available: []
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
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-lightgray rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-mediumgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-darkgray mb-1 sm:mb-2">No payments found</h3>
          <p className="text-sm sm:text-base text-mediumgray px-4">There are no payments in this category at the moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
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
      <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
        
        {/* Header - Responsive sizing and spacing */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-boldblue mb-1 sm:mb-2 md:mb-3">Overview</h1>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm border border-lightblue/20 mb-4 sm:mb-6 md:mb-8">
          {/* Tabs - Fully responsive with horizontal scroll on mobile */}
          <div className="flex border-b border-lightgray/50 overflow-x-auto [&::-webkit-scrollbar]:h-0">
            {tabs.map((tab: Tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer flex-shrink-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-boldblue border-b-2 border-boldblue bg-gradient-to-t from-skyblue/5 to-transparent'
                    : 'text-mediumgray hover:text-darkgray hover:bg-lightgray/20'
                }`}
                style={{ minWidth: '120px' }}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <span className="truncate">{tab.label}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex-shrink-0 ${
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

          {/* Tab content with responsive padding */}
          <div className="p-3 sm:p-4 md:p-6">
            {renderTabContent()}
          </div>

          {/* Total Available Card - Fully responsive */}
          <div className="mx-3 sm:mx-4 md:mx-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-aquagreen to-aquagreen rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-4 gap-3 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Total Available</h3>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold break-words">
                    ${getTotalAvailable().toLocaleString()}
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm">Ready to withdraw</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              
              {/* Buttons - Stack on mobile, side by side on larger screens */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => router.push('/payment/withdraw')} 
                  className="cursor-pointer flex-1 bg-white text-aquagreen font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white/90 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="truncate">Get Paid Now</span>
                </button>
                <button 
                  onClick={() => router.push('/payment/payout-setup')} 
                  className="cursor-pointer flex-1 bg-white/20 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden xs:inline">Payment Settings</span>
                  <span className="xs:hidden">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Responsive text and spacing */}
        <div className="text-center px-4">
          <p className="text-xs sm:text-sm text-mediumgray">
            Questions about payments?{' '}
            <a href="#" className="text-boldblue hover:text-deepskyblue font-medium transition-colors duration-200 whitespace-nowrap">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractorOverview;