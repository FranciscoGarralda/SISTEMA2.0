import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  Wallet,
  BarChart3,
  PieChart,
  Calculator,
  Calendar,
  Search,
  Package,
  TrendingDown,
  Activity,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { FormInput, formatAmountWithCurrency } from '../../../components/forms';
import { getTodayLocalDate, getCurrentYearMonth, isCurrentMonth, isToday } from '../../../utils/dateUtils';

export const UtilitySummary = ({ 
  utilityStats,
  totalUtilityCombined,
  monthlyUtilityCombined,
  dailyUtilityCombined,
  finalStockData,
  selectedDate,
  setSelectedDate,
  onNavigate
}) => {
  // Utilidad para fecha seleccionada - solo VENTA por divisa
  const dailyUtilityForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return { venta: {} };
    const dailyVenta = {};

    // Filtrar movimientos de la fecha seleccionada
    // Esta lógica se maneja en el hook principal
    return { venta: dailyVenta };
  }, [selectedDate]);

  // Utilidad del mes actual - solo VENTA por divisa
  const currentMonthUtility = React.useMemo(() => {
    const currentYearMonth = getCurrentYearMonth();
    const monthlyVenta = {};

    // Filtrar movimientos del mes actual
    // Esta lógica se maneja en el hook principal
    return { venta: monthlyVenta };
  }, []);

  // Utilidad de hoy - solo VENTA por divisa
  const todayUtility = React.useMemo(() => {
    const today = getTodayLocalDate();
    const dailyVenta = {};

    // Filtrar movimientos de hoy
    // Esta lógica se maneja en el hook principal
    return { venta: dailyVenta };
  }, []);

  // Obtener todas las divisas de utilidad
  const allCurrenciesInUtility = React.useMemo(() => {
    const currencies = new Set();
    Object.keys(totalUtilityCombined).forEach(currency => {
      currencies.add(currency);
    });
    return Array.from(currencies).sort();
  }, [totalUtilityCombined]);

  // Función para obtener colores para cada moneda/tipo
  const getUtilityColor = (currencyType, index) => {
    const colors = [
      '#10B981', // Verde para VENTA
      '#374151', // Gris oscuro para ARBITRAJE
      '#F59E0B', // Amarillo
      '#EF4444', // Rojo
      '#8B5CF6', // Violeta
      '#F97316', // Naranja
    ];
    return colors[index % colors.length];
  };

  // Función para renderizar cards de métricas
  const renderMetricCard = (title, data, bgColor, textColor, borderColor, icon, subtitle = '') => (
    <div className={`card ${bgColor} border-l-4 ${borderColor} p-4 sm:p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {React.createElement(icon, { size: 20, className: `${textColor} opacity-80 flex-shrink-0` })}
            <h3 className={`text-sm font-semibold ${textColor} truncate`}>{title}</h3>
          </div>
          {subtitle && (
            <p className={`text-sm ${textColor} opacity-75 mb-2`}>{subtitle}</p>
          )}
          {Object.entries(data).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(data).map(([currency, amount]) => (
                <p key={currency} className={`text-lg sm:text-xl font-bold ${amount < 0 ? 'text-error-600' : textColor} truncate`}>
                  {formatAmountWithCurrency(amount, currency)}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base sm:text-lg empty-state-text font-medium">Sin datos</p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${bgColor} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
          {React.createElement(icon, { size: 20, className: `sm:w-6 sm:h-6 ${textColor} opacity-40` })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="">
          <div className="section-header">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="sm:w-6 sm:h-6 text-success-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                    Análisis de Utilidad
                  </h1>
                  <p className="description-text">
                    {utilityStats.totalMovements} transacciones procesadas
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('nuevoMovimiento')} 
                className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto"
              >
                <Calculator size={18} />
                <span>Nueva Transacción</span>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Filtro de fecha */}
            <div className="filter-section">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="description-text" />
                  <label className="text-sm font-medium empty-state-text">
                    Filtrar por fecha:
                  </label>
                </div>
                <FormInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="btn-secondary text-sm"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Métricas principales */}
            <div className="metrics-grid">
              <h2 className="section-title">
                Resumen de Utilidad
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Utilidad Total */}
                {renderMetricCard(
                  'Utilidad Total',
                  totalUtilityCombined,
                  'bg-success-50',
                  'text-success-700',
                  'border-success-500',
                  TrendingUp,
                  'Ganancia acumulada por ventas'
                )}

                {/* Utilidad de Hoy */}
                {renderMetricCard(
                  'Utilidad de Hoy',
                  todayUtility.venta,
                  'bg-blue-50',
                  'text-blue-700',
                  'border-blue-500',
                  Activity,
                  'Ganancia del día actual'
                )}

                {/* Utilidad del Mes */}
                {renderMetricCard(
                  'Utilidad del Mes',
                  currentMonthUtility.venta,
                  'bg-purple-50',
                  'text-purple-700',
                  'border-purple-500',
                  Calendar,
                  'Ganancia del mes actual'
                )}

                {/* Utilidad por Fecha Seleccionada */}
                {selectedDate && renderMetricCard(
                  'Utilidad por Fecha',
                  dailyUtilityForSelectedDate.venta,
                  'bg-warning-50',
                  'text-warning-700',
                  'border-warning-500',
                  Target,
                  `Ganancia del ${selectedDate}`
                )}
              </div>
            </div>

            {/* Gráficos */}
            <div className="charts-section">
              <h2 className="section-title">
                Análisis Gráfico
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico mensual */}
                <div className="chart-card">
                  <h3 className="chart-title flex items-center gap-2">
                    <BarChart3 size={18} />
                    Utilidad Mensual
                  </h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyUtilityCombined}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Legend />
                        {allCurrenciesInUtility.map((currency, index) => (
                          <Bar
                            key={`${currency}_VENTA`}
                            dataKey={`${currency}_VENTA`}
                            fill={getUtilityColor('VENTA', index)}
                            name={`${currency} - Venta`}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico diario */}
                <div className="chart-card">
                  <h3 className="chart-title flex items-center gap-2">
                    <Activity size={18} />
                    Utilidad Diaria
                  </h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dailyUtilityCombined}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Legend />
                        {allCurrenciesInUtility.map((currency, index) => (
                          <Bar
                            key={`${currency}_VENTA`}
                            dataKey={`${currency}_VENTA`}
                            fill={getUtilityColor('VENTA', index)}
                            name={`${currency} - Venta`}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock actual */}
            <div className="stock-section">
              <h2 className="section-title">
                Stock Actual
              </h2>
              
              {Object.keys(finalStockData).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Object.entries(finalStockData).map(([currency, stock]) => (
                    <div key={currency} className="stock-card">
                      <div className="stock-header">
                        <div className="stock-icon">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <div className="stock-info">
                          <h3 className="stock-currency">{currency}</h3>
                          <p className="stock-quantity">
                            Cantidad: {stock.cantidad.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="stock-details">
                        <div className="stock-metric">
                          <span className="metric-label">Costo Promedio:</span>
                          <span className="metric-value">
                            {formatAmountWithCurrency(stock.costoPromedio, stock.monedaTCAsociada)}
                          </span>
                        </div>
                        <div className="stock-metric">
                          <span className="metric-label">Costo Total:</span>
                          <span className="metric-value">
                            {formatAmountWithCurrency(stock.totalCostoEnMonedaTC, stock.monedaTCAsociada)}
                          </span>
                        </div>
                        <div className="stock-metric">
                          <span className="metric-label">Utilidad por Venta:</span>
                          <span className="metric-value">
                            {formatAmountWithCurrency(stock.utilidadPorVenta, stock.monedaTCAsociada)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  <h3 className="empty-state-title">No hay stock disponible</h3>
                  <p className="empty-state-description">
                    No se han registrado transacciones de compra/venta.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
