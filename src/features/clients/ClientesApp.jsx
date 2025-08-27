import React from 'react';
import { Plus, Search, User } from 'lucide-react';
import { useClients } from './hooks/useClients';
import ClientForm from './components/ClientForm';
import ClientTable from './components/ClientTable';
import ClientAnalytics from './components/ClientAnalytics';

/** COMPONENTE PRINCIPAL DE CLIENTES - REFACTORIZADO */
function ClientesApp() {
  const {
    // Estado
    vista,
    clienteEditando,
    clienteAnalytics,
    busqueda,
    guardando,
    isLoading,
    error,
    
    // Datos
    clients,
    clientesFiltrados,
    clientesOperaciones,
    clientesPrestamistas,
    
    // Acciones
    crearNuevoCliente,
    editarCliente,
    eliminarCliente,
    guardarCliente,
    verAnalytics,
    volverALista,
    setBusqueda,
    loadClients,
    
    // Utilidades
    calcularFrecuencia,
    getEstadoContacto
  } = useClients();

  // Renderizado condicional según la vista
  if (vista === 'form') {
    return (
      <ClientForm 
        cliente={clienteEditando} 
        onSave={guardarCliente} 
        onCancel={volverALista}
        guardando={guardando}
      />
    );
  }

  if (vista === 'analytics') {
    return (
      <ClientAnalytics 
        cliente={clienteAnalytics} 
        onBack={volverALista}
        calcularFrecuencia={calcularFrecuencia}
      />
    );
  }

  // Vista principal - Lista de clientes
  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      {/* Header */}
      <div className="">
        <div className="section-header">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-light-surface dark:bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={20} className="sm:w-6 sm:h-6 description-text" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">Gestión de Clientes</h1>
                <p className="description-text">
                  {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button 
              onClick={crearNuevoCliente} 
              className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Nuevo Cliente</span>
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="section-header">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 description-text" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 form-input focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-light-primary dark:border-dark-primary border-t-transparent"></div>
            <span className="ml-2 description-text">Cargando clientes...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-error-100 border border-error-300 text-error-700 px-4 py-3 rounded-lg mb-4">
            Error al cargar clientes: {error}
          </div>
        )}

        {/* Contenido principal */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {/* Clientes de Operaciones */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Clientes de Operaciones</h2>
                <span className="text-sm description-text">
                  {clientesOperaciones.length} cliente{clientesOperaciones.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="card-content">
                <ClientTable
                  clientes={clientesOperaciones}
                  onEdit={editarCliente}
                  onDelete={eliminarCliente}
                  onAnalytics={verAnalytics}
                  getEstadoContacto={getEstadoContacto}
                  tipoCliente="operaciones"
                />
              </div>
            </div>

            {/* Clientes Prestamistas */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Clientes Prestamistas</h2>
                <span className="text-sm description-text">
                  {clientesPrestamistas.length} cliente{clientesPrestamistas.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="card-content">
                <ClientTable
                  clientes={clientesPrestamistas}
                  onEdit={editarCliente}
                  onDelete={eliminarCliente}
                  onAnalytics={verAnalytics}
                  getEstadoContacto={getEstadoContacto}
                  tipoCliente="prestamistas"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientesApp;