import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  error?: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

const Radio: React.FC<RadioProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  error,
  className = '',
  direction = 'vertical'
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`${direction === 'horizontal' ? 'flex space-x-6' : 'space-y-2'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center space-x-2 cursor-pointer ${
              disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Radio;