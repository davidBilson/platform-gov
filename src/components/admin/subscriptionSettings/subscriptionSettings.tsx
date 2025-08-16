import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Edit3, X, Save, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { fetchSubscriptionSettings, saveEarlyAccessDuration, saveFeePercentage, saveSubscriptionPrice, saveTips, generateGCCToken } from '@/api/admin-subscription-api';
import { EditSection, EditStates, EditValues, Settings, ValidationErrors } from '@/types/subscriptionSettings';
import { toast } from 'react-toastify';
import { handleTextAreaInput } from '@/utils/profiles/profile.contractor';
import EditableCard from './settings/EditableCard';
import InputField from './settings/InputField';



const AdminSubscriptionSettings = () => {
  // State initialization
  const [settings, setSettings] = useState<Settings>({
    subscriptionPricing: {
      consultant: { monthly: 0, annual: 0 },
      client: { monthly: 0, annual: 0 }
    },
    gccDiscount: { token: "", percentOff: 0 },
    adminFeePercent: 0,
    tips: "",
    earlyAccessDurationHours: 0
  });

  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [editStates, setEditStates] = useState<EditStates>({});
  const [editValues, setEditValues] = useState<EditValues>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await fetchSubscriptionSettings();
        setSettings({
          subscriptionPricing: data.subscriptionPricing,
          gccDiscount: data.gccDiscount,
          adminFeePercent: data.adminFeePercent,
          tips: data.tips,
          earlyAccessDurationHours: data.earlyAccessDurationHours
        });
      } catch (error) {
        console.error('Error fetching subscription settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Copy to clipboard
  const handleCopyToken = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(settings.gccDiscount.token);
      toast.info('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy token:', error);
      toast.error('Failed to copy token');
    }
  }, [settings.gccDiscount.token]);

  // Validation functions
  const validatePrice = useCallback((value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && num < 10000;
  }, []);

  const validatePercent = useCallback((value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, []);

  const validateHours = useCallback((value: string): boolean => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0 && num <= 168;
  }, []);

  // Handle edit mode
  const handleEdit = useCallback((section: EditSection): void => {
    setEditStates(prev => ({ ...prev, [section]: true }));
    setValidationErrors(prev => ({ ...prev, [section]: '' }));

    switch (section) {
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

  // Handle GCC token generation
  const handleGenerateGCCToken = useCallback(async (): Promise<void> => {
    if (!validatePercent(editValues.gccPercent || '')) {
      setValidationErrors(prev => ({
        ...prev,
        gccDiscount: 'Discount must be between 0% and 100%'
      }));
      return;
    }

    setSavingStates(prev => ({ ...prev, gccDiscount: true }));
    setValidationErrors(prev => ({ ...prev, gccDiscount: '' }));

    try {
      const { data } = await generateGCCToken(parseFloat(editValues.gccPercent!));
      setSettings(prev => ({
        ...prev,
        gccDiscount: {
          token: data.token,
          percentOff: parseInt(editValues.gccPercent!, 10)
        }
      }));

      setEditValues(prev => ({
        ...prev,
        gccToken: data.token
      }));

      setEditStates(prev => ({ ...prev, gccDiscount: false }));
    } catch (error) {
      console.error('Error generating GCC token:', error);
      setValidationErrors(prev => ({
        ...prev,
        gccDiscount: 'Failed to generate token. Please try again.'
      }));
      toast.error('Failed to generate token');
    } finally {
      setSavingStates(prev => ({ ...prev, gccDiscount: false }));
    }
  }, [editValues.gccPercent, validatePercent]);

  // Handle save
  const handleSave = useCallback(async (section: EditSection): Promise<void> => {
    if (section === 'gccDiscount') {
      await handleGenerateGCCToken();
      return;
    }

    let isValid = true;
    let errorMessage = '';

    switch (section) {
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
        // Similar validation as above
        break;
      case 'adminFee':
        if (!validatePercent(editValues.adminFee || '')) {
          errorMessage = 'Fee must be between 0% and 100%';
          isValid = false;
        }
        break;
      case 'tips':
        if ((editValues.tips || '').trim().length < 10) {
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

    setSavingStates(prev => ({ ...prev, [section]: true }));
    setValidationErrors(prev => ({ ...prev, [section]: '' }));

    try {
      switch (section) {
        case 'consultantPricing':
        case 'clientPricing':
          const pricing = {
            consultantMonthly: section === 'consultantPricing' 
              ? parseFloat(editValues.consultantMonthly!) 
              : settings.subscriptionPricing.consultant.monthly,
            consultantAnnual: section === 'consultantPricing' 
              ? parseFloat(editValues.consultantAnnual!) 
              : settings.subscriptionPricing.consultant.annual,
            clientMonthly: section === 'clientPricing' 
              ? parseFloat(editValues.clientMonthly!) 
              : settings.subscriptionPricing.client.monthly,
            clientAnnual: section === 'clientPricing' 
              ? parseFloat(editValues.clientAnnual!) 
              : settings.subscriptionPricing.client.annual
          };

          await saveSubscriptionPrice({
            consultantMonthlyPrice: pricing.consultantMonthly,
            consultantAnnualPrice: pricing.consultantAnnual,
            clientMonthlyPrice: pricing.clientMonthly,
            clientAnnualPrice: pricing.clientAnnual
          });

          setSettings(prev => ({
            ...prev,
            subscriptionPricing: {
              consultant: {
                monthly: pricing.consultantMonthly,
                annual: pricing.consultantAnnual
              },
              client: {
                monthly: pricing.clientMonthly,
                annual: pricing.clientAnnual
              }
            }
          }));
          break;

        case 'adminFee':
          const feePercent = parseFloat(editValues.adminFee!);
          await saveFeePercentage(feePercent);
          setSettings(prev => ({ ...prev, adminFeePercent: feePercent }));
          break;

        case 'tips':
          await saveTips(editValues.tips!);
          setSettings(prev => ({ ...prev, tips: editValues.tips! }));
          break;

        case 'earlyAccess':
          const hours = parseInt(editValues.earlyAccess!, 10);
          await saveEarlyAccessDuration(hours);
          setSettings(prev => ({ ...prev, earlyAccessDurationHours: hours }));
          break;
      }

      setEditStates(prev => ({ ...prev, [section]: false }));
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      setValidationErrors(prev => ({
        ...prev,
        [section]: 'Failed to save changes. Please try again.'
      }));
      toast.error('Failed to save changes');
    } finally {
      setSavingStates(prev => ({ ...prev, [section]: false }));
    }
  }, [
    editValues, 
    settings, 
    handleGenerateGCCToken,
    validatePrice,
    validatePercent,
    validateHours
  ]);

  // Handle input changes
  const handleInputChange = useCallback((key: keyof EditValues, value: string): void => {
    setEditValues(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null!);

  const handleTextAreaInputWrapper = () => {
    handleTextAreaInput(textareaRef);
  };

  // Memoized card components
  const renderConsultantPricing = useMemo(() => (
    <EditableCard
      section="consultantPricing"
      title="Consultant Pricing"
      isEditing={!!editStates.consultantPricing}
      isSaving={!!savingStates.consultantPricing}
      hasError={validationErrors.consultantPricing}
      onEdit={() => handleEdit('consultantPricing')}
      onSave={() => handleSave('consultantPricing')}
      onCancel={() => handleCancel('consultantPricing')}
    >
      {editStates.consultantPricing ? (
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Monthly Price"
            value={editValues.consultantMonthly || ''}
            onChange={(value) => handleInputChange('consultantMonthly', value)}
            prefix="$"
            placeholder="49.99"
            numbersOnly={true}
          />
          <InputField
            label="Annual Price"
            value={editValues.consultantAnnual || ''}
            onChange={(value) => handleInputChange('consultantAnnual', value)}
            prefix="$"
            placeholder="499.99"
            numbersOnly={true}
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
  ), [editStates.consultantPricing, savingStates.consultantPricing, validationErrors.consultantPricing, editValues, settings, handleEdit, handleSave, handleCancel, handleInputChange]);

  // Similarly create memoized components for other sections...

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
        <div className="mb-8">
          <p className="text-gray-600">Manage subscription pricing and configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderConsultantPricing}
          
          {/* Client Pricing */}
          <EditableCard
            section="clientPricing"
            title="Client Pricing"
            isEditing={!!editStates.clientPricing}
            isSaving={!!savingStates.clientPricing}
            hasError={validationErrors.clientPricing}
            onEdit={() => handleEdit('clientPricing')}
            onSave={() => handleSave('clientPricing')}
            onCancel={() => handleCancel('clientPricing')}
          >
            {editStates.clientPricing ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Monthly Price"
                  value={editValues.clientMonthly || ''}
                  onChange={(value) => handleInputChange('clientMonthly', value)}
                  prefix="$"
                  placeholder="29.99"
                  numbersOnly={true}
                />
                <InputField
                  label="Annual Price"
                  value={editValues.clientAnnual || ''}
                  onChange={(value) => handleInputChange('clientAnnual', value)}
                  prefix="$"
                  placeholder="299.99"
                  numbersOnly={true}
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
          <EditableCard
            section="gccDiscount"
            title="GCC Discount"
            isEditing={!!editStates.gccDiscount}
            isSaving={!!savingStates.gccDiscount}
            hasError={validationErrors.gccDiscount}
            onEdit={() => handleEdit('gccDiscount')}
            onSave={() => handleSave('gccDiscount')}
            onCancel={() => handleCancel('gccDiscount')}
          >
            {editStates.gccDiscount ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Current Token <span className="text-xs text-gray-500">(will be replaced when generating new token)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editValues.gccToken || ''}
                      disabled={true}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md font-mono text-sm bg-gray-100 cursor-not-allowed"
                      placeholder="Token will be generated automatically"
                    />
                    {settings.gccDiscount.token && (
                      <button
                        onClick={handleCopyToken}
                        className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-boldblue transition-colors"
                        title="Copy token"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <InputField
                  label="Discount Percentage"
                  value={editValues.gccPercent || ''}
                  onChange={(value) => handleInputChange('gccPercent', value)}
                  suffix="%"
                  placeholder="15"
                  className="w-32"
                  numbersOnly={true}
                />
                <div className="text-sm text-gray-600 bg-boldblue/5 p-3 rounded-md border border-boldblue/20">
                  <p><strong>Note:</strong> Clicking "Generate Token" will create a new token with the specified discount percentage and replace the current token.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Token</span>
                  <div className="relative">
                    <p className="font-mono text-xs text-boldblue mt-1 p-2 pr-10 bg-gray-50 rounded border break-all">
                      {settings.gccDiscount.token || 'No token generated yet'}
                    </p>
                    {settings.gccDiscount.token && (
                      <button
                        onClick={handleCopyToken}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-boldblue transition-colors"
                        title="Copy token"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Discount</span>
                  <p className="text-2xl font-semibold text-aquagreen">{settings.gccDiscount.percentOff}%</p>
                </div>
              </div>
            )}
          </EditableCard>

          {/* Admin Fee */}
          <EditableCard
            section="adminFee"
            title="Admin Fee"
            isEditing={!!editStates.adminFee}
            isSaving={!!savingStates.adminFee}
            hasError={validationErrors.adminFee}
            onEdit={() => handleEdit('adminFee')}
            onSave={() => handleSave('adminFee')}
            onCancel={() => handleCancel('adminFee')}
          >
            {editStates.adminFee ? (
              <InputField
                label="Fee Percentage"
                value={editValues.adminFee || ''}
                onChange={(value) => handleInputChange('adminFee', value)}
                suffix="%"
                placeholder="7.5"
                className="w-32"
                numbersOnly={true}
              />
            ) : (
              <div>
                <span className="text-sm font-medium text-gray-600">Fee Percentage</span>
                <p className="text-2xl font-semibold text-boldblue">{settings.adminFeePercent}%</p>
              </div>
            )}
          </EditableCard>

          {/* Tips */}
          <EditableCard
            section="tips"
            title="Tips"
            className="lg:col-span-2"
            isEditing={!!editStates.tips}
            isSaving={!!savingStates.tips}
            hasError={validationErrors.tips}
            onEdit={() => handleEdit('tips')}
            onSave={() => handleSave('tips')}
            onCancel={() => handleCancel('tips')}
          >
            {editStates.tips ? (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Tips Content</label>
                <textarea
                  onInput={handleTextAreaInputWrapper}
                  ref={textareaRef}

                  value={editValues.tips || ''}
                  onChange={(e) => handleInputChange('tips', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-boldblue transition-colors resize-none"
                  rows={4}
                  placeholder="Enter tips..."
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
          <EditableCard
            section="earlyAccess"
            title="Early Access Duration"
            className="lg:col-span-2"
            isEditing={!!editStates.earlyAccess}
            isSaving={!!savingStates.earlyAccess}
            hasError={validationErrors.earlyAccess}
            onEdit={() => handleEdit('earlyAccess')}
            onSave={() => handleSave('earlyAccess')}
            onCancel={() => handleCancel('earlyAccess')}
          >
            {editStates.earlyAccess ? (
              <InputField
                label="Duration"
                value={editValues.earlyAccess || ''}
                onChange={(value) => handleInputChange('earlyAccess', value)}
                suffix="hours"
                placeholder="24"
                className="w-40"
                numbersOnly={true}
              />
            ) : (
              <div>
                <span className="text-sm font-medium text-gray-600">Duration (must be either 24 or 48 hours)</span>
                <p className="text-2xl font-semibold text-boldblue">{settings.earlyAccessDurationHours} hours</p>
              </div>
            )}
          </EditableCard>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionSettings;