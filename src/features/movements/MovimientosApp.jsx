import React, { useMemo } from 'react';
import { List } from 'lucide-react';
import { useMovements } from './hooks/useMovements';
import MovementTable from './components/MovementTable';
import MovementFilters from './components/MovementFilters';
import MovementStats from './components/MovementStats';

/** COMPONENTE PRINCIPAL DE MOVIMIENTOS - REFACTORIZADO */
function MovimientosApp({ clients = [] }) {
  const {
    // Estado
    busqueda,
    filtroTipo,
    filtroEstado,
    ordenarPor,
    orden,
    isLoading,
    error,
    
    // Datos
    movements,
    movimientosFiltrados,
    estadisticas,
    
    // Acciones
    updateMovement,
    deleteMovement,
    loadMovements,
    
    // Filtros
    setBusqueda,
    setFiltroTipo,
    setFiltroEstado,
    setOrdenarPor,
    setOrden,
    limpiarFiltros,
    
    // Utilidades
    hasMovements,
    movementCount,
    filteredCount
  } = useMovements();

  // Opciones para el filtro de tipo de operación
  const operationTypeOptions = useMemo(() => {
    const types = new Set(movements.map(mov => mov.operacion));
    return Array.from(types).map(type => ({ 
      value: type, 
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [movements]);

  const handleViewDetail = (movement) => {
    // TODO: Implementar vista de detalle
    console.log('Ver detalle:', movement);
  };

  const handleEdit = (movement) => {
    // TODO: Implementar edición
    console.log('Editar:', movement);
  };

  const handleDelete = (movementId) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este movimiento?');
    if (confirmacion) {
      deleteMovement(movementId);
    }
  };

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      {/* Header */}
      <div className="">
        <div className="section-header">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <List size={20} className="sm:w-6 sm:h-6 text-success-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">Gestión de Movimientos</h1>
                <p className="description-text">
                  {movementCount} movimiento{movementCount !== 1 ? 's' : ''} registrado{movementCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-light-primary dark:border-dark-primary border-t-transparent"></div>
            <span className="ml-2 description-text">Cargando movimientos...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-error-100 border border-error-300 text-error-700 px-4 py-3 rounded-lg mb-4">
            Error al cargar movimientos: {error}
          </div>
        )}

        {/* Contenido principal */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {/* Estadísticas */}
            <MovementStats 
              estadisticas={estadisticas}
              filteredCount={filteredCount}
              totalCount={movementCount}
            />

            {/* Filtros */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Filtros y Búsqueda</h2>
              </div>
              <div className="card-content">
                <MovementFilters
                  busqueda={busqueda}
                  filtroTipo={filtroTipo}
                  filtroEstado={filtroEstado}
                  ordenarPor={ordenarPor}
                  orden={orden}
                  onBusquedaChange={setBusqueda}
                  onFiltroTipoChange={setFiltroTipo}
                  onFiltroEstadoChange={setFiltroEstado}
                  onOrdenarPorChange={setOrdenarPor}
                  onOrdenChange={setOrden}
                  onLimpiarFiltros={limpiarFiltros}
                  operationTypeOptions={operationTypeOptions}
                />
              </div>
            </div>

            {/* Tabla de movimientos */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Lista de Movimientos</h2>
                <span className="text-sm description-text">
                  {filteredCount} de {movementCount} movimiento{filteredCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="card-content">
                <MovementTable
                  movements={movimientosFiltrados}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetail={handleViewDetail}
                  clients={clients}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovimientosApp;