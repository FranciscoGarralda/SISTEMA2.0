import React from 'react';
import { useMovements } from '../hooks/useData';
import GastosApp from '../features/expenses/GastosApp';
import MainLayout from '../components/layouts/MainLayout';

export default function GastosPage() {
  const { movements, updateMovement, deleteMovement } = useMovements();

  return (
    <MainLayout>
      <GastosApp 
        movements={movements}
        onEditMovement={updateMovement}
        onDeleteMovement={deleteMovement}
      />
    </MainLayout>
  );
}