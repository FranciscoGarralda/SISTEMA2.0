/**
 * Backend basado en localStorage para funcionamiento offline
 * Simula las respuestas del servidor usando localStorage
 */

class LocalStorageBackend {
  constructor() {
    this.STORAGE_KEYS = {
      movements: 'app_movements',
      clients: 'app_clients',
      users: 'app_users',
      currentUser: 'app_current_user',
      stock: 'app_stock',
      balances: 'app_balances'
    };
    
    this.initializeDefaults();
  }

  initializeDefaults() {
    // Solo en el cliente
    if (typeof window === 'undefined') return;
    
    // Inicializar con datos por defecto si no existen
    if (!this.getData('clients')) {
      this.setData('clients', []);
    }
    if (!this.getData('movements')) {
      this.setData('movements', []);
    }
    if (!this.getData('users')) {
      this.setData('users', [
        {
          id: 1,
          username: 'admin',
          name: 'Administrador',
          role: 'admin',
          active: true
        }
      ]);
    }
  }

  getData(key) {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS[key]);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  setData(key, data) {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  }

  // MOVEMENTS
  async getMovements(filters = {}) {
    const movements = this.getData('movements') || [];
    
    // Aplicar filtros si existen
    let filtered = [...movements];
    
    if (filters.type) {
      filtered = filtered.filter(m => m.type === filters.type);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(m => new Date(m.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(m => new Date(m.date) <= new Date(filters.dateTo));
    }
    
    return filtered;
  }

  async createMovement(movementData) {
    const movements = this.getData('movements') || [];
    const newMovement = {
      ...movementData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    movements.push(newMovement);
    this.setData('movements', movements);
    
    return newMovement;
  }

  async updateMovement(id, movementData) {
    const movements = this.getData('movements') || [];
    const index = movements.findIndex(m => m.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Movimiento no encontrado');
    }
    
    movements[index] = {
      ...movements[index],
      ...movementData,
      updatedAt: new Date().toISOString()
    };
    
    this.setData('movements', movements);
    return movements[index];
  }

  async deleteMovement(id) {
    const movements = this.getData('movements') || [];
    const filtered = movements.filter(m => m.id !== parseInt(id));
    
    if (filtered.length === movements.length) {
      throw new Error('Movimiento no encontrado');
    }
    
    this.setData('movements', filtered);
    return { success: true };
  }

  // CLIENTS
  async getClients(filters = {}) {
    const clients = this.getData('clients') || [];
    
    // Aplicar filtros si existen
    let filtered = [...clients];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(search) ||
        c.document?.toLowerCase().includes(search) ||
        c.phone?.toLowerCase().includes(search)
      );
    }
    
    if (filters.active !== undefined) {
      filtered = filtered.filter(c => c.active === filters.active);
    }
    
    return filtered;
  }

  async createClient(clientData) {
    const clients = this.getData('clients') || [];
    const newClient = {
      ...clientData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      active: true
    };
    
    clients.push(newClient);
    this.setData('clients', clients);
    
    return newClient;
  }

  async updateClient(id, clientData) {
    const clients = this.getData('clients') || [];
    const index = clients.findIndex(c => c.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    clients[index] = {
      ...clients[index],
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    
    this.setData('clients', clients);
    return clients[index];
  }

  async deleteClient(id) {
    const clients = this.getData('clients') || [];
    const filtered = clients.filter(c => c.id !== parseInt(id));
    
    if (filtered.length === clients.length) {
      throw new Error('Cliente no encontrado');
    }
    
    this.setData('clients', filtered);
    return { success: true };
  }

  // USERS
  async getUsers() {
    return this.getData('users') || [];
  }

  async createUser(userData) {
    const users = this.getData('users') || [];
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      active: true
    };
    
    users.push(newUser);
    this.setData('users', users);
    
    return newUser;
  }

  async updateUser(id, userData) {
    const users = this.getData('users') || [];
    const index = users.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    this.setData('users', users);
    return users[index];
  }

  async deleteUser(id) {
    const users = this.getData('users') || [];
    const filtered = users.filter(u => u.id !== parseInt(id));
    
    if (filtered.length === users.length) {
      throw new Error('Usuario no encontrado');
    }
    
    this.setData('users', filtered);
    return { success: true };
  }

  // AUTH
  async login(username, password) {
    // Para desarrollo, aceptar admin/admin
    if (username === 'admin' && password === 'admin') {
      const user = {
        id: 1,
        username: 'admin',
        name: 'Administrador',
        role: 'admin'
      };
      
      this.setData('currentUser', user);
      
      return {
        success: true,
        user,
        token: 'local-token-' + Date.now()
      };
    }
    
    throw new Error('Credenciales inválidas');
  }

  async getCurrentUser() {
    return this.getData('currentUser');
  }

  async logout() {
    localStorage.removeItem(this.STORAGE_KEYS.currentUser);
    return { success: true };
  }
}

// Exportar instancia única
export const localStorageBackend = new LocalStorageBackend();
export default localStorageBackend;