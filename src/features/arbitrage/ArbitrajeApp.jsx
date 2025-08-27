import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  AlertCircle,
  Calculator,
  Wallet,
  RefreshCw,
  Download,
  Calendar as CalendarIcon,
  Search,
  User
} from 'lucide-react';
import { formatCurrencyInput, formatAmountWithCurrency } from '../../services/utilityService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { safeParseFloat } from '../../services/utilityService';
import { getTodayLocalDate, getCurrentYearMonth, isCurrentMonth, isToday } from '../../utils/dateUtils';

/** COMPONENTE PRINCIPAL DE ANÁLISIS DE ARBITRAJE */
const ArbitrajeApp = ({ movements = [], onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar movimientos para mostrar solo arbitraje
  const arbitrageMovements = useMemo(() => {
    return movements.filter(mov =>
      mov.operacion === 'ARBITRAJE'
    );
  }, [movements]);

  // Calcular ganancias totales de arbitraje por moneda TC (donde va la comisión)
  const totalArbitrageProfits = useMemo(() => {
    const totals = {};
    arbitrageMovements.forEach(mov => {
      if (mov.profit && safeParseFloat(mov.profit) !== 0) {
        // El profit se calcula en la moneda del TC (donde se deposita la ganancia)
        const currency = mov.monedaProfit || mov.monedaTC || 'ARS';
        totals[currency] = (totals[currency] || 0) + safeParseFloat(mov.profit);
      }
    });
    return totals;
  }, [arbitrageMovements]);

  // Calcular ganancias mensuales de arbitraje para gráficos
  const monthlyArbitrageProfits = useMemo(() => {
    const monthly = {};

    arbitrageMovements.forEach(mov => {
      if (mov.fecha) {
        const date = new Date(mov.fecha);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const currency = mov.moneda;

        if (!monthly[yearMonth]) {
          monthly[yearMonth] = {};
        }
        if (currency) {
          monthly[yearMonth][currency] = (monthly[yearMonth][currency] || 0) + safeParseFloat(mov.profit);
        }
      }
    });

    const chartData = Object.entries(monthly).map(([month, currencies]) => {
      const data = { name: month };
      for (const currency in currencies) {
        data[currency] = currencies[currency];
      }
      return data;
    }).sort((a, b) => a.name.localeCompare(b.name));

    return chartData;
  }, [arbitrageMovements]);

  // Calcular ganancias del mes actual
  const currentMonthArbitrageProfits = useMemo(() => {
    const currentYearMonth = getCurrentYearMonth();
    const monthly = {};

    arbitrageMovements.forEach(mov => {
      if (mov.fecha && isCurrentMonth(mov.fecha)) {
        const currency = mov.moneda;
        if (currency) {
          monthly[currency] = (monthly[currency] || 0) + safeParseFloat(mov.profit);
        }
      }
    });
    return monthly;
  }, [arbitrageMovements]);

  // Calcular ganancias de hoy
  const todayArbitrageProfits = useMemo(() => {
    const today = getTodayLocalDate();
    const daily = {};

    arbitrageMovements.forEach(mov => {
      if (isToday(mov.fecha)) {
        const currency = mov.moneda;
        if (currency) {
          daily[currency] = (daily[currency] || 0) + safeParseFloat(mov.profit);
        }
      }
    });
    return daily;
  }, [arbitrageMovements]);

  // Obtener todas las monedas en arbitraje
  const allCurrenciesInArbitrage = useMemo(() => {
    const currencies = new Set();
    arbitrageMovements.forEach(mov => {
      if (mov.moneda) {
        currencies.add(mov.moneda);
      }
    });
    return Array.from(currencies).sort();
  }, [arbitrageMovements]);

  // Filtrar movimientos de arbitraje por búsqueda
  const filteredArbitrageMovements = useMemo(() => {
    if (!searchTerm) {
      return arbitrageMovements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return arbitrageMovements.filter(mov =>
      (mov.cliente && mov.cliente.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (mov.detalle && mov.detalle.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (mov.moneda && mov.moneda.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (mov.cuenta && mov.cuenta.toLowerCase().includes(lowerCaseSearchTerm))
    ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [arbitrageMovements, searchTerm]);

  // Función para obtener colores para cada moneda
  const getArbitrageColor = (currency, index) => {
    const colors = [
      '#8B5CF6', // Violeta
      '#A855F7', // Púrpura
      '#9333EA', // Violeta oscuro
      '#7C3AED', // Índigo violeta
      '#6D28D9', // Púrpura oscuro
      '#5B21B6', // Violeta profundo
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
      <div className="w-full px-2 sm:px-3 lg:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="">
          <div className="section-header">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-light-surface dark:bg-dark-surface rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRightLeft size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 description-text" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="main-title truncate">
                    Análisis de Arbitraje
                  </h1>
                  <p className="description-text">
                    Dashboard de operaciones de arbitraje • {arbitrageMovements.length} operacion{arbitrageMovements.length !== 1 ? 'es' : ''} registrada{arbitrageMovements.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('nuevoMovimiento', {
                  operacion: 'TRANSACCIONES',
                  subOperacion: 'ARBITRAJE'
                })}
                className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto"
              >
                <ArrowRightLeft size={18} />
                <span>Nuevo Arbitraje</span>
              </button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title">
              Métricas Principales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {renderMetricCard(
                'Ganancias Totales por Arbitraje',
                totalArbitrageProfits,
                'table-header',
                'empty-state-text',
                'border-light-border dark:border-dark-border',
                Wallet,
                'Acumulado histórico'
              )}

              {renderMetricCard(
                'Ganancias del Mes Actual',
                currentMonthArbitrageProfits,
                'table-header',
                'empty-state-text',
                'border-light-border dark:border-dark-border',
                CalendarIcon,
                'Mes en curso'
              )}

              {renderMetricCard(
                'Ganancias de Hoy',
                todayArbitrageProfits,
                'bg-violet-50',
                'text-violet-700',
                'border-violet-500',
                RefreshCw,
                'Día actual'
              )}
            </div>
          </div>
        </div>

        {/* Gráfico de ganancias mensuales por arbitraje */}
        <div className="">
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title mb-4 sm:mb-6 flex items-center gap-2">
              <ArrowRightLeft size={18} className="description-text flex-shrink-0" />
              <span>Tendencia de Ganancias Mensuales por Arbitraje</span>
            </h2>

            {monthlyArbitrageProfits.length > 0 ? (
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyArbitrageProfits}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${month}/${year.substring(2)}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Legend />
                    {allCurrenciesInArbitrage.map((currency, index) => (
                      <Bar
                        key={currency}
                        dataKey={currency}
                        stackId="a"
                        fill={getArbitrageColor(currency, index)}
                        name={currency}
                        radius={index === allCurrenciesInArbitrage.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <ArrowRightLeft size={40} className="sm:w-12 sm:h-12 mx-auto empty-state-text mb-3 sm:mb-4" />
                {searchTerm ? (
                  <div>
                    <p className="text-sm sm:text-base empty-state-text mb-2">
                      No se encontraron operaciones de arbitraje que coincidan con "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="description-text hover:empty-state-text text-sm underline"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                ) : arbitrageMovements.length === 0 ? (
                  <div>
                    <p className="text-sm sm:text-base empty-state-text mb-4">No hay operaciones de arbitraje registradas</p>
                    <p className="text-xs sm:text-sm description-text">
                      Las operaciones de arbitraje aparecerán aquí cuando se registren transacciones de tipo "ARBITRAJE"
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base empty-state-text">Todas las operaciones de arbitraje están ocultas por el filtro actual</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lista de movimientos de arbitraje */}
        <div className="">
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title mb-4 sm:mb-6 flex items-center gap-2">
              <ArrowRightLeft size={18} className="description-text flex-shrink-0" />
              <span>Operaciones de Arbitraje</span>
            </h2>

            {/* Barra de búsqueda */}
            <div className="relative">
              <CalendarIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 description-text" />
              <input
                type="text"
                placeholder="Buscar operación de arbitraje por cliente, detalle, moneda o cuenta..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 form-input focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Indicador de búsqueda activa */}
            {searchTerm && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <span className="text-xs sm:text-sm description-text">Búsqueda activa:</span>
                <span className="px-2 py-1 bg-gray-100 empty-state-text rounded-full text-xs">
                  "{searchTerm}"
                </span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs empty-state-text hover:empty-state-text underline ml-2"
                >
                  Limpiar
                </button>
              </div>
            )}

            {/* Lista de operaciones */}
            <div className="space-y-3 sm:space-y-4">
              {filteredArbitrageMovements.length > 0 ? (
                filteredArbitrageMovements.map((mov) => (
                  <div key={mov.id} className="bg-gradient-to-r from-light-surface to-light-cardHover dark:from-dark-surface dark:to-dark-cardHover rounded-xl border border-light-border dark:border-dark-border p-3 sm:p-4 hover:shadow-medium transition-all duration-200">
                    {/* Header de la operación */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm description-text mb-2">
                          <CalendarIcon size={12} />
                          <span>
                            {mov.fecha ? new Date(mov.fecha + 'T12:00:00').toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              weekday: 'short'
                            }) : 'Sin fecha'}
                          </span>
                        </div>

                        <h3 className="font-semibold table-cell text-sm sm:text-base flex items-center gap-2 truncate">
                          <Wallet size={16} className="text-light-textSecondary dark:text-dark-textSecondary flex-shrink-0" />
                          <span className="truncate">{mov.cliente || 'Sin Cliente'}</span>
                        </h3>
                      </div>

                      {/* Ganancia destacada */}
                      <div className="text-right flex-shrink-0 mt-2 sm:mt-0">
                        <p className="text-sm description-text mb-2">Ganancia</p>
                        <p className="font-bold text-lg sm:text-xl empty-state-text">
                          {formatAmountWithCurrency(safeParseFloat(mov.profit), mov.monedaProfit || mov.monedaTC || 'ARS')}
                        </p>
                      </div>
                    </div>

                    {/* Detalles de la operación */}
                    <div className="bg-light-card dark:bg-dark-card rounded-lg p-3 space-y-2">
                      {mov.detalle && (
                        <div>
                          <span className="text-xs font-medium description-text">Detalle:</span>
                          <p className="text-sm description-text break-words">{mov.detalle}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs">
                        <div>
                          <span className="font-medium description-text">Moneda Base:</span>
                          <p className="description-text">{mov.moneda || 'N/A'}</p>
                        </div>

                        {mov.monto && (
                          <div>
                            <span className="font-medium description-text">Monto Compra:</span>
                            <p className="description-text">{formatAmountWithCurrency(mov.monto, mov.moneda)}</p>
                          </div>
                        )}

                        {mov.montoVenta && (
                          <div>
                            <span className="font-medium description-text">Monto Venta:</span>
                            <p className="description-text">{formatAmountWithCurrency(mov.montoVenta, mov.monedaVenta || mov.moneda)}</p>
                          </div>
                        )}

                        <div>
                          <span className="font-medium description-text">Cuenta Comisión:</span>
                          <p className="description-text">{mov.cuenta || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Información adicional de arbitraje */}
                      {(mov.tc || mov.tcVenta) && (
                        <div className="border-t pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                            {mov.tc && (
                              <div>
                                <span className="font-medium description-text">TC Compra:</span>
                                <p className="description-text">{mov.tc} {mov.monedaTC && `(${mov.monedaTC})`}</p>
                              </div>
                            )}
                            {mov.tcVenta && (
                              <div>
                                <span className="font-medium description-text">TC Venta:</span>
                                <p className="description-text">{mov.tcVenta} {mov.monedaTCVenta && `(${mov.monedaTCVenta})`}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Estado de la operación */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-light-border dark:border-dark-border gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mov.estado === 'realizado'
                          ? 'bg-success-100 text-success-700'
                          : mov.estado === 'pendiente'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-light-surface dark:bg-dark-surface empty-state-text'
                      }`}>
                        {mov.estado || 'Sin estado'}
                      </span>

                      <div className="flex items-center gap-2 text-xs empty-state-text">
                        <span>Por: {mov.por || 'N/A'}</span>
                        {mov.nombreOtro && <span>({mov.nombreOtro})</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p className="text-sm sm:text-base empty-state-text mb-4">No hay operaciones de arbitraje registradas</p>
                  <p className="text-xs sm:text-sm description-text">
                    Las operaciones de arbitraje aparecerán aquí cuando se registren transacciones de tipo "ARBITRAJE"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional y KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="section-title mb-3 sm:mb-4 flex items-center gap-2">
                <Wallet size={16} className="description-text" />
                Resumen de Arbitraje
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm description-text">Total de operaciones:</span>
                  <span className="font-semibold table-cell text-sm sm:text-base">{arbitrageMovements.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm description-text">Monedas operadas:</span>
                  <span className="font-semibold table-cell text-sm sm:text-base">{allCurrenciesInArbitrage.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm description-text">Operaciones este mes:</span>
                  <span className="font-semibold table-cell text-sm sm:text-base">
                    {arbitrageMovements.filter(mov =>
                      mov.fecha && isCurrentMonth(mov.fecha)
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm description-text">Meses con actividad:</span>
                  <span className="font-semibold table-cell text-sm sm:text-base">{monthlyArbitrageProfits.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm description-text">Promedio ganancia/operación:</span>
                  <span className="font-semibold table-cell text-sm sm:text-base">
                    {arbitrageMovements.length > 0
                      ? (Object.values(totalArbitrageProfits).reduce((a, b) => a + b, 0) / arbitrageMovements.length).toFixed(2)
                      : '0'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="section-title mb-3 sm:mb-4 flex items-center gap-2">
                <Calculator size={16} className="text-light-success dark:text-dark-success" />
                Optimización de Arbitraje
              </h3>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm description-text">
                <p>• Identificar oportunidades frecuentes de arbitraje</p>
                <p>• Analizar márgenes de ganancia por par de monedas</p>
                <p>• Optimizar timing de operaciones</p>
                <p>• Evaluar costos de transacción vs beneficios</p>
                <p>• Monitorear tendencias de volatilidad</p>
                <p>• Diversificar entre diferentes mercados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estado vacío si no hay arbitrajes */}
        {arbitrageMovements.length === 0 && (
          <div className="">
            <div className="p-6 sm:p-8 lg:p-12 text-center">
              <AlertCircle size={48} className="sm:w-16 sm:h-16 mx-auto empty-state-text mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold empty-state-text mb-4">
                No hay operaciones de arbitraje registradas
              </h3>
              <p className="text-sm sm:text-base empty-state-text mb-6">
                Las operaciones de arbitraje aparecerán aquí cuando se registren transacciones que generen ganancias por diferencias de precios.
              </p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArbitrajeApp;