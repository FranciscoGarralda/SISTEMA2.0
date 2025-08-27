import React from 'react';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';

const MovementStats = ({ estadisticas, filteredCount, totalCount }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total de movimientos */}
      <div className="table-header rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="description-text" />
          <span className="text-xs sm:text-sm description-text font-medium">Total Movimientos</span>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold description-text">
          {totalCount}
        </div>
        {filteredCount !== totalCount && (
          <div className="text-xs description-text mt-1">
            {filteredCount} filtrados
          </div>
        )}
      </div>

      {/* Monto total */}
      <div className="bg-success-50 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-success-600" />
          <span className="text-xs sm:text-sm text-success-600 font-medium">Monto Total</span>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-success-600">
          {formatAmountWithCurrency(estadisticas.totalMonto, 'USD')}
        </div>
        <div className="text-xs text-success-600 mt-1">
          Promedio: {formatAmountWithCurrency(estadisticas.promedio, 'USD')}
        </div>
      </div>

      {/* Por tipo */}
      <div className="bg-warning-50 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-warning-600" />
          <span className="text-xs sm:text-sm text-warning-600 font-medium">Por Tipo</span>
        </div>
        <div className="space-y-1">
          {Object.entries(estadisticas.porTipo).map(([tipo, cantidad]) => (
            <div key={tipo} className="flex justify-between text-xs text-warning-700">
              <span className="capitalize">{tipo}:</span>
              <span className="font-medium">{cantidad}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Por estado */}
      <div className="bg-info-50 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-info-600" />
          <span className="text-xs sm:text-sm text-info-600 font-medium">Por Estado</span>
        </div>
        <div className="space-y-1">
          {Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => (
            <div key={estado} className="flex justify-between text-xs text-info-700">
              <span className="capitalize">{estado}:</span>
              <span className="font-medium">{cantidad}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovementStats;
