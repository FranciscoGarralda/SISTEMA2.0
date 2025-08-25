import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      setCheckingAuth(true);
      
      // Solo verificar en el cliente (no en servidor)
      if (typeof window === 'undefined') {
        setCheckingAuth(false);
        setIsAuthenticated(false);
        return;
      }
      
      // Primero verificar si hay un token almacenado
      const hasToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      if (!hasToken) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }
      
      // Timeout más corto para mejor UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      try {
        const response = await apiService.getMe();
        clearTimeout(timeoutId);
        
        if (response && response.id) {
          setIsAuthenticated(true);
          setCurrentUser(response);
        } else {
          // Token inválido, limpiar
          sessionStorage.removeItem('authToken');
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = useCallback((user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    currentUser,
    checkingAuth,
    handleLoginSuccess,
    handleLogout,
    checkAuthStatus
  };
};
