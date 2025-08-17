import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const MovimientosApp = lazy(() => import('../features/movements/MovimientosApp'));

export default function MovimientosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <MovimientosApp 
          movements={[]}
          clients={[]}
          onEditMovement={() => {}}
          onDeleteMovement={() => {}}
          onNavigate={() => {}}
        />
      </Suspense>
    </MainLayout>
  );
}