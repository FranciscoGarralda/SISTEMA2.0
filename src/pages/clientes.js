import React from 'react';
import { useClients } from '../hooks/useData';
import ClientesApp from '../features/clients/ClientesApp';
import MainLayout from '../components/layouts/MainLayout';

export default function ClientesPage() {
  const { clients, addClient, updateClient, deleteClient, loadClients } = useClients();

  return (
    <MainLayout>
      <ClientesApp 
        clientes={clients}
        onSaveClient={addClient}
        onUpdateClient={updateClient}
        onDeleteClient={deleteClient}
        onReloadClients={loadClients}
      />
    </MainLayout>
  );
}