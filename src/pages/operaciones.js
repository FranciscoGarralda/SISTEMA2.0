import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { useClients } from '../store/ClientsContext';

const FinancialOperationsApp = lazy(() => import('../features/financial-operations/FinancialOperationsApp'));

export default function OperacionesPage() {
  const { clients, saveClient, loadClients } = useClients();
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <FinancialOperationsApp 
          onSaveMovement={() => {}}
          onCancelEdit={() => {}}
          clients={clients}
          onSaveClient={saveClient}
          reloadClients={loadClients}
        />
      </Suspense>
    </MainLayout>
  );
}