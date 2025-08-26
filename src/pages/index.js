import React, { useState, lazy, Suspense, useCallback, useMemo, startTransition } from 'react';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import LoginPage from '../features/auth/LoginPage';

// Lazy load components
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

// Lazy load feature components (simplificado para evitar errores de chunks)
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

// Component map
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
  'usuarios': UserManagementApp,
};

export default function Home() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Custom hooks
  const {
    isAuthenticated,
    currentUser,
    checkingAuth,
    handleLoginSuccess,
    handleLogout
  } = useAuth();

  const {
    movements,
    clients,
    editingMovement,
    loadDataFromBackend,
    handleSaveMovement,
    handleDeleteMovement,
    handleEditMovement,
    handleCancelEdit,
    handleSaveClient,
    handleDeleteClient
  } = useData();

  // Navigation function
  const navigateTo = useCallback((page) => {
    const pageMap = {
      'inicio': 'inicio',
      'nuevoMovimiento': 'operaciones',
      'pendientesRetiro': 'pendientes',
      'cuentas': 'cuentas-corrientes',
      'saldosIniciales': 'saldos-iniciales'
    };
    
    const mappedPage = pageMap[page] || page;
    
    // Use startTransition to avoid Suspense errors
    startTransition(() => {
      setCurrentPage(mappedPage);
    });
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Load data when authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      loadDataFromBackend();
    }
  }, [isAuthenticated, loadDataFromBackend]);

  // Memoized props
  const commonProps = useMemo(() => ({
    movements,
    onNavigate: navigateTo
  }), [movements, navigateTo]);

  const componentProps = useMemo(() => ({
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
      onEditMovement: handleEditMovement,
      onDeleteMovement: handleDeleteMovement,
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
      onViewMovementDetail: null
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
      movements,
      onNavigate: navigateTo
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
    },
  }), [
    commonProps,
    movements,
    clients,
    editingMovement,
    handleSaveMovement,
    handleCancelEdit,
    handleSaveClient,
    handleDeleteClient,
    handleEditMovement,
    handleDeleteMovement,
    navigateTo
  ]);

  // Render current page component
  const renderCurrentPage = () => {
    // Show welcome page for inicio
    if (currentPage === 'inicio') {
      return <WelcomePage onNavigate={navigateTo} />;
    }
    
    // Check user permissions
    if (currentUser && currentUser.role !== 'admin') {
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
      
      if (requiredPermission && (!currentUser.permissions || 
          !Array.isArray(currentUser.permissions) || 
          !currentUser.permissions.includes(requiredPermission))) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen description-text p-4">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚫</span>
              </div>
              <h2 className="text-xl font-bold mb-4 description-text">Acceso Denegado</h2>
              <p className="mb-6 description-text">No tienes permisos para acceder a este módulo.</p>
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
    
    const props = componentProps[currentPage] || commonProps;
    
    // Wrap lazy components with Suspense
    if (Component.displayName === 'Lazy' || Component.$$typeof === Symbol.for('react.lazy')) {
      return (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="description-text dark:text-gray-400 font-medium">Cargando módulo...</p>
            </div>
          </div>
        }>
          <Component {...props} />
        </Suspense>
      );
    }
    
    return <Component {...props} />;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto shadow-lg"></div>
          <p className="mt-6 text-lg empty-state-text dark:text-gray-200 font-semibold">Conectando con el servidor...</p>
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

      <div className="main-container dark:bg-gray-900">
        <NavigationApp 
          currentPage={currentPage} 
          onNavigate={navigateTo}
          currentUser={currentUser}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          <div className="p-6">
            {renderCurrentPage()}
          </div>
        </NavigationApp>
      </div>
    </>
  );
}


