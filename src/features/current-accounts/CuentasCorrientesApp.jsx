import React, { useState, useMemo } from 'react';
import {
  Building2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Eye
} from 'lucide-react';
import { formatAmountWithCurrency, proveedoresCC } from '../../components/forms';
import { safeParseFloat } from '../../services/safeOperations';
import { ccInitialBalanceService } from '../../services';

/** COMPONENTE PRINCIPAL DE CUENTAS CORRIENTES */
function CuentasCorrientesApp({ movements = [], onNavigate = () => {} }) {
  const [currentView, setCurrentView] = useState('summary'); // 'summary' o 'detail'
  const [selectedProviderForDetail, setSelectedProviderForDetail] = useState(null);

  // Calcular las cuentas corrientes y sus saldos
  const allCalculatedAccounts = useMemo(() => {
    const accountsMap = new Map();

    // Inicializar todas las combinaciones posibles de proveedor-moneda
    proveedoresCC.forEach(p => {
      if (p.value !== '') {
        p.allowedCurrencies.forEach(currency => {
          const key = `${p.value}-${currency}`;
          const saldoInicial = ccInitialBalanceService.getBalance(p.value, currency);
          
          accountsMap.set(key, {
            proveedor: p.value,
            proveedorLabel: p.label,
            moneda: currency,
            ingresos: 0,
            egresos: 0,
            saldo: saldoInicial, // Empezar con el saldo inicial
            debeUsuario: 0,
            debeProveedor: 0,
            movimientosCount: 0,
            comisionesGeneradas: 0,
          });
        });
      }
    });

    // Procesar movimientos de cuentas corrientes
    movements.forEach(mov => {
      if (mov.operacion === 'CUENTAS_CORRIENTES' && mov.proveedorCC) {
        
        if (mov.subOperacion === 'INGRESO' && mov.moneda && mov.monto) {
          const key = `${mov.proveedorCC}-${mov.moneda}`;
          const account = accountsMap.get(key);
          if (account) {
            const amount = safeParseFloat(mov.monto);
            account.movimientosCount++;
            account.ingresos += amount;
            // INGRESO: Ellos nos dan dinero, les debemos MÁS (saldo más negativo)
            account.saldo -= amount;
          }
        } else if (mov.subOperacion === 'EGRESO' && mov.moneda && mov.monto) {
          const key = `${mov.proveedorCC}-${mov.moneda}`;
          const account = accountsMap.get(key);
          if (account) {
            const amount = safeParseFloat(mov.monto);
            account.movimientosCount++;
            account.egresos += amount;
            // EGRESO: Les pagamos, les debemos MENOS (saldo menos negativo)
            account.saldo += amount;
          }
        } else if (mov.subOperacion === 'COMPRA') {
          // En COMPRA: Les compramos moneda
          // Pagamos monedaTC (les debemos MENOS en esa moneda)
          if (mov.monedaTC && mov.total) {
            const keyPago = `${mov.proveedorCC}-${mov.monedaTC}`;
            const accountPago = accountsMap.get(keyPago);
            if (accountPago) {
              const totalPago = safeParseFloat(mov.total);
              accountPago.movimientosCount++;
              accountPago.egresos += totalPago;
              accountPago.saldo += totalPago; // Pagamos, debemos MENOS
            }
          }
          // Recibimos moneda (les debemos MÁS en esa moneda)
          if (mov.moneda && mov.monto) {
            const keyRecibo = `${mov.proveedorCC}-${mov.moneda}`;
            const accountRecibo = accountsMap.get(keyRecibo);
            if (accountRecibo) {
              const montoRecibo = safeParseFloat(mov.monto);
              accountRecibo.movimientosCount++;
              accountRecibo.ingresos += montoRecibo;
              accountRecibo.saldo -= montoRecibo; // Recibimos, debemos MÁS
            }
          }
        } else if (mov.subOperacion === 'VENTA') {
          // En VENTA: Les vendemos moneda
          // Entregamos moneda (les debemos MENOS en esa moneda)
          if (mov.moneda && mov.monto) {
            const keyEntrega = `${mov.proveedorCC}-${mov.moneda}`;
            const accountEntrega = accountsMap.get(keyEntrega);
            if (accountEntrega) {
              const montoEntrega = safeParseFloat(mov.monto);
              accountEntrega.movimientosCount++;
              accountEntrega.egresos += montoEntrega;
              accountEntrega.saldo += montoEntrega; // Entregamos, debemos MENOS
            }
          }
          // Recibimos monedaTC (les debemos MÁS en esa moneda)
          if (mov.monedaTC && mov.total) {
            const keyRecibo = `${mov.proveedorCC}-${mov.monedaTC}`;
            const accountRecibo = accountsMap.get(keyRecibo);
            if (accountRecibo) {
              const totalRecibo = safeParseFloat(mov.total);
              accountRecibo.movimientosCount++;
              accountRecibo.ingresos += totalRecibo;
              accountRecibo.saldo -= totalRecibo; // Recibimos, debemos MÁS
            }
          }
        } else if (mov.subOperacion === 'ARBITRAJE') {
          // ARBITRAJE: Ahora usa los mismos campos que ARBITRAJE normal
          // COMPRA: pagamos monedaTC, recibimos moneda
          if (mov.monedaTC && mov.totalCompra) {
            const keyPagoCompra = `${mov.proveedorCC}-${mov.monedaTC}`;
            const accountPagoCompra = accountsMap.get(keyPagoCompra);
            if (accountPagoCompra) {
              const totalPagoCompra = safeParseFloat(mov.totalCompra);
              accountPagoCompra.movimientosCount++;
              accountPagoCompra.egresos += totalPagoCompra;
              accountPagoCompra.saldo += totalPagoCompra; // Pagamos, debemos MENOS
            }
          }
          if (mov.moneda && mov.monto) {
            const keyReciboCompra = `${mov.proveedorCC}-${mov.moneda}`;
            const accountReciboCompra = accountsMap.get(keyReciboCompra);
            if (accountReciboCompra) {
              const montoReciboCompra = safeParseFloat(mov.monto);
              accountReciboCompra.movimientosCount++;
              accountReciboCompra.ingresos += montoReciboCompra;
              accountReciboCompra.saldo -= montoReciboCompra; // Recibimos, debemos MÁS
            }
          }
          // VENTA: entregamos monedaVenta (que es monedaTC), recibimos monedaTCVenta (que es moneda)
          if (mov.monedaVenta && mov.montoVenta) {
            const keyEntregaVenta = `${mov.proveedorCC}-${mov.monedaVenta}`;
            const accountEntregaVenta = accountsMap.get(keyEntregaVenta);
            if (accountEntregaVenta) {
              const montoEntregaVenta = safeParseFloat(mov.montoVenta);
              accountEntregaVenta.movimientosCount++;
              accountEntregaVenta.egresos += montoEntregaVenta;
              accountEntregaVenta.saldo += montoEntregaVenta; // Entregamos, debemos MENOS
            }
          }
          if (mov.monedaTCVenta && mov.totalVenta) {
            const keyCobroVenta = `${mov.proveedorCC}-${mov.monedaTCVenta}`;
            const accountCobroVenta = accountsMap.get(keyCobroVenta);
            if (accountCobroVenta) {
              const totalCobroVenta = safeParseFloat(mov.totalVenta);
              accountCobroVenta.movimientosCount++;
              accountCobroVenta.ingresos += totalCobroVenta;
              accountCobroVenta.saldo -= totalCobroVenta; // Recibimos, debemos MÁS
            }
          }
        }

        // Agregar comisiones si existen (para todas las sub-operaciones)
        if (mov.comision && mov.monedaComision) {
          const comisionAmount = safeParseFloat(mov.comision);
          // La comisión se agrega a la cuenta en la moneda de la comisión
          const comisionKey = `${mov.proveedorCC}-${mov.monedaComision}`;
          const comisionAccount = accountsMap.get(comisionKey);
          if (comisionAccount) {
            comisionAccount.comisionesGeneradas += comisionAmount;
          }
        }
      }
    });

    // Calcular quién debe a quién
    accountsMap.forEach(account => {
      if (account.saldo < 0) {
        account.debeUsuario = Math.abs(account.saldo);
        account.debeProveedor = 0;
      } else {
        account.debeProveedor = account.saldo;
        account.debeUsuario = 0;
      }
    });

    return Array.from(accountsMap.values()).filter(account => 
      account.ingresos > 0 || account.egresos > 0 || account.saldo !== 0
    );
  }, [movements]);

  // Calcular los totales por proveedor para la vista de resumen
  const summaryTotals = useMemo(() => {
    const totalsByProvider = new Map();

    allCalculatedAccounts.forEach(account => {
      if (!totalsByProvider.has(account.proveedor)) {
        totalsByProvider.set(account.proveedor, {
          proveedor: account.proveedor,
          proveedorLabel: account.proveedorLabel,
          ingresos: 0,
          egresos: 0,
          saldo: 0,
          debeUsuario: 0,
          debeProveedor: 0,
          cantidadMonedas: 0,
          monedas: new Set(),
          movimientosCount: 0,
          comisionesGeneradas: 0, // Agregar comisiones totales
        });
      }
      
      const providerTotal = totalsByProvider.get(account.proveedor);
      providerTotal.ingresos += account.ingresos;
      providerTotal.egresos += account.egresos;
      providerTotal.saldo += account.saldo;
      providerTotal.debeUsuario += account.debeUsuario;
      providerTotal.debeProveedor += account.debeProveedor;
      providerTotal.monedas.add(account.moneda);
      providerTotal.cantidadMonedas = providerTotal.monedas.size;
      providerTotal.movimientosCount += account.movimientosCount;
      providerTotal.comisionesGeneradas += account.comisionesGeneradas; // Sumar comisiones
    });

    return Array.from(totalsByProvider.values()).sort((a, b) => 
      a.proveedor.localeCompare(b.proveedor)
    );
  }, [allCalculatedAccounts]);

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
      comisionesGeneradas: 0, // Agregar comisiones
    };
    
    detailedAccounts.forEach(account => {
      totals.ingresos += account.ingresos;
      totals.egresos += account.egresos;
      totals.saldo += account.saldo;
      totals.debeUsuario += account.debeUsuario;
      totals.debeProveedor += account.debeProveedor;
      totals.movimientosCount += account.movimientosCount;
      totals.comisionesGeneradas += account.comisionesGeneradas; // Sumar comisiones
    });
    
    return totals;
  }, [detailedAccounts]);

  const handleSelectProvider = (provider) => {
    setSelectedProviderForDetail(provider);
    setCurrentView('detail');
  };

  const handleBackToSummary = () => {
    setCurrentView('summary');
    setSelectedProviderForDetail(null);
  };

  const getProviderLabel = (providerCode) => {
    const provider = proveedoresCC.find(p => p.value === providerCode);
    return provider ? provider.label : providerCode;
  };



  // Vista de resumen
  if (currentView === 'summary') {
    return (
      <div className="min-h-screen bg-gray-50 p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
        <div className="w-full px-2 sm:px-3 lg:px-4">
          {/* Header */}
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="sm:w-6 sm:h-6 text-gray-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      Cuentas Corrientes
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Resumen por proveedor • {summaryTotals.length} proveedor{summaryTotals.length !== 1 ? 'es' : ''} activo{summaryTotals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('nuevoMovimiento', {
                  operacion: 'CUENTAS_CORRIENTES'
                })} 
                  className="btn-primary flex items-center justify-center gap-2 touch-target w-full sm:w-auto"
                >
                  <Building2 size={18} />
                  <span>Nueva Cuenta</span>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                Resumen por Proveedor
              </h2>
              
              {summaryTotals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {summaryTotals.map((providerSummary) => (
                    <div
                      key={providerSummary.proveedor}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 sm:p-6 cursor-pointer hover:from-gray-100 hover:to-warning-100 transition-all duration-200 hover:scale-102 hover:shadow-medium"
                      onClick={() => handleSelectProvider(providerSummary.proveedor)}
                    >
                      {/* Header del proveedor */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {getProviderLabel(providerSummary.proveedor)}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded-full">
                            {providerSummary.cantidadMonedas} moneda{providerSummary.cantidadMonedas !== 1 ? 's' : ''}
                          </span>
                          <ChevronRight size={16} className="text-gray-800" />
                        </div>
                      </div>

                      {/* Métricas principales */}
                      <div className="space-y-2 sm:space-y-3 text-sm">
                        {/* Ingresos y Egresos */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                            <TrendingUp size={14} className="text-success-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-700">Ingresos</p>
                            <p className="font-semibold text-success-600 text-xs sm:text-sm">
                              {formatAmountWithCurrency(providerSummary.ingresos, 'PESO', { showSymbol: false, decimals: 0 })}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                            <TrendingDown size={14} className="text-error-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-700">Egresos</p>
                            <p className="font-semibold text-error-600 text-xs sm:text-sm">
                              {formatAmountWithCurrency(providerSummary.egresos, 'PESO', { showSymbol: false, decimals: 0 })}
                            </p>
                          </div>
                        </div>

                        {/* Saldo consolidado */}
                        <div className="bg-white rounded-lg p-2 sm:p-3">
                          <p className="text-xs text-gray-700 text-center mb-1">Saldo Consolidado</p>
                          <p className={`font-bold text-center text-sm sm:text-base ${
                            providerSummary.saldo < 0 ? 'text-error-600' : 'text-success-600'
                          }`}>
                            {formatAmountWithCurrency(providerSummary.saldo, 'PESO', { showSymbol: false, decimals: 0 })}
                          </p>
                        </div>

                        {/* Estado de deuda */}
                        {providerSummary.debeUsuario > 0 && (
                          <div className="bg-error-100 rounded-lg p-2 sm:p-3 text-center">
                            <AlertCircle size={14} className="text-error-600 mx-auto mb-1" />
                            <p className="text-xs text-error-700 font-medium">
                              Nosotros debemos: {formatAmountWithCurrency(providerSummary.debeUsuario, 'PESO', { showSymbol: false, decimals: 0 })}
                            </p>
                          </div>
                        )}
                        
                        {providerSummary.debeProveedor > 0 && (
                          <div className="bg-success-100 rounded-lg p-2 sm:p-3 text-center">
                            <DollarSign size={14} className="text-success-600 mx-auto mb-1" />
                            <p className="text-xs text-success-700 font-medium">
                              Nos deben: {formatAmountWithCurrency(providerSummary.debeProveedor, 'PESO', { showSymbol: false, decimals: 0 })}
                            </p>
                          </div>
                        )}

                        {/* Comisiones generadas */}
                        {providerSummary.comisionesGeneradas > 0 && (
                          <div className="bg-gray-100 rounded-lg p-2 sm:p-3 text-center">
                            <p className="text-xs text-gray-700">Comisiones generadas</p>
                            <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                              {formatAmountWithCurrency(providerSummary.comisionesGeneradas, 'PESO', { showSymbol: false, decimals: 0 })}
                            </p>
                          </div>
                        )}

                        {/* Contador de movimientos */}
                        <div className="text-center pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-800">
                            {providerSummary.movimientosCount} movimiento{providerSummary.movimientosCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Building2 size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-700 mb-2">No hay cuentas corrientes activas</p>
                  <p className="text-xs sm:text-sm text-gray-800 mb-4">
                    Las cuentas corrientes aparecerán aquí cuando se registren movimientos de INGRESO o EGRESO con proveedores
                  </p>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de detalle
  if (currentView === 'detail' && selectedProviderForDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
        <div className="w-full px-2 sm:px-3 lg:px-4">
          {/* Header con navegación */}
          <div className="">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <button
                  onClick={handleBackToSummary}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-target"
                  aria-label="Volver al resumen"
                >
                  <ArrowLeft size={18} className="text-gray-600" />
                </button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="sm:w-6 sm:h-6 text-gray-800" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    Detalle de {getProviderLabel(selectedProviderForDetail)}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {detailedAccounts.length} moneda{detailedAccounts.length !== 1 ? 's' : ''} • {detailedViewTotals.movimientosCount} movimiento{detailedViewTotals.movimientosCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {/* Breadcrumb */}
              <nav className="text-xs sm:text-sm text-gray-700">
                <button 
                  onClick={handleBackToSummary}
                  className="hover:text-gray-700 transition-colors"
                >
                  Cuentas Corrientes
                </button>
                <span className="mx-2">›</span>
                <span className="text-gray-700 font-medium">
                  {getProviderLabel(selectedProviderForDetail)}
                </span>
              </nav>
            </div>

            {/* Contenido del detalle */}
            <div className="p-3 sm:p-4 lg:p-6">
              {detailedAccounts.length > 0 ? (
                <>
                  {/* Tabla de detalles por moneda - Desktop */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Moneda
                          </th>
                          <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Ingresos
                          </th>
                          <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Egresos
                          </th>
                          <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Saldo
                          </th>
                          <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Comisiones
                          </th>
                          <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detailedAccounts.map((account, index) => (
                          <tr key={`${account.proveedor}-${account.moneda}-${index}`} className="hover:bg-gray-50">
                            <td className="px-2 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">{account.moneda}</span>
                              </div>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap text-right text-sm text-success-600 font-medium">
                              {formatAmountWithCurrency(account.ingresos, account.moneda)}
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap text-right text-sm text-error-600 font-medium">
                              {formatAmountWithCurrency(account.egresos, account.moneda)}
                            </td>
                            <td className={`px-2 py-3 whitespace-nowrap text-right text-sm font-bold ${
                              account.saldo < 0 ? 'text-error-600' : 'text-success-600'
                            }`}>
                              {formatAmountWithCurrency(account.saldo, account.moneda)}
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap text-right text-sm">
                              {formatAmountWithCurrency(account.comisionesGeneradas, account.moneda)}
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap text-right text-sm">
                              {account.debeUsuario > 0 ? (
                                <span className="px-2 py-1 bg-error-100 text-error-700 rounded-full text-xs font-medium">
                                  Nosotros: {formatAmountWithCurrency(account.debeUsuario, account.moneda)}
                                </span>
                              ) : account.debeProveedor > 0 ? (
                                <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                                  Nos deben: {formatAmountWithCurrency(account.debeProveedor, account.moneda)}
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  Sin saldo
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        
                        {/* Fila de totales */}
                        <tr className="bg-gray-50 font-bold">
                          <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                            TOTAL {getProviderLabel(selectedProviderForDetail)}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                            {formatAmountWithCurrency(detailedViewTotals.ingresos, 'PESO', { showSymbol: false })}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                            {formatAmountWithCurrency(detailedViewTotals.egresos, 'PESO', { showSymbol: false })}
                          </td>
                          <td className={`px-2 py-3 whitespace-nowrap text-right text-sm font-bold ${
                            detailedViewTotals.saldo < 0 ? 'text-error-600' : 'text-success-600'
                          }`}>
                            {formatAmountWithCurrency(detailedViewTotals.saldo, 'PESO', { showSymbol: false })}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-right text-sm">
                            {formatAmountWithCurrency(detailedViewTotals.comisionesGeneradas, 'PESO', { showSymbol: false })}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-right text-sm">
                            {detailedViewTotals.debeUsuario > 0 ? (
                              <span className="text-error-800 text-xs font-medium">
                                Nosotros: {formatAmountWithCurrency(detailedViewTotals.debeUsuario, 'PESO', { showSymbol: false })}
                              </span>
                            ) : detailedViewTotals.debeProveedor > 0 ? (
                              <span className="text-success-800 text-xs font-medium">
                                Nos deben: {formatAmountWithCurrency(detailedViewTotals.debeProveedor, 'PESO', { showSymbol: false })}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">Balanceado</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Cards de detalles por moneda - Mobile */}
                  <div className="sm:hidden space-y-3">
                    {detailedAccounts.map((account, index) => (
                      <div key={`${account.proveedor}-${account.moneda}-${index}`} className="">
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{account.moneda}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              account.saldo < 0 ? 'bg-error-100 text-error-700' : 'bg-success-100 text-success-700'
                            }`}>
                              {account.saldo < 0 ? 'Debemos' : 'Nos deben'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-700 text-xs">Ingresos</p>
                              <p className="font-medium text-success-600">
                                {formatAmountWithCurrency(account.ingresos, account.moneda)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-xs">Egresos</p>
                              <p className="font-medium text-error-600">
                                {formatAmountWithCurrency(account.egresos, account.moneda)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">Saldo</span>
                              <span className={`font-bold ${
                                account.saldo < 0 ? 'text-error-600' : 'text-success-600'
                              }`}>
                                {formatAmountWithCurrency(account.saldo, account.moneda)}
                              </span>
                            </div>
                            {account.comisionesGeneradas > 0 && (
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-700">Comisiones</span>
                                <span className="font-medium text-gray-800">
                                  {formatAmountWithCurrency(account.comisionesGeneradas, account.moneda)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Card de totales para mobile */}
                    <div className=" bg-gray-50 border-gray-200">
                      <div className="p-3 space-y-2">
                        <h3 className="font-bold text-gray-900">
                          TOTAL {getProviderLabel(selectedProviderForDetail)}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-800 text-xs">Total Ingresos</p>
                            <p className="font-medium text-gray-900">
                              {formatAmountWithCurrency(detailedViewTotals.ingresos, 'PESO', { showSymbol: false })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-800 text-xs">Total Egresos</p>
                            <p className="font-medium text-gray-900">
                              {formatAmountWithCurrency(detailedViewTotals.egresos, 'PESO', { showSymbol: false })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-800">Saldo Total</span>
                            <span className={`font-bold ${
                              detailedViewTotals.saldo < 0 ? 'text-error-600' : 'text-success-600'
                            }`}>
                              {formatAmountWithCurrency(detailedViewTotals.saldo, 'PESO', { showSymbol: false })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Building2 size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-700 mb-2">
                    No se encontraron movimientos para {getProviderLabel(selectedProviderForDetail)}
                  </p>
                  <button
                    onClick={handleBackToSummary}
                    className="text-gray-800 hover:text-gray-700 text-sm underline"
                  >
                    Volver al resumen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default CuentasCorrientesApp;