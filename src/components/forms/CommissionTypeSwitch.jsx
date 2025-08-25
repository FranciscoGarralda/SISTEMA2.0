import React from 'react';
import { Percent, DollarSign } from 'lucide-react';

const CommissionTypeSwitch = ({ value = 'percentage', onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-sm font-medium ${value === 'fixed' ? 'empty-state-text' : 'empty-state-text'}`}>
        %
      </span>
      <button
        type="button"
        onClick={() => onChange(value === 'percentage' ? 'fixed' : 'percentage')}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${value === 'percentage' ? 'bg-gray-900' : 'bg-gray-200'}
          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-2
        `}
        aria-label="Cambiar tipo de comisión"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
            ${value === 'percentage' ? 'translate-x-1' : 'translate-x-6'}
          `}
        />
      </button>
      <span className={`text-sm font-medium ${value === 'percentage' ? 'empty-state-text' : 'empty-state-text'}`}>
        $
      </span>
    </div>
  );
};

export default CommissionTypeSwitch;