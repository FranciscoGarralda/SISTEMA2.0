/**
 * Shared UI Store - Estado compartido entre diferentes features
 * Maneja: cliente seleccionado, rango de fechas, filtros globales, etc.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Estado inicial
const initialState = {
  // Cliente y cuenta seleccionados
  selectedClientId: null,
  selectedAccountId: null,
  
  // Rango de fechas global
  currentDateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  
  // Filtros globales
  globalFilters: {
    searchTerm: '',
    selectedMoneda: 'all',
    selectedPeriod: 'mensual'
  },
  
  // Estado de carga global
  isLoading: false,
  
  // Notificaciones globales
  notifications: []
};

// Store de estado compartido
export const useSharedUIStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones para cliente seleccionado
      setSelectedClientId: (clientId) => set({ selectedClientId: clientId }),
      clearSelectedClient: () => set({ selectedClientId: null }),

      // Acciones para cuenta seleccionada
      setSelectedAccountId: (accountId) => set({ selectedAccountId: accountId }),
      clearSelectedAccount: () => set({ selectedAccountId: null }),

      // Acciones para rango de fechas
      setCurrentDateRange: (dateRange) => set({ currentDateRange: dateRange }),
      setDateRangeStart: (startDate) => set(state => ({ 
        currentDateRange: { ...state.currentDateRange, start: startDate } 
      })),
      setDateRangeEnd: (endDate) => set(state => ({ 
        currentDateRange: { ...state.currentDateRange, end: endDate } 
      })),

      // Acciones para filtros globales
      setGlobalFilters: (filters) => set({ globalFilters: { ...get().globalFilters, ...filters } }),
      setSearchTerm: (searchTerm) => set(state => ({ 
        globalFilters: { ...state.globalFilters, searchTerm } 
      })),
      setSelectedMoneda: (moneda) => set(state => ({ 
        globalFilters: { ...state.globalFilters, selectedMoneda: moneda } 
      })),
      setSelectedPeriod: (period) => set(state => ({ 
        globalFilters: { ...state.globalFilters, selectedPeriod: period } 
      })),
      clearGlobalFilters: () => set({ globalFilters: initialState.globalFilters }),

      // Acciones para estado de carga
      setLoading: (isLoading) => set({ isLoading }),
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      // Acciones para notificaciones
      addNotification: (notification) => set(state => ({ 
        notifications: [...state.notifications, { ...notification, id: Date.now() }] 
      })),
      removeNotification: (notificationId) => set(state => ({ 
        notifications: state.notifications.filter(n => n.id !== notificationId) 
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Acciones de utilidad
      reset: () => set(initialState),
      
      // Selectores útiles
      getSelectedClient: () => {
        const { selectedClientId } = get();
        return selectedClientId;
      },
      
      getCurrentDateRange: () => {
        const { currentDateRange } = get();
        return currentDateRange;
      },
      
      getGlobalFilters: () => {
        const { globalFilters } = get();
        return globalFilters;
      }
    }),
    {
      name: 'shared-ui-storage',
      partialize: (state) => ({ 
        selectedClientId: state.selectedClientId,
        selectedAccountId: state.selectedAccountId,
        currentDateRange: state.currentDateRange,
        globalFilters: state.globalFilters
      })
    }
  )
);
