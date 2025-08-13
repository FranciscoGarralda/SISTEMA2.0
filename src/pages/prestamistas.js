import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const PrestamistasApp = lazy(() => import('../features/lenders/PrestamistasApp'));

export default function PrestamistasPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <PrestamistasApp />
      </Suspense>
    </MainLayout>
  );
}