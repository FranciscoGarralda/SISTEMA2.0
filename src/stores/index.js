/**
 * Stores Index - Exporta todos los stores de Zustand
 * Centraliza la gestión de estado global de la aplicación
 */

// Auth Store
export {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useIsLoading as useAuthLoading,
  useAuthError,
  useUserRole,
  useUserPermissions
} from './authStore';

// Clients Store
export {
  useClientsStore,
  useClients,
  useSelectedClient,
  useClientsLoading,
  useClientsError,
  useClientsSearchTerm,
  useClientsFilters,
  useFilteredClients,
  useClientStats
} from './clientsStore';

// Movements Store
export {
  useMovementsStore,
  useMovements,
  useSelectedMovement,
  useMovementsLoading,
  useMovementsError,
  useMovementsFilters,
  useMovementsPagination,
  useMovementsStats,
  useFilteredMovements
} from './movementsStore';

// Export principal para uso rápido
export const stores = {
  auth: 'useAuthStore',
  clients: 'useClientsStore',
  movements: 'useMovementsStore'
};

// Función para resetear todos los stores
export const resetAllStores = () => {
  const { useAuthStore } = require('./authStore');
  const { useClientsStore } = require('./clientsStore');
  const { useMovementsStore } = require('./movementsStore');
  
  useAuthStore.getState().reset();
  useClientsStore.getState().reset();
  useMovementsStore.getState().reset();
};

// Función para obtener el estado de todos los stores
export const getAllStoresState = () => {
  const { useAuthStore } = require('./authStore');
  const { useClientsStore } = require('./clientsStore');
  const { useMovementsStore } = require('./movementsStore');
  
  return {
    auth: useAuthStore.getState(),
    clients: useClientsStore.getState(),
    movements: useMovementsStore.getState(),
    timestamp: new Date().toISOString()
  };
};
