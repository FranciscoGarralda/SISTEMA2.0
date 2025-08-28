import React from 'react';
import CuentasCorrientesApp from '../features/current-accounts/CuentasCorrientesApp';
import MainLayout from '../components/layouts/MainLayout';

export default function CuentasCorrientesPage() {
  return (
    <MainLayout>
      <CuentasCorrientesApp />
    </MainLayout>
  );
}