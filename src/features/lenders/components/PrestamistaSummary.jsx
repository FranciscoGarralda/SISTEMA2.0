import React from 'react';
import { CreditCard, ArrowRight, DollarSign, TrendingUp, Calendar, User } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';

export const PrestamistaSummary = ({ 
  prestamistaSummary, 
  onViewDetail, 
  onNavigate 
}) => {
  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="">
          <div className="section-header">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard size={20} className="sm:w-6 sm:h-6 text-warning-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                    Gestión de Prestamistas
                  </h1>
                  <p className="description-text">
                    {prestamistaSummary.length} prestamista{prestamistaSummary.length !== 1 ? 's' : ''} registrado{prestamistaSummary.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('nuevoMovimiento', {
                  operacion: 'PRESTAMISTAS'
                })} 
                className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto"
              >
                <CreditCard size={18} />
                <span>Nuevo Préstamo</span>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-3 sm:p-4 lg:p-6">
            <h2 className="section-title">
              Resumen de Prestamistas
            </h2>

            {prestamistaSummary.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CreditCard size={48} className="text-gray-400" />
                </div>
                <h3 className="empty-state-title">No hay prestamistas registrados</h3>
                <p className="empty-state-description">
                  Comienza agregando un nuevo prestamista para gestionar préstamos.
                </p>
                <button 
                  onClick={() => onNavigate('clientes')}
                  className="btn-primary"
                >
                  Agregar Prestamista
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {prestamistaSummary.map(({ client, summary }) => {
                  if (!summary) return null;

                  const currencies = Object.keys(summary.netBalance);
                  const totalNetBalance = currencies.reduce((total, currency) => {
                    return total + (summary.netBalance[currency] || 0);
                  }, 0);

                  return (
                    <div key={client.id} className="prestamista-card">
                      <div className="prestamista-card-header">
                        <div className="prestamista-info">
                          <div className="prestamista-avatar">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <div className="prestamista-details">
                            <h3 className="prestamista-name">
                              {client.nombre} {client.apellido}
                            </h3>
                            <p className="prestamista-phone">
                              {client.telefono || 'Sin teléfono'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onViewDetail(client)}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <span>Ver Detalle</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      <div className="prestamista-stats">
                        <div className="stat-item">
                          <div className="stat-icon">
                            <DollarSign size={16} className="text-green-600" />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Balance Neto</span>
                            <span className="stat-value">
                              {currencies.map(currency => (
                                <span key={currency} className="currency-amount">
                                  {formatAmountWithCurrency(summary.netBalance[currency] || 0, currency)}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>

                        <div className="stat-item">
                          <div className="stat-icon">
                            <TrendingUp size={16} className="text-blue-600" />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Intereses Acumulados</span>
                            <span className="stat-value">
                              {currencies.map(currency => (
                                <span key={currency} className="currency-amount">
                                  {formatAmountWithCurrency(summary.totalAccruedInterest[currency] || 0, currency)}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>

                        <div className="stat-item">
                          <div className="stat-icon">
                            <Calendar size={16} className="text-purple-600" />
                          </div>
                          <div className="stat-content">
                            <span className="stat-label">Movimientos</span>
                            <span className="stat-value">
                              {summary.movimientosCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
