import React, { lazy, Suspense } from 'react';
import MainLayout from '../shared/layouts/MainLayout';
import { useClients } from '../shared/contexts/ClientsContext';

const ClientesApp = lazy(() => import('../features/clients/ClientesApp'));

export default function ClientesPage() {
  const { clients, saveClient, deleteClient } = useClients();
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <ClientesApp 
          clientes={clients}
          onSaveClient={saveClient}
          onDeleteClient={deleteClient}
        />
      </Suspense>
    </MainLayout>
  );
}