import { useState, useMemo, useEffect } from 'react';
import { safeParseFloat } from '../../../services/utilityService';
import { useCommunicationContext } from '../../../hooks/useHookCommunication';

export const useCommissions = (movements = []) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sistema de comunicación
  const { emit, listen } = useCommunicationContext();

  // Filtrar movimientos que tienen comisión - SOLO COMISIONES (SIN ARBITRAJES)
  const commissionMovements = useMemo(() => {
    return movements.filter(mov => 
      mov.comision && 
      safeParseFloat(mov.comision) > 0 &&
      !(mov.operacion === 'ARBITRAJE') // EXCLUIR arbitrajes
    );
  }, [movements]);

  // Comisiones de PROVEEDORES CC
  const providerCommissions = useMemo(() => {
    return commissionMovements.filter(mov => 
      mov.operacion === 'CUENTAS_CORRIENTES'
    );
  }, [commissionMovements]);

  // Calcular comisiones totales por moneda - SOLO PROVEEDORES CC
  const totalProviderCommissions = useMemo(() => {
    const totals = {};
    providerCommissions.forEach(mov => {
      const currency = mov.monedaComision || mov.moneda;
      if (currency) {
        totals[currency] = (totals[currency] || 0) + safeParseFloat(mov.comision);
      }
    });
    return totals;
  }, [providerCommissions]);

  // Calcular comisiones totales - SOLO COMISIONES REALES
  const totalCommissions = useMemo(() => {
    const totals = {};
    commissionMovements.forEach(mov => {
      const currency = mov.monedaComision || mov.moneda;
      if (currency) {
        totals[currency] = (totals[currency] || 0) + safeParseFloat(mov.comision);
      }
    });
    return totals;
  }, [commissionMovements]);

  // Calcular comisiones mensuales para gráficos
  const monthlyCommissions = useMemo(() => {
    const monthly = {};
    commissionMovements.forEach(mov => {
      if (mov.fecha) {
        const date = new Date(mov.fecha);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const currency = mov.monedaComision || mov.moneda;

        if (!monthly[yearMonth]) {
          monthly[yearMonth] = {};
        }
        if (currency) {
          monthly[yearMonth][currency] = (monthly[yearMonth][currency] || 0) + safeParseFloat(mov.comision);
        }
      }
    });

    // Formatear para Recharts
    const chartData = Object.entries(monthly).map(([month, currencies]) => {
      const data = { name: month };
      for (const currency in currencies) {
        data[currency] = currencies[currency];
      }
      return data;
    }).sort((a, b) => a.name.localeCompare(b.name));

    return chartData;
  }, [commissionMovements]);

  // Calcular comisiones diarias para fecha seleccionada
  const dailyCommissionsForSelectedDate = useMemo(() => {
    if (!selectedDate) return {};
    const daily = {};
    commissionMovements.forEach(mov => {
      if (mov.fecha === selectedDate) {
        const currency = mov.monedaComision || mov.moneda;
        if (currency) {
          daily[currency] = (daily[currency] || 0) + safeParseFloat(mov.comision);
        }
      }
    });
    return daily;
  }, [commissionMovements, selectedDate]);

  // Calcular comisiones por proveedor
  const commissionsByProvider = useMemo(() => {
    const byProvider = {};
    providerCommissions.forEach(mov => {
      const provider = mov.proveedorCC || 'Sin proveedor';
      const currency = mov.monedaComision || mov.moneda;
      
      if (!byProvider[provider]) {
        byProvider[provider] = {};
      }
      if (currency) {
        byProvider[provider][currency] = (byProvider[provider][currency] || 0) + safeParseFloat(mov.comision);
      }
    });
    return byProvider;
  }, [providerCommissions]);

  // Calcular comisiones por tipo de operación
  const commissionsByOperation = useMemo(() => {
    const byOperation = {};
    commissionMovements.forEach(mov => {
      const operation = mov.operacion || 'Sin operación';
      const currency = mov.monedaComision || mov.moneda;
      
      if (!byOperation[operation]) {
        byOperation[operation] = {};
      }
      if (currency) {
        byOperation[operation][currency] = (byOperation[operation][currency] || 0) + safeParseFloat(mov.comision);
      }
    });
    return byOperation;
  }, [commissionMovements]);

  // Calcular estadísticas generales
  const commissionStats = useMemo(() => {
    const stats = {
      totalMovements: commissionMovements.length,
      totalProviderMovements: providerCommissions.length,
      totalCommissions: Object.values(totalCommissions).reduce((sum, value) => sum + value, 0),
      totalProviderCommissions: Object.values(totalProviderCommissions).reduce((sum, value) => sum + value, 0),
      currencies: Object.keys(totalCommissions),
      providerCurrencies: Object.keys(totalProviderCommissions),
      providers: Object.keys(commissionsByProvider),
      operations: Object.keys(commissionsByOperation)
    };

    return stats;
  }, [commissionMovements, providerCommissions, totalCommissions, totalProviderCommissions, commissionsByProvider, commissionsByOperation]);

  // Escuchar cambios en movimientos para recalcular comisiones
  useEffect(() => {
    const unsubscribe = listen('data:movements:updated', (eventData) => {
      console.log('Movimientos actualizados, recalculando comisiones...');
    });
    return unsubscribe;
  }, []); // Remover listen de dependencias

  // Emitir eventos cuando cambian los cálculos de comisiones
  useEffect(() => {
    if (commissionStats.totalMovements > 0) {
      emit('calc:commissions:updated', {
        stats: commissionStats,
        totalCommissions,
        totalProviderCommissions,
        monthlyCommissions,
        commissionsByProvider,
        commissionsByOperation
      });
    }
  }, [commissionStats, totalCommissions, totalProviderCommissions, monthlyCommissions, commissionsByProvider, commissionsByOperation]); // Remover emit

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    
    // Datos filtrados
    commissionMovements,
    providerCommissions,
    
    // Cálculos
    totalCommissions,
    totalProviderCommissions,
    monthlyCommissions,
    dailyCommissionsForSelectedDate,
    commissionsByProvider,
    commissionsByOperation,
    commissionStats
  };
};
