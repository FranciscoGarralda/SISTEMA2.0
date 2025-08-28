import { useState, useMemo } from 'react';
import { formatAmountWithCurrency, proveedoresCC } from '../../../components/forms';
import { safeParseFloat } from '../../../services/utilityService';
import { balanceService } from '../../../services';

export const useCurrentAccounts = (movements = []) => {
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
          const saldoInicial = balanceService.getCCBalance(p.value, currency);
          
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
          // ARBITRAJE: Usa los campos correctos del formulario
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
          // VENTA: entregamos monedaTC, recibimos monedaTCVenta
          if (mov.monedaTC && mov.montoVenta) {
            const keyEntregaVenta = `${mov.proveedorCC}-${mov.monedaTC}`;
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

        // Agregar comisiones si existen (solo una vez por movimiento)
        if (mov.comision && mov.monedaComision && !mov.comisionProcessed) {
          const comisionAmount = safeParseFloat(mov.comision);
          // La comisión se agrega a la cuenta en la moneda de la comisión
          const comisionKey = `${mov.proveedorCC}-${mov.monedaComision}`;
          const comisionAccount = accountsMap.get(comisionKey);
          if (comisionAccount) {
            comisionAccount.comisionesGeneradas += comisionAmount;
          }
          // Marcar como procesada para evitar duplicación
          mov.comisionProcessed = true;
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
          totalIngresos: 0,
          totalEgresos: 0,
          totalSaldo: 0,
          totalDebeUsuario: 0,
          totalDebeProveedor: 0,
          totalMovimientos: 0,
          totalComisiones: 0,
          cuentas: []
        });
      }

      const total = totalsByProvider.get(account.proveedor);
      total.totalIngresos += account.ingresos;
      total.totalEgresos += account.egresos;
      total.totalSaldo += account.saldo;
      total.totalDebeUsuario += account.debeUsuario;
      total.totalDebeProveedor += account.debeProveedor;
      total.totalMovimientos += account.movimientosCount;
      total.totalComisiones += account.comisionesGeneradas;
      total.cuentas.push(account);
    });

    return Array.from(totalsByProvider.values());
  }, [allCalculatedAccounts]);

  // Funciones de navegación
  const showProviderDetail = (provider) => {
    setSelectedProviderForDetail(provider);
    setCurrentView('detail');
  };

  const backToSummary = () => {
    setCurrentView('summary');
    setSelectedProviderForDetail(null);
  };

  return {
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
    hasAccounts: allCalculatedAccounts.length > 0,
    accountCount: allCalculatedAccounts.length,
    providerCount: summaryTotals.length
  };
};
