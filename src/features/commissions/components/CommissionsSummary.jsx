import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CalendarDays,
  Search,
  Building2,
  PieChart,
  BarChart3,
  Target,
  TrendingDown,
  Calculator,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { FormInput, formatAmountWithCurrency } from '../../../components/forms';
import { getTodayLocalDate, getCurrentYearMonth, isCurrentMonth, isToday } from '../../../utils/dateUtils';

export const CommissionsSummary = ({ 
  commissionMovements,
  totalCommissions,
  totalProviderCommissions,
  monthlyCommissions,
  dailyCommissionsForSelectedDate,
  commissionsByProvider,
  commissionsByOperation,
  commissionStats,
  selectedDate,
  setSelectedDate
}) => {
  // Calcular comisiones del mes actual
  const currentMonthCommissions = React.useMemo(() => {
    const currentMonth = getCurrentYearMonth();
    const monthly = {};
    commissionMovements.forEach(mov => {
      if (mov.fecha) {
        const date = new Date(mov.fecha);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (yearMonth === currentMonth) {
          const currency = mov.monedaComision || mov.moneda;
          if (currency) {
            monthly[currency] = (monthly[currency] || 0) + parseFloat(mov.comision || 0);
          }
        }
      }
    });
    return monthly;
  }, [commissionMovements]);

  // Calcular comisiones de hoy
  const todayCommissions = React.useMemo(() => {
    const today = getTodayLocalDate();
    const daily = {};
    commissionMovements.forEach(mov => {
      if (mov.fecha === today) {
        const currency = mov.monedaComision || mov.moneda;
        if (currency) {
          daily[currency] = (daily[currency] || 0) + parseFloat(mov.comision || 0);
        }
      }
    });
    return daily;
  }, [commissionMovements]);

  // Función para renderizar tarjeta de métrica
  const renderMetricCard = (title, data, bgColor, textColor, borderColor, icon) => (
    <div className={`card ${bgColor} ${borderColor} border-l-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            {React.createElement(icon, { size: 20, className: `${textColor} opacity-80 flex-shrink-0` })}
            <h3 className={`text-sm font-semibold ${textColor} truncate`}>{title}</h3>
          </div>
          {Object.entries(data).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(data).map(([currency, amount]) => (
                <p key={currency} className={`text-lg sm:text-xl font-bold ${textColor} truncate`}>
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
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-success-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="main-title truncate">
                    Análisis de Comisiones
                  </h1>
                  <p className="description-text">
                    Dashboard completo de ingresos por comisiones • {commissionMovements.length} movimiento{commissionMovements.length !== 1 ? 's' : ''} con comisión
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title">
              Métricas Principales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {renderMetricCard(
                'Comisión Total Histórica',
                totalCommissions,
                'table-header',
                'empty-state-text',
                'border-gray-500',
                Target
              )}
              
              {renderMetricCard(
                'Comisión del Mes Actual',
                currentMonthCommissions,
                'bg-success-50',
                'text-success-700',
                'border-success-500',
                CalendarDays
              )}

              {renderMetricCard(
                'Comisión de Hoy',
                todayCommissions,
                'bg-warning-50',
                'text-warning-700',
                'border-warning-500',
                Clock
              )}
            </div>

            {/* Métricas por tipo */}
            <h3 className="text-sm font-semibold description-text mb-4">Comisiones por Tipo</h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {renderMetricCard(
                'Proveedores CC',
                totalProviderCommissions,
                'bg-purple-50',
                'text-purple-700',
                'border-purple-500',
                Building2
              )}
            </div>
          </div>
        </div>

        {/* Buscador de comisiones por día */}
        <div className="">
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title">
              Comisiones por Día
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium description-text mb-2">
                  Seleccionar Fecha
                </label>
                <FormInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                  placeholder="Seleccionar fecha..."
                />
              </div>
            </div>

            {selectedDate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMetricCard(
                  `Comisiones del ${selectedDate}`,
                  dailyCommissionsForSelectedDate,
                  'bg-blue-50',
                  'text-blue-700',
                  'border-blue-500',
                  CalendarDays
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de comisiones mensuales */}
        {monthlyCommissions.length > 0 && (
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6">
              <h2 className="section-title">
                Evolución Mensual de Comisiones
              </h2>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyCommissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    {Object.keys(totalCommissions).map((currency, index) => (
                      <Bar 
                        key={currency} 
                        dataKey={currency} 
                        fill={index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : '#8B5CF6'} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Comisiones por proveedor */}
        {Object.keys(commissionsByProvider).length > 0 && (
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6">
              <h2 className="section-title">
                Comisiones por Proveedor
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(commissionsByProvider).map(([provider, currencies]) => (
                  <div key={provider} className="card">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 size={16} className="text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 truncate">{provider}</h3>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(currencies).map(([currency, amount]) => (
                        <p key={currency} className="text-lg font-bold text-green-600">
                          {formatAmountWithCurrency(amount, currency)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comisiones por operación */}
        {Object.keys(commissionsByOperation).length > 0 && (
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6">
              <h2 className="section-title">
                Comisiones por Tipo de Operación
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(commissionsByOperation).map(([operation, currencies]) => (
                  <div key={operation} className="card">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator size={16} className="text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 truncate">{operation}</h3>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(currencies).map(([currency, amount]) => (
                        <p key={currency} className="text-lg font-bold text-blue-600">
                          {formatAmountWithCurrency(amount, currency)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
