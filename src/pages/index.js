import React, { useState, useEffect, lazy, Suspense, useRef, useCallback, useMemo, startTransition } from 'react';
import Head from 'next/head';
import { apiService, localStorageBackend } from '../services';
import LoginPage from '../features/auth/LoginPage';

// Lazy load components for better performance
const NavigationApp = lazy(() => 
  import('../components/ui/NavigationApp').then(module => ({
    default: module.NavigationApp
  }))
);
const WelcomePage = lazy(() => 
  import('../components/ui/NavigationApp').then(module => ({
    default: module.WelcomePage
  }))
);

// Lazy load feature components
const FinancialOperationsApp = lazy(() => import('../features/financial-operations/FinancialOperationsApp'));
const ClientesApp = lazy(() => import('../features/clients/ClientesApp'));
const MovimientosApp = lazy(() => import('../features/movements/MovimientosApp'));
const PendientesRetiroApp = lazy(() => import('../features/pending-withdrawals/PendientesRetiroApp'));
const GastosApp = lazy(() => import('../features/expenses/GastosApp'));
const CuentasCorrientesApp = lazy(() => import('../features/current-accounts/CuentasCorrientesApp'));
const PrestamistasApp = lazy(() => import('../features/lenders/PrestamistasApp'));
const ComisionesApp = lazy(() => import('../features/commissions/ComisionesApp'));
const UtilidadApp = lazy(() => import('../features/utility/UtilidadApp'));
const ArbitrajeApp = lazy(() => import('../features/arbitrage/ArbitrajeApp'));
const SaldosApp = lazy(() => import('../features/balances/SaldosApp'));
const CajaApp = lazy(() => import('../features/cash-register/CajaApp'));
const RentabilidadApp = lazy(() => import('../features/profitability/RentabilidadApp'));
const StockApp = lazy(() => import('../features/stock/StockApp'));
const SaldosInicialesApp = lazy(() => import('../features/initial-balances/SaldosInicialesApp'));
const UserManagementApp = lazy(() => import('../features/user-management/UserManagementApp'));

// Component map for dynamic rendering
const componentMap = {
  'operaciones': FinancialOperationsApp,
  'clientes': ClientesApp,
  'movimientos': MovimientosApp,
  'pendientes': PendientesRetiroApp,
  'gastos': GastosApp,
  'cuentas-corrientes': CuentasCorrientesApp,
  'prestamistas': PrestamistasApp,
  'comisiones': ComisionesApp,
  'utilidad': UtilidadApp,
  'arbitraje': ArbitrajeApp,
  'saldos': SaldosApp,
  'caja': CajaApp,
  'rentabilidad': RentabilidadApp,
  'stock': StockApp,
  'saldos-iniciales': SaldosInicialesApp,
  'usuarios': UserManagementApp
};

export default function Home() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data state
  const [movements, setMovements] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingMovement, setEditingMovement] = useState(null);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
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
        // No hay token, no intentar verificar autenticación
        // No auth token found, skipping auth check
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }
      
      // Timeout más corto para mejor UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
      
      try {
        const response = await apiService.getMe();
        clearTimeout(timeoutId);
        
              if (response && response.id) {
        startTransition(() => {
          setIsAuthenticated(true);
          setCurrentUser(response);
        });
        // Load data from backend after authentication
        loadDataFromBackend();
      } else {
        // Token inválido, limpiar
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('authToken');
        startTransition(() => {
          setIsAuthenticated(false);
        });
      }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
                  // Auth check timeout - using fallback
        setIsAuthenticated(false);
      } else {
        // Auth check error - using fallback
        setIsAuthenticated(false);
        }
      }
    } catch (error) {
      // Auth check failed - using fallback
      setIsAuthenticated(false);
    } finally {
      // SIEMPRE setear checkingAuth a false
      setCheckingAuth(false);
    }
  };

  const loadDataFromBackend = async () => {
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const [backendMovements, backendClients] = await Promise.all([
        apiService.getMovements().catch(() => []),
        apiService.getClients().catch(() => [])
      ]);
      
      startTransition(() => {
        setMovements(Array.isArray(backendMovements) ? backendMovements : []);
        setClients(Array.isArray(backendClients) ? backendClients : []);
      });
    } catch (error) {
      console.error('Error loading data from backend:', error);
    }
  };

  // Handle login success
  const handleLoginSuccess = (user) => {
    startTransition(() => {
      setIsAuthenticated(true);
      setCurrentUser(user);
    });
    loadDataFromBackend();
  };

  // Handle logout
  const handleLogout = async () => {
    await apiService.logout();
    startTransition(() => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setMovements([]);
      setClients([]);
    });
  };

  // Movement management functions
  const handleSaveMovement = async (movementData) => {
    try {
      let savedMovement;
      
      // Verificar si estamos en modo local
      if (apiService.baseURL === 'local') {
        console.log('🔧 Guardando movimiento en localStorage');
        
        // Verificar que localStorageBackend esté disponible
        if (!localStorageBackend) {
          throw new Error('localStorageBackend no está disponible');
        }
        
        if (editingMovement) {
          savedMovement = await localStorageBackend.updateMovement(editingMovement.id, movementData);
        } else {
          savedMovement = await localStorageBackend.createMovement(movementData);
        }
        
        // Actualizar estado local
        if (savedMovement) {
          setMovements(prevMovements => {
            if (!Array.isArray(prevMovements)) return [savedMovement];
            
            const updatedMovements = [...prevMovements];
            const existingIndex = updatedMovements.findIndex(m => m.id === savedMovement.id);
            
            if (existingIndex >= 0) {
              updatedMovements[existingIndex] = savedMovement;
            } else {
              updatedMovements.push(savedMovement);
            }
            
            return updatedMovements;
          });
        }
      } else {
        // Modo backend
        if (editingMovement) {
          savedMovement = await apiService.updateMovement(editingMovement.id, movementData);
        } else {
          savedMovement = await apiService.createMovement(movementData);
        }
        
        // Si se guardó en backend exitosamente, recargar datos
        if (savedMovement) {
          await loadDataFromBackend();
        }
      }
      
      setEditingMovement(null);
      navigateTo('movimientos');
      return savedMovement;
    } catch (error) {
      console.error('Error saving movement:', error);
      alert(`Error al guardar el movimiento: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteMovement = async (id) => {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        if (isAuthenticated) {
          await apiService.deleteMovement(id);
          await loadDataFromBackend();
        } else {
          setMovements(prev => prev.filter(m => m.id !== id));
        }
      } catch (error) {
        console.error('Error deleting movement:', error);
        alert('Error al eliminar el movimiento');
      }
    }
  };

  const handleEditMovement = (movement) => {
    setEditingMovement(movement);
    setCurrentPage('operaciones');
  };

  const handleCancelEdit = () => {
    setEditingMovement(null);
    setCurrentPage('movimientos');
  };

  // Client management functions
  const handleSaveClient = async (clientData) => {
    try {
      // Verificar duplicados
      const existingClient = clients.find(c => 
        c.nombre.toLowerCase() === clientData.nombre.toLowerCase() && c.id !== clientData.id
      );

      if (existingClient) {
        alert('Ya existe un cliente con ese nombre');
        return null;
      }

      let savedClient;
      
      // Solo guardar en backend
      if (clientData.id && typeof clientData.id === 'number') {
        savedClient = await apiService.updateClient(clientData.id, clientData);
      } else {
        savedClient = await apiService.createClient(clientData);
      }
      
      // Si se guardó en backend exitosamente
      if (savedClient && savedClient.id) {
        setClients(prevClients => {
          if (!Array.isArray(prevClients)) return [savedClient];
          
          const updatedClients = [...prevClients];
          const existingIndex = updatedClients.findIndex(c => c.id === savedClient.id);
          
          if (existingIndex >= 0) {
            updatedClients[existingIndex] = savedClient;
          } else {
            updatedClients.push(savedClient);
          }
          
          return updatedClients;
        });
        
        return savedClient;
      }
      
      return null;
    } catch (error) {
      console.error('Error saving client:', error);
      alert(`Error al guardar el cliente: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteClient = async (id) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    const clientMovements = movements && Array.isArray(movements) 
      ? movements.filter(m => m.cliente === client.nombre)
      : [];
    
    if (clientMovements && clientMovements.length > 0) {
      alert(`No se puede eliminar el cliente "${client.nombre}" porque tiene ${clientMovements.length} movimientos asociados.`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar al cliente "${client.nombre}"?`)) {
      try {
        if (isAuthenticated) {
          await apiService.deleteClient(id);
          await loadDataFromBackend();
        } else {
          setClients(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  // Navigation
  const navigateTo = (page) => {
    // Map navigation IDs to component IDs
    const pageMap = {
      'inicio': 'inicio',  // Mostrar la página de bienvenida
      'nuevoMovimiento': 'operaciones',
      'pendientesRetiro': 'pendientes',
      'cuentas': 'cuentas-corrientes',
      'saldosIniciales': 'saldos-iniciales'
    };
    
    const mappedPage = pageMap[page] || page;
    setCurrentPage(mappedPage);
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Render current page component
  const renderCurrentPage = () => {
    // Show welcome page for inicio
    if (currentPage === 'inicio') {
      return <WelcomePage onNavigate={navigateTo} />;
    }
    
    // Verificar permisos del usuario
    if (currentUser && currentUser.role !== 'admin') {
      // Mapear páginas a permisos
      const permissionMap = {
        'operaciones': 'operaciones',
        'pendientes': 'pendientes',
        'cuentas-corrientes': 'cuentas-corrientes',
        'saldos-iniciales': 'saldos-iniciales',
        'movimientos': 'movimientos',
        'saldos': 'saldos',
        'clientes': 'clientes',
        'prestamistas': 'prestamistas',
        'gastos': 'gastos',
        'comisiones': 'comisiones',
        'utilidad': 'utilidad',
        'arbitraje': 'arbitraje',
        'caja': 'caja',
        'rentabilidad': 'rentabilidad',
        'stock': 'stock'
      };
      
      const requiredPermission = permissionMap[currentPage];
      
      // Si el usuario no tiene permisos o no tiene acceso a esta página
      if (requiredPermission && (!currentUser.permissions || 
          !Array.isArray(currentUser.permissions) || 
          !currentUser.permissions.includes(requiredPermission))) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 p-4">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚫</span>
              </div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Acceso Denegado</h2>
              <p className="mb-6 text-gray-600">No tienes permisos para acceder a este módulo.</p>
              <button 
                onClick={() => navigateTo('inicio')} 
                className="btn-primary"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        );
      }
    }
    
    const Component = componentMap[currentPage];
    
    if (!Component) {
      return <div>Página no encontrada</div>;
    }

    // Props for different components
    const commonProps = {
      movements,
      onNavigate: navigateTo
    };

    const componentProps = {
      'operaciones': {
        onSaveMovement: handleSaveMovement,
        clients,
        initialMovementData: editingMovement,
        onCancelEdit: handleCancelEdit,
        onSaveClient: handleSaveClient
      },
      'clientes': {
        clientes: clients,
        onSaveClient: handleSaveClient,
        onDeleteClient: handleDeleteClient,
        movements
      },
      'movimientos': {
        ...commonProps,
        onEdit: handleEditMovement,
        onDelete: handleDeleteMovement,
        clients
      },
      'pendientes': {
        ...commonProps,
        clients,
        onEditMovement: handleEditMovement,
        onDeleteMovement: handleDeleteMovement
      },
      'gastos': {
        ...commonProps,
        onEditMovement: handleEditMovement,
        onDeleteMovement: handleDeleteMovement,
        onViewMovementDetail: null // Add if needed
      },
      'cuentas-corrientes': {
        ...commonProps,
        onNavigate: navigateTo
      },
      'prestamistas': {
        ...commonProps,
        clients,
        onNavigate: navigateTo
      },
      'comisiones': {
        ...commonProps,
        onNavigate: navigateTo
      },
      'utilidad': {
        ...commonProps,
        onNavigate: navigateTo
      },
      'arbitraje': {
        ...commonProps,
        movements,
        onNavigate: navigateTo
      },
      'saldos': {
        ...commonProps,
        movements,
        onNavigate: navigateTo
      },
      'caja': {
        movements
      },
      'rentabilidad': {
        ...commonProps,
        movements,
        onNavigate: navigateTo
      },
      'stock': {
        ...commonProps,
        movements,
        onNavigate: navigateTo
      },
      'saldos-iniciales': {
        ...commonProps,
        movements,
        onNavigate: navigateTo
      },
      'usuarios': {
        ...commonProps,
        onNavigate: navigateTo
      }
    };

    const props = componentProps[currentPage] || commonProps;
    
    return <Component {...props} />;
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto shadow-lg"></div>
          <p className="mt-6 text-lg text-gray-700 dark:text-gray-200 font-semibold">Conectando con el servidor...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Verificando autenticación</p>
          <div className="mt-6">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Head>
        <title>Sistema Financiero - Alliance F&R</title>
        <meta name="description" content="Sistema de gestión financiera para casa de cambio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationApp 
          currentPage={currentPage} 
          onNavigate={navigateTo}
          currentUser={currentUser}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando módulo...</p>
                </div>
              </div>
            }>
              {renderCurrentPage()}
            </Suspense>
          </div>
        </NavigationApp>
      </div>
    </>
  );
}


