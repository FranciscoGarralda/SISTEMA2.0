import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const ComisionesApp = lazy(() => import('../features/commissions/ComisionesApp'));

export default function ComisionesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <ComisionesApp />
      </Suspense>
    </MainLayout>
  );
}