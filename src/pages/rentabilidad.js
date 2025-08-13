import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const RentabilidadApp = lazy(() => import('../features/profitability/RentabilidadApp'));

export default function RentabilidadPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <RentabilidadApp />
      </Suspense>
    </MainLayout>
  );
}