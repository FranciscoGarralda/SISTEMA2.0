import React, { lazy, Suspense } from 'react';
import MainLayout from '../components/layouts/MainLayout';

const UserManagementApp = lazy(() => import('../features/user-management/UserManagementApp'));

export default function UsuariosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando módulo...</div>}>
        <UserManagementApp />
      </Suspense>
    </MainLayout>
  );
}