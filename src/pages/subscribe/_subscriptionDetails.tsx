import React, { useState } from 'react';
import { cancelSubscription, resumeSubscription } from "@/api/subscription-api";
import { toast } from 'react-toastify';
import FeedbackModal from './_feedbackModal';
import CancelSubscriptionModal from './_cancelSubscriptionModal';

const SubscriptionDetails = ({ 
  subscriptionData, 
  onSubscriptionUpdate 
}: { 
  subscriptionData: any;
  onSubscriptionUpdate?: () => void;
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'cancel' | 'resume'>('cancel');
  const [isLoading, setIsLoading] = useState(false);

  const {
    user,
    subscription,
    flags,
    isPremium,
    canAccessPremiumFeatures,
    isSubscriptionActive,
    isSubscriptionCancelled,
    planName,
    daysRemaining,
  } = subscriptionData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCancelSubscription = async (cancelReason: string) => {
    setIsLoading(true);
    try {
      const result = await cancelSubscription(user?.id, cancelReason || null);
      
      if (result.success) {
        setShowCancelModal(false);
        setFeedbackType('cancel');
        setShowFeedbackModal(true);
        // Call the update function to refresh subscription data
        onSubscriptionUpdate?.();
      } else {
        // Handle error - you might want to show an error toast/modal here
        toast.error('Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('An error occurred while cancelling your subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await resumeSubscription(user?.id);
      
      if (result.success) {
        setFeedbackType('resume');
        setShowFeedbackModal(true);
        // Call the update function to refresh subscription data
        onSubscriptionUpdate?.();
      } else {
        toast.error('Failed to resume subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast.error('An error occurred while resuming your subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-boldblue mb-2">
          Welcome back, {user?.name || 'Subscriber'}!
        </h1>
        <p className="text-xl text-gray-600">
          {isPremium ? 'You have premium access' : 'Manage your subscription'}
        </p>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Current Subscription
          </h2>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(subscription?.status || '')}`}>
            {subscription?.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Plan Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {planName || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {subscription?.billingInterval || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">
                  ${subscription?.amount || '0'} {subscription?.currency || 'USD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auto Renew:</span>
                <span className={`font-medium ${subscription?.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                  {subscription?.autoRenew ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Dates & Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Period</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="font-medium text-gray-900">
                  {subscription?.startDate ? formatDate(subscription.startDate) : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium text-gray-900">
                  {subscription?.endDate ? formatDate(subscription.endDate) : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Remaining:</span>
                <span className={`font-medium ${(daysRemaining || 0) <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                  {daysRemaining ?? 'N/A'} days
                </span>
              </div>
              {subscription?.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled:</span>
                  <span className="font-medium text-red-600">
                    {formatDate(subscription.cancelledAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancellation Reason if exists */}
        {subscription?.cancelReason && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">Cancellation Reason:</h4>
            <p className="text-yellow-700">{subscription.cancelReason}</p>
          </div>
        )}
      </div>

      {/* Features Access Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Access</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border-2 ${canAccessPremiumFeatures ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-medium mb-2 ${canAccessPremiumFeatures ? 'text-green-800' : 'text-red-800'}`}>
              Premium Features
            </h3>
            <p className={canAccessPremiumFeatures ? 'text-green-700' : 'text-red-700'}>
              {canAccessPremiumFeatures ? '✅ Full Access' : '❌ Limited Access'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${flags?.willAutoRenew ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-medium mb-2 ${flags?.willAutoRenew ? 'text-blue-800' : 'text-gray-800'}`}>
              Auto Renewal
            </h3>
            <p className={flags?.willAutoRenew ? 'text-blue-700' : 'text-gray-700'}>
              {flags?.willAutoRenew ? '🔄 Will Auto-Renew' : '⏸️ Manual Renewal Required'}
            </p>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-6 space-y-4">
          {flags?.isExpiringSoon && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800">
                ⚠️ <strong>Expiring Soon:</strong> Your subscription expires in {daysRemaining} days.
              </p>
            </div>
          )}

          {flags?.needsPaymentMethod && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                💳 <strong>Payment Required:</strong> Please update your payment method to continue your subscription.
              </p>
            </div>
          )}

          {isSubscriptionCancelled && !flags?.willAutoRenew && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                📋 <strong>Subscription Cancelled:</strong> Your access will end on {subscription?.endDate ? formatDate(subscription.endDate) : 'the end date'}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {isSubscriptionActive && (
          <button 
            onClick={() => setShowCancelModal(true)}
            disabled={isLoading}
            className="cursor-pointer bg-crimson text-white px-6 py-3 rounded-lg hover:bg-crimson/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Cancel Subscription'}
          </button>
        )}
        {!isSubscriptionActive && (
          <button 
            onClick={handleResumeSubscription}
            disabled={isLoading}
            className="cursor-pointer bg-aquagreen text-white px-6 py-3 rounded-lg hover:bg-aquagreen/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Reactivate Subscription'}
          </button>
        )}
      </div>

      {/* Modals */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isLoading}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackModalClose}
        type={feedbackType}
        endDate={subscription?.endDate}
      />
    </div>
  );
};

export default SubscriptionDetails;