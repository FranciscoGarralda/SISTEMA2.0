import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Hash
} from 'lucide-react';
import { formatAmountWithCurrency } from '../../../components/forms';
import { safeParseFloat } from '../../../services/utilityService';

export const PrestamistaDetail = ({ 
  prestamista, 
  movements = [], 
  clients = [], 
  onBack 
}) => {
  // Procesar movimientos para mostrar balance acumulado
  const processedMovements = useMemo(() => {
    const allMovements = movements;
    const clientFullName = `${prestamista.nombre} ${prestamista.apellido}`;
    
    // Filtrar movimientos del prestamista
    const prestamistaMovements = allMovements
      .filter(mov => 
        mov.operacion === 'PRESTAMISTAS' && 
        (mov.cliente === prestamista.nombre || mov.cliente === clientFullName)
      )
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const balancesByCurrency = {};
    const movementsWithRunningBalance = [];
    const finalBalances = {};

    // Procesar cada movimiento cronológicamente
    prestamistaMovements.forEach(mov => {
      const currency = mov.moneda;
      if (!balancesByCurrency[currency]) {
        balancesByCurrency[currency] = { 
          principal: 0, 
          interestAccrued: 0, 
          lastCalculationDate: new Date(0), 
          effectiveRate: 0 
        };
      }

      const currentBalance = balancesByCurrency[currency];
      const movementDate = new Date(mov.fecha);

      // Acumular intereses hasta la fecha del movimiento actual
      if (currentBalance.principal > 0 && currentBalance.effectiveRate > 0) {
        const daysToAccrue = Math.ceil(
          (movementDate.getTime() - currentBalance.lastCalculationDate.getTime()) / (1000 * 3600 * 24)
        );
        if (daysToAccrue > 0) {
          currentBalance.interestAccrued += 
            currentBalance.principal * (currentBalance.effectiveRate / 100 / 365) * daysToAccrue;
        }
      }

      // Aplicar el movimiento
      if (mov.subOperacion === 'PRESTAMO') {
        const amount = safeParseFloat(mov.monto, 0);
        currentBalance.principal += amount;
        const newRate = safeParseFloat(mov.interes, 0);
        if (newRate > 0) {
          currentBalance.effectiveRate = newRate;
        }
      } else if (mov.subOperacion === 'RETIRO') {
        const amount = safeParseFloat(mov.monto, 0);
        if (currentBalance.interestAccrued >= amount) {
          currentBalance.interestAccrued -= amount;
        } else {
          const remainingAmount = amount - currentBalance.interestAccrued;
          currentBalance.interestAccrued = 0;
          currentBalance.principal = Math.max(0, currentBalance.principal - remainingAmount);
        }
      }
      
      currentBalance.lastCalculationDate = movementDate;

      // Agregar movimiento con balance acumulado
      movementsWithRunningBalance.push({
        ...mov,
        runningBalance: {
          principal: currentBalance.principal,
          interestAccrued: currentBalance.interestAccrued,
          netBalance: currentBalance.principal + currentBalance.interestAccrued,
          effectiveRate: currentBalance.effectiveRate,
        }
      });
    });

    // Calcular balances finales
    const today = new Date();
    for (const currency in balancesByCurrency) {
      const balance = balancesByCurrency[currency];
      if (balance.principal > 0 && balance.effectiveRate > 0) {
        const daysToAccrue = Math.ceil(
          (today.getTime() - balance.lastCalculationDate.getTime()) / (1000 * 3600 * 24)
        );
        if (daysToAccrue > 0) {
          balance.interestAccrued += 
            balance.principal * (balance.effectiveRate / 100 / 365) * daysToAccrue;
        }
      }
      
      finalBalances[currency] = {
        principal: balance.principal,
        interestAccrued: balance.interestAccrued,
        netBalance: balance.principal + balance.interestAccrued,
        effectiveRate: balance.effectiveRate,
      };
    }

    return {
      movements: movementsWithRunningBalance.reverse(), // Mostrar más recientes primero
      finalBalances: finalBalances,
    };
  }, [prestamista, movements, clients]);

  const finalBalances = processedMovements.finalBalances;

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        {/* Header con navegación */}
        <div className="">
          <div className="section-header">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-target flex-shrink-0"
                aria-label="Volver al resumen"
              >
                <ArrowLeft size={18} className="description-text" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="sm:w-6 sm:h-6 text-warning-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold table-cell truncate">
                  {prestamista.nombre} {prestamista.apellido}
                </h1>
                <p className="description-text">
                  Detalle completo de préstamos e intereses
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="description-text">
              <button 
                onClick={onBack}
                className="hover:empty-state-text transition-colors"
              >
                Prestamistas
              </button>
              <span className="mx-2">›</span>
              <span className="empty-state-text font-medium">
                {prestamista.nombre} {prestamista.apellido}
              </span>
            </nav>
          </div>

          {/* Contenido del detalle */}
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Métricas principales */}
            {Object.keys(finalBalances).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(finalBalances).map(([currency, balance]) => (
                  <React.Fragment key={currency}>
                    <div className="empty-state text-center">
                      <DollarSign size={18} className="description-text mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium empty-state-text">Principal Pendiente ({currency})</p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold description-text">
                        {formatAmountWithCurrency(balance.principal, currency)}
                      </p>
                      {balance.effectiveRate > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tasa: {balance.effectiveRate}% anual
                        </p>
                      )}
                    </div>
                    <div className="bg-warning-50 p-3 sm:p-4 rounded-lg text-center">
                      <TrendingUp size={18} className="text-warning-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium empty-state-text">Interés Acumulado ({currency})</p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-warning-600">
                        {formatAmountWithCurrency(balance.interestAccrued, currency)}
                      </p>
                    </div>
                    <div className={`p-3 sm:p-4 rounded-lg text-center ${
                      balance.netBalance < 0 ? 'bg-success-50' : 'bg-error-50'
                    }`}>
                      {balance.netBalance < 0 ? (
                        <CheckCircle size={18} className="text-success-600 mx-auto mb-2" />
                      ) : (
                        <AlertTriangle size={18} className="text-error-600 mx-auto mb-2" />
                      )}
                      <p className="text-xs sm:text-sm font-medium empty-state-text">Saldo Neto ({currency})</p>
                      <p className={`text-base sm:text-lg lg:text-xl font-bold ${
                        balance.netBalance < 0 ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {balance.netBalance < 0 
                          ? `Nos deben: ${formatAmountWithCurrency(Math.abs(balance.netBalance), currency)}`
                          : `Les debemos: ${formatAmountWithCurrency(balance.netBalance, currency)}`
                        }
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CreditCard size={48} className="text-gray-400" />
                </div>
                <h3 className="empty-state-title">No hay movimientos registrados</h3>
                <p className="empty-state-description">
                  Este prestamista aún no tiene operaciones registradas.
                </p>
              </div>
            )}

            {/* Tabla de movimientos */}
            {processedMovements.movements.length > 0 && (
              <div className="movements-section">
                <h3 className="section-subtitle flex items-center gap-2">
                  <Calendar size={18} />
                  Historial de Movimientos
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                        <th>Moneda</th>
                        <th>Interés</th>
                        <th>Balance Principal</th>
                        <th>Interés Acumulado</th>
                        <th>Balance Neto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedMovements.movements.map((mov, index) => (
                        <tr key={index} className="data-row">
                          <td className="date-cell">
                            {new Date(mov.fecha).toLocaleDateString('es-ES')}
                          </td>
                          <td className="type-cell">
                            <span className={`badge ${mov.subOperacion === 'PRESTAMO' ? 'badge-success' : 'badge-warning'}`}>
                              {mov.subOperacion}
                            </span>
                          </td>
                          <td className="amount-cell">
                            {formatAmountWithCurrency(mov.monto, mov.moneda)}
                          </td>
                          <td className="currency-cell">
                            <span className="currency-badge">{mov.moneda}</span>
                          </td>
                          <td className="rate-cell">
                            {mov.interes ? `${mov.interes}%` : '-'}
                          </td>
                          <td className="balance-cell">
                            {formatAmountWithCurrency(mov.runningBalance.principal, mov.moneda)}
                          </td>
                          <td className="interest-cell">
                            {formatAmountWithCurrency(mov.runningBalance.interestAccrued, mov.moneda)}
                          </td>
                          <td className="net-cell">
                            <span className={`font-semibold ${
                              mov.runningBalance.netBalance < 0 ? 'text-success-600' : 'text-error-600'
                            }`}>
                              {formatAmountWithCurrency(mov.runningBalance.netBalance, mov.moneda)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
