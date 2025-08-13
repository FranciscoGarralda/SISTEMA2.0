import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const StockApp = lazy(() => import('../features/stock/StockApp'));

export default function StockPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <StockApp />
      </Suspense>
    </MainLayout>
  );
}