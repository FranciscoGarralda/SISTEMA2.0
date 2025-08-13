import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const ArbitrajeApp = lazy(() => import('../features/arbitrage/ArbitrajeApp'));

export default function ArbitrajePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <ArbitrajeApp />
      </Suspense>
    </MainLayout>
  );
}