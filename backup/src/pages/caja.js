import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const CajaApp = lazy(() => import('../features/cash-register/CajaApp'));

export default function CajaPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <CajaApp />
      </Suspense>
    </MainLayout>
  );
}