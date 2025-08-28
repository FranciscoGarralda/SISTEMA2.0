import React from 'react';
import { Users, Plus, AlertCircle, Wrench } from 'lucide-react';
import { useUserManagement } from './hooks/useUserManagement';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

/** COMPONENTE PRINCIPAL DE GESTIÓN DE USUARIOS - REFACTORIZADO */
function UserManagementApp() {
  const {
    // Estado
    users,
    showForm,
    editingUser,
    loading,
    saving,
    error,
    success,
    showFixButton,
    formData,
    
    // Constantes
    SYSTEM_MODULES,
    ROLES,
    
    // Acciones
    loadUsers,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
    handleFieldChange,
    togglePermission,
    clearMessages,
    fixUserSystem,
    
    // Utilidades
    hasUsers,
    userCount
  } = useUserManagement();

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="section-header">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-light-surface dark:bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={20} className="sm:w-6 sm:h-6 description-text" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                  Gestión de Usuarios
                </h1>
                <p className="description-text">
                  {userCount} usuario{userCount !== 1 ? 's' : ''} registrado{userCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => resetForm()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={clearMessages}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={clearMessages}
              className="text-green-400 hover:text-green-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Botón de reparación */}
        {showFixButton && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench size={18} />
                <span>El sistema de usuarios necesita reparación</span>
              </div>
              <button
                onClick={fixUserSystem}
                className="btn-secondary text-sm"
              >
                Reparar Sistema
              </button>
            </div>
          </div>
        )}

        {/* Formulario de usuario */}
        {showForm && (
          <UserForm
            formData={formData}
            editingUser={editingUser}
            saving={saving}
            onFieldChange={handleFieldChange}
            onTogglePermission={togglePermission}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            SYSTEM_MODULES={SYSTEM_MODULES}
            ROLES={ROLES}
          />
        )}

        {/* Lista de usuarios */}
        <UserList
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          SYSTEM_MODULES={SYSTEM_MODULES}
          ROLES={ROLES}
        />
      </div>
    </div>
  );
}

export default UserManagementApp;