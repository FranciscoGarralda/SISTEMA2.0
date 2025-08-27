import React from 'react';
import MovimientosApp from '../features/movements/MovimientosApp';
import MainLayout from '../components/layouts/MainLayout';

export default function MovimientosPage() {
  return (
    <MainLayout>
      <MovimientosApp />
    </MainLayout>
  );
}