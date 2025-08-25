import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { useClients } from '../store/ClientsContext';

const ClientesApp = lazy(() => import('../features/clients/ClientesApp'));

export default function ClientesPage() {
  const { clients, saveClient, deleteClient } = useClients();
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center description-text">Cargando módulo...</div>}>
        <ClientesApp 
          clientes={clients}
          onSaveClient={saveClient}
          onDeleteClient={deleteClient}
        />
      </Suspense>
    </MainLayout>
  );
}