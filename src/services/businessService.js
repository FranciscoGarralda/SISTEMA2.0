/**
 * Business Service - Servicio consolidado de lógica de negocio
 * Combina: balanceService.js, stockService.js, cajaService.js, movementService.js
 */

import { dataService } from './dataService.js';
import { 
  safeParseFloat, 
  safeArray, 
  safeArrayFilter, 
  safeArrayReduce,
  formatAmountWithCurrency,
  formatDate,
  getClientName
} from './utilityService.js';

// ========================
// 💰 BALANCE SERVICE
// ========================

class BalanceService {
  constructor() {
    this.storageKey = 'balances';
  }

  async getBalances() {
    try {
      const balances = await dataService.storage.get(this.storageKey) || [];
      return safeArray(balances);
    } catch (error) {
      console.error('Error obteniendo balances:', error);
      return [];
    }
  }

  async saveBalance(balance) {
    try {
      const balances = await this.getBalances();
      const newBalance = {
        ...balance,
        id: balance.id || Date.now().toString(),
        fecha: balance.fecha || new Date().toISOString(),
        monto: safeParseFloat(balance.monto, 0)
      };

      const existingIndex = balances.findIndex(b => b.id === newBalance.id);
      if (existingIndex >= 0) {
        balances[existingIndex] = newBalance;
      } else {
        balances.push(newBalance);
      }

      await dataService.storage.set(this.storageKey, balances);
      return newBalance;
    } catch (error) {
      console.error('Error guardando balance:', error);
      throw error;
    }
  }

  async deleteBalance(balanceId) {
    try {
      const balances = await this.getBalances();
      const filteredBalances = safeArrayFilter(balances, b => b.id !== balanceId);
      await dataService.storage.set(this.storageKey, filteredBalances);
      return true;
    } catch (error) {
      console.error('Error eliminando balance:', error);
      return false;
    }
  }

  calculateTotalBalance(balances = []) {
    return safeArrayReduce(balances, (total, balance) => {
      return total + safeParseFloat(balance.monto, 0);
    }, 0);
  }

  getBalanceByDate(balances = [], date) {
    return safeArrayFilter(balances, balance => {
      return balance.fecha === date;
    });
  }

  formatBalance(balance) {
    return {
      ...balance,
      montoFormatted: formatAmountWithCurrency(balance.monto),
      fechaFormatted: formatDate(balance.fecha)
    };
  }

  // Métodos específicos para saldos iniciales
  getAllInitialBalancesByCuenta() {
    try {
      const balances = dataService.storage.get('initialBalances') || {};
      return balances;
    } catch (error) {
      console.error('Error obteniendo saldos iniciales:', error);
      return {};
    }
  }

  async saveInitialBalance(cuenta, monto) {
    try {
      const balances = this.getAllInitialBalancesByCuenta();
      balances[cuenta] = safeParseFloat(monto, 0);
      await dataService.storage.set('initialBalances', balances);
      return balances;
    } catch (error) {
      console.error('Error guardando saldo inicial:', error);
      throw error;
    }
  }

  // Métodos para cuentas corrientes
  getCCBalance(proveedor, currency) {
    try {
      const balances = dataService.storage.get('ccBalances') || {};
      const key = `${proveedor}-${currency}`;
      return safeParseFloat(balances[key], 0);
    } catch (error) {
      console.error('Error obteniendo balance CC:', error);
      return 0;
    }
  }

  async saveCCBalance(proveedor, currency, monto) {
    try {
      const balances = dataService.storage.get('ccBalances') || {};
      const key = `${proveedor}-${currency}`;
      balances[key] = safeParseFloat(monto, 0);
      await dataService.storage.set('ccBalances', balances);
      return balances;
    } catch (error) {
      console.error('Error guardando balance CC:', error);
      throw error;
    }
  }

  // Método para obtener todos los balances CC por proveedor
  getAllCCBalancesByProveedor() {
    try {
      const balances = dataService.storage.get('ccBalances') || {};
      return balances;
    } catch (error) {
      console.error('Error obteniendo balances CC por proveedor:', error);
      return {};
    }
  }
}

// ========================
// 📦 STOCK SERVICE
// ========================

class StockService {
  constructor() {
    this.storageKey = 'stock';
  }

  async getStock() {
    try {
      const stock = await dataService.storage.get(this.storageKey) || [];
      return safeArray(stock);
    } catch (error) {
      console.error('Error obteniendo stock:', error);
      return [];
    }
  }

  async saveStockItem(item) {
    try {
      const stock = await this.getStock();
      const newItem = {
        ...item,
        id: item.id || Date.now().toString(),
        fecha: item.fecha || new Date().toISOString(),
        cantidad: safeParseFloat(item.cantidad, 0),
        precio: safeParseFloat(item.precio, 0)
      };

      const existingIndex = stock.findIndex(s => s.id === newItem.id);
      if (existingIndex >= 0) {
        stock[existingIndex] = newItem;
      } else {
        stock.push(newItem);
      }

      await dataService.storage.set(this.storageKey, stock);
      return newItem;
    } catch (error) {
      console.error('Error guardando item de stock:', error);
      throw error;
    }
  }

  async deleteStockItem(itemId) {
    try {
      const stock = await this.getStock();
      const filteredStock = safeArrayFilter(stock, s => s.id !== itemId);
      await dataService.storage.set(this.storageKey, filteredStock);
      return true;
    } catch (error) {
      console.error('Error eliminando item de stock:', error);
      return false;
    }
  }

  calculateTotalStock(stock = []) {
    return safeArrayReduce(stock, (total, item) => {
      return total + (safeParseFloat(item.cantidad, 0) * safeParseFloat(item.precio, 0));
    }, 0);
  }

  getStockByProduct(stock = [], productId) {
    return safeArrayFilter(stock, item => item.productoId === productId);
  }

  updateStockQuantity(stock = [], productId, quantity) {
    return safeArray(stock).map(item => {
      if (item.productoId === productId) {
        return {
          ...item,
          cantidad: safeParseFloat(item.cantidad, 0) + safeParseFloat(quantity, 0)
        };
      }
      return item;
    });
  }

  formatStockItem(item) {
    return {
      ...item,
      cantidadFormatted: safeParseFloat(item.cantidad, 0).toFixed(2),
      precioFormatted: formatAmountWithCurrency(item.precio),
      totalFormatted: formatAmountWithCurrency(
        safeParseFloat(item.cantidad, 0) * safeParseFloat(item.precio, 0)
      ),
      fechaFormatted: formatDate(item.fecha)
    };
  }

  // Método específico para obtener todo el stock
  getAllStock() {
    try {
      const stock = dataService.storage.get(this.storageKey) || [];
      return safeArray(stock);
    } catch (error) {
      console.error('Error obteniendo todo el stock:', error);
      return [];
    }
  }
}

// ========================
// 💼 CAJA SERVICE
// ========================

class CajaService {
  constructor() {
    this.storageKey = 'caja';
  }

  async getCajaData() {
    try {
      const cajaData = await dataService.storage.get(this.storageKey) || {
        saldoInicial: 0,
        movimientos: [],
        saldoActual: 0
      };
      return cajaData;
    } catch (error) {
      console.error('Error obteniendo datos de caja:', error);
      return {
        saldoInicial: 0,
        movimientos: [],
        saldoActual: 0
      };
    }
  }

  // Método específico para obtener apertura de caja
  getApertura(fecha) {
    try {
      const cajaData = dataService.storage.get(this.storageKey) || {};
      const aperturaKey = `apertura_${fecha}`;
      return cajaData[aperturaKey] || {
        saldoInicial: 0,
        monedas: {}
      };
    } catch (error) {
      console.error('Error obteniendo apertura de caja:', error);
      return {
        saldoInicial: 0,
        monedas: {}
      };
    }
  }

  // Método para verificar si hay cierre
  hayCierre(fecha) {
    try {
      const cajaData = dataService.storage.get(this.storageKey) || {};
      const cierreKey = `cierre_${fecha}`;
      return !!cajaData[cierreKey];
    } catch (error) {
      console.error('Error verificando cierre de caja:', error);
      return false;
    }
  }

  async saveCajaData(cajaData) {
    try {
      const data = {
        ...cajaData,
        saldoInicial: safeParseFloat(cajaData.saldoInicial, 0),
        saldoActual: safeParseFloat(cajaData.saldoActual, 0),
        movimientos: safeArray(cajaData.movimientos)
      };
      await dataService.storage.set(this.storageKey, data);
      return data;
    } catch (error) {
      console.error('Error guardando datos de caja:', error);
      throw error;
    }
  }

  async addMovimiento(movimiento) {
    try {
      const cajaData = await this.getCajaData();
      const newMovimiento = {
        ...movimiento,
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        monto: safeParseFloat(movimiento.monto, 0)
      };

      cajaData.movimientos.push(newMovimiento);
      cajaData.saldoActual = this.calculateSaldoActual(cajaData.saldoInicial, cajaData.movimientos);
      
      await this.saveCajaData(cajaData);
      return newMovimiento;
    } catch (error) {
      console.error('Error agregando movimiento de caja:', error);
      throw error;
    }
  }

  calculateSaldoActual(saldoInicial, movimientos = []) {
    const totalMovimientos = safeArrayReduce(movimientos, (total, mov) => {
      const monto = safeParseFloat(mov.monto, 0);
      return mov.tipo === 'INGRESO' ? total + monto : total - monto;
    }, 0);

    return safeParseFloat(saldoInicial, 0) + totalMovimientos;
  }

  getMovimientosByDate(movimientos = [], date) {
    return safeArrayFilter(movimientos, mov => {
      return mov.fecha.startsWith(date);
    });
  }

  getMovimientosByType(movimientos = [], type) {
    return safeArrayFilter(movimientos, mov => mov.tipo === type);
  }

  formatCajaData(cajaData) {
    return {
      ...cajaData,
      saldoInicialFormatted: formatAmountWithCurrency(cajaData.saldoInicial),
      saldoActualFormatted: formatAmountWithCurrency(cajaData.saldoActual),
      movimientos: safeArray(cajaData.movimientos).map(mov => ({
        ...mov,
        montoFormatted: formatAmountWithCurrency(mov.monto),
        fechaFormatted: formatDate(mov.fecha)
      }))
    };
  }
}

// ========================
// 📊 MOVEMENT SERVICE
// ========================

class MovementService {
  constructor() {
    this.storageKey = 'movements';
  }

  async getMovements() {
    try {
      const movements = await dataService.storage.get(this.storageKey) || [];
      return safeArray(movements);
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      return [];
    }
  }

  async saveMovement(movement) {
    try {
      const movements = await this.getMovements();
      const newMovement = {
        ...movement,
        id: movement.id || Date.now().toString(),
        fecha: movement.fecha || new Date().toISOString(),
        monto: safeParseFloat(movement.monto, 0),
        comision: safeParseFloat(movement.comision, 0)
      };

      const existingIndex = movements.findIndex(m => m.id === newMovement.id);
      if (existingIndex >= 0) {
        movements[existingIndex] = newMovement;
      } else {
        movements.push(newMovement);
      }

      await dataService.storage.set(this.storageKey, movements);
      return newMovement;
    } catch (error) {
      console.error('Error guardando movimiento:', error);
      throw error;
    }
  }

  async deleteMovement(movementId) {
    try {
      const movements = await this.getMovements();
      const filteredMovements = safeArrayFilter(movements, m => m.id !== movementId);
      await dataService.storage.set(this.storageKey, filteredMovements);
      return true;
    } catch (error) {
      console.error('Error eliminando movimiento:', error);
      return false;
    }
  }

  getMovementsByType(movements = [], type) {
    return safeArrayFilter(movements, mov => mov.operacion === type);
  }

  getMovementsByDate(movements = [], date) {
    return safeArrayFilter(movements, mov => {
      return mov.fecha.startsWith(date);
    });
  }

  getMovementsByClient(movements = [], clientId) {
    return safeArrayFilter(movements, mov => mov.clienteId === clientId);
  }

  calculateTotalMovements(movements = []) {
    return safeArrayReduce(movements, (total, mov) => {
      return total + safeParseFloat(mov.monto, 0);
    }, 0);
  }

  calculateTotalCommissions(movements = []) {
    return safeArrayReduce(movements, (total, mov) => {
      return total + safeParseFloat(mov.comision, 0);
    }, 0);
  }

  calculateProfitability(movements = []) {
    const totalMovements = this.calculateTotalMovements(movements);
    const totalCommissions = this.calculateTotalCommissions(movements);
    
    if (totalMovements === 0) return 0;
    
    return (totalCommissions / totalMovements) * 100;
  }

  formatMovement(movement, clients = []) {
    return {
      ...movement,
      montoFormatted: formatAmountWithCurrency(movement.monto),
      comisionFormatted: formatAmountWithCurrency(movement.comision),
      totalFormatted: formatAmountWithCurrency(
        safeParseFloat(movement.monto, 0) + safeParseFloat(movement.comision, 0)
      ),
      fechaFormatted: formatDate(movement.fecha),
      clienteNombre: getClientName(movement.clienteId, clients)
    };
  }

  getMovementStats(movements = []) {
    const totalMovements = this.calculateTotalMovements(movements);
    const totalCommissions = this.calculateTotalCommissions(movements);
    const profitability = this.calculateProfitability(movements);
    
    const byType = {};
    safeArray(movements).forEach(mov => {
      const type = mov.operacion;
      if (!byType[type]) {
        byType[type] = { count: 0, total: 0, commissions: 0 };
      }
      byType[type].count++;
      byType[type].total += safeParseFloat(mov.monto, 0);
      byType[type].commissions += safeParseFloat(mov.comision, 0);
    });

    return {
      totalMovements,
      totalCommissions,
      profitability,
      byType,
      formatted: {
        totalMovements: formatAmountWithCurrency(totalMovements),
        totalCommissions: formatAmountWithCurrency(totalCommissions),
        profitability: `${profitability.toFixed(2)}%`
      }
    };
  }
}

// ========================
// 📦 EXPORTS
// ========================

export const balanceService = new BalanceService();
export const stockService = new StockService();
export const cajaService = new CajaService();
export const movementService = new MovementService();

// Export consolidado
export const businessService = {
  balance: balanceService,
  stock: stockService,
  caja: cajaService,
  movement: movementService,
  
  // Métodos de conveniencia
  async getAllData() {
    const [balances, stock, caja, movements] = await Promise.all([
      balanceService.getBalances(),
      stockService.getStock(),
      cajaService.getCajaData(),
      movementService.getMovements()
    ]);
    
    return { balances, stock, caja, movements };
  },
  
  async saveAllData(data) {
    const promises = [];
    
    if (data.balances) {
      promises.push(dataService.storage.set('balances', data.balances));
    }
    
    if (data.stock) {
      promises.push(dataService.storage.set('stock', data.stock));
    }
    
    if (data.caja) {
      promises.push(cajaService.saveCajaData(data.caja));
    }
    
    if (data.movements) {
      promises.push(dataService.storage.set('movements', data.movements));
    }
    
    await Promise.all(promises);
    return true;
  },
  
  // Métodos de cálculo consolidados
  calculateTotals(data) {
    return {
      balances: balanceService.calculateTotalBalance(data.balances || []),
      stock: stockService.calculateTotalStock(data.stock || []),
      caja: cajaService.calculateSaldoActual(
        data.caja?.saldoInicial || 0,
        data.caja?.movimientos || []
      ),
      movements: movementService.calculateTotalMovements(data.movements || []),
      commissions: movementService.calculateTotalCommissions(data.movements || []),
      profitability: movementService.calculateProfitability(data.movements || [])
    };
  },
  
  formatAllData(data) {
    return {
      balances: safeArray(data.balances).map(b => balanceService.formatBalance(b)),
      stock: safeArray(data.stock).map(s => stockService.formatStockItem(s)),
      caja: cajaService.formatCajaData(data.caja || {}),
      movements: safeArray(data.movements).map(m => 
        movementService.formatMovement(m, data.clients || [])
      )
    };
  }
};
