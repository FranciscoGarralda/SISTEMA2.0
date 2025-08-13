/**
 * Format number input in real-time as user types
 * @param {string} value - Raw input value
 * @param {string} currency - Currency code (default: PESO)
 * @param {object} options - Formatting options
 * @returns {object} { formatted, raw } - Formatted display value and raw numeric value
 */

import { safeParseFloat } from './safeOperations.js';
export const formatCurrencyInput = (value, currency = 'PESO', options = {}) => {
  const { maxDecimals = 6, showDecimals = true } = options;
  
  // Remove all non-numeric characters except decimal point and comma
  let cleanValue = value.toString().replace(/[^\d.,]/g, '');
  
  // If empty or just symbols, return empty
  if (!cleanValue || cleanValue === '.' || cleanValue === ',') {
    return { formatted: '', raw: '' };
  }
  
  // Handle user input more intelligently
  // If the value doesn't contain any dots or commas, it's a plain number
  if (!cleanValue.includes('.') && !cleanValue.includes(',')) {
    // Just a plain number, no formatting needed yet
    const number = parseFloat(cleanValue);
    if (isNaN(number)) {
      return { formatted: '', raw: '' };
    }
    
    // For display, format with thousands separators
    const formatted = formatNumberForDisplay(number, currency, showDecimals, maxDecimals);
    
    return {
      formatted,
      raw: number.toString()
    };
  }
  
  // Parse using improved safeParseFloat for values with dots/commas
  const number = safeParseFloat(cleanValue, 0);
  
  // Handle invalid numbers
  if (isNaN(number)) {
    return { formatted: '', raw: '' };
  }
  
  // Format for display
  const formatted = formatNumberForDisplay(number, currency, showDecimals, maxDecimals);
  
  return {
    formatted,
    raw: number.toString()
  };
};

// Helper function to format number for display
function formatNumberForDisplay(number, currency, showDecimals, maxDecimals) {
  // Handle sign
  const absNumber = Math.abs(number);
  const isNegative = number < 0;
  
  // Determine decimal places to show
  let decimalPlaces = 2; // default
  if (showDecimals) {
    // Count actual decimal places in the original number
    const numberStr = absNumber.toString();
    if (numberStr.includes('.')) {
      const actualDecimals = numberStr.split('.')[1].length;
      decimalPlaces = Math.min(actualDecimals, maxDecimals);
    }
    // For very small numbers, show more decimals
    if (absNumber < 1 && absNumber > 0) {
      decimalPlaces = Math.max(decimalPlaces, 4);
    }
  }
  
  // Split into integer and decimal parts
  const fixedNumber = absNumber.toFixed(Math.max(decimalPlaces, 2));
  const [integerPart, decimalPart] = fixedNumber.split('.');
  
  // Add thousand separators with spaces
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Build the number with comma for decimals
  let formattedNumber = formattedInteger;
  if (showDecimals && decimalPart && (parseInt(decimalPart) > 0 || decimalPlaces > 2)) {
    // Remove trailing zeros but keep at least 2 decimal places for currencies
    const trimmedDecimals = decimalPart.replace(/0+$/, '');
    const finalDecimals = trimmedDecimals.length < 2 ? decimalPart.substring(0, 2) : trimmedDecimals;
    if (finalDecimals) {
      formattedNumber += ',' + finalDecimals;
    }
  }
  
  // Add negative sign if needed
  if (isNegative) {
    formattedNumber = '-' + formattedNumber;
  }
  
  // Add currency symbol
  const currencySymbol = currency === 'PESO' ? '$' : currency === 'USD' ? 'U$S' : '';
  return currencySymbol + ' ' + formattedNumber;
}

/**
 * Parse formatted currency input back to raw number
 * @param {string} formattedValue - Formatted currency string like "$1.000,50"
 * @returns {string} Raw numeric value
 */
export const parseCurrencyInput = (formattedValue) => {
  if (!formattedValue) return '';
  
  // Remove currency symbols and spaces (including US$, €, etc.)
  const cleaned = formattedValue.replace(/[US$€£¥₿\s]/g, '');
  
  // Handle Spanish format: 1.290.500,75 -> 1290500.75
  let numericValue = cleaned;
  
  // If there's a comma, it's the decimal separator
  if (cleaned.includes(',')) {
    // Split by comma to separate integer and decimal parts
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      // Remove dots from integer part (thousands separators)
      const integerPart = parts[0].replace(/\./g, '');
      const decimalPart = parts[1];
      numericValue = integerPart + '.' + decimalPart;
    }
  } else {
    // No comma, so dots are thousands separators - remove them
    numericValue = cleaned.replace(/\./g, '');
  }
  
  const number = safeParseFloat(numericValue, 0);
  return isNaN(number) ? '' : number.toString();
};

/**
 * Currency symbols configuration
 */
export const CURRENCY_SYMBOLS = {
  PESO: '$',
  USD: 'US$',
  EURO: '€',
  USDT: '₮',
  BTC: '₿',
  ETH: 'Ξ',
  ARS: '$',
  BRL: 'R$',
  CLP: '$',
  COP: '$',
  MXN: '$',
  UYU: '$U'
};

/**
 * Currency display names
 */
export const CURRENCY_NAMES = {
  PESO: 'Peso Argentino',
  USD: 'Dólar Estadounidense',
  EURO: 'Euro',
  USDT: 'Tether USD',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  ARS: 'Peso Argentino',
  BRL: 'Real Brasileño',
  CLP: 'Peso Chileno',
  COP: 'Peso Colombiano',
  MXN: 'Peso Mexicano',
  UYU: 'Peso Uruguayo'
};

/**
 * Format amount with currency symbol and proper number formatting
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (PESO, USD, EURO, etc.)
 * @param {object} options - Formatting options
 * @returns {string} Formatted amount with currency symbol
 */
export const formatAmountWithCurrency = (amount, currency = 'PESO', options = {}) => {
  const {
    showSymbol = true,
    decimals = 2,
    position = 'before'
  } = options;

  // Convert to number if string
  const numAmount = typeof amount === 'string' ? safeParseFloat(amount, 0) : amount;
  
  // Handle invalid amounts
  if (isNaN(numAmount)) {
    return showSymbol ? `${CURRENCY_SYMBOLS[currency] || '$'}0` : '0';
  }

  // Format with Spanish style: 1.290.500,75
  const absAmount = Math.abs(numAmount);
  const isNegative = numAmount < 0;
  
  // Split into integer and decimal parts
  const fixedNumber = absAmount.toFixed(decimals);
  const [integerPart, decimalPart] = fixedNumber.split('.');
  
  // Add thousand separators with spaces
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Build the number with comma for decimals
  let formattedNumber = formattedInteger;
  if (decimals > 0 && decimalPart && parseInt(decimalPart) > 0) {
    formattedNumber += ',' + decimalPart;
  } else if (decimals > 0) {
    formattedNumber += ',00';
  }
  
  // Add negative sign if needed
  if (isNegative) {
    formattedNumber = '-' + formattedNumber;
  }

  // Get currency symbol
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  
  // Build formatted string
  if (!showSymbol) {
    return formattedNumber;
  }
  
  return position === 'before' ? `${symbol} ${formattedNumber}` : `${formattedNumber} ${symbol}`;
};

/**
 * Parse formatted currency string back to number
 * @param {string} formattedAmount - Formatted currency string
 * @returns {number} Parsed number
 */
export const parseCurrencyAmount = (formattedAmount) => {
  if (!formattedAmount) return 0;
  
  // Remove everything except numbers, dots and commas
  let cleanAmount = formattedAmount.toString().replace(/[^\d.,]/g, '');
  
  if (!cleanAmount) return 0;
  
  // Simple conversion: replace comma with dot
  cleanAmount = cleanAmount.replace(',', '.');
  
  return safeParseFloat(cleanAmount, 0);
};



/**
 * Format date with day of week
 * @param {Date|string} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date with day of week
 */
export const formatDateWithDay = (date, options = {}) => {
  const {
    showDay = true,
    format = 'dd/MM/yyyy',
    locale = 'es-AR'
  } = options;
  
  if (!date) return '';
  
  // Fix timezone issue: parse date as local time instead of UTC
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else {
    // If it's a string in YYYY-MM-DD format, parse as local time
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      dateObj = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      dateObj = new Date(date);
    }
  }
  
  if (isNaN(dateObj.getTime())) return '';
  
  const dayNames = {
    'es-AR': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  let formattedDate = format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
  
  if (showDay) {
    const dayName = dayNames[locale] || dayNames['es-AR'];
    const weekDay = dayName[dateObj.getDay()];
    formattedDate = `${weekDay}, ${formattedDate}`;
  }
  
  return formattedDate;
};

/**
 * Calculate operation totals for buy/sell operations
 * @param {object} operation - Operation data
 * @returns {object} Calculated totals
 */
export const calculateOperationTotals = (operation) => {
  const { cantidad = 0, precio = 0, comision = 0, impuestos = 0 } = operation;
  
  const subtotal = cantidad * precio;
  const totalComision = subtotal * (comision / 100);
  const totalImpuestos = subtotal * (impuestos / 100);
  const total = subtotal + totalComision + totalImpuestos;
  
  return {
    subtotal,
    totalComision,
    totalImpuestos,
    total
  };
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid currency
 */
export const isValidCurrency = (currency) => {
  return Object.keys(CURRENCY_SYMBOLS).includes(currency);
};

/**
 * Get available currencies for a provider
 * @param {string} provider - Provider name
 * @returns {Array} Available currencies for the provider
 */
export const getProviderCurrencies = (provider) => {
  const providerCurrencies = {
    'BANCO_NACION': ['PESO', 'USD'],
    'BANCO_PROVINCIA': ['PESO', 'USD'],
    'MERCADO_PAGO': ['PESO', 'USD'],
    'BINANCE': ['USD', 'USDT', 'BTC', 'ETH'],
    'CRYPTO_COM': ['USD', 'USDT', 'BTC', 'ETH'],
    'WESTERN_UNION': ['USD', 'EURO'],
    'PAYPAL': ['USD', 'EURO'],
    'DEFAULT': Object.keys(CURRENCY_SYMBOLS)
  };
  
  return providerCurrencies[provider] || providerCurrencies.DEFAULT;
};

/**
 * Utility functions for formatting data in the application
 */

// REMOVED: formatCurrency function that used toLocaleString (caused inconsistencies)
// Use formatAmountWithCurrency instead for consistent formatting

/**
 * Format date to localized string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'es-ES')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'es-ES', options = {}) => {
  if (!date) return 'Sin fecha';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
};

/**
 * Format phone number to a consistent format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length >= 10) {
    // Assume Argentine format: +54 11 1234-5678
    const countryCode = cleaned.slice(0, 2);
    const areaCode = cleaned.slice(2, 4);
    const firstPart = cleaned.slice(4, 8);
    const secondPart = cleaned.slice(8, 12);
    
    return `+${countryCode} ${areaCode} ${firstPart}-${secondPart}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Get client full name from client ID
 * @param {string|number} clientId - The client ID to look up
 * @param {Array} clients - Array of client objects
 * @returns {string} Full client name or fallback text
 */
export const getClientName = (clientId, clients = []) => {
  if (!clientId) return 'Sin cliente';
  
  const client = clients.find(c => c.id === clientId || c.id === parseInt(clientId));
  
  if (!client) return `Cliente ${clientId}`;
  
  const fullName = `${client.nombre || ''} ${client.apellido || ''}`.trim();
  return fullName || `Cliente ${clientId}`;
};

/**
 * Get client full info object from client ID
 * @param {string|number} clientId - The client ID to look up
 * @param {Array} clients - Array of client objects
 * @returns {Object|null} Client object or null if not found
 */
export const getClientInfo = (clientId, clients = []) => {
  if (!clientId) return null;
  
  return clients.find(c => c.id === clientId || c.id === parseInt(clientId)) || null;
};

/**
 * Format percentage value
 * @param {number|string} value - Percentage value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return '0%';
  
  const numericValue = typeof value === 'string' ? safeParseFloat(value, 0) : value;
  if (isNaN(numericValue)) return '0%';
  
  return `${numericValue.toFixed(decimals)}%`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get operation status badge configuration
 * @param {string} status - Operation status
 * @returns {Object} Badge configuration with bg, text, and label
 */
export const getStatusBadge = (status) => {
  const badges = {
    'pendiente_retiro': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'P. Retiro'
    },
    'pendiente_entrega': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'P. Entrega'
    },
    'realizado': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Finalizado'
    },
    'pendiente': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Pendiente'
    }
  };
  
  return badges[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status || 'Sin estado'
  };
};