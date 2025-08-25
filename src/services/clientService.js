import { safeLocalStorage } from './utilityService';

/**
 * Servicio para manejar clientes
 */
class ClientService {
  constructor() {
    this.STORAGE_KEY = 'financial-clients';
  }

  /**
   * Obtener todos los clientes
   */
  getClients() {
    const result = safeLocalStorage.getItem(this.STORAGE_KEY);
    return (result && result.success) ? result.data : [];
  }

  /**
   * Guardar clientes
   */
  saveClients(clients) {
    const result = safeLocalStorage.setItem(this.STORAGE_KEY, clients);
    if (!result.success) {
      console.error('Error guardando clientes:', result.error);
    }
    return result.success;
  }

  /**
   * Agregar un cliente
   */
  addClient(client) {
    const clients = this.getClients();
    const newClient = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    this.saveClients(clients);
    return newClient;
  }

  /**
   * Actualizar un cliente
   */
  updateClient(id, updates) {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates };
      this.saveClients(clients);
      return clients[index];
    }
    return null;
  }

  /**
   * Eliminar un cliente
   */
  deleteClient(id) {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    this.saveClients(filtered);
    return filtered.length < clients.length;
  }

  /**
   * Buscar un cliente por ID
   */
  getClientById(id) {
    const clients = this.getClients();
    return clients.find(c => c.id === id);
  }
}

// Exportar instancia única
const clientService = new ClientService();

// Exportar funciones individuales para compatibilidad
export const getClients = () => clientService.getClients();
export const saveClient = (client) => clientService.addClient(client);
export const updateClient = (id, updates) => clientService.updateClient(id, updates);
export const deleteClient = (id) => clientService.deleteClient(id);
export const getClientById = (id) => clientService.getClientById(id);
export const searchClients = (query) => {
  const clients = clientService.getClients();
  return clients.filter(c => 
    c.nombre?.toLowerCase().includes(query.toLowerCase()) ||
    c.apellido?.toLowerCase().includes(query.toLowerCase())
  );
};
export const validateClientData = (data) => {
  return {
    isValid: data.nombre && data.nombre.trim().length > 0,
    errors: []
  };
};
export const formatClientData = (data) => {
  return {
    ...data,
    nombre: data.nombre?.trim(),
    apellido: data.apellido?.trim(),
    telefono: data.telefono?.trim(),
    email: data.email?.trim()
  };
};

export default clientService;