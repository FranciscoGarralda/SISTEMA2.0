/**
 * Constantes consolidadas del sistema financiero
 * Exporta todas las constantes desde un solo lugar
 */

// Exportar todas las constantes básicas
export * from './constants.js';

// Exportar configuraciones de campos
export * from './fieldConfigs.js';

// Re-exportar configuraciones específicas para facilitar el acceso
export { specificFieldsConfig } from './fieldConfigs.js';