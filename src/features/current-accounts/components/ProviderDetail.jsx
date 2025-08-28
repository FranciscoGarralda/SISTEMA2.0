import React from 'react';
import { ArrowLeft, Building2, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';

const ProviderDetail = ({ 
  provider, 
  detailedAccounts, 
  detailedViewTotals, 
  onBack,
  getProviderLabel 
}) => {
  if (!provider || !detailedAccounts || detailedAccounts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} className="description-text" />
        </div>
        <p className="description-text font-medium">No hay datos disponibles</p>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
          No se encontraron movimientos para este proveedor
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors duration-200 touch-target"
          aria-label="Volver al resumen"
        >
          <ArrowLeft size={18} className="description-text" />
        </button>
        <div className="w-10 h-10 bg-light-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 size={20} className="text-light-primary dark:text-dark-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold table-cell truncate">
            {getProviderLabel(provider)}
          </h1>
          <p className="description-text">
            {detailedAccounts.length} moneda{detailedAccounts.length !== 1 ? 's' : ''} • {detailedViewTotals.movimientosCount} movimiento{detailedViewTotals.movimientosCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="description-text">
        <button 
          onClick={onBack}
          className="hover:empty-state-text transition-colors"
        >
          Cuentas Corrientes
        </button>
        <span className="mx-2">›</span>
        <span className="empty-state-text font-medium">
          {getProviderLabel(provider)}
        </span>
      </nav>

      {/* Resumen de totales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={16} className="text-success-600" />
              <span className="text-sm text-success-600 font-medium">Total Ingresos</span>
            </div>
            <div className="text-xl font-bold text-success-600">
              {formatAmountWithCurrency(detailedViewTotals.ingresos, 'USD')}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown size={16} className="text-error-600" />
              <span className="text-sm text-error-600 font-medium">Total Egresos</span>
            </div>
            <div className="text-xl font-bold text-error-600">
              {formatAmountWithCurrency(detailedViewTotals.egresos, 'USD')}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign size={16} className="text-warning-600" />
              <span className="text-sm text-warning-600 font-medium">Comisiones</span>
            </div>
            <div className="text-xl font-bold text-warning-600">
              {formatAmountWithCurrency(detailedViewTotals.comisionesGeneradas, 'USD')}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle size={16} className="description-text" />
              <span className="text-sm description-text font-medium">Saldo Total</span>
            </div>
            <div className={`text-xl font-bold ${
              detailedViewTotals.saldo < 0 ? 'text-error-600' : 
              detailedViewTotals.saldo > 0 ? 'text-success-600' : 
              'table-cell'
            }`}>
              {formatAmountWithCurrency(Math.abs(detailedViewTotals.saldo), 'USD')}
            </div>
            <div className="text-xs description-text mt-1">
              {detailedViewTotals.saldo < 0 ? 'Debemos' : 
               detailedViewTotals.saldo > 0 ? 'Nos deben' : 
               'En equilibrio'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de detalles por moneda */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Detalle por Moneda</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell text-left">Moneda</th>
                  <th className="table-cell text-right">Ingresos</th>
                  <th className="table-cell text-right">Egresos</th>
                  <th className="table-cell text-right">Saldo</th>
                  <th className="table-cell text-right">Comisiones</th>
                  <th className="table-cell text-right">Movimientos</th>
                </tr>
              </thead>
              <tbody>
                {detailedAccounts.map((account) => {
                  const hasDebt = account.debeUsuario > 0 || account.debeProveedor > 0;
                  const isUserInDebt = account.debeUsuario > 0;
                  
                  return (
                    <tr key={`${account.proveedor}-${account.moneda}`} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{account.moneda}</span>
                          {hasDebt && (
                            <AlertCircle 
                              size={14} 
                              className={isUserInDebt ? "text-error-600" : "text-warning-600"} 
                            />
                          )}
                        </div>
                      </td>
                      <td className="table-cell text-right">
                        <span className="text-success-600 font-medium">
                          {formatAmountWithCurrency(account.ingresos, account.moneda)}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <span className="text-error-600 font-medium">
                          {formatAmountWithCurrency(account.egresos, account.moneda)}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <div>
                          <span className={`font-bold ${
                            account.saldo < 0 ? 'text-error-600' : 
                            account.saldo > 0 ? 'text-success-600' : 
                            'table-cell'
                          }`}>
                            {formatAmountWithCurrency(Math.abs(account.saldo), account.moneda)}
                          </span>
                          <div className="text-xs description-text">
                            {account.saldo < 0 ? 'Debemos' : 
                             account.saldo > 0 ? 'Nos deben' : 
                             'En equilibrio'}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-right">
                        <span className="text-warning-600 font-medium">
                          {formatAmountWithCurrency(account.comisionesGeneradas, account.moneda)}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <span className="font-medium">
                          {account.movimientosCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
