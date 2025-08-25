import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const PrestamistasApp = lazy(() => import('../features/lenders/PrestamistasApp'));

export default function PrestamistasPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <PrestamistasApp />
      </Suspense>
    </MainLayout>
  );
}