import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

const FormInput = forwardRef(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  error = '',
  placeholder = '',
  className = '',
  showDayName = false,
  dayName = '',
  onKeyDown,
  ...rest
}, ref) => {
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;

  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
    bg-gray-700 dark:bg-gray-700 text-white dark:text-white 
    placeholder-gray-400 dark:placeholder-gray-400 
    transition-colors duration-200
  `;

  const inputClasses = `
    ${baseInputClasses}
    ${error 
      ? 'border-red-500 dark:border-red-500' 
      : 'border-gray-600 dark:border-gray-600'
    }
    ${className}
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium empty-state-text dark:empty-state-text"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Input principal */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        
        {/* Iconos especiales */}
        {type === 'date' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar size={18} className="text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Nombre del día para fechas - fuera del input */}
      {showDayName && dayName && type === 'date' && (
        <div className="text-sm text-gray-400 dark:text-gray-400 font-medium mt-1">
          {dayName}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-400 dark:text-red-400 flex items-center"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;