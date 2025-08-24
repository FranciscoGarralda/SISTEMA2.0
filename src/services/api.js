// API Service para conectar con el backend
import { cacheService } from './cache';
import localStorageBackend from './localStorageBackend';

class ApiService {
  constructor() {
    // FORZAR modo local siempre en desarrollo
    this.baseURL = 'local';
    console.log('🔧 API Service: Modo local activado - FORZADO');
    
    this.token = null;
    this.csrfToken = null;
    this.abortControllers = new Map();
    this.loadToken();
  }

  // Cargar token desde localStorage
  loadToken() {
    if (typeof window === 'undefined') return;
    
    try {
      this.token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    } catch (error) {
      console.warn('Error al cargar token:', error);
    }
  }

  // Guardar token
  setToken(token) {
    this.token = token;
    this.storeToken(token);
  }
  
  // Almacenar token con seguridad preferente en sessionStorage
  storeToken(token) {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem('authToken', token);
      localStorage.setItem('authToken', token); // Fallback por compatibilidad
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  }

  // Limpiar token
  clearToken() {
    this.token = null;
    
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.warn('Error al eliminar token:', error);
    }
  }

  // Establecer token CSRF
  setCsrfToken(token) {
    if (token && typeof token === 'string') {
      this.csrfToken = token;
    }
  }

  // Headers por defecto
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }
    
    return headers;
  }

  // Manejar respuesta de fetch
  async handleResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en el servidor:', errorText);
      throw new Error('Error en el servidor');
    }
    
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Error parsing JSON');
    }
  }

  // AUTH ENDPOINTS
  async login(username, password) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para login');
      const result = await localStorageBackend.login(username, password);
      if (result.success) {
        this.setToken('local-token-' + Date.now());
        return result;
      } else {
        throw new Error(result.message || 'Credenciales inválidas');
      }
    }
    
    const response = await fetch(`${this.baseURL}/auth-login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    
    if (data.success && data.token) {
      this.setToken(data.token);
      if (data.csrfToken) {
        this.setCsrfToken(data.csrfToken);
      }
    }
    
    return data;
  }

  async getMe() {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para getMe');
      return localStorageBackend.getCurrentUser();
    }
    
    const response = await fetch(`${this.baseURL}/auth-me`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // MOVEMENTS ENDPOINTS
  async getMovements(filters = {}) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para getMovements');
      return localStorageBackend.getMovements(filters);
    }
    
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/movements?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data || [];
  }

  async createMovement(movementData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para createMovement');
      return localStorageBackend.createMovement(movementData);
    }
    
    const response = await fetch(`${this.baseURL}/movements`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(movementData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async updateMovement(id, movementData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para updateMovement');
      return localStorageBackend.updateMovement(id, movementData);
    }
    
    const response = await fetch(`${this.baseURL}/movement-id/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(movementData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteMovement(id) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para deleteMovement');
      return localStorageBackend.deleteMovement(id);
    }
    
    const response = await fetch(`${this.baseURL}/movement-id/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // CLIENTS ENDPOINTS
  async getClients(filters = {}) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para getClients');
      return localStorageBackend.getClients(filters);
    }
    
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/clients?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data.data || [];
  }

  async createClient(clientData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para createClient');
      return localStorageBackend.createClient(clientData);
    }
    
    const response = await fetch(`${this.baseURL}/clients`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(clientData),
      credentials: 'include'
    });
    
    const result = await this.handleResponse(response);
    return result.data || result;
  }

  async updateClient(id, clientData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para updateClient');
      return localStorageBackend.updateClient(id, clientData);
    }
    
    const response = await fetch(`${this.baseURL}/client-id/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(clientData),
      credentials: 'include'
    });
    
    const result = await this.handleResponse(response);
    return result.data || result;
  }

  async deleteClient(id) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para deleteClient');
      return localStorageBackend.deleteClient(id);
    }
    
    const response = await fetch(`${this.baseURL}/client-id/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // USER MANAGEMENT ENDPOINTS
  async getUsers() {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para getUsers');
      return localStorageBackend.getUsers();
    }
    
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data || [];
  }

  async createUser(userData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para createUser');
      return localStorageBackend.createUser(userData);
    }
    
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async updateUser(id, userData) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para updateUser');
      return localStorageBackend.updateUser(id, userData);
    }
    
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(id) {
    if (this.baseURL === 'local') {
      console.log('🔧 Usando localStorageBackend para deleteUser');
      return localStorageBackend.deleteUser(id);
    }
    
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // HEALTH CHECK
  async healthCheck() {
    if (this.baseURL === 'local') {
      return { status: 'ok', mode: 'local' };
    }
    
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// Exportar instancia única
export const apiService = new ApiService();