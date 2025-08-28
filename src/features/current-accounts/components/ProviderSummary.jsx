import React from 'react';
import { Building2, ChevronRight, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';

const ProviderSummary = ({ summaryTotals, onSelectProvider }) => {
  if (!summaryTotals || summaryTotals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} className="description-text" />
        </div>
        <p className="description-text font-medium">No hay cuentas corrientes activas</p>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
          Las cuentas aparecerán aquí cuando se registren movimientos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaryTotals.map((provider) => {
        const hasDebt = provider.totalDebeUsuario > 0 || provider.totalDebeProveedor > 0;
        const isUserInDebt = provider.totalDebeUsuario > 0;
        
        return (
          <div 
            key={provider.proveedor}
            className="card hover:shadow-medium transition-all duration-200 cursor-pointer"
            onClick={() => onSelectProvider(provider.proveedor)}
          >
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-light-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-light-primary dark:text-dark-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold table-cell truncate">
                      {provider.proveedorLabel}
                    </h3>
                    <p className="text-sm description-text">
                      {provider.cuentas.length} cuenta{provider.cuentas.length !== 1 ? 's' : ''} • {provider.totalMovimientos} movimientos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Indicador de deuda */}
                  {hasDebt && (
                    <div className="flex items-center gap-2">
                      <AlertCircle 
                        size={16} 
                        className={isUserInDebt ? "text-error-600" : "text-warning-600"} 
                      />
                      <span className={`text-sm font-medium ${
                        isUserInDebt ? "text-error-600" : "text-warning-600"
                      }`}>
                        {isUserInDebt ? "Debemos" : "Nos deben"}
                      </span>
                    </div>
                  )}

                  {/* Saldo total */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      provider.totalSaldo < 0 ? 'text-error-600' : 
                      provider.totalSaldo > 0 ? 'text-success-600' : 
                      'table-cell'
                    }`}>
                      {formatAmountWithCurrency(Math.abs(provider.totalSaldo), 'USD')}
                    </div>
                    <div className="text-xs description-text">
                      {provider.totalSaldo < 0 ? 'Debemos' : 
                       provider.totalSaldo > 0 ? 'Nos deben' : 
                       'En equilibrio'}
                    </div>
                  </div>

                  <ChevronRight size={20} className="description-text" />
                </div>
              </div>

              {/* Métricas adicionales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp size={14} className="text-success-600" />
                    <span className="text-xs text-success-600 font-medium">Ingresos</span>
                  </div>
                  <div className="text-sm font-semibold text-success-600">
                    {formatAmountWithCurrency(provider.totalIngresos, 'USD')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown size={14} className="text-error-600" />
                    <span className="text-xs text-error-600 font-medium">Egresos</span>
                  </div>
                  <div className="text-sm font-semibold text-error-600">
                    {formatAmountWithCurrency(provider.totalEgresos, 'USD')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign size={14} className="text-warning-600" />
                    <span className="text-xs text-warning-600 font-medium">Comisiones</span>
                  </div>
                  <div className="text-sm font-semibold text-warning-600">
                    {formatAmountWithCurrency(provider.totalComisiones, 'USD')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 size={14} className="description-text" />
                    <span className="text-xs description-text font-medium">Monedas</span>
                  </div>
                  <div className="text-sm font-semibold table-cell">
                    {provider.cuentas.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProviderSummary;
