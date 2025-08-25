/**
 * Services Index - Exporta todos los servicios consolidados
 * FASE 2: Consolidación completada - 15 servicios → 5 servicios principales
 */

// ========================
// 📦 SERVICIOS CONSOLIDADOS
// ========================

// 1. Data Service (api.js + localStorageBackend.js + cache.js + server-wake.js)
export { 
  dataService, 
  apiService, 
  localStorageBackend, 
  cacheService, 
  serverWakeService 
} from './dataService.js';

// 2. Utility Service (safeOperations.js + validation.js + formatters.js)
export { 
  utilityService,
  safeParseFloat,
  safeParseInt,
  safeArray,
  safeArrayMap,
  safeArrayFilter,
  safeArrayFind,
  safeArrayReduce,
  safeGet,
  safeLocalStorage,
  safeCalculation,
  safeString,
  safeTrim,
  validateDate,
  formatSafeDate,
  isValidNumber,
  isValidInteger,
  isValidEmail,
  isValidPhone,
  VALIDATION_TYPES,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  FIELD_VALIDATION_SCHEMA,
  validateField,
  validateForm,
  getFieldRules,
  addFieldRule,
  removeFieldRules,
  businessValidation,
  formatCurrencyInput,
  parseCurrencyInput,
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  formatAmountWithCurrency,
  parseCurrencyAmount,
  formatDateWithDay,
  formatDate,
  formatPhone,
  getClientName,
  getClientInfo,
  formatPercentage,
  truncateText,
  getStatusBadge,
  calculateOperationTotals,
  isValidCurrency,
  getProviderCurrencies
} from './utilityService.js';

// 3. Business Service (balanceService.js + stockService.js + cajaService.js + movementService.js)
export { 
  businessService,
  balanceService,
  stockService,
  cajaService,
  movementService
} from './businessService.js';

// 4. Client Service (mantenido como está)
export { 
  getClients,
  saveClient,
  updateClient,
  deleteClient,
  getClientById,
  searchClients,
  validateClientData,
  formatClientData
} from './clientService.js';

// 5. System Service (errorHandler.js + preload.js + index.js)
export { 
  systemService,
  preloadService,
  systemUtils,
  ERROR_TYPES,
  ERROR_SEVERITY,
  handleValidationError,
  handleCalculationError,
  handleStorageError,
  handleParsingError,
  handleBusinessLogicError,
  handleCriticalError,
  safeExecute,
  safeExecuteWithRetry
} from './systemService.js';

// ========================
// 🔧 EXPORTS DE CONVENIENCIA
// ========================

// Importar servicios para el objeto consolidado
import { dataService } from './dataService.js';
import { utilityService } from './utilityService.js';
import { businessService } from './businessService.js';
import { systemService } from './systemService.js';
import {
  getClients,
  saveClient,
  updateClient,
  deleteClient,
  getClientById,
  searchClients,
  validateClientData,
  formatClientData
} from './clientService.js';

// Export principal para uso rápido
export const services = {
  data: dataService,
  utility: utilityService,
  business: businessService,
  client: {
    getClients,
    saveClient,
    updateClient,
    deleteClient,
    getClientById,
    searchClients,
    validateClientData,
    formatClientData
  },
  system: systemService
};

// Export para inicialización
export const initializeServices = async () => {
  try {
    console.log('🚀 Inicializando servicios consolidados...');
    
    // Inicializar servicios del sistema
    await systemService.initialize();
    
    // Verificar conectividad de datos
    await dataService.api.getMovements();
    
    console.log('✅ Servicios consolidados inicializados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando servicios:', error);
    return false;
  }
};

// Export para limpieza
export const cleanupServices = () => {
  try {
    console.log('🧹 Limpiando servicios consolidados...');
    
    // Limpiar cache
    dataService.clearCache();
    
    // Limpiar servicios del sistema
    systemService.cleanup();
    
    console.log('✅ Servicios consolidados limpiados correctamente');
  } catch (error) {
    console.error('❌ Error limpiando servicios:', error);
  }
};

// Export para obtener estado del sistema
export const getServicesStatus = () => {
  return {
    data: {
      cacheSize: dataService.cache.cache.size,
      storageAvailable: dataService.storage.isAvailable,
      apiMode: dataService.api.isLocalMode ? 'local' : 'remote'
    },
    system: systemService.getSystemStatus(),
    timestamp: new Date().toISOString()
  };
};

// ========================
// 📊 ESTADÍSTICAS DE CONSOLIDACIÓN
// ========================

export const consolidationStats = {
  originalServices: 15,
  consolidatedServices: 5,
  reduction: '66.7%',
  services: {
    'Data Service': ['api.js', 'localStorageBackend.js', 'cache.js', 'server-wake.js'],
    'Utility Service': ['safeOperations.js', 'validation.js', 'formatters.js'],
    'Business Service': ['balanceService.js', 'stockService.js', 'cajaService.js', 'movementService.js'],
    'Client Service': ['clientService.js'],
    'System Service': ['errorHandler.js', 'preload.js', 'index.js']
  }
};