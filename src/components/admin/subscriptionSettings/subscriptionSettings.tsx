import React, { useState, useCallback, useEffect } from 'react';
import { Edit3, X, Save, AlertCircle } from 'lucide-react';
import { fetchSubscriptionSettings } from '@/api/admin-subscription-api';


// Types
interface SubscriptionPricing {
  consultant: {
    monthly: number;
    annual: number;
  };
  client: {
    monthly: number;
    annual: number;
  };
}

interface GccDiscount {
  token: string;
  percentOff: number;
}

interface Settings {
  subscriptionPricing: SubscriptionPricing;
  gccDiscount: GccDiscount;
  adminFeePercent: number;
  tips: string;
  earlyAccessDurationHours: number;
}

type EditSection = 'consultantPricing' | 'clientPricing' | 'gccDiscount' | 'adminFee' | 'tips' | 'earlyAccess';

interface EditValues {
  consultantMonthly?: string;
  consultantAnnual?: string;
  clientMonthly?: string;
  clientAnnual?: string;
  gccToken?: string;
  gccPercent?: string;
  adminFee?: string;
  tips?: string;
  earlyAccess?: string;
}

interface EditStates {
  [key: string]: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const AdminSubscriptionSettings = () => {
  // Main settings state - Initialize with empty structure
  const [settings, setSettings] = useState<Settings>({
    subscriptionPricing: {
      consultant: {
        monthly: 0,
        annual: 0
      },
      client: {
        monthly: 0,
        annual: 0
      }
    },
    gccDiscount: {
      token: "",
      percentOff: 0
    },
    adminFeePercent: 0,
    tips: "",
    earlyAccessDurationHours: 0
  });

  const [loading, setLoading] = useState(true);

  // Edit states
  const [editStates, setEditStates] = useState<EditStates>({});
  const [editValues, setEditValues] = useState<EditValues>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const fetchedSettings = await fetchSubscriptionSettings();
        console.log('fetchedSettings: ', fetchedSettings.data);
        
        // Update the settings state with fetched data
        setSettings({
          subscriptionPricing: fetchedSettings.data.subscriptionPricing,
          gccDiscount: fetchedSettings.data.gccDiscount,
          adminFeePercent: fetchedSettings.data.adminFeePercent,
          tips: fetchedSettings.data.tips,
          earlyAccessDurationHours: fetchedSettings.data.earlyAccessDurationHours
        });
      } catch (error) {
        console.error('Error fetching subscription settings:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [])

  // Validation functions
  const validatePrice = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && num < 10000;
  };

  const validatePercent = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  const validateHours = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num <= 168; // Max 1 week
  };

  const validateToken = (value: string): boolean => {
    return value.length > 10 && /^[a-f0-9-]+$/i.test(value);
  };

  // Handle edit mode
  const handleEdit = useCallback((section: EditSection): void => {
    setEditStates(prev => ({ ...prev, [section]: true }));
    setValidationErrors(prev => ({ ...prev, [section]: '' }));
    
    // Initialize edit values with current values
    switch(section) {
      case 'consultantPricing':
        setEditValues(prev => ({
          ...prev,
          consultantMonthly: settings.subscriptionPricing.consultant.monthly.toString(),
          consultantAnnual: settings.subscriptionPricing.consultant.annual.toString()
        }));
        break;
      case 'clientPricing':
        setEditValues(prev => ({
          ...prev,
          clientMonthly: settings.subscriptionPricing.client.monthly.toString(),
          clientAnnual: settings.subscriptionPricing.client.annual.toString()
        }));
        break;
      case 'gccDiscount':
        setEditValues(prev => ({
          ...prev,
          gccToken: settings.gccDiscount.token,
          gccPercent: settings.gccDiscount.percentOff.toString()
        }));
        break;
      case 'adminFee':
        setEditValues(prev => ({ ...prev, adminFee: settings.adminFeePercent.toString() }));
        break;
      case 'tips':
        setEditValues(prev => ({ ...prev, tips: settings.tips }));
        break;
      case 'earlyAccess':
        setEditValues(prev => ({ ...prev, earlyAccess: settings.earlyAccessDurationHours.toString() }));
        break;
    }
  }, [settings]);

  // Handle cancel
  const handleCancel = useCallback((section: EditSection): void => {
    setEditStates(prev => ({ ...prev, [section]: false }));
    setValidationErrors(prev => ({ ...prev, [section]: '' }));
    setHasUnsavedChanges(false);
  }, []);

  // Handle save
  const handleSave = useCallback((section: EditSection): void => {
    let isValid = true;
    let errorMessage = '';

    // Validation based on section
    switch(section) {
      case 'consultantPricing':
        if (!validatePrice(editValues.consultantMonthly || '')) {
          errorMessage = 'Monthly price must be between $0.01 and $9,999.99';
          isValid = false;
        } else if (!validatePrice(editValues.consultantAnnual || '')) {
          errorMessage = 'Annual price must be between $0.01 and $9,999.99';
          isValid = false;
        }
        break;
      case 'clientPricing':
        if (!validatePrice(editValues.clientMonthly || '')) {
          errorMessage = 'Monthly price must be between $0.01 and $9,999.99';
          isValid = false;
        } else if (!validatePrice(editValues.clientAnnual || '')) {
          errorMessage = 'Annual price must be between $0.01 and $9,999.99';
          isValid = false;
        }
        break;
      case 'gccDiscount':
        if (!validateToken(editValues.gccToken || '')) {
          errorMessage = 'Token must be a valid UUID format';
          isValid = false;
        } else if (!validatePercent(editValues.gccPercent || '')) {
          errorMessage = 'Discount must be between 0% and 100%';
          isValid = false;
        }
        break;
      case 'adminFee':
        if (!validatePercent(editValues.adminFee || '')) {
          errorMessage = 'Fee must be between 0% and 100%';
          isValid = false;
        }
        break;
      case 'tips':
        if (!editValues.tips || editValues.tips.trim().length < 10) {
          errorMessage = 'Tips must be at least 10 characters long';
          isValid = false;
        }
        break;
      case 'earlyAccess':
        if (!validateHours(editValues.earlyAccess || '')) {
          errorMessage = 'Duration must be between 1 and 168 hours';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      setValidationErrors(prev => ({ ...prev, [section]: errorMessage }));
      return;
    }

    // Update main settings
    switch(section) {
      case 'consultantPricing':
        setSettings(prev => ({
          ...prev,
          subscriptionPricing: {
            ...prev.subscriptionPricing,
            consultant: {
              monthly: parseFloat(editValues.consultantMonthly!),
              annual: parseFloat(editValues.consultantAnnual!)
            }
          }
        }));
        break;
      case 'clientPricing':
        setSettings(prev => ({
          ...prev,
          subscriptionPricing: {
            ...prev.subscriptionPricing,
            client: {
              monthly: parseFloat(editValues.clientMonthly!),
              annual: parseFloat(editValues.clientAnnual!)
            }
          }
        }));
        break;
      case 'gccDiscount':
        setSettings(prev => ({
          ...prev,
          gccDiscount: {
            token: editValues.gccToken!,
            percentOff: parseInt(editValues.gccPercent!)
          }
        }));
        break;
      case 'adminFee':
        setSettings(prev => ({ ...prev, adminFeePercent: parseFloat(editValues.adminFee!) }));
        break;
      case 'tips':
        setSettings(prev => ({ ...prev, tips: editValues.tips! }));
        break;
      case 'earlyAccess':
        setSettings(prev => ({ ...prev, earlyAccessDurationHours: parseInt(editValues.earlyAccess!) }));
        break;
    }
    
    setEditStates(prev => ({ ...prev, [section]: false }));
    setValidationErrors(prev => ({ ...prev, [section]: '' }));
    setHasUnsavedChanges(false);
  }, [editValues]);

  // Handle input changes
  const handleInputChange = useCallback((key: keyof EditValues, value: string): void => {
    setEditValues(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  }, []);

  // Editable card component
  const EditableCard: React.FC<{
    section: EditSection;
    title: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ section, title, children, className = '' }) => {
    const isEditing = editStates[section];
    const hasError = validationErrors[section];

    return (
      <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        isEditing ? 'border-blue-500 shadow-lg' : hasError ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
      } ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => handleCancel(section)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-red-600 rounded-md transition-colors text-sm"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave(section)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-boldblue text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(section)}
                  className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-boldblue hover:bg-blue-50 rounded-md transition-colors text-sm"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            {children}
          </div>

          {/* Error message */}
          {hasError && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{hasError}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Input field component
  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
    className?: string;
  }> = ({ label, value, onChange, type = 'text', prefix, suffix, placeholder, className = '' }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boldblue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <div className="mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">Manage subscription pricing and configuration</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Consultant Pricing */}
          <EditableCard section="consultantPricing" title="Consultant Pricing">
            {editStates.consultantPricing ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Monthly Price"
                  value={editValues.consultantMonthly || ''}
                  onChange={(value) => handleInputChange('consultantMonthly', value)}
                  type="number"
                  prefix="$"
                  placeholder="49.99"
                />
                <InputField
                  label="Annual Price"
                  value={editValues.consultantAnnual || ''}
                  onChange={(value) => handleInputChange('consultantAnnual', value)}
                  type="number"
                  prefix="$"
                  placeholder="499.99"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Monthly</span>
                  <p className="text-2xl font-semibold text-boldblue">${settings.subscriptionPricing.consultant.monthly}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Annual</span>
                  <p className="text-2xl font-semibold text-boldblue">${settings.subscriptionPricing.consultant.annual}</p>
                </div>
              </div>
            )}
          </EditableCard>

          {/* Client Pricing */}
          <EditableCard section="clientPricing" title="Client Pricing">
            {editStates.clientPricing ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Monthly Price"
                  value={editValues.clientMonthly || ''}
                  onChange={(value) => handleInputChange('clientMonthly', value)}
                  type="number"
                  prefix="$"
                  placeholder="29.99"
                />
                <InputField
                  label="Annual Price"
                  value={editValues.clientAnnual || ''}
                  onChange={(value) => handleInputChange('clientAnnual', value)}
                  type="number"
                  prefix="$"
                  placeholder="299.99"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Monthly</span>
                  <p className="text-2xl font-semibold text-boldblue">${settings.subscriptionPricing.client.monthly}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Annual</span>
                  <p className="text-2xl font-semibold text-boldblue">${settings.subscriptionPricing.client.annual}</p>
                </div>
              </div>
            )}
          </EditableCard>

          {/* GCC Discount */}
          <EditableCard section="gccDiscount" title="GCC Discount">
            {editStates.gccDiscount ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Discount Token</label>
                  <input
                    type="text"
                    value={editValues.gccToken || ''}
                    onChange={(e) => handleInputChange('gccToken', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                    placeholder="Enter UUID token"
                  />
                </div>
                <InputField
                  label="Discount Percentage"
                  value={editValues.gccPercent || ''}
                  onChange={(value) => handleInputChange('gccPercent', value)}
                  type="number"
                  suffix="%"
                  placeholder="15"
                  className="w-32"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Token</span>
                  <p className="font-mono text-xs text-boldblue mt-1 p-2 bg-gray-50 rounded border break-all">
                    {settings.gccDiscount.token}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Discount</span>
                  <p className="text-2xl font-semibold text-aquagreen">{settings.gccDiscount.percentOff}%</p>
                </div>
              </div>
            )}
          </EditableCard>

          {/* Admin Fee */}
          <EditableCard section="adminFee" title="Admin Fee">
            {editStates.adminFee ? (
              <InputField
                label="Fee Percentage"
                value={editValues.adminFee || ''}
                onChange={(value) => handleInputChange('adminFee', value)}
                type="number"
                suffix="%"
                placeholder="7.5"
                className="w-32"
              />
            ) : (
              <div>
                <span className="text-sm font-medium text-gray-600">Fee Percentage</span>
                <p className="text-2xl font-semibold text-boldblue">{settings.adminFeePercent}%</p>
              </div>
            )}
          </EditableCard>

          {/* Tips */}
          <EditableCard section="tips" title="Subscription Tips" className="lg:col-span-2">
            {editStates.tips ? (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Tips Content</label>
                <textarea
                  value={editValues.tips || ''}
                  onChange={(e) => handleInputChange('tips', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Enter subscription tips..."
                />
              </div>
            ) : (
              <div>
                <span className="text-sm font-medium text-gray-600">Current Tips</span>
                <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded border">{settings.tips}</p>
              </div>
            )}
          </EditableCard>

          {/* Early Access Duration */}
          <EditableCard section="earlyAccess" title="Early Access Duration" className="lg:col-span-2">
            {editStates.earlyAccess ? (
              <InputField
                label="Duration"
                value={editValues.earlyAccess || ''}
                onChange={(value) => handleInputChange('earlyAccess', value)}
                type="number"
                suffix="hours"
                placeholder="24"
                className="w-40"
              />
            ) : (
              <div>
                <span className="text-sm font-medium text-gray-600">Duration</span>
                <p className="text-2xl font-semibold text-boldblue">{settings.earlyAccessDurationHours} hours</p>
              </div>
            )}
          </EditableCard>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Last updated: August 4, 2025 at 1:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionSettings;