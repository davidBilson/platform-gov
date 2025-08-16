import React from 'react';

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    numbersOnly?: boolean;
  }> = React.memo(({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    prefix, 
    suffix, 
    placeholder, 
    className = '', 
    disabled = false, 
    numbersOnly = false 
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
  
      if (numbersOnly) {
        newValue = newValue.replace(/[^0-9.]/g, '');
        const parts = newValue.split('.');
        if (parts.length > 2) {
          newValue = parts[0] + '.' + parts.slice(1).join('');
        }
      }
  
      onChange(newValue);
    };
  
    return (
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
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-boldblue focus:border-boldblue transition-colors ${prefix ? 'pl-8' : ''
              } ${suffix ? 'pr-12' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  });

  export default InputField;