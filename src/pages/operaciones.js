import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';
import { useClients } from '../shared/contexts/ClientsContext';

const FinancialOperationsApp = lazy(() => import('../features/financial-operations/FinancialOperationsApp'));

export default function OperacionesPage() {
  const { clients, saveClient } = useClients();
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <FinancialOperationsApp 
          onSaveMovement={() => {}}
          onCancelEdit={() => {}}
          clients={clients}
          onSaveClient={saveClient}
        />
      </Suspense>
    </MainLayout>
  );
}