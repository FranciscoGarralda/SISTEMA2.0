import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const GastosApp = lazy(() => import('../features/expenses/GastosApp'));

export default function GastosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
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