import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const PendientesRetiroApp = lazy(() => import('../features/pending-withdrawals/PendientesRetiroApp'));

export default function PendientesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <PendientesRetiroApp 
          movements={[]}
          clients={[]}
          onEditMovement={() => {}}
          onDeleteMovement={() => {}}
        />
      </Suspense>
    </MainLayout>
  );
}