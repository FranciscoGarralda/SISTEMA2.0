import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FormSelect } from '../../../components/forms';

const MovementFilters = ({
  busqueda,
  filtroTipo,
  filtroEstado,
  ordenarPor,
  orden,
  onBusquedaChange,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  onOrdenarPorChange,
  onOrdenChange,
  onLimpiarFiltros,
  operationTypeOptions = []
}) => {
  const ordenOptions = [
    { value: 'fecha', label: 'Fecha' },
    { value: 'monto', label: 'Monto' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'tipo', label: 'Tipo' }
  ];

  const ordenDirectionOptions = [
    { value: 'desc', label: 'Descendente' },
    { value: 'asc', label: 'Ascendente' }
  ];

  const estadoOptions = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'completado', label: 'Completado' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const tipoOptions = [
    { value: 'todos', label: 'Todos los tipos' },
    ...operationTypeOptions
  ];

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 description-text" />
        <input
          type="text"
          placeholder="Buscar por cliente, detalle, operación..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 form-input focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <FormSelect
            label="Tipo de Operación"
            value={filtroTipo}
            onChange={onFiltroTipoChange}
            options={tipoOptions}
            placeholder="Seleccionar tipo"
          />
        </div>
        
        <div>
          <FormSelect
            label="Estado"
            value={filtroEstado}
            onChange={onFiltroEstadoChange}
            options={estadoOptions}
            placeholder="Seleccionar estado"
          />
        </div>
        
        <div>
          <FormSelect
            label="Ordenar por"
            value={ordenarPor}
            onChange={onOrdenarPorChange}
            options={ordenOptions}
            placeholder="Seleccionar campo"
          />
        </div>
        
        <div>
          <FormSelect
            label="Orden"
            value={orden}
            onChange={onOrdenChange}
            options={ordenDirectionOptions}
            placeholder="Seleccionar orden"
          />
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {(busqueda || filtroTipo !== 'todos' || filtroEstado !== 'todos') && (
        <div className="flex justify-end">
          <button
            onClick={onLimpiarFiltros}
            className="flex items-center gap-2 px-3 py-2 text-sm description-text hover:table-cell rounded-lg transition-colors"
          >
            <X size={16} />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MovementFilters;
