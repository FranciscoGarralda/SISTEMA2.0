/**
 * Auth Store - Gestión de estado de autenticación con Zustand
 * Maneja: usuario, token, estado de login, permisos
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  permissions: [],
  role: null
};

// Store de autenticación
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        role: user?.role || null,
        permissions: user?.permissions || []
      }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Login
      login: async (username, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await apiService.login(username, password);
          
          if (response && response.success && response.user) {
            const { user, token } = response;
            
            set({
              user,
              token,
              isAuthenticated: true,
              role: user.role || null,
              permissions: user.permissions || [],
              isLoading: false,
              error: null
            });

            // Guardar token en localStorage/sessionStorage
            if (token) {
              sessionStorage.setItem('authToken', token);
              localStorage.setItem('authToken', token);
            }

            return { success: true, user };
          } else {
            const errorMessage = response?.message || 'Credenciales incorrectas';
            set({ 
              isLoading: false, 
              error: errorMessage 
            });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          console.error('Error en login:', error);
          const errorMessage = error.message || 'Error al iniciar sesión';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        try {
          await apiService.logout();
        } catch (error) {
          console.error('Error en logout:', error);
        } finally {
          // Limpiar estado
          set(initialState);
          
          // Limpiar tokens
          sessionStorage.removeItem('authToken');
          localStorage.removeItem('authToken');
        }
      },

      // Verificar sesión actual
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
          
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return false;
          }

          const user = await apiService.getMe();
          
          if (user) {
            set({
              user,
              token,
              isAuthenticated: true,
              role: user.role || null,
              permissions: user.permissions || [],
              isLoading: false
            });
            return true;
          } else {
            set({ isLoading: false, isAuthenticated: false });
            return false;
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          set({ isLoading: false, isAuthenticated: false });
          return false;
        }
      },

      // Actualizar usuario
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ 
            user: updatedUser,
            role: updatedUser.role || currentUser.role,
            permissions: updatedUser.permissions || currentUser.permissions
          });
        }
      },

      // Verificar permisos
      hasPermission: (permission) => {
        const { permissions, role } = get();
        
        // Admin tiene todos los permisos
        if (role === 'admin') return true;
        
        // Verificar permiso específico
        return permissions.includes(permission);
      },

      // Verificar rol
      hasRole: (role) => {
        const currentRole = get().role;
        return currentRole === role;
      },

      // Resetear estado
      reset: () => set(initialState)
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        permissions: state.permissions
      }),
      // Solo persistir ciertos campos
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Verificar si el token sigue siendo válido al rehidratar
          const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
          if (!token) {
            state.reset();
          }
        }
      }
    }
  )
);

// Selectores para optimizar re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserRole = () => useAuthStore((state) => state.role);
export const useUserPermissions = () => useAuthStore((state) => state.permissions);
