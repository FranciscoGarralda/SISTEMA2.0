import React from 'react';
import { useClients, useMovements } from '../hooks/useData';
import PendientesRetiroApp from '../features/pending-withdrawals/PendientesRetiroApp';
import MainLayout from '../components/layouts/MainLayout';

export default function PendientesPage() {
  const { clients } = useClients();
  const { movements, updateMovement, deleteMovement } = useMovements();

  return (
    <MainLayout>
      <PendientesRetiroApp 
        movements={movements}
        clients={clients}
        onEditMovement={updateMovement}
        onDeleteMovement={deleteMovement}
      />
    </MainLayout>
  );
}