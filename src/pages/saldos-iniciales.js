import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const SaldosInicialesApp = lazy(() => import('../features/initial-balances/SaldosInicialesApp'));

export default function SaldosInicialesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <SaldosInicialesApp />
      </Suspense>
    </MainLayout>
  );
}