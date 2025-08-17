// Mock API Service para desarrollo sin backend
import { v4 as uuidv4 } from 'uuid';

// Datos simulados
const mockData = {
  users: [
    {
      id: '1',
      username: 'admin',
      password: 'admin', // Contraseña en texto plano solo para desarrollo
      name: 'Administrador',
      role: 'admin',
      active: true
    }
  ],
  clients: [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '+54 11 1234-5678',
      tipoCliente: 'regular'
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'González',
      email: 'maria@example.com',
      telefono: '+54 11 8765-4321',
      tipoCliente: 'vip'
    }
  ],
  movements: [
    {
      id: '1',
      fecha: new Date().toISOString().split('T')[0],
      clienteId: '1',
      tipo: 'compra',
      monto: 1000,
      moneda: 'USD',
      estado: 'completado'
    }
  ]
};

// Simulación de latencia de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  constructor() {
    this.token = null;
    this.csrfToken = 'mock-csrf-token';
    this.data = JSON.parse(JSON.stringify(mockData));
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

  // AUTH ENDPOINTS
  async login(username, password) {
    await delay(500); // Simular latencia
    
    // Verificar credenciales (simplificado)
    if (username === 'admin' && password === 'admin') {
      const token = 'mock-jwt-token-' + Date.now();
      this.setToken(token);
      
      return {
        token,
        csrfToken: this.csrfToken,
        user: {
          id: '1',
          username: 'admin',
          name: 'Administrador',
          role: 'admin'
        }
      };
    }
    
    const error = new Error('Credenciales inválidas');
    error.response = { status: 401, data: { message: 'Credenciales inválidas' } };
    throw error;
  }

  async logout() {
    await delay(300);
    this.clearToken();
    return { success: true };
  }

  async getMe() {
    await delay(300);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    return {
      user: {
        id: '1',
        username: 'admin@example.com',
        name: 'Administrador',
        role: 'admin'
      },
      csrfToken: this.csrfToken
    };
  }
  
  async refreshCsrfToken() {
    await delay(200);
    return true;
  }

  async _ensureCsrfToken() {
    // No hace nada en el mock
    return true;
  }

  // CLIENTS ENDPOINTS
  async getClients() {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    return this.data.clients;
  }

  async createClient(clientData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const newClient = {
      ...clientData,
      id: uuidv4()
    };
    
    this.data.clients.push(newClient);
    return newClient;
  }

  async updateClient(id, clientData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const index = this.data.clients.findIndex(client => client.id === id);
    if (index === -1) {
      const error = new Error('Cliente no encontrado');
      error.response = { status: 404, data: { message: 'Cliente no encontrado' } };
      throw error;
    }
    
    this.data.clients[index] = {
      ...this.data.clients[index],
      ...clientData,
      id // Mantener el ID original
    };
    
    return this.data.clients[index];
  }

  async deleteClient(id) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const index = this.data.clients.findIndex(client => client.id === id);
    if (index === -1) {
      const error = new Error('Cliente no encontrado');
      error.response = { status: 404, data: { message: 'Cliente no encontrado' } };
      throw error;
    }
    
    this.data.clients.splice(index, 1);
    return { success: true };
  }

  // MOVEMENTS ENDPOINTS
  async getMovements() {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    return this.data.movements;
  }

  async createMovement(movementData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const newMovement = {
      ...movementData,
      id: uuidv4(),
      fecha: movementData.fecha || new Date().toISOString().split('T')[0]
    };
    
    this.data.movements.push(newMovement);
    return newMovement;
  }

  async updateMovement(id, movementData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const index = this.data.movements.findIndex(movement => movement.id === id);
    if (index === -1) {
      const error = new Error('Movimiento no encontrado');
      error.response = { status: 404, data: { message: 'Movimiento no encontrado' } };
      throw error;
    }
    
    this.data.movements[index] = {
      ...this.data.movements[index],
      ...movementData,
      id // Mantener el ID original
    };
    
    return this.data.movements[index];
  }

  async deleteMovement(id) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const index = this.data.movements.findIndex(movement => movement.id === id);
    if (index === -1) {
      const error = new Error('Movimiento no encontrado');
      error.response = { status: 404, data: { message: 'Movimiento no encontrado' } };
      throw error;
    }
    
    this.data.movements.splice(index, 1);
    return { success: true };
  }

  // USERS ENDPOINTS
  async getUsers() {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    return this.data.users;
  }

  async createUser(userData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const newUser = {
      ...userData,
      id: uuidv4()
    };
    
    this.data.users.push(newUser);
    return newUser;
  }

  async updateUser(id, userData) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    const index = this.data.users.findIndex(user => user.id === id);
    if (index === -1) {
      const error = new Error('Usuario no encontrado');
      error.response = { status: 404, data: { message: 'Usuario no encontrado' } };
      throw error;
    }
    
    this.data.users[index] = {
      ...this.data.users[index],
      ...userData,
      id // Mantener el ID original
    };
    
    return this.data.users[index];
  }

  async deleteUser(id) {
    await delay(500);
    
    if (!this.token) {
      const error = new Error('No autorizado');
      error.response = { status: 401, data: { message: 'No autorizado' } };
      throw error;
    }
    
    // No permitir eliminar al administrador
    if (id === '1') {
      const error = new Error('No se puede eliminar al administrador');
      error.response = { status: 403, data: { message: 'No se puede eliminar al administrador' } };
      throw error;
    }
    
    const index = this.data.users.findIndex(user => user.id === id);
    if (index === -1) {
      const error = new Error('Usuario no encontrado');
      error.response = { status: 404, data: { message: 'Usuario no encontrado' } };
      throw error;
    }
    
    this.data.users.splice(index, 1);
    return { success: true };
  }
}

// Exportar instancia única
const mockApiService = new MockApiService();
export default mockApiService;
