import React, { Suspense, useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const NavigationApp = dynamic(() => 
  import('../ui/NavigationApp').then(module => module.NavigationApp),
  { ssr: false }
);

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Cargar y persistir estado de sidebar
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('sidebarOpen');
      if (stored != null) setIsSidebarOpen(stored === '1');
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => {
    const next = !prev;
    try { 
      sessionStorage.setItem('sidebarOpen', next ? '1' : '0'); 
    } catch (error) {
      console.warn('Error saving sidebar state:', error);
    }
    return next;
  });

  const pathToPageId = useMemo(() => ({
    '/': 'inicio',
    '/operaciones': 'operaciones',
    '/clientes': 'clientes',
    '/movimientos': 'movimientos',
    '/pendientes': 'pendientes',
    '/gastos': 'gastos',
    '/cuentas-corrientes': 'cuentas-corrientes',
    '/prestamistas': 'prestamistas',
    '/comisiones': 'comisiones',
    '/utilidad': 'utilidad',
    '/arbitraje': 'arbitraje',
    '/saldos': 'saldos',
    '/caja': 'caja',
    '/rentabilidad': 'rentabilidad',
    '/stock': 'stock',
    '/saldos-iniciales': 'saldos-iniciales',
    '/usuarios': 'usuarios'
  }), []);

  const currentPage = pathToPageId[router.pathname] || 'inicio';

  const navigateMap = useMemo(() => ({
    inicio: '/',
    nuevoMovimiento: '/operaciones',
    pendientesRetiro: '/pendientes',
    cuentas: '/cuentas-corrientes',
    saldosIniciales: '/saldos-iniciales',
    clientes: '/clientes',
    movimientos: '/movimientos',
    gastos: '/gastos',
    comisiones: '/comisiones',
    utilidad: '/utilidad',
    arbitraje: '/arbitraje',
    saldos: '/saldos',
    caja: '/caja',
    rentabilidad: '/rentabilidad',
    stock: '/stock',
    prestamistas: '/prestamistas',
    usuarios: '/usuarios'
  }), []);

  const handleNavigate = useCallback((itemId) => {
    const path = navigateMap[itemId] || `/${itemId}`;
    router.push(path);
  }, [navigateMap, router]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando...</div>}>
      <NavigationApp 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={null}
        onLogout={() => {}}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      >
        {children}
      </NavigationApp>
    </Suspense>
  );
}