/**
 * Utility Service - Servicio consolidado de utilidades
 * Combina: safeOperations.js, validation.js, formatters.js
 */

// ========================
// 🛡️ SAFE OPERATIONS
// ========================

export const safeParseFloat = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeParseInt = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const safeArrayMap = (array, mapFn, defaultValue = []) => {
  try {
    const safeArray = Array.isArray(array) ? array : [];
    return safeArray.map(mapFn);
  } catch (error) {
    console.warn('Error en safeArrayMap:', error);
    return defaultValue;
  }
};

export const safeArrayFilter = (array, filterFn, defaultValue = []) => {
  try {
    const safeArray = Array.isArray(array) ? array : [];
    return safeArray.filter(filterFn);
  } catch (error) {
    console.warn('Error en safeArrayFilter:', error);
    return defaultValue;
  }
};

export const safeArrayFind = (array, findFn, defaultValue = null) => {
  try {
    const safeArray = Array.isArray(array) ? array : [];
    return safeArray.find(findFn) || defaultValue;
  } catch (error) {
    console.warn('Error en safeArrayFind:', error);
    return defaultValue;
  }
};

export const safeArrayReduce = (array, reduceFn, initialValue = 0) => {
  try {
    const safeArray = Array.isArray(array) ? array : [];
    return safeArray.reduce(reduceFn, initialValue);
  } catch (error) {
    console.warn('Error en safeArrayReduce:', error);
    return initialValue;
  }
};

export const safeGet = (obj, path, defaultValue = null) => {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn('Error en safeGet:', error);
    return defaultValue;
  }
};

export const validateDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const formatSafeDate = (dateString, options = {}) => {
  if (!validateDate(dateString)) {
    return options.defaultValue || 'Fecha inválida';
  }
  
  try {
    const date = new Date(dateString);
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };
    
    return date.toLocaleDateString('es-ES', defaultOptions);
  } catch (error) {
    console.warn('Error formateando fecha:', error);
    return options.defaultValue || 'Error de formato';
  }
};

export const safeLocalStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error leyendo localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error escribiendo localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removiendo localStorage:', error);
      return false;
    }
  }
};

export const safeCalculation = {
  add: (...values) => {
    return values.reduce((sum, val) => sum + safeParseFloat(val, 0), 0);
  },
  
  subtract: (a, b) => {
    return safeParseFloat(a, 0) - safeParseFloat(b, 0);
  },
  
  multiply: (...values) => {
    return values.reduce((product, val) => product * safeParseFloat(val, 1), 1);
  },
  
  divide: (a, b) => {
    const divisor = safeParseFloat(b, 1);
    return divisor !== 0 ? safeParseFloat(a, 0) / divisor : 0;
  },
  
  percentage: (value, total) => {
    const numValue = safeParseFloat(value, 0);
    const numTotal = safeParseFloat(total, 1);
    return numTotal !== 0 ? (numValue / numTotal) * 100 : 0;
  }
};

export const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value).trim() || defaultValue;
};

export const safeTrim = (value, defaultValue = '') => {
  const str = safeString(value, defaultValue);
  return str.trim() || defaultValue;
};

export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isValidInteger = (value) => {
  return Number.isInteger(Number(value));
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email));
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(String(phone));
};

export const safeExecute = (fn, fallback = null, context = 'Unknown') => {
  try {
    return fn();
  } catch (error) {
    console.warn(`Error en ${context}:`, error);
    return fallback;
  }
};

// ========================
// ✅ VALIDATION
// ========================

export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  INTEGER: 'integer',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
  PATTERN: 'pattern',
  CUSTOM: 'custom'
};

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[0-9\s\-\(\)]{8,}$/,
  CURRENCY: /^[0-9]+(\.[0-9]{1,2})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un email válido',
  phone: 'Ingrese un teléfono válido',
  number: 'Ingrese un número válido',
  integer: 'Ingrese un número entero',
  minLength: 'Mínimo {min} caracteres',
  maxLength: 'Máximo {max} caracteres',
  minValue: 'Valor mínimo: {min}',
  maxValue: 'Valor máximo: {max}',
  pattern: 'Formato inválido',
  custom: 'Valor inválido'
};

export const FIELD_VALIDATION_SCHEMA = {
  nombre: [
    { type: VALIDATION_TYPES.REQUIRED, message: 'El nombre es obligatorio' },
    { type: VALIDATION_TYPES.MIN_LENGTH, value: 2, message: 'Mínimo 2 caracteres' },
    { type: VALIDATION_TYPES.MAX_LENGTH, value: 50, message: 'Máximo 50 caracteres' }
  ],
  email: [
    { type: VALIDATION_TYPES.REQUIRED, message: 'El email es obligatorio' },
    { type: VALIDATION_TYPES.EMAIL, message: 'Email inválido' }
  ],
  telefono: [
    { type: VALIDATION_TYPES.PHONE, message: 'Teléfono inválido' }
  ],
  monto: [
    { type: VALIDATION_TYPES.REQUIRED, message: 'El monto es obligatorio' },
    { type: VALIDATION_TYPES.NUMBER, message: 'Ingrese un monto válido' },
    { type: VALIDATION_TYPES.MIN_VALUE, value: 0, message: 'El monto debe ser mayor a 0' }
  ],
  fecha: [
    { type: VALIDATION_TYPES.REQUIRED, message: 'La fecha es obligatoria' },
    { type: VALIDATION_TYPES.PATTERN, value: VALIDATION_PATTERNS.DATE, message: 'Formato de fecha inválido' }
  ]
};

export const validateField = (fieldName, value, formData = {}, rules = FIELD_VALIDATION_SCHEMA[fieldName]) => {
  if (!rules || !Array.isArray(rules)) {
    return { isValid: true, message: '' };
  }

  for (const rule of rules) {
    const { type, value: ruleValue, message } = rule;
    
    switch (type) {
      case VALIDATION_TYPES.REQUIRED:
        if (!value || safeTrim(value) === '') {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.EMAIL:
        if (value && !isValidEmail(value)) {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.PHONE:
        if (value && !isValidPhone(value)) {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.NUMBER:
        if (value && !isValidNumber(value)) {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.INTEGER:
        if (value && !isValidInteger(value)) {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.MIN_LENGTH:
        if (value && safeString(value).length < ruleValue) {
          return { isValid: false, message: message.replace('{min}', ruleValue) };
        }
        break;
        
      case VALIDATION_TYPES.MAX_LENGTH:
        if (value && safeString(value).length > ruleValue) {
          return { isValid: false, message: message.replace('{max}', ruleValue) };
        }
        break;
        
      case VALIDATION_TYPES.MIN_VALUE:
        if (value && safeParseFloat(value) < ruleValue) {
          return { isValid: false, message: message.replace('{min}', ruleValue) };
        }
        break;
        
      case VALIDATION_TYPES.MAX_VALUE:
        if (value && safeParseFloat(value) > ruleValue) {
          return { isValid: false, message: message.replace('{max}', ruleValue) };
        }
        break;
        
      case VALIDATION_TYPES.PATTERN:
        if (value && !ruleValue.test(value)) {
          return { isValid: false, message };
        }
        break;
        
      case VALIDATION_TYPES.CUSTOM:
        if (ruleValue && typeof ruleValue === 'function') {
          const customResult = ruleValue(value, formData);
          if (!customResult.isValid) {
            return customResult;
          }
        }
        break;
    }
  }
  
  return { isValid: true, message: '' };
};

export const validateForm = (formData, schema = FIELD_VALIDATION_SCHEMA) => {
  const errors = {};
  let isValid = true;
  
  for (const fieldName in schema) {
    const fieldRules = schema[fieldName];
    const fieldValue = formData[fieldName];
    const validation = validateField(fieldName, fieldValue, formData, fieldRules);
    
    if (!validation.isValid) {
      errors[fieldName] = validation.message;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};

export const getFieldRules = (fieldName) => {
  return FIELD_VALIDATION_SCHEMA[fieldName] || [];
};

export const addFieldRule = (fieldName, rule) => {
  if (!FIELD_VALIDATION_SCHEMA[fieldName]) {
    FIELD_VALIDATION_SCHEMA[fieldName] = [];
  }
  FIELD_VALIDATION_SCHEMA[fieldName].push(rule);
};

export const removeFieldRules = (fieldName) => {
  delete FIELD_VALIDATION_SCHEMA[fieldName];
};

export const businessValidation = {
  validateMovement: (movement) => {
    const errors = {};
    
    if (!movement.monto || safeParseFloat(movement.monto) <= 0) {
      errors.monto = 'El monto debe ser mayor a 0';
    }
    
    if (!movement.fecha) {
      errors.fecha = 'La fecha es obligatoria';
    }
    
    if (!movement.operacion) {
      errors.operacion = 'El tipo de operación es obligatorio';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  validateClient: (client) => {
    const errors = {};
    
    if (!client.nombre || safeTrim(client.nombre).length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (client.email && !isValidEmail(client.email)) {
      errors.email = 'Email inválido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// ========================
// 🎨 FORMATTERS
// ========================

export const formatCurrencyInput = (value, currency = 'PESO', options = {}) => {
  if (!value) return '';
  
  const numValue = safeParseFloat(value, 0);
  const { locale = 'es-AR', minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'PESO' ? 'ARS' : currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numValue);
  } catch (error) {
    console.warn('Error formateando moneda:', error);
    return numValue.toFixed(2);
  }
};

export const parseCurrencyInput = (formattedValue) => {
  if (!formattedValue) return 0;
  
  try {
    // Remover símbolos de moneda y espacios
    const cleanValue = formattedValue
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');
    
    return safeParseFloat(cleanValue, 0);
  } catch (error) {
    console.warn('Error parseando moneda:', error);
    return 0;
  }
};

export const CURRENCY_SYMBOLS = {
  PESO: '$',
  DOLAR: 'US$',
  EURO: '€',
  REAL: 'R$'
};

export const CURRENCY_NAMES = {
  PESO: 'Peso Argentino',
  DOLAR: 'Dólar Estadounidense',
  EURO: 'Euro',
  REAL: 'Real Brasileño'
};

export const formatAmountWithCurrency = (amount, currency = 'PESO', options = {}) => {
  const numAmount = safeParseFloat(amount, 0);
  const { showSymbol = true, showName = false, locale = 'es-AR' } = options;
  
  let result = '';
  
  if (showSymbol) {
    result += CURRENCY_SYMBOLS[currency] || '';
  }
  
  result += new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
  
  if (showName) {
    result += ` ${CURRENCY_NAMES[currency] || currency}`;
  }
  
  return result;
};

export const parseCurrencyAmount = (formattedAmount) => {
  if (!formattedAmount) return 0;
  
  try {
    // Remover símbolos de moneda y espacios
    const cleanValue = formattedAmount
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');
    
    return safeParseFloat(cleanValue, 0);
  } catch (error) {
    console.warn('Error parseando monto:', error);
    return 0;
  }
};

export const formatDateWithDay = (date, options = {}) => {
  if (!validateDate(date)) {
    return options.defaultValue || 'Fecha inválida';
  }
  
  try {
    const dateObj = new Date(date);
    const { locale = 'es-ES', showDay = true } = options;
    
    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (showDay) {
      formatOptions.weekday = 'long';
    }
    
    return dateObj.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.warn('Error formateando fecha con día:', error);
    return options.defaultValue || 'Error de formato';
  }
};

export const formatDate = (date, locale = 'es-ES', options = {}) => {
  if (!validateDate(date)) {
    return options.defaultValue || 'Fecha inválida';
  }
  
  try {
    const dateObj = new Date(date);
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };
    
    return dateObj.toLocaleDateString(locale, defaultOptions);
  } catch (error) {
    console.warn('Error formateando fecha:', error);
    return options.defaultValue || 'Error de formato';
  }
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleanPhone = String(phone).replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  
  if (cleanPhone.length === 11) {
    return `+${cleanPhone.slice(0, 1)} (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  }
  
  return phone;
};

export const getClientName = (clientId, clients = []) => {
  const client = safeArrayFind(clients, c => c.id === clientId);
  return client ? safeString(client.nombre, 'Cliente desconocido') : 'Cliente desconocido';
};

export const getClientInfo = (clientId, clients = []) => {
  const client = safeArrayFind(clients, c => c.id === clientId);
  return client || null;
};

export const formatPercentage = (value, decimals = 2) => {
  const numValue = safeParseFloat(value, 0);
  return `${numValue.toFixed(decimals)}%`;
};

export const truncateText = (text, maxLength = 50) => {
  const str = safeString(text, '');
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

export const getStatusBadge = (status) => {
  const statusMap = {
    'PENDIENTE': { color: 'warning', text: 'Pendiente' },
    'COMPLETADO': { color: 'success', text: 'Completado' },
    'CANCELADO': { color: 'error', text: 'Cancelado' },
    'EN_PROCESO': { color: 'info', text: 'En Proceso' }
  };
  
  return statusMap[status] || { color: 'default', text: status };
};

export const calculateOperationTotals = (operation) => {
  const monto = safeParseFloat(operation.monto, 0);
  const comision = safeParseFloat(operation.comision, 0);
  const total = monto + comision;
  
  return {
    monto,
    comision,
    total,
    formatted: {
      monto: formatAmountWithCurrency(monto),
      comision: formatAmountWithCurrency(comision),
      total: formatAmountWithCurrency(total)
    }
  };
};

export const isValidCurrency = (currency) => {
  return Object.keys(CURRENCY_SYMBOLS).includes(currency);
};

export const getProviderCurrencies = (provider) => {
  const providerCurrencies = {
    'COMPRA': ['PESO', 'DOLAR'],
    'VENTA': ['PESO', 'DOLAR'],
    'ARBITRAJE': ['PESO', 'DOLAR', 'EURO'],
    'CUENTAS_CORRIENTES': ['PESO'],
    'SOCIOS': ['PESO', 'DOLAR'],
    'ADMINISTRATIVAS': ['PESO'],
    'PRESTAMISTAS': ['PESO'],
    'INTERNAS': ['PESO']
  };
  
  return providerCurrencies[provider] || ['PESO'];
};

// ========================
// 📦 EXPORTS CONSOLIDADOS
// ========================

export const utilityService = {
  // Safe operations
  safe: {
    parseFloat: safeParseFloat,
    parseInt: safeParseInt,
    array: safeArray,
    arrayMap: safeArrayMap,
    arrayFilter: safeArrayFilter,
    arrayFind: safeArrayFind,
    arrayReduce: safeArrayReduce,
    get: safeGet,
    string: safeString,
    trim: safeTrim,
    localStorage: safeLocalStorage,
    calculation: safeCalculation,
    execute: safeExecute
  },
  
  // Validation
  validation: {
    types: VALIDATION_TYPES,
    patterns: VALIDATION_PATTERNS,
    messages: VALIDATION_MESSAGES,
    schema: FIELD_VALIDATION_SCHEMA,
    validateField,
    validateForm,
    getFieldRules,
    addFieldRule,
    removeFieldRules,
    business: businessValidation
  },
  
  // Formatters
  format: {
    currency: formatCurrencyInput,
    parseCurrency: parseCurrencyInput,
    amountWithCurrency: formatAmountWithCurrency,
    parseAmount: parseCurrencyAmount,
    date: formatDate,
    dateWithDay: formatDateWithDay,
    phone: formatPhone,
    percentage: formatPercentage,
    truncate: truncateText,
    statusBadge: getStatusBadge
  },
  
  // Utilities
  utils: {
    isValidNumber,
    isValidInteger,
    isValidEmail,
    isValidPhone,
    isValidCurrency,
    validateDate,
    formatSafeDate,
    getClientName,
    getClientInfo,
    getProviderCurrencies,
    calculateOperationTotals,
    CURRENCY_SYMBOLS,
    CURRENCY_NAMES
  }
};
