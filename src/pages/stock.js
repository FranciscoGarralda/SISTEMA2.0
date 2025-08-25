import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const StockApp = lazy(() => import('../features/stock/StockApp'));

export default function StockPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <StockApp />
      </Suspense>
    </MainLayout>
  );
}