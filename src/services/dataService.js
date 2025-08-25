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
    this.isLocalMode = process.env.NODE_ENV === 'development';
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
