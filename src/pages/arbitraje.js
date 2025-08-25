import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const ArbitrajeApp = lazy(() => import('../features/arbitrage/ArbitrajeApp'));

export default function ArbitrajePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <ArbitrajeApp />
      </Suspense>
    </MainLayout>
  );
}