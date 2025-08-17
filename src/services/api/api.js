// API Service para conectar con el backend
import { cacheService } from './cache';
import mockApiService from '../mockApi';

// Determinar si debemos usar el mock API
const useMockApi = () => {
  // Usar mock si está explícitamente configurado o si estamos en desarrollo y no hay API configurada
  if (process.env.NEXT_PUBLIC_MOCK_API === 'true') return true;
  
  // Si estamos en el navegador, intentar detectar si el backend está disponible
  if (typeof window !== 'undefined') {
    // Si ya hubo un error de conexión, usar mock
    const hadConnectionError = sessionStorage.getItem('api_connection_error');
    if (hadConnectionError === 'true') return true;
  }
  
  return false;
};

class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
      data = await response.json();
    } catch (e) {
      // Si no hay JSON en la respuesta
      data = { message: 'Error en el servidor' };
    }
    
    if (!response.ok) {
      const error = new Error(data.message || 'Error en la petición');
      error.response = { data, status: response.status };
      throw error;
    }
    
    return data;
  }

  // AUTH ENDPOINTS
  async login(username, password) {
    try {
      // Si debemos usar el mock API, delegar al mockApiService
      if (useMockApi()) {
        console.log('Usando Mock API para login');
        return await mockApiService.login(username, password);
      }
      
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
      
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
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
        // Marcar que hubo un error de conexión para usar mock en futuras llamadas
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('api_connection_error', 'true');
          } catch (e) {}
          
          // Intentar con mock API como fallback
          console.log('Fallback a Mock API después de error de conexión');
          try {
            return await mockApiService.login(username, password);
          } catch (mockError) {
            throw mockError;
          }
        }
        
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
    // Si debemos usar el mock API, delegar al mockApiService
    if (useMockApi()) {
      console.log('Usando Mock API para getMe');
      return await mockApiService.getMe();
    }
    
    try {
      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse(response);
      
      // Actualizar token CSRF si está presente en la respuesta
      if (data.csrfToken) {
        this.setCsrfToken(data.csrfToken);
      }
      
      return data;
    } catch (error) {
      if (error.message?.includes('Failed to fetch')) {
        // Marcar que hubo un error de conexión para usar mock en futuras llamadas
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('api_connection_error', 'true');
          } catch (e) {}
          
          // Intentar con mock API como fallback
          console.log('Fallback a Mock API después de error de conexión');
          return await mockApiService.getMe();
        }
      }
      throw error;
    }
  }
  
  // Método para obtener un token CSRF fresco
  async refreshCsrfToken() {
    try {
      const response = await fetch(`${this.baseURL}/api/csrf-token`, {
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
    const response = await fetch(`${this.baseURL}/api/clients?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const data = await this.handleResponse(response);
    return data.data || [];
  }

  async createClient(clientData) {
    await this._ensureCsrfToken();
    
    const response = await fetch(`${this.baseURL}/api/clients`, {
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
    
    const response = await fetch(`${this.baseURL}/api/clients/${id}`, {
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
    
    const response = await fetch(`${this.baseURL}/api/clients/${id}`, {
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