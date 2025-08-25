import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const UtilidadApp = lazy(() => import('../features/utility/UtilidadApp'));

export default function UtilidadPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <UtilidadApp />
      </Suspense>
    </MainLayout>
  );
}