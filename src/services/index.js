// API Services
export { default as apiService } from './api';
export { default as mockApiService } from './mockApi.js';
export { cacheService } from './cache.js';
export { serverWakeService } from './server-wake.js';

// Domain Services
export { default as cajaService } from './cajaService.js';
export { default as ccInitialBalanceService } from './ccInitialBalanceService.js';
export { default as clientService } from './clientService.js';
export { default as initialBalanceService } from './initialBalanceService.js';
export { default as movementService } from './movementService.js';
export { default as stockService } from './stockService.js';

// Utility Services
export { default as errorHandlerService } from './errorHandler.js';
export { default as preloadService } from './preload.js';
export { default as productionOptimizerService } from './productionOptimizer.js';

// Export all from formatters
export * from './formatters.js';

// Export all from validation
export * from './validation.js';

// Export all from safeOperations
export * from './safeOperations.js';

// Export all from performance
export * from './performance.js';

// Export all from lazyLoader
export * from './lazyLoader.js';

// Export all from memoryOptimizer
export * from './memoryOptimizer.js';