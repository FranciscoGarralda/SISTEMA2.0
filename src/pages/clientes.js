import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';

const ClientesApp = lazy(() => import('../features/clients/ClientesApp'));

export default function ClientesPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <ClientesApp 
          clientes={[]}
          onSaveClient={() => {}}
          onDeleteClient={() => {}}
        />
      </Suspense>
    </MainLayout>
  );
}