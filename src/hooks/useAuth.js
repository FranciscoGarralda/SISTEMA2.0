/**
 * useAuth Hook - Hook personalizado para autenticación
 * Utiliza Zustand para el manejo de estado
 */

import { useEffect } from 'react';
import { useAuthStore } from '../stores';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    permissions,
    login,
    logout,
    checkAuth,
    updateUser,
    hasPermission,
    hasRole,
    clearError
  } = useAuthStore();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    permissions,

    // Acciones
    login,
    logout,
    updateUser,
    clearError,

    // Utilidades
    hasPermission,
    hasRole,

    // Verificar si el usuario está autenticado
    isLoggedIn: isAuthenticated,

    // Verificar si es admin
    isAdmin: role === 'admin',

    // Verificar si es operador
    isOperator: role === 'operator',

    // Verificar si es visualizador
    isViewer: role === 'viewer'
  };
};

// Hook específico para verificar permisos
export const usePermission = (permission) => {
  const { hasPermission } = useAuthStore();
  return hasPermission(permission);
};

// Hook específico para verificar roles
export const useRole = (role) => {
  const { hasRole } = useAuthStore();
  return hasRole(role);
};

// Hook para obtener solo el usuario
export const useUser = () => {
  const { user } = useAuthStore();
  return user;
};

// Hook para verificar si está autenticado
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated;
};

// Hook para obtener el estado de carga
export const useAuthLoading = () => {
  const { isLoading } = useAuthStore();
  return isLoading;
};

// Hook para obtener errores de autenticación
export const useAuthError = () => {
  const { error, clearError } = useAuthStore();
  return { error, clearError };
};
