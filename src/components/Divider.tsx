import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  children
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`border-l border-gray-200 ${className}`} />
    );
  }

  if (children) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="flex-grow border-t border-gray-200" />
        <span className="px-4 text-sm text-gray-500 bg-white">{children}</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
    );
  }

  return (
    <hr className={`border-gray-200 ${className}`} />
  );
};

export default Divider;