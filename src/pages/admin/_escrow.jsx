import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Hash,
  X,
  User,
  Calendar,
  MapPin,
  AlertCircle,
  CreditCard,
  FileText,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { getPendingPayouts } from '@/api/payment-api';

const EscrowDashboard = () => {
  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPendingPayouts();
  }, []);

  const loadPendingPayouts = async () => {
    setLoading(true);
    try {
      const result = await getPendingPayouts();
      if (result.success) {
        setPayouts(result.data);
        setSummary(result.summary);
      }
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (fundId) => {
    setApproving(fundId);
    // TODO: Implement approval logic
    console.log('Approving payout:', fundId);
    setTimeout(() => setApproving(null), 2000);
  };

  const handleContractClick = (payout) => {
    setSelectedPayout(payout);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayout(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen relative">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-boldblue font-semibold mb-2">Payment Approvals</h1>
          <p className="text-gray-600">Review and approve pending escrow payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary?.totalPendingPayouts || payouts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary?.totalAmount || payouts.reduce((sum, payout) => sum + payout.amount, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary?.overdueCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Loading payments...</span>
              </div>
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">All caught up!</p>
              <p className="text-gray-500">No pending payments to review</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contractor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payouts.map((payout) => (
                    <tr key={payout.fundId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Hash className="w-4 h-4 text-gray-400 mr-2" />
                          <button
                            onClick={() => handleContractClick(payout)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {payout.fundId.slice(-8)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {payout.contractor?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {payout.contractor?.name || 'Unknown Contractor'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 truncate max-w-xs block">
                          {payout.job?.title || payout.job?.jobTitle || 'Job title not available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(payout.amount, payout.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(payout.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleApprove(payout.fundId)}
                          disabled={approving === payout.fundId}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {approving === payout.fundId ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sliding Modal */}
      {modalOpen && selectedPayout && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30  transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contract Details</h2>
                  <p className="text-sm text-gray-500">Fund ID: {selectedPayout.fundId}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Payment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Gross Amount</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(selectedPayout.amount, selectedPayout.currency)}
                      </p>
                    </div>
                    <div className="border-r pr-4">
                      <p className="text-xs text-gray-500">Platform Fee (5%)</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(selectedPayout.amount * 0.05, selectedPayout.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Net Payout</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(selectedPayout.amount * 0.95, selectedPayout.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {selectedPayout.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Job Details
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayout.job?.title || selectedPayout.job?.jobTitle}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedPayout.job?.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(selectedPayout.job?.createdAt)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {selectedPayout.job?.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Payment Type:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {selectedPayout.job?.paymentType?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Client Information
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayout.client?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedPayout.job?.clientName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedPayout.client?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedPayout.client?.phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contractor Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Contractor Information
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayout.contractor?.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedPayout.contractor?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedPayout.contractor?.phoneNumber}
                      </div>
                    </div>

                    {/* Bank Account Info */}
                    {selectedPayout.contractor?.bankAccounts && selectedPayout.contractor.bankAccounts.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Bank Account
                        </h4>
                        {selectedPayout.contractor.bankAccounts.map((account, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <p>{account.bankName} ****{account.last4}</p>
                            <p className="text-xs text-gray-500">
                              {account.country} • {account.currency.toUpperCase()}
                              {account.isDefault && <span className="ml-2 text-green-600">Default</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract Details */}
                {selectedPayout.contract && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Contract Information</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Contract Status</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {selectedPayout.contract.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(selectedPayout.contract.startDate)}
                          </p>
                        </div>
                      </div>
                      {selectedPayout.contract.milestonesCount > 0 && (
                        <div>
                          <p className="text-xs text-gray-500">Milestones Progress</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedPayout.contract.completedMilestones}/{selectedPayout.contract.milestonesCount} completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">

                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleApprove(selectedPayout.fundId)}
                      disabled={approving === selectedPayout.fundId}
                      title={`${formatCurrency(selectedPayout.amount * 0.95, selectedPayout.currency)} will be sent to contractor after 5% platform fee`}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {approving === selectedPayout.fundId ? 'Approving...' : 'Approve Payment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowDashboard;