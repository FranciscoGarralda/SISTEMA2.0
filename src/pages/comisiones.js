import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const ComisionesApp = lazy(() => import('../features/commissions/ComisionesApp'));

export default function ComisionesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <ComisionesApp />
      </Suspense>
    </MainLayout>
  );
}