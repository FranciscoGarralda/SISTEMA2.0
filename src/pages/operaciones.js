import React from 'react';
import { useClients, useMovements } from '../hooks/useData';
import FinancialOperationsApp from '../features/financial-operations/FinancialOperationsApp';
import MainLayout from '../components/layouts/MainLayout';

export default function OperacionesPage() {
  const { clients, addClient, loadClients } = useClients();
  const { movements, addMovement, loadMovements } = useMovements();

  return (
    <MainLayout>
      <FinancialOperationsApp 
        clients={clients}
        movements={movements}
        onSaveClient={addClient}
        onSaveMovement={addMovement}
        onReloadClients={loadClients}
        onReloadMovements={loadMovements}
      />
    </MainLayout>
  );
}