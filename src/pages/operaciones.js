import React from 'react';
import { useClients, useMovements } from '../hooks/useData';
import FinancialOperationsApp from '../features/financial-operations/FinancialOperationsApp';
import MainLayout from '../components/layouts/MainLayout';

export default function OperacionesPage() {
  const { addClient } = useClients();
  const { addMovement } = useMovements();

  return (
    <MainLayout>
      <FinancialOperationsApp 
        onSaveClient={addClient}
        onSaveMovement={addMovement}
      />
    </MainLayout>
  );
}