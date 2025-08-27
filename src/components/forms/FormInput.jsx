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

  const inputClasses = `
    form-input
    ${error 
      ? 'border-light-error dark:border-dark-error' 
      : ''
    }
    ${className}
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium empty-state-text"
        >
          {label}
          {required && <span className="text-light-error dark:text-dark-error ml-1">*</span>}
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
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              const input = document.getElementById(inputId);
              if (input) {
                input.showPicker();
              }
            }}
          >
            <Calendar size={18} className="text-light-textMuted dark:text-dark-textMuted hover:text-light-textSecondary dark:hover:text-dark-textSecondary transition-colors" />
          </div>
        )}
      </div>
      
      {/* Nombre del día para fechas - fuera del input */}
      {showDayName && dayName && type === 'date' && (
        <div className="text-sm text-light-textMuted dark:text-dark-textMuted font-medium mt-1">
          {dayName}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-sm text-light-error dark:text-dark-error flex items-center"
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