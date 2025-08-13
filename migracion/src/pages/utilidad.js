import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const UtilidadApp = lazy(() => import('../features/utility/UtilidadApp'));

export default function UtilidadPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <UtilidadApp />
      </Suspense>
    </MainLayout>
  );
}