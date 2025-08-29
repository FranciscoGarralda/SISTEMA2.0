/**
 * useData Hook - Hook personalizado para gestión de datos
 * Utiliza Zustand para el manejo de estado
 */

import { useEffect } from 'react';
import { useClientsStore, useMovementsStore } from '../stores';

// Hook para gestión de clientes
export const useClients = () => {
  const {
    clients,
    selectedClient,
    isLoading,
    error,
    searchTerm,
    filters,
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    setSearchTerm,
    setFilters,
    clearError,
    clearSelectedClient
  } = useClientsStore();

  // Cargar clientes al montar el componente
  useEffect(() => {
    if (clients.length === 0 && !isLoading) {
      loadClients();
    }
  }, [clients.length, isLoading]); // Remover loadClients de dependencias

  return {
    // Estado
    clients,
    selectedClient,
    isLoading,
    error,
    searchTerm,
    filters,

    // Acciones
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    setSearchTerm,
    setFilters,
    clearError,
    clearSelectedClient,

    // Utilidades
    hasClients: clients.length > 0,
    clientCount: clients.length
  };
};

// Hook para gestión de movimientos
export const useMovements = () => {
  const {
    movements,
    selectedMovement,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    loadMovements,
    addMovement,
    updateMovement,
    deleteMovement,
    setFilters,
    setPagination,
    clearError,
    clearSelectedMovement,
    resetFilters
  } = useMovementsStore();

  // Cargar movimientos al montar el componente
  useEffect(() => {
    if (movements.length === 0 && !isLoading) {
      loadMovements();
    }
  }, [movements.length, isLoading]); // Removido loadMovements de las dependencias porque las 'actions' de Zustand son estables y no necesitan ser dependencias

  return {
    // Estado
    movements,
    selectedMovement,
    isLoading,
    error,
    filters,
    pagination,
    stats,

    // Acciones
    loadMovements,
    addMovement,
    updateMovement,
    deleteMovement,
    setFilters,
    setPagination,
    clearError,
    clearSelectedMovement,
    resetFilters,

    // Utilidades
    hasMovements: movements.length > 0,
    movementCount: movements.length
  };
};

// Hook combinado para todos los datos
export const useData = () => {
  const clients = useClients();
  const movements = useMovements();

  return {
    clients,
    movements,
    
    // Estado general
    isLoading: clients.isLoading || movements.isLoading,
    hasError: clients.error || movements.error,
    
    // Acciones combinadas
    refreshAll: async () => {
      await Promise.all([
        clients.loadClients(),
        movements.loadMovements()
      ]);
    },
    
    // Utilidades
    hasData: clients.hasClients || movements.hasMovements,
    totalItems: clients.clientCount + movements.movementCount
  };
};

// Hook específico para estadísticas
export const useStats = () => {
  const { stats } = useMovementsStore();
  const { getClientStats } = useClientsStore();
  
  const clientStats = getClientStats();
  
  return {
    movements: stats,
    clients: clientStats,
    
    // Estadísticas combinadas
    total: {
      movements: stats.total,
      clients: clientStats.total,
      commissions: stats.totalCommissions,
      profit: stats.totalProfit
    }
  };
};
