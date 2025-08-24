import { safeLocalStorage, safeParseFloat } from './safeOperations';

/**
 * Servicio para manejar saldos iniciales de Cuentas Corrientes
 * IMPORTANTE: Estos saldos NO afectan el stock, solo las deudas
 */
class CCInitialBalanceService {
  constructor() {
    this.STORAGE_KEY = 'financial-cc-initial-balances';
    this.balances = {};
    // Solo cargar datos si estamos en el cliente
    if (typeof window !== 'undefined') {
      this.loadBalances();
    }
  }

  /**
   * Cargar saldos desde localStorage
   */
  loadBalances() {
    try {
      const result = safeLocalStorage.getItem(this.STORAGE_KEY);
      this.balances = (result && result.success && result.data) ? result.data : {};
      // Asegurar que siempre sea un objeto
      if (!this.balances || typeof this.balances !== 'object') {
        this.balances = {};
      }
    } catch (error) {
      console.error('Error loading CC initial balances:', error);
      this.balances = {};
    }
  }

  /**
   * Guardar saldos en localStorage
   */
  saveBalances() {
    try {
      // Asegurar que this.balances sea un objeto válido
      if (!this.balances || typeof this.balances !== 'object') {
        this.balances = {};
      }
      const result = safeLocalStorage.setItem(this.STORAGE_KEY, this.balances);
      if (!result.success) {
        console.error('Error guardando saldos CC:', result.error);
      }
    } catch (error) {
      console.error('Error saving CC initial balances:', error);
    }
  }

  /**
   * Obtener saldo inicial de un proveedor y moneda
   */
  getBalance(proveedor, moneda) {
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    const key = `${proveedor}-${moneda}`;
    return safeParseFloat(this.balances[key], 0);
  }

  /**
   * Establecer saldo inicial
   * Negativo = les debemos, Positivo = nos deben
   */
  setBalance(proveedor, moneda, monto) {
    // Validar parámetros
    if (!proveedor || !moneda || typeof proveedor !== 'string' || typeof moneda !== 'string') {
      console.warn('setBalance: parámetros inválidos', { proveedor, moneda });
      return;
    }
    
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    
    const key = `${proveedor}-${moneda}`;
    const amount = safeParseFloat(monto, 0);
    
    if (amount === 0) {
      delete this.balances[key];
    } else {
      this.balances[key] = amount;
    }
    
    this.saveBalances();
  }

  /**
   * Obtener todos los saldos agrupados por proveedor
   */
  getAllBalancesByProveedor() {
    const grouped = {};
    
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
      return grouped;
    }
    
    Object.entries(this.balances).forEach(([key, monto]) => {
      // Asegurar que key es string
      if (typeof key !== 'string' || !key.includes('-')) {
        return;
      }
      
      const [proveedor, moneda] = key.split('-');
      if (!grouped[proveedor]) {
        grouped[proveedor] = {};
      }
      grouped[proveedor][moneda] = monto;
    });
    
    return grouped;
  }

  /**
   * Obtener todos los saldos
   */
  getAllBalances() {
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    return { ...this.balances };
  }

  /**
   * Limpiar todos los saldos
   */
  clearAllBalances() {
    this.balances = {};
    this.saveBalances();
  }
}

// Exportar instancia única
const ccInitialBalanceService = new CCInitialBalanceService();
export default ccInitialBalanceService;