import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import {
  Plus,
  Users,
  Wallet,
  List,
  Clock,
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Building2,
  UserCheck,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Calculator,
  BarChart3,
  Package,
  Settings,
  Shield
} from 'lucide-react';
import FixedHeader from './FixedHeader';
import Footer from './Footer';
import SidebarTooltip from './SidebarTooltip';



/** COMPONENTE DE ELEMENTO DEL MENÚ MEJORADO */
const MenuItem = memo(({ icon: Icon, title, onClick, isActive, isSidebarOpen, onFocus, index }) => {

  return (
    <SidebarTooltip content={title} disabled={isSidebarOpen}>
      <button
        role="menuitem"
        onFocus={() => onFocus && onFocus(index)}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg relative
          ${!isSidebarOpen ? 'justify-center' : ''}
          ${isActive 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600'
          }
          touch-manipulation select-none
          focus:outline-none
        `}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
        {isSidebarOpen && (
          <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
            {title}
          </span>
        )}
        
        {/* Indicador activo sutil */}
        {isActive && isSidebarOpen && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-900 rounded-r-full"></div>
        )}
      </button>
    </SidebarTooltip>
  );
});

MenuItem.displayName = 'MenuItem';

/** COMPONENTE DEL MENÚ PRINCIPAL OPTIMIZADO */
const MainMenu = memo(({ onNavigate, activeItem, isSidebarOpen, toggleSidebar, isMobile = false, currentUser }) => {
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Ref para el contenedor con scroll
  const navScrollRef = useRef(null);

  // Persistir scroll en desktop
  useEffect(() => {
    if (isMobile) return;
    const el = navScrollRef.current;
    if (!el) return;

    const stored = sessionStorage.getItem('sidebarScrollTop');
    if (stored) {
      const val = parseInt(stored, 10);
      if (!Number.isNaN(val)) {
        el.scrollTop = val;
      }
    }

    const onScroll = () => {
      sessionStorage.setItem('sidebarScrollTop', String(el.scrollTop));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const menuItems = useMemo(() => [
    // OPERACIONES PRINCIPALES (arriba - más usadas)
    { id: 'inicio', icon: Home, title: 'Inicio', category: 'main' },
    { id: 'nuevoMovimiento', icon: Plus, title: 'Nuevo Movimiento', category: 'main' },
    { id: 'pendientesRetiro', icon: Clock, title: 'Pendientes', category: 'main' },
    { id: 'movimientos', icon: List, title: 'Movimientos', category: 'main' },
    
    // OPERACIONES (acciones que modifican datos)
    { id: 'caja', icon: Calculator, title: 'Caja Diaria', category: 'operations' },
    { id: 'gastos', icon: Receipt, title: 'Gastos', category: 'operations' },
    
    // GESTIÓN (administración de entidades)
    { id: 'clientes', icon: UserCheck, title: 'Clientes', category: 'management' },
    { id: 'prestamistas', icon: CreditCard, title: 'Prestamistas', category: 'management' },
    { id: 'cuentas', icon: Building2, title: 'Cuentas Corrientes', category: 'management' },
    
    // REPORTES E INFORMACIÓN (solo consulta - abajo)
    { id: 'saldos', icon: Wallet, title: 'Saldos', category: 'reports' },
    { id: 'utilidad', icon: TrendingUp, title: 'Utilidad', category: 'reports' },
    { id: 'arbitraje', icon: ArrowUpDown, title: 'Arbitraje', category: 'reports' },
    { id: 'stock', icon: Package, title: 'Stock', category: 'reports' },
    { id: 'comisiones', icon: DollarSign, title: 'Comisiones', category: 'reports' },
    { id: 'rentabilidad', icon: BarChart3, title: 'Rentabilidad', category: 'reports' },
    
    // CONFIGURACIÓN
    { id: 'saldosIniciales', icon: Settings, title: 'Saldos Iniciales', category: 'config' },
    { id: 'usuarios', icon: Users, title: 'Gestión de Usuarios', adminOnly: true, category: 'config' }
  ], []);

  // Mapeo inverso para determinar qué item está activo
  const reversePageMap = useMemo(() => ({
    'operaciones': 'nuevoMovimiento',
    'pendientes': 'pendientesRetiro',
    'cuentas-corrientes': 'cuentas',
    'saldos-iniciales': 'saldosIniciales'
  }), []);

  const getActiveItemId = useCallback((currentPage) => {
    return reversePageMap[currentPage] || currentPage;
  }, [reversePageMap]);

  const handleItemClick = useCallback((itemId) => {
    onNavigate(itemId);
  }, [onNavigate]);

  // Filtrar items según el rol del usuario y permisos
  const visibleMenuItems = useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) return [];
    
    return menuItems.filter(item => {
      // Inicio siempre es visible para todos
      if (item.id === 'inicio') {
        return true;
      }
      
      // Si el item es solo para admin y el usuario no es admin, no mostrarlo
      if (item.adminOnly && (!currentUser || currentUser.role !== 'admin')) {
        return false;
      }
      
      // Si el usuario no es admin, SIEMPRE verificar permisos
      if (currentUser && currentUser.role !== 'admin') {
        // Mapear IDs de menú a IDs de permisos
        const permissionMap = {
          'nuevoMovimiento': 'operaciones',
          'pendientesRetiro': 'pendientes',
          'cuentas': 'cuentas-corrientes',
          'saldosIniciales': 'saldos-iniciales'
        };
        
        const permissionId = permissionMap[item.id] || item.id;
        
        // Si no tiene permisos o no incluye este permiso, no mostrar
        if (!currentUser.permissions || !Array.isArray(currentUser.permissions) || !currentUser.permissions.includes(permissionId)) {
          return false;
        }
      }
      
      return true;
    });
  }, [menuItems, currentUser]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSidebarOpen && !isMobile) return; // Solo funciona cuando el menú está visible
      
      const menuButtons = menuRef.current?.querySelectorAll('button[role="menuitem"]');
      if (!menuButtons || menuButtons.length === 0) return;
      
      let newIndex = focusedIndex;
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          newIndex = focusedIndex < menuButtons.length - 1 ? focusedIndex + 1 : 0;
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = focusedIndex > 0 ? focusedIndex - 1 : menuButtons.length - 1;
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && menuButtons[focusedIndex]) {
            e.preventDefault();
            menuButtons[focusedIndex].click();
          }
          break;
        case 'Escape':
          if (isMobile && toggleSidebar) {
            toggleSidebar();
          }
          break;
        default:
          return;
      }
      
      if (newIndex !== focusedIndex && newIndex >= 0) {
        setFocusedIndex(newIndex);
        menuButtons[newIndex]?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, isSidebarOpen, isMobile, toggleSidebar]);

  // Si es móvil y no está abierto, no renderizar nada
  if (isMobile && !isSidebarOpen) {
    return null;
  }

  return (
    <div 
      ref={menuRef}
      className={`
        ${isMobile 
          ? 'fixed top-0 left-0 h-screen z-[60] w-64'
          : `h-full z-30 ${isSidebarOpen ? 'w-64' : 'w-16'}`
        }
        bg-white shadow-xl flex flex-col border-r border-gray-200
      `}
      role="navigation"
      aria-label="Menú principal"
    >
      {/* Header para móvil con botón cerrar e Inicio en la misma línea */}
      {isMobile && isSidebarOpen && (
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200">
          <button
            onClick={() => handleItemClick('inicio')}
            className="flex items-center gap-3 flex-1 p-2 rounded-lg"
          >
            <Home size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Inicio</span>
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg"
            aria-label="Cerrar menú"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
        </div>
      )}
      
      {/* Header para desktop con Inicio y toggle en la misma línea */}
      {!isMobile && isSidebarOpen && (
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
          <button
            onClick={() => handleItemClick('inicio')}
            className="flex items-center gap-3 flex-1 p-2 rounded-lg"
          >
            <Home size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Inicio</span>
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg"
            aria-label="Cerrar menú"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
        </div>
      )}
      
      {/* Toggle button for desktop cuando está cerrado */}
      {!isMobile && !isSidebarOpen && (
        <div className="p-2">
          <button
            onClick={toggleSidebar}
            className="mx-auto p-2 rounded-lg focus:outline-none flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
      )}
      
      {/* Menú de navegación - ocupa todo el espacio */}
      <nav ref={navScrollRef} className={`flex-1 ${isSidebarOpen || isMobile ? 'px-3 py-4' : 'p-2'} overflow-y-auto ${isMobile ? '' : 'pt-4'}`}>
        {/* Renderizar items por categoría */}
        {visibleMenuItems && visibleMenuItems.length > 0 && ['main', 'operations', 'management', 'reports', 'config'].map((category, categoryIndex) => {
          // Filtrar "inicio" solo cuando está abierto (ya está en el header)
          const categoryItems = visibleMenuItems.filter(item => {
            // En desktop cerrado, mostrar todos los items incluido inicio como ícono
            if (!isSidebarOpen && !isMobile) {
              return item.category === category;
            }
            // En móvil o desktop abierto, no mostrar inicio (está en el header)
            if (isSidebarOpen && item.id === 'inicio') return false;
            return item.category === category;
          });
          if (!categoryItems || categoryItems.length === 0) return null;
          
          return (
            <div key={category} className={categoryIndex > 0 ? 'mt-6' : ''}>
              {/* Separador entre categorías */}
              {categoryIndex > 0 && (
                <div className={isSidebarOpen ? 'mx-3 mb-3 border-t border-gray-200' : 'mx-2 my-2 border-t border-gray-200'}></div>
              )}
              
              {/* Items de la categoría */}
              <div className="space-y-1">
                {categoryItems.map((item, itemIndex) => {
                  // Calcular el índice global para la navegación
                  const globalIndex = visibleMenuItems && Array.isArray(visibleMenuItems) 
                    ? visibleMenuItems.findIndex(i => i.id === item.id)
                    : -1;
                  return (
                    <MenuItem
                      key={item.id}
                      icon={item.icon}
                      title={item.title}
                      isActive={getActiveItemId(activeItem) === item.id}
                      onClick={() => handleItemClick(item.id)}
                      isSidebarOpen={isSidebarOpen}
                      onFocus={setFocusedIndex}
                      index={globalIndex}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
});

MainMenu.displayName = 'MainMenu';

/** COMPONENTE PRINCIPAL DE NAVEGACIÓN OPTIMIZADO */
const NavigationApp = memo(({ children, currentPage, onNavigate, currentUser, onLogout, isSidebarOpen: propIsSidebarOpen, toggleSidebar: propToggleSidebar }) => {
  // Use props if provided, otherwise use internal state
  const [internalIsSidebarOpen, setInternalIsSidebarOpen] = useState(false);
  const isSidebarOpen = propIsSidebarOpen !== undefined ? propIsSidebarOpen : internalIsSidebarOpen;
  const [isMobile, setIsMobile] = useState(false);

  // Optimized mobile detection with cleanup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkMobile();
    
    // Throttled resize handler to prevent excessive calls
    let resizeTimer;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Optimized toggle function with useCallback
  const toggleSidebar = useCallback(() => {
    if (propToggleSidebar) {
      propToggleSidebar();
    } else {
      setInternalIsSidebarOpen(prev => !prev);
    }
  }, [propToggleSidebar]);

  // Optimized navigation handler with useCallback
  const handleNavigate = useCallback((page) => {
    onNavigate(page);
    // No cerrar automáticamente (ni móvil ni escritorio)
  }, [onNavigate]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        if (propToggleSidebar) {
          propToggleSidebar();
        } else {
          setInternalIsSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      // Solo bloquear el scroll si el sidebar está abierto en móvil
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile, isSidebarOpen]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header fijo */}
      <FixedHeader 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentPage={currentPage}
        showMenuButton={true}
        currentUser={currentUser}
        onLogout={onLogout}


      />

      {/* Layout principal con altura calculada */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Sidebar - Solo desktop (lg+), siempre fija */}
        <div className="hidden lg:block">
          <MainMenu 
            onNavigate={handleNavigate} 
            activeItem={currentPage} 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar}
            isMobile={false}
            currentUser={currentUser}
          />
        </div>
        
        {/* Sidebar móvil - Solo cuando está abierto */}
        {isMobile && (
          <MainMenu 
            onNavigate={handleNavigate} 
            activeItem={currentPage} 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar}
            isMobile={true}
            currentUser={currentUser}
          />
        )}
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Overlay para móvil cuando el sidebar está abierto */}
          {isSidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden"
              onClick={toggleSidebar}
              role="button"
              tabIndex={0}
              aria-label="Cerrar menú"
            />
          )}
          
          {/* Contenido de la página - con scroll */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-0">
              {children}
            </div>
          </main>
          
          {/* Footer fijo */}
          <Footer />
        </div>
      </div>
    </div>
  );
});

NavigationApp.displayName = 'NavigationApp';

/** PÁGINA DE BIENVENIDA */
const WelcomePage = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 p-4 lg:p-8">
    <div className="text-center w-full px-2 sm:px-3 lg:px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <DollarSign size={32} className="text-gray-800" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 animate-fadeIn">
        Bienvenido a Alliance F&R
      </h2>
      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 animate-fadeIn">
        Sistema integral de gestión financiera. Accede rápidamente a las funciones principales:
      </p>
      
      {/* Accesos Rápidos Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => onNavigate('nuevoMovimiento')}
          className="text-center p-6 bg-white rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 animate-scaleIn border-2 border-transparent hover:border-gray-200 group"
        >
          <Plus size={32} className="mx-auto mb-3 text-gray-500 group-hover:scale-110 transition-transform" />
          <span className="block font-semibold text-gray-800 mb-1">Nuevo Movimiento</span>
          <span className="text-sm text-gray-700">Crear operación financiera</span>
        </button>
        
        <button
          onClick={() => onNavigate('saldos')}
          className="text-center p-6 bg-white rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 animate-scaleIn border-2 border-transparent hover:border-success-200 group"
          style={{animationDelay: '0.1s'}}
        >
          <Wallet size={32} className="mx-auto mb-3 text-success-500 group-hover:scale-110 transition-transform" />
          <span className="block font-semibold text-gray-800 mb-1">Saldos</span>
          <span className="text-sm text-gray-700">Ver estado de cuentas</span>
        </button>
        
        <button
          onClick={() => onNavigate('movimientos')}
          className="text-center p-6 bg-white rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 animate-scaleIn border-2 border-transparent hover:border-gray-200 group"
          style={{animationDelay: '0.2s'}}
        >
          <List size={32} className="mx-auto mb-3 text-gray-500 group-hover:scale-110 transition-transform" />
          <span className="block font-semibold text-gray-800 mb-1">Movimientos</span>
          <span className="text-sm text-gray-700">Ver y gestionar</span>
        </button>
      </div>
      
      {/* Info */}
      <div className="max-w-3xl mx-auto text-sm text-gray-600 animate-fadeInSlow">
        <p>
          Optimizado para uso diario con accesos rápidos, atajos de teclado y un diseño funcional.
        </p>
      </div>
    </div>
  </div>
);

export { NavigationApp, WelcomePage };