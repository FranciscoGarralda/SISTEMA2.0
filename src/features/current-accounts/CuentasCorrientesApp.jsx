import React, { useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { useCurrentAccounts } from './hooks/useCurrentAccounts';
import ProviderSummary from './components/ProviderSummary';
import ProviderDetail from './components/ProviderDetail';
import { proveedoresCC } from '../../components/forms';

/** COMPONENTE PRINCIPAL DE CUENTAS CORRIENTES - REFACTORIZADO */
function CuentasCorrientesApp({ movements = [] }) {
  const {
    // Estado
    currentView,
    selectedProviderForDetail,
    
    // Datos calculados
    allCalculatedAccounts,
    summaryTotals,
    
    // Acciones
    showProviderDetail,
    backToSummary,
    
    // Utilidades
    hasAccounts,
    accountCount,
    providerCount
  } = useCurrentAccounts(movements);

  // Cuentas a mostrar en la vista de detalle
  const detailedAccounts = useMemo(() => {
    if (!selectedProviderForDetail) return [];
    return allCalculatedAccounts
      .filter(acc => acc.proveedor === selectedProviderForDetail)
      .sort((a, b) => a.moneda.localeCompare(b.moneda));
  }, [allCalculatedAccounts, selectedProviderForDetail]);

  // Totales para la vista de detalle
  const detailedViewTotals = useMemo(() => {
    const totals = {
      ingresos: 0,
      egresos: 0,
      saldo: 0,
      debeUsuario: 0,
      debeProveedor: 0,
      movimientosCount: 0,
      comisionesGeneradas: 0,
    };
    
    detailedAccounts.forEach(account => {
      totals.ingresos += account.ingresos;
      totals.egresos += account.egresos;
      totals.saldo += account.saldo;
      totals.debeUsuario += account.debeUsuario;
      totals.debeProveedor += account.debeProveedor;
      totals.movimientosCount += account.movimientosCount;
      totals.comisionesGeneradas += account.comisionesGeneradas;
    });
    
    return totals;
  }, [detailedAccounts]);

  const getProviderLabel = (providerCode) => {
    const provider = proveedoresCC.find(p => p.value === providerCode);
    return provider ? provider.label : providerCode;
  };

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="">
          <div className="section-header">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-light-surface dark:bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="sm:w-6 sm:h-6 description-text" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                    Cuentas Corrientes
                  </h1>
                  <p className="description-text">
                    {providerCount} proveedor{providerCount !== 1 ? 'es' : ''} • {accountCount} cuenta{accountCount !== 1 ? 's' : ''} activa{accountCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-3 sm:p-4 lg:p-6">
            {currentView === 'summary' ? (
              <ProviderSummary 
                summaryTotals={summaryTotals}
                onSelectProvider={showProviderDetail}
              />
            ) : (
              <ProviderDetail
                provider={selectedProviderForDetail}
                detailedAccounts={detailedAccounts}
                detailedViewTotals={detailedViewTotals}
                onBack={backToSummary}
                getProviderLabel={getProviderLabel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuentasCorrientesApp;