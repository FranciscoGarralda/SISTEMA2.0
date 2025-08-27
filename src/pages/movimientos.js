import React from 'react';
import { useClients, useMovements } from '../hooks/useData';
import MovimientosApp from '../features/movements/MovimientosApp';
import MainLayout from '../components/layouts/MainLayout';

export default function MovimientosPage() {
  const { clients } = useClients();
  const { movements, updateMovement, deleteMovement } = useMovements();

  return (
    <MainLayout>
      <MovimientosApp 
        movements={movements}
        clients={clients}
        onEditMovement={updateMovement}
        onDeleteMovement={deleteMovement}
      />
    </MainLayout>
  );
}