import React from 'react';
import { Edit3, Trash2, Eye, Calendar, User, DollarSign } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';
import { getClientName } from '../../../services/utilityService';

const MovementTable = ({ 
  movements, 
  onEdit, 
  onDelete, 
  onViewDetail,
  clients = []
}) => {
  if (!movements || movements.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={24} className="description-text" />
        </div>
        <p className="description-text font-medium">No hay movimientos registrados</p>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
          Los movimientos aparecerán aquí cuando los agregues
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th className="table-cell text-left">Fecha</th>
            <th className="table-cell text-left">Cliente</th>
            <th className="table-cell text-left">Operación</th>
            <th className="table-cell text-left">Monto</th>
            <th className="table-cell text-left">Estado</th>
            <th className="table-cell text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => {
            const clienteNombre = getClientName(movement.cliente, clients);
            const montoFormateado = formatAmountWithCurrency(movement.monto, movement.moneda);
            
            return (
              <tr key={movement.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="description-text flex-shrink-0" />
                    <span className="text-sm table-cell">
                      {new Date(movement.fecha).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <User size={14} className="description-text flex-shrink-0" />
                    <span className="text-sm table-cell truncate max-w-32">
                      {clienteNombre}
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="space-y-1">
                    <span className="text-sm font-medium table-cell">
                      {movement.operacion}
                    </span>
                    {movement.subOperacion && (
                      <span className="text-xs description-text block">
                        {movement.subOperacion}
                      </span>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="description-text flex-shrink-0" />
                    <span className={`text-sm font-medium ${
                      movement.operacion === 'compra' ? 'text-success-600' : 
                      movement.operacion === 'venta' ? 'text-error-600' : 
                      'table-cell'
                    }`}>
                      {montoFormateado}
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    movement.estado === 'completado' ? 'bg-success-100 text-success-600' :
                    movement.estado === 'pendiente' ? 'bg-warning-100 text-warning-600' :
                    movement.estado === 'cancelado' ? 'bg-error-100 text-error-600' :
                    'bg-light-surface dark:bg-dark-surface description-text'
                  }`}>
                    {movement.estado}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetail(movement)}
                      className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target"
                      title="Ver detalle"
                    >
                      <Eye size={16} className="description-text" />
                    </button>
                    <button
                      onClick={() => onEdit(movement)}
                      className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target"
                      title="Editar movimiento"
                    >
                      <Edit3 size={16} className="description-text" />
                    </button>
                    <button
                      onClick={() => onDelete(movement.id)}
                      className="p-2 hover:bg-error-100 text-error-600 rounded-lg transition-colors touch-target"
                      title="Eliminar movimiento"
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

export default MovementTable;
