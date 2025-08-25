/**
 * System Service - Servicio consolidado del sistema
 * Combina: errorHandler.js, preload.js, index.js
 */

// ========================
// 🚨 ERROR HANDLER
// ========================

// Funciones de desarrollo condicionales
const devError = (message, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`🚨 Error: ${message}`, context);
  }
};

const devWarn = (message, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Warning: ${message}`, context);
  }
};

export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION',
  CALCULATION: 'CALCULATION',
  STORAGE: 'STORAGE',
  PARSING: 'PARSING',
  BUSINESS_LOGIC: 'BUSINESS_LOGIC',
  CRITICAL: 'CRITICAL',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN'
};

export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const handleValidationError = (error, context = {}) => {
  devError(`Error de validación: ${error.message}`, context);
  return {
    type: ERROR_TYPES.VALIDATION,
    severity: ERROR_SEVERITY.MEDIUM,
    message: error.message,
    context
  };
};

export const handleCalculationError = (error, context = {}) => {
  devError(`Error de cálculo: ${error.message}`, context);
  return {
    type: ERROR_TYPES.CALCULATION,
    severity: ERROR_SEVERITY.HIGH,
    message: error.message,
    context
  };
};

export const handleStorageError = (error, context = {}) => {
  devError(`Error de almacenamiento: ${error.message}`, context);
  return {
    type: ERROR_TYPES.STORAGE,
    severity: ERROR_SEVERITY.HIGH,
    message: error.message,
    context
  };
};

export const handleParsingError = (error, context = {}) => {
  devError(`Error de parsing: ${error.message}`, context);
  return {
    type: ERROR_TYPES.PARSING,
    severity: ERROR_SEVERITY.MEDIUM,
    message: error.message,
    context
  };
};

export const handleBusinessLogicError = (error, context = {}) => {
  devError(`Error de lógica de negocio: ${error.message}`, context);
  return {
    type: ERROR_TYPES.BUSINESS_LOGIC,
    severity: ERROR_SEVERITY.HIGH,
    message: error.message,
    context
  };
};

export const handleCriticalError = (error, context = {}) => {
  devError(`Error crítico: ${error.message}`, context);
  return {
    type: ERROR_TYPES.CRITICAL,
    severity: ERROR_SEVERITY.CRITICAL,
    message: error.message,
    context
  };
};

export const safeExecute = async (fn, context = {}) => {
  try {
    return await fn();
  } catch (error) {
    const errorInfo = {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message: error.message,
      context: { ...context, stack: error.stack }
    };
    
    devError(`Error en ejecución segura: ${error.message}`, errorInfo);
    throw errorInfo;
  }
};

export const safeExecuteWithRetry = async (fn, maxRetries = 3, context = {}) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      devWarn(`Intento ${attempt}/${maxRetries} falló: ${error.message}`, context);
      
      if (attempt < maxRetries) {
        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  const errorInfo = {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.HIGH,
    message: `Falló después de ${maxRetries} intentos: ${lastError.message}`,
    context: { ...context, originalError: lastError }
  };
  
  devError(`Error después de reintentos: ${lastError.message}`, errorInfo);
  throw errorInfo;
};

// ========================
// ⚡ PRELOAD SERVICE
// ========================

class PreloadService {
  constructor() {
    this.preloadedComponents = new Map();
    this.preloadedData = new Map();
    this.isPreloading = false;
  }

  async preloadComponent(componentName, importFn) {
    if (this.preloadedComponents.has(componentName)) {
      return this.preloadedComponents.get(componentName);
    }

    try {
      const component = await importFn();
      this.preloadedComponents.set(componentName, component);
      devWarn(`Componente precargado: ${componentName}`);
      return component;
    } catch (error) {
      devError(`Error precargando componente ${componentName}:`, error);
      throw error;
    }
  }

  async preloadData(dataKey, dataFn) {
    if (this.preloadedData.has(dataKey)) {
      return this.preloadedData.get(dataKey);
    }

    try {
      const data = await dataFn();
      this.preloadedData.set(dataKey, data);
      devWarn(`Datos precargados: ${dataKey}`);
      return data;
    } catch (error) {
      devError(`Error precargando datos ${dataKey}:`, error);
      throw error;
    }
  }

  async preloadCriticalComponents() {
    if (this.isPreloading) {
      devWarn('Precarga ya en progreso');
      return;
    }

    this.isPreloading = true;
    
    try {
      const preloadPromises = [
        this.preloadComponent('MovimientosApp', () => import('../features/movements/MovimientosApp.jsx')),
        this.preloadComponent('SaldosInicialesApp', () => import('../features/initial-balances/SaldosInicialesApp.jsx')),
        this.preloadComponent('ArbitrajeApp', () => import('../features/arbitrage/ArbitrajeApp.jsx')),
        this.preloadComponent('StockApp', () => import('../features/stock/StockApp.jsx')),
        this.preloadComponent('ComisionesApp', () => import('../features/commissions/ComisionesApp.jsx')),
        this.preloadComponent('RentabilidadApp', () => import('../features/profitability/RentabilidadApp.jsx')),
        this.preloadComponent('CajaApp', () => import('../features/cash-register/CajaApp.jsx')),
        this.preloadComponent('GastosApp', () => import('../features/expenses/GastosApp.jsx')),
        this.preloadComponent('ClientesApp', () => import('../features/clients/ClientesApp.jsx')),
        this.preloadComponent('PrestamistasApp', () => import('../features/lenders/PrestamistasApp.jsx')),
        this.preloadComponent('CuentasCorrientesApp', () => import('../features/current-accounts/CuentasCorrientesApp.jsx')),
        this.preloadComponent('SaldosApp', () => import('../features/balances/SaldosApp.jsx')),
        this.preloadComponent('UtilidadApp', () => import('../features/utility/UtilidadApp.jsx')),
        this.preloadComponent('ArbitrajeApp', () => import('../features/arbitrage/ArbitrajeApp.jsx')),
        this.preloadComponent('GestiónUsuariosApp', () => import('../features/user-management/UserManagementApp.jsx'))
      ];

      await Promise.allSettled(preloadPromises);
      devWarn('Precarga de componentes críticos completada');
    } catch (error) {
      devError('Error en precarga de componentes críticos:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  async preloadCriticalData() {
    try {
      const dataPromises = [
        this.preloadData('movements', async () => {
          const { dataService } = await import('./dataService.js');
          return dataService.api.getMovements();
        }),
        this.preloadData('clients', async () => {
          const { dataService } = await import('./dataService.js');
          return dataService.api.getClients();
        }),
        this.preloadData('balances', async () => {
          const { businessService } = await import('./businessService.js');
          return businessService.balance.getBalances();
        })
      ];

      await Promise.allSettled(dataPromises);
      devWarn('Precarga de datos críticos completada');
    } catch (error) {
      devError('Error en precarga de datos críticos:', error);
    }
  }

  clearPreloadedData() {
    this.preloadedData.clear();
    devWarn('Datos precargados limpiados');
  }

  clearPreloadedComponents() {
    this.preloadedComponents.clear();
    devWarn('Componentes precargados limpiados');
  }

  getPreloadStatus() {
    return {
      componentsCount: this.preloadedComponents.size,
      dataCount: this.preloadedData.size,
      isPreloading: this.isPreloading,
      preloadedComponents: Array.from(this.preloadedComponents.keys()),
      preloadedData: Array.from(this.preloadedData.keys())
    };
  }
}

// ========================
// 🔧 SYSTEM UTILITIES
// ========================

export const systemUtils = {
  // Gestión de errores
  errorHandler: {
    types: ERROR_TYPES,
    severity: ERROR_SEVERITY,
    handleValidationError,
    handleCalculationError,
    handleStorageError,
    handleParsingError,
    handleBusinessLogicError,
    handleCriticalError,
    safeExecute,
    safeExecuteWithRetry
  },

  // Gestión de rendimiento
  performance: {
    measureTime: (name, fn) => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      devWarn(`⏱️ ${name} tomó ${(end - start).toFixed(2)}ms`);
      return result;
    },

    measureTimeAsync: async (name, fn) => {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      devWarn(`⏱️ ${name} tomó ${(end - start).toFixed(2)}ms`);
      return result;
    },

    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle: (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  },

  // Gestión de memoria
  memory: {
    getMemoryUsage: () => {
      if (typeof performance !== 'undefined' && performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    },

    logMemoryUsage: () => {
      const usage = systemUtils.memory.getMemoryUsage();
      if (usage) {
        devWarn(`💾 Memoria: ${(usage.used / 1024 / 1024).toFixed(2)}MB / ${(usage.total / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  },

  // Gestión de estado
  state: {
    createStateManager: (initialState = {}) => {
      let state = { ...initialState };
      const listeners = new Set();

      return {
        getState: () => ({ ...state }),
        setState: (newState) => {
          state = { ...state, ...newState };
          listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        }
      };
    }
  },

  // Gestión de eventos
  events: {
    createEventBus: () => {
      const events = {};

      return {
        on: (event, callback) => {
          if (!events[event]) {
            events[event] = [];
          }
          events[event].push(callback);
        },

        off: (event, callback) => {
          if (events[event]) {
            events[event] = events[event].filter(cb => cb !== callback);
          }
        },

        emit: (event, data) => {
          if (events[event]) {
            events[event].forEach(callback => {
              try {
                callback(data);
              } catch (error) {
                devError(`Error en evento ${event}:`, error);
              }
            });
          }
        }
      };
    }
  }
};

// ========================
// 📦 EXPORTS
// ========================

export const preloadService = new PreloadService();

// Export consolidado
export const systemService = {
  // Error handling
  error: systemUtils.errorHandler,
  
  // Performance
  performance: systemUtils.performance,
  
  // Memory management
  memory: systemUtils.memory,
  
  // State management
  state: systemUtils.state,
  
  // Event management
  events: systemUtils.events,
  
  // Preload service
  preload: preloadService,
  
  // System utilities
  utils: systemUtils,
  
  // Métodos de conveniencia
  async initialize() {
    try {
      devWarn('🚀 Inicializando servicios del sistema...');
      
      // Precargar componentes críticos
      await preloadService.preloadCriticalComponents();
      
      // Precargar datos críticos
      await preloadService.preloadCriticalData();
      
      // Log de memoria inicial
      systemUtils.memory.logMemoryUsage();
      
      devWarn('✅ Servicios del sistema inicializados correctamente');
      return true;
    } catch (error) {
      devError('❌ Error inicializando servicios del sistema:', error);
      return false;
    }
  },
  
  cleanup() {
    try {
      preloadService.clearPreloadedComponents();
      preloadService.clearPreloadedData();
      devWarn('🧹 Limpieza del sistema completada');
    } catch (error) {
      devError('Error en limpieza del sistema:', error);
    }
  },
  
  getSystemStatus() {
    return {
      preload: preloadService.getPreloadStatus(),
      memory: systemUtils.memory.getMemoryUsage(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
  }
};
