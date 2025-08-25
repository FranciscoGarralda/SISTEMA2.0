/**
 * Configuración consolidada del sistema financiero
 * Centraliza todas las configuraciones en un solo lugar
 */

// ===== CONFIGURACIÓN DE ENTORNO =====
export const ENV_CONFIG = {
  // Entorno actual
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  
  // URLs y endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  LOCAL_API_URL: 'http://localhost:3000/api',
  
  // Configuración de desarrollo
  DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  FORCE_LOCAL: process.env.NEXT_PUBLIC_FORCE_LOCAL === 'true',
};

// ===== CONFIGURACIÓN DE API =====
export const API_CONFIG = {
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints principales
  ENDPOINTS: {
    HEALTH: '/health',
    MOVEMENTS: '/movements',
    CLIENTS: '/clients',
    BALANCES: '/balances',
    STOCK: '/stock',
    COMMISSIONS: '/commissions',
  },
};

// ===== CONFIGURACIÓN DE VALIDACIÓN =====
export const VALIDATION_CONFIG = {
  // Límites de caracteres
  MAX_LENGTHS: {
    CLIENT_NAME: 50,
    CLIENT_EMAIL: 100,
    CLIENT_PHONE: 20,
    CLIENT_DNI: 15,
    CLIENT_ADDRESS: 200,
    MOVEMENT_DETAIL: 500,
  },
  
  // Patrones de validación
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[0-9\s\-\(\)]{7,}$/,
    DNI: /^[0-9]{7,8}$/,
    AMOUNT: /^[0-9]+(\.[0-9]{1,2})?$/,
  },
  
  // Mensajes de error
  MESSAGES: {
    REQUIRED: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PHONE: 'Teléfono inválido',
    INVALID_DNI: 'DNI inválido',
    INVALID_AMOUNT: 'Monto inválido',
    MAX_LENGTH: (field, max) => `${field} no puede tener más de ${max} caracteres`,
  },
};

// ===== CONFIGURACIÓN DE STORAGE =====
export const STORAGE_CONFIG = {
  // Claves de localStorage
  KEYS: {
    CLIENTS: 'financial-clients',
    MOVEMENTS: 'financial-movements',
    INITIAL_BALANCES: 'financial-initial-balances',
    CC_BALANCES: 'financial-cc-initial-balances',
    SETTINGS: 'financial-settings',
    THEME: 'financial-theme',
  },
  
  // Configuración de caché
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
  },
};

// ===== CONFIGURACIÓN DE UI =====
export const UI_CONFIG = {
  // Tema
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
  
  // Animaciones
  ANIMATIONS: {
    DURATION: 200, // ms
    EASING: 'ease-in-out',
  },
  
  // Paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // Notificaciones
  NOTIFICATIONS: {
    AUTO_HIDE: 5000, // 5 segundos
    MAX_VISIBLE: 5,
  },
};

// ===== CONFIGURACIÓN DE OPERACIONES =====
export const OPERATIONS_CONFIG = {
  // Tipos de operación
  TYPES: {
    COMPRA: 'COMPRA',
    VENTA: 'VENTA',
    ARBITRAJE: 'ARBITRAJE',
    CUENTAS_CORRIENTES: 'CUENTAS_CORRIENTES',
    SOCIOS: 'SOCIOS',
    ADMINISTRATIVAS: 'ADMINISTRATIVAS',
    PRESTAMISTAS: 'PRESTAMISTAS',
    INTERNAS: 'INTERNAS',
  },
  
  // Monedas soportadas
  CURRENCIES: {
    PESO: 'PESO',
    DOLAR: 'DOLAR',
    EURO: 'EURO',
  },
  
  // Estados de operación
  STATUS: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  },
};

// ===== CONFIGURACIÓN DE SEGURIDAD =====
export const SECURITY_CONFIG = {
  // Headers de seguridad
  HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
  },
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'financial-auth-token',
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  },
};

// ===== CONFIGURACIÓN DE PERFORMANCE =====
export const PERFORMANCE_CONFIG = {
  // Lazy loading
  LAZY_LOADING: {
    PRELOAD_DELAY: 2000, // 2 segundos
    ENABLE_PRELOAD: true,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000, // 1 segundo
  },
  
  // Debounce
  DEBOUNCE: {
    SEARCH: 300, // 300ms
    SAVE: 1000, // 1 segundo
    VALIDATION: 500, // 500ms
  },
  
  // Throttle
  THROTTLE: {
    SCROLL: 100, // 100ms
    RESIZE: 250, // 250ms
  },
};

// ===== CONFIGURACIÓN DE ERRORES =====
export const ERROR_CONFIG = {
  // Niveles de error
  LEVELS: {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical',
  },
  
  // Configuración de logging
  LOGGING: {
    ENABLE_CONSOLE: true,
    ENABLE_REMOTE: false,
    MAX_LOG_SIZE: 1000,
  },
  
  // Mensajes de error genéricos
  MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    VALIDATION_ERROR: 'Datos inválidos. Revisa la información.',
    UNKNOWN_ERROR: 'Error desconocido. Contacta soporte.',
  },
};

// ===== EXPORTACIÓN PRINCIPAL =====
export default {
  ENV_CONFIG,
  API_CONFIG,
  VALIDATION_CONFIG,
  STORAGE_CONFIG,
  UI_CONFIG,
  OPERATIONS_CONFIG,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  ERROR_CONFIG,
};
