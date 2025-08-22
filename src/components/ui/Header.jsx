import React from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';

const Header = ({ 
  currentPage, 
  onNavigate, 
  onLogout, 
  currentUser, 
  isAuthenticated,
  onToggleSidebar,
  isSidebarOpen 
}) => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'operaciones', label: 'Operaciones', icon: '💱' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'movimientos', label: 'Movimientos', icon: '📊' },
    { id: 'stock', label: 'Stock', icon: '📦' },
    { id: 'saldos', label: 'Saldos', icon: '💰' },
    { id: 'utilidad', label: 'Utilidad', icon: '📈' },
    { id: 'caja', label: 'Caja', icon: '💼' },
    { id: 'gastos', label: 'Gastos', icon: '💸' },
    { id: 'comisiones', label: 'Comisiones', icon: '🎯' },
    { id: 'arbitraje', label: 'Arbitraje', icon: '⚖️' },
    { id: 'cuentas-corrientes', label: 'Cuentas Corrientes', icon: '🏦' },
    { id: 'saldos-iniciales', label: 'Saldos Iniciales', icon: '🏁' },
    { id: 'pendientes', label: 'Pendientes', icon: '⏳' },
    { id: 'prestamistas', label: 'Prestamistas', icon: '🤝' },
    { id: 'rentabilidad', label: 'Rentabilidad', icon: '📊' },
    { id: 'usuarios', label: 'Usuarios', icon: '👤' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 dark:bg-gray-800 border-b border-gray-700 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          {/* Botón hamburguesa para móvil */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <h1 className="text-lg font-bold text-white dark:text-white">
              Sistema Financiero
            </h1>
          </div>
        </div>

        {/* Navegación principal - oculta en móvil */}
        <nav className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-gray-300 dark:text-gray-300 hover:text-teal-400 dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Usuario y logout */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && currentUser && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-300">
              <div className="w-8 h-8 bg-teal-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <User size={16} className="text-teal-400" />
              </div>
              <span className="font-medium">{currentUser.name || 'Usuario'}</span>
            </div>
          )}
          
          {isAuthenticated && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-red-400 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
