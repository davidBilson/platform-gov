import React, { useState, useEffect, memo } from 'react';
import { Settings, DollarSign, Clock, Save, AlertCircle } from 'lucide-react';
import { getFeeSettings, updateFeeSettings } from '@/api/admin-api';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (field: keyof FeeSettingsErrors, value: string) => void;
  inputMode?: 'decimal' | 'numeric';
  prefix?: string;
  suffix?: string;
  error?: string | undefined;
  description?: string;
  field: keyof FeeSettingsErrors;
}

const InputField: React.FC<InputFieldProps> = memo(({ 
  label, 
  value, 
  onChange, 
  inputMode = 'decimal',
  prefix = '', 
  suffix = '', 
  error,
  description,
  field 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-boldblue 
            focus:border-boldblue sm:text-sm transition-colors
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-8' : ''}
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
          `}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle size={14} />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

interface FeeSettingsErrors {
  freelancerServiceFee?: string;
  clientServiceFee?: string;
  minimumWithdrawal?: string;
  payoutDelay?: string;
}

const FeeSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [errors, setErrors] = useState<FeeSettingsErrors>({});
  
  const [feeSettings, setFeeSettings] = useState({
    freelancerServiceFee: '0',
    clientServiceFee: '0',
    minimumWithdrawal: '0',
    payoutDelay: '0'
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await getFeeSettings();
        if (response.success) {
          const settings = response.data;
          setFeeSettings({
            freelancerServiceFee: settings.freelancerServiceFee.toString(),
            clientServiceFee: settings.clientServiceFee.toString(),
            minimumWithdrawal: settings.minimumWithdrawal.toString(),
            payoutDelay: settings.payoutDelay.toString()
          });
        }
      } catch (error) {
        console.error('Error loading fee settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const validateForm = () => {
    const newErrors: FeeSettingsErrors = {};
    
    // Validate freelancer service fee
    const freelancerFee = parseFloat(feeSettings.freelancerServiceFee);
    if (isNaN(freelancerFee)) {
      newErrors.freelancerServiceFee = 'Fee must be a number';
    } else if (freelancerFee < 0 || freelancerFee > 50) {
      newErrors.freelancerServiceFee = 'Fee must be between 0% and 50%';
    }
    
    // Validate client service fee
    const clientFee = parseFloat(feeSettings.clientServiceFee);
    if (isNaN(clientFee)) {
      newErrors.clientServiceFee = 'Fee must be a number';
    } else if (clientFee < 0 || clientFee > 50) {
      newErrors.clientServiceFee = 'Fee must be between 0% and 50%';
    }
    
    // Validate minimum withdrawal
    const minWithdrawal = parseFloat(feeSettings.minimumWithdrawal);
    if (isNaN(minWithdrawal)) {
      newErrors.minimumWithdrawal = 'Amount must be a number';
    } else if (minWithdrawal < 0 || minWithdrawal > 1000) {
      newErrors.minimumWithdrawal = 'Amount must be between $0 and $1,000';
    }
    
    // Validate payout delay
    const payoutDelay = parseInt(feeSettings.payoutDelay);
    if (isNaN(payoutDelay)) {
      newErrors.payoutDelay = 'Delay must be a whole number';
    } else if (payoutDelay < 0 || payoutDelay > 30) {
      newErrors.payoutDelay = 'Delay must be between 0 and 30 days';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FeeSettingsErrors, value: string) => {
    // Allow empty string for better UX
    if (value === '') {
      setFeeSettings(prev => ({ ...prev, [field]: '' }));
      return;
    }

    // Different handling for integer vs decimal fields
    if (field === 'payoutDelay') {
      // Only allow integers
      if (/^\d*$/.test(value)) {
        setFeeSettings(prev => ({ ...prev, [field]: value }));
      }
    } else {
      // Allow decimals with up to 2 decimal places
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFeeSettings(prev => ({ ...prev, [field]: value }));
      }
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      const settingsToSave = {
        freelancerServiceFee: parseFloat(feeSettings.freelancerServiceFee),
        clientServiceFee: parseFloat(feeSettings.clientServiceFee),
        minimumWithdrawal: parseFloat(feeSettings.minimumWithdrawal),
        payoutDelay: parseInt(feeSettings.payoutDelay)
      };
  
      await updateFeeSettings(settingsToSave);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-boldblue mb-2">Fee Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-boldblue/10">
              <Settings size={24} className="text-boldblue" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Platform Fee Configuration</h3>
          </div>

          <div className="space-y-6">
            <InputField
              label="Freelancer Service Fee (%)"
              field="freelancerServiceFee"
              value={feeSettings.freelancerServiceFee}
              onChange={handleInputChange}
              suffix="%"
              error={errors.freelancerServiceFee}
              description="Percentage fee deducted from freelancer earnings"
            />

            <InputField
              label="Client Service Fee (%)"
              field="clientServiceFee"
              value={feeSettings.clientServiceFee}
              onChange={handleInputChange}
              suffix="%"
              error={errors.clientServiceFee}
              description="Additional percentage fee charged to clients"
            />

            <InputField
              label="Minimum Withdrawal Amount ($)"
              field="minimumWithdrawal"
              value={feeSettings.minimumWithdrawal}
              onChange={handleInputChange}
              prefix="$"
              error={errors.minimumWithdrawal}
              description="Minimum amount required before users can withdraw funds"
            />

            <InputField
              label="Payout Delay (days)"
              field="payoutDelay"
              value={feeSettings.payoutDelay}
              onChange={handleInputChange}
              inputMode="numeric"
              error={errors.payoutDelay}
              description="Number of days to wait after job completion before allowing withdrawal"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-boldblue text-white font-medium rounded-lg hover:bg-boldblue/50 focus:outline-none focus:ring-2 focus:ring-boldblue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview/Impact Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-aquagreen/20">
                <DollarSign size={20} className="text-aquagreen" />
              </div>
              <h4 className="font-semibold text-slate-800">Fee Preview</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-skyblue rounded-lg">
                <p className="text-xs text-boldblue mb-1">$100 job</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Freelancer receives:</span>
                    <span className="font-medium">
                      ${(100 - (100 * parseFloat(feeSettings.freelancerServiceFee || '0') / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client pays:</span>
                    <span className="font-medium">
                      ${(100 + (100 * parseFloat(feeSettings.clientServiceFee || '0') / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-boldblue/20">
                    <span className="font-medium">Platform earns:</span>
                    <span className="font-bold text-boldblue">
                      ${(parseFloat((100 + (100 * parseFloat(feeSettings.clientServiceFee || '0') / 100)).toFixed(2)) - parseFloat((100 - (100 * parseFloat(feeSettings.freelancerServiceFee || '0') / 100)).toFixed(2)))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-deepskyblue/20">
                <Clock size={20} className="text-deepskyblue" />
              </div>
              <h4 className="font-semibold text-slate-800">Payout Info</h4>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum withdrawal:</span>
                <span className="font-medium">${feeSettings.minimumWithdrawal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payout delay:</span>
                <span className="font-medium">{feeSettings.payoutDelay} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeeSettings;