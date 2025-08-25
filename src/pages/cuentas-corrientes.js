import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const CuentasCorrientesApp = lazy(() => import('../features/current-accounts/CuentasCorrientesApp'));

export default function CuentasCorrientesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <CuentasCorrientesApp />
      </Suspense>
    </MainLayout>
  );
}