/**
 * Movements Store - Gestión de estado de movimientos financieros con Zustand
 * Maneja: lista de movimientos, filtros, estadísticas, estados de carga/error
 */

import { create } from 'zustand';
import { apiService } from '../services';

// Estado inicial
const initialState = {
  movements: [],
  selectedMovement: null,
  isLoading: false,
  error: null,
  filters: {
    dateFrom: '',
    dateTo: '',
    operation: 'all',
    client: 'all',
    currency: 'all'
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0
  },
  stats: {
    total: 0,
    totalCommissions: 0,
    totalProfit: 0,
    byOperation: {},
    byCurrency: {},
    byMonth: {}
  }
};

// Store de movimientos
export const useMovementsStore = create((set, get) => ({
  // Estado inicial
  ...initialState,

  // Acciones
  setMovements: (movements) => set({ movements }),

  setSelectedMovement: (movement) => set({ selectedMovement: movement }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),

  // Cargar movimientos
  loadMovements: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const movements = await apiService.getMovements();
      
      set({ 
        movements: movements || [],
        isLoading: false 
      });
      
      // Calcular estadísticas
      get().calculateStats();
      
      return movements;
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      set({ 
        isLoading: false, 
        error: 'Error al cargar movimientos' 
      });
      return [];
    }
  },

  // Agregar movimiento
  addMovement: async (movementData) => {
    try {
      set({ isLoading: true, error: null });
      
      const newMovement = await apiService.saveMovement(movementData);
      
      const currentMovements = get().movements;
      set({ 
        movements: [...currentMovements, newMovement],
        isLoading: false 
      });
      
      // Recalcular estadísticas
      get().calculateStats();
      
      return newMovement;
    } catch (error) {
      console.error('Error agregando movimiento:', error);
      set({ 
        isLoading: false, 
        error: 'Error al agregar movimiento' 
      });
      throw error;
    }
  },

  // Actualizar movimiento
  updateMovement: async (movementId, movementData) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedMovement = await apiService.updateMovement(movementId, movementData);
      
      const currentMovements = get().movements;
      const updatedMovements = currentMovements.map(movement => 
        movement.id === movementId ? updatedMovement : movement
      );
      
      set({ 
        movements: updatedMovements,
        selectedMovement: get().selectedMovement?.id === movementId ? updatedMovement : get().selectedMovement,
        isLoading: false 
      });
      
      // Recalcular estadísticas
      get().calculateStats();
      
      return updatedMovement;
    } catch (error) {
      console.error('Error actualizando movimiento:', error);
      set({ 
        isLoading: false, 
        error: 'Error al actualizar movimiento' 
      });
      throw error;
    }
  },

  // Eliminar movimiento
  deleteMovement: async (movementId) => {
    try {
      set({ isLoading: true, error: null });
      
      await apiService.deleteMovement(movementId);
      
      const currentMovements = get().movements;
      const filteredMovements = currentMovements.filter(movement => movement.id !== movementId);
      
      set({ 
        movements: filteredMovements,
        selectedMovement: get().selectedMovement?.id === movementId ? null : get().selectedMovement,
        isLoading: false 
      });
      
      // Recalcular estadísticas
      get().calculateStats();
      
      return true;
    } catch (error) {
      console.error('Error eliminando movimiento:', error);
      set({ 
        isLoading: false, 
        error: 'Error al eliminar movimiento' 
      });
      throw error;
    }
  },

  // Filtrar movimientos
  filterMovements: () => {
    const { movements, filters } = get();
    let filteredMovements = movements;

    // Filtrar por fecha
    if (filters.dateFrom) {
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.fecha) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.fecha) <= new Date(filters.dateTo)
      );
    }

    // Filtrar por operación
    if (filters.operation !== 'all') {
      filteredMovements = filteredMovements.filter(movement => 
        movement.operacion === filters.operation
      );
    }

    // Filtrar por cliente
    if (filters.client !== 'all') {
      filteredMovements = filteredMovements.filter(movement => 
        movement.clienteId === filters.client
      );
    }

    // Filtrar por moneda
    if (filters.currency !== 'all') {
      filteredMovements = filteredMovements.filter(movement => 
        movement.moneda === filters.currency
      );
    }

    return filteredMovements;
  },

  // Obtener movimientos filtrados
  getFilteredMovements: () => {
    return get().filterMovements();
  },

  // Calcular estadísticas
  calculateStats: () => {
    const movements = get().movements;
    
    const stats = {
      total: 0,
      totalCommissions: 0,
      totalProfit: 0,
      byOperation: {},
      byCurrency: {},
      byMonth: {}
    };

    movements.forEach(movement => {
      const amount = parseFloat(movement.monto) || 0;
      const commission = parseFloat(movement.comision) || 0;
      const profit = parseFloat(movement.profit) || 0;

      // Totales
      stats.total += amount;
      stats.totalCommissions += commission;
      stats.totalProfit += profit;

      // Por operación
      const operation = movement.operacion || 'unknown';
      if (!stats.byOperation[operation]) {
        stats.byOperation[operation] = { count: 0, total: 0, commissions: 0 };
      }
      stats.byOperation[operation].count++;
      stats.byOperation[operation].total += amount;
      stats.byOperation[operation].commissions += commission;

      // Por moneda
      const currency = movement.moneda || 'unknown';
      if (!stats.byCurrency[currency]) {
        stats.byCurrency[currency] = { count: 0, total: 0, commissions: 0 };
      }
      stats.byCurrency[currency].count++;
      stats.byCurrency[currency].total += amount;
      stats.byCurrency[currency].commissions += commission;

      // Por mes
      if (movement.fecha) {
        const date = new Date(movement.fecha);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!stats.byMonth[monthKey]) {
          stats.byMonth[monthKey] = { count: 0, total: 0, commissions: 0 };
        }
        stats.byMonth[monthKey].count++;
        stats.byMonth[monthKey].total += amount;
        stats.byMonth[monthKey].commissions += commission;
      }
    });

    set({ stats });
    return stats;
  },

  // Obtener movimientos por cliente
  getMovementsByClient: (clientId) => {
    const { movements } = get();
    return movements.filter(movement => movement.clienteId === clientId);
  },

  // Obtener movimientos por fecha
  getMovementsByDate: (date) => {
    const { movements } = get();
    const targetDate = new Date(date).toISOString().split('T')[0];
    return movements.filter(movement => 
      movement.fecha.startsWith(targetDate)
    );
  },

  // Obtener movimientos por operación
  getMovementsByOperation: (operation) => {
    const { movements } = get();
    return movements.filter(movement => movement.operacion === operation);
  },

  // Limpiar movimiento seleccionado
  clearSelectedMovement: () => set({ selectedMovement: null }),

  // Resetear filtros
  resetFilters: () => set({ 
    filters: initialState.filters,
    pagination: initialState.pagination 
  }),

  // Resetear estado
  reset: () => set(initialState)
}));

// Selectores para optimizar re-renders
export const useMovements = () => useMovementsStore((state) => state.movements);
export const useSelectedMovement = () => useMovementsStore((state) => state.selectedMovement);
export const useMovementsLoading = () => useMovementsStore((state) => state.isLoading);
export const useMovementsError = () => useMovementsStore((state) => state.error);
export const useMovementsFilters = () => useMovementsStore((state) => state.filters);
export const useMovementsPagination = () => useMovementsStore((state) => state.pagination);
export const useMovementsStats = () => useMovementsStore((state) => state.stats);
export const useFilteredMovements = () => useMovementsStore((state) => state.getFilteredMovements());
