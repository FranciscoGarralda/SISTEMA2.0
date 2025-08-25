import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const CajaApp = lazy(() => import('../features/cash-register/CajaApp'));

export default function CajaPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <CajaApp />
      </Suspense>
    </MainLayout>
  );
}