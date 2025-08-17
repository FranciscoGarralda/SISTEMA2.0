import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const SaldosApp = lazy(() => import('../features/balances/SaldosApp'));

export default function SaldosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <SaldosApp />
      </Suspense>
    </MainLayout>
  );
}