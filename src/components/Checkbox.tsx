import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const checkSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className={className}>
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`${sizeClasses[size]} border-2 rounded transition-colors ${
              checked
                ? 'bg-amber-600 border-amber-600'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              error ? 'border-red-300' : ''
            }`}
          >
            {checked && (
              <Check
                size={checkSizes[size]}
                className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>
        </div>
        
        {label && (
          <span className={`text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        )}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;