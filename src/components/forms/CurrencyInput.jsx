import React, { useState, useEffect, forwardRef } from 'react';
import { formatCurrencyInput, parseCurrencyInput } from '../../services/utilityService.js';

/**
 * Currency input component with real-time formatting
 * Formats numbers as user types: 1000000 -> $1.000.000
 */
const CurrencyInput = forwardRef(({
  label,
  value,
  onChange,
  currency = 'PESO',
  placeholder = '0',
  name,
  required = false,
  error = '',
  className = '',
  readOnly = false,
  hideLabel = false, // Nueva prop para ocultar el label
  ...rest
}, ref) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when external value changes
  useEffect(() => {
    if (value && value !== '') {
      const { formatted } = formatCurrencyInput(value, currency);
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [value, currency]);

  // Handle input change with real-time formatting
  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Sanitizar entrada
    inputValue = sanitizeInput(inputValue);
    
    // Convert comma to dot for decimal input
    inputValue = inputValue.replace(',', '.');
    
    // If user clears the input
    if (inputValue === '') {
      setDisplayValue('');
      onChange('');
      return;
    }
    
    // Remove currency symbols and spaces for processing
    const cleanedInput = inputValue.replace(/[^\d.]/g, '');
    
    // Validar formato de número
    if (cleanedInput && !/^\d*\.?\d*$/.test(cleanedInput)) {
      return;
    }
    
    // If focused, allow raw input without immediate formatting
    if (isFocused) {
      setDisplayValue(cleanedInput);
      // Parse the raw value for the parent component
      onChange(cleanedInput);
    } else {
      // Format the input when not focused
      const { formatted, raw } = formatCurrencyInput(cleanedInput, currency);
      setDisplayValue(formatted);
      onChange(raw);
    }
  };
  
  // Función para sanitizar entrada de usuario
  const sanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return value.replace(/<[^>]*>/g, '');
  };

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    // When focused, show raw value for easier editing (only if not readOnly)
    if (value && !readOnly) {
      setDisplayValue(value);
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    // When blurred, show formatted value (only if not readOnly)
    if (value && value !== '' && !readOnly) {
      const { formatted, raw } = formatCurrencyInput(value, currency);
      setDisplayValue(formatted);
      // IMPORTANTE: Asegurar que el valor sin formato se mantenga
      onChange(raw);
    }
  };

  // Input classes
  const inputClasses = [
    'w-full px-2 py-2 text-sm sm:text-base font-medium border rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'placeholder-light-textMuted dark:placeholder-dark-textMuted focus:placeholder-light-textSecondary dark:focus:placeholder-dark-textSecondary',
    'bg-light-card dark:bg-dark-card hover:bg-light-surface dark:hover:bg-dark-surface focus:bg-light-card dark:focus:bg-dark-card',
    'text-right', // Currency inputs are always right-aligned
    error 
      ? 'border-light-error dark:border-dark-error focus:border-light-error dark:focus:border-dark-error focus:ring-light-error/20 dark:focus:ring-dark-error/20 text-light-error dark:text-dark-error' 
      : 'border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary focus:border-light-primary dark:focus:border-dark-primary focus:ring-light-primary/20 dark:focus:ring-dark-primary/20 text-light-textPrimary dark:text-dark-textPrimary',
    readOnly 
      ? 'bg-light-surface dark:bg-dark-surface cursor-not-allowed opacity-60 hover:bg-light-surface dark:hover:bg-dark-surface' 
      : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`space-y-3 ${className}`}>
      {label && !hideLabel && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium empty-state-text"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input */}
      <input
        ref={ref}
        id={name}
        name={name}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputMode="decimal"
        lang="en-US"
        pattern="[0-9]*[.]?[0-9]*"
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        className={inputClasses}
        {...rest}
      />
      
      {/* Error message */}
      {error && (
        <p className="text-xs text-error-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;