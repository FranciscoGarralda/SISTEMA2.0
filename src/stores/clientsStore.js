/**
 * Clients Store - Gestión de estado de clientes con Zustand
 * Maneja: lista de clientes, cliente seleccionado, estados de carga/error
 */

import { create } from 'zustand';
import { apiService } from '../services';

// Estado inicial
const initialState = {
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  filters: {
    status: 'all',
    type: 'all'
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  }
};

// Store de clientes
export const useClientsStore = create((set, get) => ({
  // Estado inicial
  ...initialState,

  // Acciones
  setClients: (clients) => set({ clients }),

  setSelectedClient: (client) => set({ selectedClient: client }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setSearchTerm: (searchTerm) => set({ searchTerm }),

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),

  // Cargar clientes
  loadClients: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const clients = await apiService.getClients();
      
      set({ 
        clients: clients || [],
        isLoading: false 
      });
      
      return clients;
    } catch (error) {
      console.error('Error cargando clientes:', error);
      set({ 
        isLoading: false, 
        error: 'Error al cargar clientes' 
      });
      return [];
    }
  },

  // Agregar cliente
  addClient: async (clientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const newClient = await apiService.saveClient(clientData);
      
      const currentClients = get().clients;
      set({ 
        clients: [...currentClients, newClient],
        isLoading: false 
      });
      
      return newClient;
    } catch (error) {
      console.error('Error agregando cliente:', error);
      set({ 
        isLoading: false, 
        error: 'Error al agregar cliente' 
      });
      throw error;
    }
  },

  // Actualizar cliente
  updateClient: async (clientId, clientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedClient = await apiService.updateClient(clientId, clientData);
      
      const currentClients = get().clients;
      const updatedClients = currentClients.map(client => 
        client.id === clientId ? updatedClient : client
      );
      
      set({ 
        clients: updatedClients,
        selectedClient: get().selectedClient?.id === clientId ? updatedClient : get().selectedClient,
        isLoading: false 
      });
      
      return updatedClient;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      set({ 
        isLoading: false, 
        error: 'Error al actualizar cliente' 
      });
      throw error;
    }
  },

  // Eliminar cliente
  deleteClient: async (clientId) => {
    try {
      set({ isLoading: true, error: null });
      
      await apiService.deleteClient(clientId);
      
      const currentClients = get().clients;
      const filteredClients = currentClients.filter(client => client.id !== clientId);
      
      set({ 
        clients: filteredClients,
        selectedClient: get().selectedClient?.id === clientId ? null : get().selectedClient,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      set({ 
        isLoading: false, 
        error: 'Error al eliminar cliente' 
      });
      throw error;
    }
  },

  // Buscar cliente por ID
  getClientById: async (clientId) => {
    try {
      const client = await apiService.getClientById(clientId);
      if (client) {
        set({ selectedClient: client });
      }
      return client;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      set({ error: 'Error al obtener cliente' });
      return null;
    }
  },

  // Buscar clientes
  searchClients: (searchTerm) => {
    const { clients } = get();
    if (!searchTerm) return clients;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.nombre?.toLowerCase().includes(lowerSearchTerm) ||
      client.apellido?.toLowerCase().includes(lowerSearchTerm) ||
      client.email?.toLowerCase().includes(lowerSearchTerm) ||
      client.telefono?.includes(searchTerm)
    );
  },

  // Filtrar clientes
  filterClients: () => {
    const { clients, filters } = get();
    let filteredClients = clients;

    // Filtrar por estado
    if (filters.status !== 'all') {
      filteredClients = filteredClients.filter(client => 
        client.estado === filters.status
      );
    }

    // Filtrar por tipo
    if (filters.type !== 'all') {
      filteredClients = filteredClients.filter(client => 
        client.tipo === filters.type
      );
    }

    return filteredClients;
  },

  // Obtener clientes filtrados y buscados
  getFilteredClients: () => {
    const { searchTerm } = get();
    const searchedClients = get().searchClients(searchTerm);
    const filteredClients = get().filterClients();
    
    // Combinar búsqueda y filtros
    return searchedClients.filter(client => 
      filteredClients.some(filteredClient => filteredClient.id === client.id)
    );
  },

  // Calcular estadísticas
  getClientStats: () => {
    const clients = get().clients;
    
    return {
      total: clients.length,
      active: clients.filter(c => c.estado === 'activo').length,
      inactive: clients.filter(c => c.estado === 'inactivo').length,
      newThisMonth: clients.filter(c => {
        const createdAt = new Date(c.createdAt);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && 
               createdAt.getFullYear() === now.getFullYear();
      }).length
    };
  },

  // Limpiar cliente seleccionado
  clearSelectedClient: () => set({ selectedClient: null }),

  // Resetear estado
  reset: () => set(initialState)
}));

// Selectores para optimizar re-renders
export const useClients = () => useClientsStore((state) => state.clients);
export const useSelectedClient = () => useClientsStore((state) => state.selectedClient);
export const useClientsLoading = () => useClientsStore((state) => state.isLoading);
export const useClientsError = () => useClientsStore((state) => state.error);
export const useClientsSearchTerm = () => useClientsStore((state) => state.searchTerm);
export const useClientsFilters = () => useClientsStore((state) => state.filters);
export const useFilteredClients = () => useClientsStore((state) => state.getFilteredClients());
export const useClientStats = () => useClientsStore((state) => state.getClientStats());
