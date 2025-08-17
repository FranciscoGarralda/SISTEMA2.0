/**
 * Currency options with flags and symbols
 */

import { safeParseFloat } from '../services/safeOperations.js';
export const monedas = [
  { value: 'PESO', label: '🇦🇷 ARS' },
  { value: 'USD', label: '💵 USD' },
  { value: 'EURO', label: '🇪🇺 EUR' },
  { value: 'USDT', label: '₿ USDT' },
  { value: 'REAL', label: '🇧🇷 BRL' },
  { value: 'LIBRA', label: '🇬🇧 GBP' },
  { value: 'CLP', label: '🇨🇱 CLP' },
];

/**
 * Account types configuration
 */
export const cuentas = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'bancaria_socio1', label: 'Cuenta Bancaria Socio1' },
  { value: 'bancaria_socio2', label: 'Cuenta Bancaria Socio2' },
  { value: 'bancaria_alliance', label: 'Cuenta Bancaria Alliance' },
  { value: 'usdt_socio1', label: 'Cuenta Socio1 (USDT)' },
  { value: 'usdt_socio2', label: 'Cuenta Socio2 (USDT)' },
  { value: 'cliente', label: 'Cliente' },
];

/**
 * Partners/associates configuration
 */
export const socios = [
  { value: 'socio1', label: 'Socio 1' },
  { value: 'socio2', label: 'Socio 2' },
  { value: 'otro', label: 'Otro' },
];

/**
 * Partner options without "Otro" for specific operations
 */
export const sociosSinOtro = [
  { value: 'socio1', label: 'Socio 1' },
  { value: 'socio2', label: 'Socio 2' },
];

/**
 * Operation status options - Updated for Estado de retiro
 */
export const estados = [
  { value: 'pendiente_retiro', label: 'P. Retiro' },
  { value: 'pendiente_entrega', label: 'P. Entrega' },
  { value: 'realizado', label: 'Finalizado' },
];

/**
 * Current account providers with allowed currencies
 */
export const proveedoresCC = [
  { value: 'ALL', label: 'ALL', allowedCurrencies: ['PESO', 'USD', 'EURO', 'USDT', 'REAL', 'LIBRA', 'CLP'] },
  { value: 'ME', label: 'ME', allowedCurrencies: ['PESO', 'USD', 'EURO', 'USDT', 'REAL', 'LIBRA', 'CLP'] },
  { value: 'SS', label: 'SS', allowedCurrencies: ['PESO', 'USD', 'EURO', 'USDT', 'REAL', 'LIBRA', 'CLP'] },
  { value: 'AL', label: 'AL', allowedCurrencies: ['PESO', 'USD', 'EURO', 'USDT', 'REAL', 'LIBRA', 'CLP'] },
];

/**
 * Main operation types with icons and sub-operations
 */
export const operaciones = {
  TRANSACCIONES: { icon: '💱', subMenu: ['COMPRA', 'VENTA', 'ARBITRAJE'] },
  CUENTAS_CORRIENTES: { icon: '🤝', subMenu: ['INGRESO', 'EGRESO', 'COMPRA', 'VENTA', 'ARBITRAJE'] },
  SOCIOS: { icon: '👥', subMenu: ['INGRESO', 'SALIDA', 'PRESTAMO', 'DEVOLUCION'] },
  ADMINISTRATIVAS: { icon: '🔧', subMenu: ['AJUSTE', 'GASTO'] },
  PRESTAMISTAS: { icon: '🏦', subMenu: ['PRESTAMO', 'RETIRO'] },
  INTERNAS: { icon: '🔄', subMenu: ['MOV ENTRE CUENTAS'] },
};

/**
 * Wallet types for operations (without mixed payment)
 */
export const walletTypes = [
  { value: 'socio1_efectivo', label: 'Socio 1 - Efectivo' },
  { value: 'socio1_digital', label: 'Socio 1 - Digital' },
  { value: 'socio2_efectivo', label: 'Socio 2 - Efectivo' },
  { value: 'socio2_digital', label: 'Socio 2 - Digital' },
];

/**
 * Wallet types for TC field (includes mixed payment)
 */
export const walletTypesTC = [
  { value: 'socio1_efectivo', label: 'Socio 1 - Efectivo' },
  { value: 'socio1_digital', label: 'Socio 1 - Digital' },
  { value: 'socio2_efectivo', label: 'Socio 2 - Efectivo' },
  { value: 'socio2_digital', label: 'Socio 2 - Digital' },
  { value: 'pago_mixto', label: 'Pago Mixto' },
];

/**
 * Payment types for mixed payments
 */
export const tiposPago = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'crypto', label: 'Criptomonedas' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
];

/**
 * Operation priorities
 */
export const prioridades = [
  { value: 'baja', label: 'Baja', color: 'text-green-600' },
  { value: 'media', label: 'Media', color: 'text-yellow-600' },
  { value: 'alta', label: 'Alta', color: 'text-red-600' },
];

/**
 * Time periods for reports
 */
export const periodos = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta Semana' },
  { value: 'mes', label: 'Este Mes' },
  { value: 'trimestre', label: 'Este Trimestre' },
  { value: 'año', label: 'Este Año' },
  { value: 'personalizado', label: 'Período Personalizado' },
];

/**
 * Notification types
 */
export const tiposNotificacion = [
  { value: 'info', label: 'Información', color: 'blue' },
  { value: 'success', label: 'Éxito', color: 'green' },
  { value: 'warning', label: 'Advertencia', color: 'yellow' },
  { value: 'error', label: 'Error', color: 'red' },
];

/**
 * Default prestamista clients - can be extended dynamically
 */
export const prestamistaClientsDefault = [
  { value: '', label: 'Seleccionar cliente' },
  { value: 'cliente1', label: 'Cliente 1' },
  { value: 'cliente2', label: 'Cliente 2' },
  { value: 'cliente3', label: 'Cliente 3' },
];

/**
 * Responsive breakpoints configuration
 */
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Default form validation rules
 */
export const validationRules = {
  required: (value) => value !== '' && value !== null && value !== undefined,
  minAmount: (value, min = 0) => safeParseFloat(value, 0) >= min,
  maxAmount: (value, max = 999999999) => safeParseFloat(value, 0) <= max,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[\d\s\-+()]+$/.test(value),
};

/**
 * Error messages for validation
 */
export const errorMessages = {
  required: 'Este campo es obligatorio',
  minAmount: 'El monto debe ser mayor a 0',
  maxAmount: 'El monto excede el límite permitido',
  email: 'Ingrese un email válido',
  phone: 'Ingrese un teléfono válido',
  invalidCurrency: 'Seleccione una moneda válida',
  invalidAccount: 'Seleccione una cuenta válida',
};