import React from 'react';
import { TrendingUp, Calendar, DollarSign, Percent, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';

export const ProfitabilitySummary = ({ 
  currentProfitability,
  previousProfitability,
  periodComparison,
  dateRange,
  selectedPeriod,
  selectedMoneda,
  setSelectedMoneda,
  handlePeriodChange
}) => {
  // Top clientes por rentabilidad
  const topClientes = React.useMemo(() => {
    return Object.entries(currentProfitability.porCliente)
      .map(([cliente, data]) => ({ cliente, ...data }))
      .sort((a, b) => b.gananciaTotal - a.gananciaTotal)
      .slice(0, 10);
  }, [currentProfitability]);

  // Función para renderizar métrica con comparación
  const renderMetric = (title, current, previous, format = 'currency', currency = 'PESO') => {
    const change = current - previous;
    const percentage = previous !== 0 ? (change / previous) * 100 : 0;
    const isPositive = change >= 0;

    const formatValue = (value) => {
      if (format === 'currency') {
        return formatAmountWithCurrency(value, currency);
      } else if (format === 'percentage') {
        return `${value.toFixed(2)}%`;
      } else {
        return value.toLocaleString();
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          <div className={`flex items-center gap-1 text-xs ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{Math.abs(percentage).toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(current)}
          </span>
          <span className="text-sm text-gray-500">
            vs {formatValue(previous)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="section-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-light-surface dark:bg-dark-surface rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 description-text" />
              </div>
              <div>
                <h1 className="text-xl font-bold table-cell">Rentabilidad</h1>
                <p className="text-sm description-text">Análisis de ganancias y márgenes</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-3 sm:p-4 space-y-4">
            {/* Botones de período */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePeriodChange('diario')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'diario'
                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                    : 'bg-light-surface dark:bg-dark-surface empty-state-text hover:bg-light-cardHover dark:hover:bg-dark-cardHover'
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => handlePeriodChange('semanal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'semanal'
                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                    : 'bg-light-surface dark:bg-dark-surface empty-state-text hover:bg-light-cardHover dark:hover:bg-dark-cardHover'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => handlePeriodChange('mensual')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'mensual'
                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                    : 'bg-light-surface dark:bg-dark-surface empty-state-text hover:bg-light-cardHover dark:hover:bg-dark-cardHover'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => handlePeriodChange('anual')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'anual'
                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                    : 'bg-light-surface dark:bg-dark-surface empty-state-text hover:bg-light-cardHover dark:hover:bg-dark-cardHover'
                }`}
              >
                Año
              </button>
            </div>

            {/* Rango de fechas */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{dateRange.start} - {dateRange.end}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetric(
            'Ganancia Total',
            periodComparison.gananciaTotal.current,
            periodComparison.gananciaTotal.previous,
            'currency'
          )}
          {renderMetric(
            'Operaciones',
            periodComparison.operaciones.current,
            periodComparison.operaciones.previous,
            'number'
          )}
          {renderMetric(
            'Tasa de Éxito',
            currentProfitability.general.totalOperaciones > 0 
              ? (currentProfitability.general.operacionesRentables / currentProfitability.general.totalOperaciones) * 100
              : 0,
            previousProfitability.general.totalOperaciones > 0
              ? (previousProfitability.general.operacionesRentables / previousProfitability.general.totalOperaciones) * 100
              : 0,
            'percentage'
          )}
          {renderMetric(
            'Margen Promedio',
            currentProfitability.general.margenPromedio,
            previousProfitability.general.margenPromedio,
            'currency'
          )}
        </div>

        {/* Análisis por moneda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Análisis por Moneda
            </h2>
          </div>
          <div className="p-4">
            {Object.keys(currentProfitability.porMoneda).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentProfitability.porMoneda).map(([moneda, data]) => (
                  <div key={moneda} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{moneda}</h3>
                      <span className="text-sm text-gray-500">
                        {data.operaciones} ops
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ganancia:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatAmountWithCurrency(data.gananciaTotal, moneda)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Volumen:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatAmountWithCurrency(data.volumen, moneda)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Margen:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {data.margenPromedio.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay datos de rentabilidad por moneda</p>
              </div>
            )}
          </div>
        </div>

        {/* Top clientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Clientes por Rentabilidad
            </h2>
          </div>
          <div className="p-4">
            {topClientes.length > 0 ? (
              <div className="space-y-3">
                {topClientes.map((cliente, index) => (
                  <div key={cliente.cliente} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {cliente.cliente}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {cliente.operaciones} operaciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatAmountWithCurrency(cliente.gananciaTotal, 'PESO')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Vol: {formatAmountWithCurrency(cliente.volumen, 'PESO')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay datos de clientes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
