import { safeLocalStorage, safeParseFloat } from './safeOperations';

/**
 * Servicio para manejar saldos iniciales por cuenta
 */
class InitialBalanceService {
  constructor() {
    this.BALANCE_KEY = 'financial-initial-balances';
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
      const result = safeLocalStorage.getItem(this.BALANCE_KEY);
      this.balances = (result && result.success && result.data) ? result.data : {};
      // Asegurar que siempre sea un objeto
      if (!this.balances || typeof this.balances !== 'object') {
        this.balances = {};
      }
    } catch (error) {
      console.error('Error loading initial balances:', error);
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
      const result = safeLocalStorage.setItem(this.BALANCE_KEY, this.balances);
      if (!result.success) {
        console.error('Error saving initial balances:', result.error);
      }
    } catch (error) {
      console.error('Error saving initial balances:', error);
    }
  }

  /**
   * Obtiene el saldo inicial de una cuenta específica
   */
  getBalance(cuenta, moneda) {
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    const key = `${cuenta}-${moneda}`;
    return safeParseFloat(this.balances[key], 0);
  }

  /**
   * Establece el saldo inicial para una cuenta y moneda específica
   */
  setBalance(cuenta, moneda, monto) {
    // Validar parámetros
    if (!cuenta || !moneda || typeof cuenta !== 'string' || typeof moneda !== 'string') {
      console.warn('setBalance: parámetros inválidos', { cuenta, moneda });
      return;
    }
    
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    
    const key = `${cuenta}-${moneda}`;
    const numericMonto = safeParseFloat(monto, 0);
    
    if (numericMonto === 0) {
      delete this.balances[key];
    } else {
      this.balances[key] = numericMonto;
    }
    
    this.saveBalances();
  }

  /**
   * Obtiene todos los saldos agrupados por cuenta
   */
  getAllBalancesByCuenta() {
    const result = {};
    
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
      return result;
    }
    
    Object.entries(this.balances).forEach(([key, value]) => {
      // Asegurar que key es string
      if (typeof key !== 'string' || !key.includes('-')) {
        return;
      }
      
      const [cuenta, moneda] = key.split('-');
      if (!result[cuenta]) {
        result[cuenta] = {};
      }
      result[cuenta][moneda] = value;
    });
    
    return result;
  }

  /**
   * Obtiene todos los saldos iniciales
   */
  getAllBalances() {
    // Asegurar que this.balances sea un objeto válido
    if (!this.balances || typeof this.balances !== 'object') {
      this.balances = {};
    }
    return this.balances;
  }

  /**
   * Limpia todos los saldos iniciales
   */
  clearAllBalances() {
    this.balances = {};
    this.saveBalances();
  }
}

// Exportar instancia única
const initialBalanceService = new InitialBalanceService();
export default initialBalanceService;