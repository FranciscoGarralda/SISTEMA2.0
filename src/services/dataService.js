/**
 * Data Service - Servicio consolidado para manejo de datos
 * Combina: api.js, localStorageBackend.js, cache.js, server-wake.js
 */

import { safeExecute } from './utilityService.js';

// ========================
// 🗄️ CACHE SERVICE
// ========================
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 5 * 60 * 1000; // 5 minutos
  }

  set(key, value, ttl = this.ttl) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    return this.cache.has(key);
  }
}

// ========================
// 💾 LOCAL STORAGE BACKEND
// ========================
class LocalStorageBackend {
  constructor() {
    this.prefix = 'sistema_financiero_';
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  async get(key) {
    if (!this.isAvailable) return null;
    
    return safeExecute(() => {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    }, null, `LocalStorage get: ${key}`);
  }

  async set(key, value) {
    if (!this.isAvailable) return false;
    
    return safeExecute(() => {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
      return true;
    }, false, `LocalStorage set: ${key}`);
  }

  async delete(key) {
    if (!this.isAvailable) return false;
    
    return safeExecute(() => {
      localStorage.removeItem(this.getKey(key));
      return true;
    }, false, `LocalStorage delete: ${key}`);
  }

  async clear() {
    if (!this.isAvailable) return false;
    
    return safeExecute(() => {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
      return true;
    }, false, 'LocalStorage clear');
  }
}

// ========================
// 🌐 API SERVICE
// ========================
class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.cache = new CacheService();
    this.localBackend = new LocalStorageBackend();
    // Forzar modo local para desarrollo y cuando no hay servidor backend
    this.isLocalMode = true; // Siempre usar modo local para simplicidad
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Métodos CRUD
  async get(endpoint, useCache = true) {
    if (useCache) {
      const cached = this.cache.get(endpoint);
      if (cached) return cached;
    }

    const data = await this.request(endpoint, { method: 'GET' });
    
    if (useCache) {
      this.cache.set(endpoint, data);
    }

    return data;
  }

  async post(endpoint, data) {
    const result = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Invalidar cache relacionado
    this.cache.delete(endpoint);
    return result;
  }

  async put(endpoint, data) {
    const result = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    this.cache.delete(endpoint);
    return result;
  }

  async delete(endpoint) {
    const result = await this.request(endpoint, { method: 'DELETE' });
    this.cache.delete(endpoint);
    return result;
  }

  // Métodos específicos del negocio
  async getMovements() {
    if (this.isLocalMode) {
      return this.localBackend.get('movements') || [];
    }
    return this.get('/movements');
  }

  async saveMovement(movement) {
    if (this.isLocalMode) {
      const movements = await this.getMovements();
      const newMovement = { ...movement, id: Date.now().toString() };
      movements.push(newMovement);
      await this.localBackend.set('movements', movements);
      return newMovement;
    }
    return this.post('/movements', movement);
  }

  async getClients() {
    if (this.isLocalMode) {
      return this.localBackend.get('clients') || [];
    }
    return this.get('/clients');
  }

  async saveClient(client) {
    if (this.isLocalMode) {
      const clients = await this.getClients();
      const newClient = { ...client, id: Date.now().toString() };
      clients.push(newClient);
      await this.localBackend.set('clients', clients);
      return newClient;
    }
    return this.post('/clients', client);
  }

  async login(username, password) {
    if (this.isLocalMode) {
      // Simular login local para desarrollo
      if (username === 'admin' && password === 'admin') {
        // Guardar token simulado
        const token = 'local-dev-token-' + Date.now();
        sessionStorage.setItem('authToken', token);
        localStorage.setItem('authToken', token);
        
        return {
          success: true,
          user: {
            id: '1',
            username: 'admin',
            name: 'Administrador',
            role: 'admin'
          },
          token: token
        };
      } else {
        return {
          success: false,
          message: 'Credenciales incorrectas'
        };
      }
    }
    
    const response = await this.post('/auth/login', { username, password });
    
    // Guardar token si el login es exitoso
    if (response && response.success && response.token) {
      sessionStorage.setItem('authToken', response.token);
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async getMe() {
    if (this.isLocalMode) {
      // Simular usuario autenticado en modo local
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      if (token) {
        return {
          id: '1',
          username: 'admin',
          name: 'Administrador',
          role: 'admin'
        };
      }
      return null;
    }
    
    return this.get('/auth/me');
  }

  async logout() {
    this.cache.clear();
    return Promise.resolve();
  }

  // Métodos para gestión de usuarios
  async getUsers() {
    if (this.isLocalMode) {
      return this.localBackend.get('users') || [];
    }
    return this.get('/users');
  }

  async createUser(userData) {
    if (this.isLocalMode) {
      const users = await this.getUsers();
      const newUser = { ...userData, id: Date.now().toString() };
      users.push(newUser);
      await this.localBackend.set('users', users);
      return newUser;
    }
    return this.post('/users', userData);
  }

  async updateUser(userId, userData) {
    if (this.isLocalMode) {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...userData };
        await this.localBackend.set('users', users);
        return users[userIndex];
      }
      throw new Error('Usuario no encontrado');
    }
    return this.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    if (this.isLocalMode) {
      const users = await this.getUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      await this.localBackend.set('users', filteredUsers);
      return true;
    }
    return this.delete(`/users/${userId}`);
  }

  // Métodos para gestión de movimientos
  async getMovements() {
    if (this.isLocalMode) {
      return this.localBackend.get('movements') || [];
    }
    return this.get('/movements');
  }

  async saveMovement(movement) {
    if (this.isLocalMode) {
      const movements = await this.getMovements();
      const newMovement = { ...movement, id: Date.now().toString() };
      movements.push(newMovement);
      await this.localBackend.set('movements', movements);
      return newMovement;
    }
    return this.post('/movements', movement);
  }

  async updateMovement(movementId, movementData) {
    if (this.isLocalMode) {
      const movements = await this.getMovements();
      const movementIndex = movements.findIndex(m => m.id === movementId);
      if (movementIndex >= 0) {
        movements[movementIndex] = { ...movements[movementIndex], ...movementData };
        await this.localBackend.set('movements', movements);
        return movements[movementIndex];
      }
      throw new Error('Movimiento no encontrado');
    }
    return this.put(`/movements/${movementId}`, movementData);
  }

  async deleteMovement(movementId) {
    if (this.isLocalMode) {
      const movements = await this.getMovements();
      const filteredMovements = movements.filter(m => m.id !== movementId);
      await this.localBackend.set('movements', filteredMovements);
      return true;
    }
    return this.delete(`/movements/${movementId}`);
  }

  // Métodos para gestión de clientes
  async updateClient(clientId, clientData) {
    if (this.isLocalMode) {
      const clients = await this.getClients();
      const clientIndex = clients.findIndex(c => c.id === clientId);
      if (clientIndex >= 0) {
        clients[clientIndex] = { ...clients[clientIndex], ...clientData };
        await this.localBackend.set('clients', clients);
        return clients[clientIndex];
      }
      throw new Error('Cliente no encontrado');
    }
    return this.put(`/clients/${clientId}`, clientData);
  }

  async deleteClient(clientId) {
    if (this.isLocalMode) {
      const clients = await this.getClients();
      const filteredClients = clients.filter(c => c.id !== clientId);
      await this.localBackend.set('clients', filteredClients);
      return true;
    }
    return this.delete(`/clients/${clientId}`);
  }

  async getClientById(clientId) {
    if (this.isLocalMode) {
      const clients = await this.getClients();
      return clients.find(c => c.id === clientId) || null;
    }
    return this.get(`/clients/${clientId}`);
  }

  // Métodos para gestión de stock
  async getStock() {
    if (this.isLocalMode) {
      return this.localBackend.get('stock') || {};
    }
    return this.get('/stock');
  }

  async saveStock(stockData) {
    if (this.isLocalMode) {
      await this.localBackend.set('stock', stockData);
      return stockData;
    }
    return this.post('/stock', stockData);
  }

  // Métodos para gestión de balances
  async getBalances() {
    if (this.isLocalMode) {
      return this.localBackend.get('balances') || {};
    }
    return this.get('/balances');
  }

  async saveBalance(balanceData) {
    if (this.isLocalMode) {
      await this.localBackend.set('balances', balanceData);
      return balanceData;
    }
    return this.post('/balances', balanceData);
  }

  // Métodos para gestión de caja
  async getCajaData() {
    if (this.isLocalMode) {
      return this.localBackend.get('caja') || {};
    }
    return this.get('/caja');
  }

  async saveCajaData(cajaData) {
    if (this.isLocalMode) {
      await this.localBackend.set('caja', cajaData);
      return cajaData;
    }
    return this.post('/caja', cajaData);
  }

  // Métodos para gestión de saldos iniciales
  async getInitialBalances() {
    if (this.isLocalMode) {
      return this.localBackend.get('initialBalances') || {};
    }
    return this.get('/initial-balances');
  }

  async saveInitialBalance(balanceData) {
    if (this.isLocalMode) {
      await this.localBackend.set('initialBalances', balanceData);
      return balanceData;
    }
    return this.post('/initial-balances', balanceData);
  }

  // Métodos para gestión de cuentas corrientes
  async getCCBalances() {
    if (this.isLocalMode) {
      return this.localBackend.get('ccBalances') || {};
    }
    return this.get('/cc-balances');
  }

  async saveCCBalance(balanceData) {
    if (this.isLocalMode) {
      await this.localBackend.set('ccBalances', balanceData);
      return balanceData;
    }
    return this.post('/cc-balances', balanceData);
  }

  // Métodos para gestión de prestamistas
  async getLenders() {
    if (this.isLocalMode) {
      return this.localBackend.get('lenders') || [];
    }
    return this.get('/lenders');
  }

  async saveLender(lenderData) {
    if (this.isLocalMode) {
      const lenders = await this.getLenders();
      const newLender = { ...lenderData, id: Date.now().toString() };
      lenders.push(newLender);
      await this.localBackend.set('lenders', lenders);
      return newLender;
    }
    return this.post('/lenders', lenderData);
  }

  async updateLender(lenderId, lenderData) {
    if (this.isLocalMode) {
      const lenders = await this.getLenders();
      const lenderIndex = lenders.findIndex(l => l.id === lenderId);
      if (lenderIndex >= 0) {
        lenders[lenderIndex] = { ...lenders[lenderIndex], ...lenderData };
        await this.localBackend.set('lenders', lenders);
        return lenders[lenderIndex];
      }
      throw new Error('Prestamista no encontrado');
    }
    return this.put(`/lenders/${lenderId}`, lenderData);
  }

  async deleteLender(lenderId) {
    if (this.isLocalMode) {
      const lenders = await this.getLenders();
      const filteredLenders = lenders.filter(l => l.id !== lenderId);
      await this.localBackend.set('lenders', filteredLenders);
      return true;
    }
    return this.delete(`/lenders/${lenderId}`);
  }

  // Métodos para gestión de gastos
  async getExpenses() {
    if (this.isLocalMode) {
      return this.localBackend.get('expenses') || [];
    }
    return this.get('/expenses');
  }

  async saveExpense(expenseData) {
    if (this.isLocalMode) {
      const expenses = await this.getExpenses();
      const newExpense = { ...expenseData, id: Date.now().toString() };
      expenses.push(newExpense);
      await this.localBackend.set('expenses', expenses);
      return newExpense;
    }
    return this.post('/expenses', expenseData);
  }

  async updateExpense(expenseId, expenseData) {
    if (this.isLocalMode) {
      const expenses = await this.getExpenses();
      const expenseIndex = expenses.findIndex(e => e.id === expenseId);
      if (expenseIndex >= 0) {
        expenses[expenseIndex] = { ...expenses[expenseIndex], ...expenseData };
        await this.localBackend.set('expenses', expenses);
        return expenses[expenseIndex];
      }
      throw new Error('Gasto no encontrado');
    }
    return this.put(`/expenses/${expenseId}`, expenseData);
  }

  async deleteExpense(expenseId) {
    if (this.isLocalMode) {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(e => e.id !== expenseId);
      await this.localBackend.set('expenses', filteredExpenses);
      return true;
    }
    return this.delete(`/expenses/${expenseId}`);
  }

  // Métodos para gestión de comisiones
  async getCommissions() {
    if (this.isLocalMode) {
      return this.localBackend.get('commissions') || [];
    }
    return this.get('/commissions');
  }

  async saveCommission(commissionData) {
    if (this.isLocalMode) {
      const commissions = await this.getCommissions();
      const newCommission = { ...commissionData, id: Date.now().toString() };
      commissions.push(newCommission);
      await this.localBackend.set('commissions', commissions);
      return newCommission;
    }
    return this.post('/commissions', commissionData);
  }

  // Métodos para gestión de pendientes de retiro
  async getPendingWithdrawals() {
    if (this.isLocalMode) {
      return this.localBackend.get('pendingWithdrawals') || [];
    }
    return this.get('/pending-withdrawals');
  }

  async savePendingWithdrawal(withdrawalData) {
    if (this.isLocalMode) {
      const withdrawals = await this.getPendingWithdrawals();
      const newWithdrawal = { ...withdrawalData, id: Date.now().toString() };
      withdrawals.push(newWithdrawal);
      await this.localBackend.set('pendingWithdrawals', withdrawals);
      return newWithdrawal;
    }
    return this.post('/pending-withdrawals', withdrawalData);
  }

  async updatePendingWithdrawal(withdrawalId, withdrawalData) {
    if (this.isLocalMode) {
      const withdrawals = await this.getPendingWithdrawals();
      const withdrawalIndex = withdrawals.findIndex(w => w.id === withdrawalId);
      if (withdrawalIndex >= 0) {
        withdrawals[withdrawalIndex] = { ...withdrawals[withdrawalIndex], ...withdrawalData };
        await this.localBackend.set('pendingWithdrawals', withdrawals);
        return withdrawals[withdrawalIndex];
      }
      throw new Error('Pendiente de retiro no encontrado');
    }
    return this.put(`/pending-withdrawals/${withdrawalId}`, withdrawalData);
  }

  async deletePendingWithdrawal(withdrawalId) {
    if (this.isLocalMode) {
      const withdrawals = await this.getPendingWithdrawals();
      const filteredWithdrawals = withdrawals.filter(w => w.id !== withdrawalId);
      await this.localBackend.set('pendingWithdrawals', filteredWithdrawals);
      return true;
    }
    return this.delete(`/pending-withdrawals/${withdrawalId}`);
  }

  // Métodos para gestión de rentabilidad
  async getProfitabilityData() {
    if (this.isLocalMode) {
      return this.localBackend.get('profitability') || {};
    }
    return this.get('/profitability');
  }

  async saveProfitabilityData(profitabilityData) {
    if (this.isLocalMode) {
      await this.localBackend.set('profitability', profitabilityData);
      return profitabilityData;
    }
    return this.post('/profitability', profitabilityData);
  }

  // Métodos para gestión de utilidad
  async getUtilityData() {
    if (this.isLocalMode) {
      return this.localBackend.get('utility') || {};
    }
    return this.get('/utility');
  }

  async saveUtilityData(utilityData) {
    if (this.isLocalMode) {
      await this.localBackend.set('utility', utilityData);
      return utilityData;
    }
    return this.post('/utility', utilityData);
  }

  // Métodos para gestión de arbitraje
  async getArbitrageData() {
    if (this.isLocalMode) {
      return this.localBackend.get('arbitrage') || {};
    }
    return this.get('/arbitrage');
  }

  async saveArbitrageData(arbitrageData) {
    if (this.isLocalMode) {
      await this.localBackend.set('arbitrage', arbitrageData);
      return arbitrageData;
    }
    return this.post('/arbitrage', arbitrageData);
  }

  // Métodos para gestión de cuentas corrientes
  async getCurrentAccounts() {
    if (this.isLocalMode) {
      return this.localBackend.get('currentAccounts') || [];
    }
    return this.get('/current-accounts');
  }

  async saveCurrentAccount(accountData) {
    if (this.isLocalMode) {
      const accounts = await this.getCurrentAccounts();
      const newAccount = { ...accountData, id: Date.now().toString() };
      accounts.push(newAccount);
      await this.localBackend.set('currentAccounts', accounts);
      return newAccount;
    }
    return this.post('/current-accounts', accountData);
  }

  async updateCurrentAccount(accountId, accountData) {
    if (this.isLocalMode) {
      const accounts = await this.getCurrentAccounts();
      const accountIndex = accounts.findIndex(a => a.id === accountId);
      if (accountIndex >= 0) {
        accounts[accountIndex] = { ...accounts[accountIndex], ...accountData };
        await this.localBackend.set('currentAccounts', accounts);
        return accounts[accountIndex];
      }
      throw new Error('Cuenta corriente no encontrada');
    }
    return this.put(`/current-accounts/${accountId}`, accountData);
  }

  async deleteCurrentAccount(accountId) {
    if (this.isLocalMode) {
      const accounts = await this.getCurrentAccounts();
      const filteredAccounts = accounts.filter(a => a.id !== accountId);
      await this.localBackend.set('currentAccounts', filteredAccounts);
      return true;
    }
    return this.delete(`/current-accounts/${accountId}`);
  }
}

// ========================
// 🔄 SERVER WAKE SERVICE
// ========================
class ServerWakeService {
  constructor() {
    this.wakeInterval = null;
    this.isWaking = false;
  }

  async wakeServer() {
    if (this.isWaking) return;
    
    this.isWaking = true;
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('🔧 Servidor despierto y funcionando');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ No se pudo despertar el servidor:', error.message);
    } finally {
      this.isWaking = false;
    }
    
    return false;
  }

  startWakeInterval(intervalMs = 30000) {
    if (this.wakeInterval) {
      clearInterval(this.wakeInterval);
    }
    
    this.wakeInterval = setInterval(() => {
      this.wakeServer();
    }, intervalMs);
  }

  stopWakeInterval() {
    if (this.wakeInterval) {
      clearInterval(this.wakeInterval);
      this.wakeInterval = null;
    }
  }
}

// ========================
// 📦 EXPORTS
// ========================
export const cacheService = new CacheService();
export const localStorageBackend = new LocalStorageBackend();
export const apiService = new ApiService();
export const serverWakeService = new ServerWakeService();

// Export consolidado
export const dataService = {
  cache: cacheService,
  storage: localStorageBackend,
  api: apiService,
  wake: serverWakeService,
  
  // Métodos de conveniencia
  async getData(key, useCache = true) {
    return apiService.get(key, useCache);
  },
  
  async saveData(key, data) {
    return apiService.post(key, data);
  },
  
  async updateData(key, data) {
    return apiService.put(key, data);
  },
  
  async deleteData(key) {
    return apiService.delete(key);
  },
  
  clearCache() {
    cacheService.clear();
  }
};
