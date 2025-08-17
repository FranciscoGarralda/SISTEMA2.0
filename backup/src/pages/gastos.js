import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const GastosApp = lazy(() => import('../features/expenses/GastosApp'));

export default function GastosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <GastosApp 
          movements={[]}
          onEditMovement={() => {}}
          onDeleteMovement={() => {}}
          onViewMovementDetail={() => {}}
          onNavigate={() => {}}
        />
      </Suspense>
    </MainLayout>
  );
}