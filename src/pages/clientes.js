import React from 'react';
import ClientesApp from '../features/clients/ClientesApp';
import MainLayout from '../components/layouts/MainLayout';

export default function ClientesPage() {
  return (
    <MainLayout>
      <ClientesApp />
    </MainLayout>
  );
}