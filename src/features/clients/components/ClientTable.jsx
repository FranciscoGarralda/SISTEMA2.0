import React from 'react';
import { Edit3, Phone, MapPin, Trash2, TrendingUp, CreditCard, Bell } from 'lucide-react';

const ClientTable = ({ 
  clientes, 
  onEdit, 
  onDelete, 
  onAnalytics, 
  getEstadoContacto,
  tipoCliente 
}) => {
  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard size={24} className="description-text" />
        </div>
        <p className="description-text font-medium">No hay clientes de {tipoCliente}</p>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
          Los clientes aparecerán aquí cuando los agregues
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th className="table-cell text-left">Cliente</th>
            <th className="table-cell text-left">Contacto</th>
            <th className="table-cell text-left">Estado</th>
            <th className="table-cell text-left">Operaciones</th>
            <th className="table-cell text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            const estado = getEstadoContacto(cliente);
            return (
              <tr key={cliente.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-light-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-light-primary dark:text-dark-primary font-semibold text-sm">
                        {cliente.nombre?.charAt(0)?.toUpperCase()}{cliente.apellido?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium table-cell truncate">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      <p className="text-sm description-text truncate">
                        DNI: {cliente.dni}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="description-text flex-shrink-0" />
                      <span className="text-sm table-cell">{cliente.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="description-text flex-shrink-0" />
                      <span className="text-sm description-text truncate max-w-32">
                        {cliente.direccion}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}>
                    <Bell size={12} className="mr-1" />
                    {estado.texto}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="description-text" />
                      <span className="text-sm table-cell">
                        {cliente.totalOperaciones || 0} operaciones
                      </span>
                    </div>
                    {cliente.volumenTotal > 0 && (
                      <p className="text-sm description-text">
                        ${cliente.volumenTotal?.toLocaleString() || 0}
                      </p>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onAnalytics(cliente)}
                      className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target"
                      title="Ver analytics"
                    >
                      <TrendingUp size={16} className="description-text" />
                    </button>
                    <button
                      onClick={() => onEdit(cliente)}
                      className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target"
                      title="Editar cliente"
                    >
                      <Edit3 size={16} className="description-text" />
                    </button>
                    <button
                      onClick={() => onDelete(cliente.id)}
                      className="p-2 hover:bg-error-100 text-error-600 rounded-lg transition-colors touch-target"
                      title="Eliminar cliente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
