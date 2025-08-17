// API Service para conectar con el backend
import { cacheService } from './cache';

class ApiService {
  constructor() {
    // En producción usar Netlify Functions, en desarrollo usar localhost
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (typeof window !== 'undefined') {
      // Cliente - usar la URL actual para Netlify Functions
      const currentHost = window.location.origin;
      
      // Si estamos en Netlify (cualquier dominio .netlify.app o el dominio personalizado)
      // O si estamos en producción, usar Netlify Functions
      if (currentHost.includes('netlify.app') || 
          currentHost.includes('casadecambio') || 
          isProduction) {
        this.baseURL = '/.netlify/functions';
      } else {
        // En desarrollo local
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      }
      
      console.log('API Service initialized with baseURL:', this.baseURL);
    } else {
      // Servidor - siempre usar Netlify Functions en SSR
      this.baseURL = '/.netlify/functions';
    }
    
    this.token = null;
    this.csrfToken = null;
    this.abortControllers = new Map();
    this.loadToken();
  }

  // Cargar token desde localStorage
  loadToken() {
    if (typeof window !== 'undefined') {
      try {
        this.token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      } catch (error) {
        console.warn('Error al cargar token:', error);
      }
    }
  }

  // Guardar token
  setToken(token) {
    this.token = token;
    this.storeToken(token);
  }
  
  // Almacenar token con seguridad preferente en sessionStorage
  storeToken(token) {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('authToken', token);
        localStorage.setItem('authToken', token); // Fallback por compatibilidad
      } catch (error) {
        console.error('Error al guardar token:', error);
      }
    }
  }

  // Limpiar token
  clearToken() {
    this.token = null;
    
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('authToken');
      } catch (error) {
        console.warn('Error al eliminar token:', error);
      }
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
    
    // console.log('API: Token actual:', this.token);
    
    const token = this.token;
    if (token && typeof token === 'string' && token.trim().length > 0) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Incluir token CSRF si está disponible
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }
    
    // console.log('API: Headers finales:', headers);
    
    return headers;
  }

  // Manejo de respuestas
  async handleResponse(response) {
    let data;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      
      // Intentar parsear como JSON
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        console.log('Raw response:', text);
        data = { message: 'Error en el servidor', rawResponse: text };
      }
    } catch (e) {
      console.error('Error reading response:', e);
      data = { message: 'Error en el servidor' };
    }
    
    if (!response.ok) {
      const error = new Error(data.message || 'Error en la petición');
      error.response = { data, status: response.status };
      throw error;
    }
    
    // Para funciones de Netlify, la respuesta exitosa viene envuelta en { success: true, data: {...} }
    if (data && data.success === true && data.data) {
      return data.data;
    }
    
    // Si es un error con success: false
    if (data && data.success === false) {
      const error = new Error(data.message || 'Error en la petición');
      error.response = { data, status: response.status };
      throw error;
    }
    
    return data;
  }

  // AUTH ENDPOINTS
  async login(username, password) {
    try {
      // Cancelar cualquier login previo
      if (this.abortControllers.has('login')) {
        this.abortControllers.get('login').abort();
      }
      
      // Crear nuevo controller con ID único para esta operación
      const controller = new AbortController();
      this.abortControllers.set('login', controller);
      
      // Timeout adaptativo según entorno
      const timeoutMs = process.env.NODE_ENV === 'production' ? 30000 : 10000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // console.log('Intentando login con:', { username, baseURL: this.baseURL });
      
      const response = await fetch(`${this.baseURL}/auth-login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ 
          username: username.trim(), 
          password 
        }),
        signal: controller.signal
      });
      
      // Limpiar recursos
      this.abortControllers.delete('login');
      clearTimeout(timeoutId);
      
      const data = await this.handleResponse(response);
      
      if (data.token) {
        this.setToken(data.token);
        
        if (data.csrfToken) {
          this.setCsrfToken(data.csrfToken);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('El servidor está tardando en responder. Por favor intenta en unos segundos.');
      }
      
      if (error.message?.includes('Failed to fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica tu conexión.');
      }
      
      throw error;
    }
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  async getMe() {
    const response = await fetch(`${this.baseURL}/auth-me`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    
    // Actualizar token CSRF si está presente en la respuesta
    if (data.csrfToken) {
      this.setCsrfToken(data.csrfToken);
    }
    
    return data;
  }
  
  // Método para obtener un token CSRF fresco
  async refreshCsrfToken() {
    try {
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include' // Importante para cookies CSRF
      });
      
      if (!response.ok) {
        throw new Error('No se pudo obtener token CSRF');
      }
      
      const data = await response.json();
      
      if (data.csrfToken) {
        this.setCsrfToken(data.csrfToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al refrescar token CSRF:', error);
      return false;
    }
  }

  // MOVEMENTS ENDPOINTS
  async getMovements(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/api/movements?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data.data || [];
  }

  async createMovement(movementData) {
    // console.log('API: Creando movimiento con datos:', movementData);
    
    // Asegurar que tenemos token CSRF antes de operación mutante
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/movements`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(movementData),
      credentials: 'include' // Importante para cookies CSRF
    });
    
    // console.log('API: Response status:', response.status);
    
    const result = await this.handleResponse(response);
    // console.log('API: Resultado:', result);
    
    return result.data || result;
  }
  
  // Método para asegurar que tenemos un token CSRF válido
  async _ensureCsrfToken() {
    // Si no tenemos token CSRF, intentar obtenerlo
    if (!this.csrfToken) {
      await this.refreshCsrfToken();
    }
  }

  async updateMovement(id, movementData) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/movements/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(movementData),
      credentials: 'include'
    });
    
    const result = await this.handleResponse(response);
    return result.data || result;
  }

  async deleteMovement(id) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/movements/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // CLIENTS ENDPOINTS
  async getClients(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/clients?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data.data || [];
  }

  async createClient(clientData) {
    await this._ensureCsrfToken();
    
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
    await this._ensureCsrfToken();
    
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
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/client-id/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  // USER MANAGEMENT ENDPOINTS
  async getUsers() {
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data.data || [];
  }

  async createUser(userData) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async updateUser(id, userData) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(id) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include'
    });
    
    return this.handleResponse(response);
  }
}

// Exportar instancia única
const apiService = new ApiService();
export default apiService;