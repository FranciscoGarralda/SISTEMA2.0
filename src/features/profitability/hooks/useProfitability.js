import { useState, useMemo, useEffect } from 'react';
import { safeParseFloat } from '../../../services/utilityService';
import { useCommunicationContext } from '../../../hooks/useHookCommunication';

export const useProfitability = (movements = []) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedMoneda, setSelectedMoneda] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('mensual');

  // Sistema de comunicación
  const { emit, listen } = useCommunicationContext();

  // Calcular rangos de fecha
  const calculateDateRange = (period) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate;

    switch (period) {
      case 'diario': startDate = endDate; break;
      case 'semanal': 
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'mensual':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'anual':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      default:
        return { start: dateRange.start, end: dateRange.end };
    }
    return { start: startDate, end: endDate };
  };

  // Manejar cambio de período
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'personalizado') {
      const newRange = calculateDateRange(period);
      setDateRange(newRange);
    }
  };

  // Filtrar movimientos por fecha
  const filteredMovements = useMemo(() => {
    return movements.filter(mov => {
      const movDate = new Date(mov.fecha).toISOString().split('T')[0];
      return movDate >= dateRange.start && movDate <= dateRange.end;
    });
  }, [movements, dateRange]);

  // Calcular movimientos del período anterior
  const previousPeriodMovements = useMemo(() => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    
    return movements.filter(mov => {
      const movDate = new Date(mov.fecha).toISOString().split('T')[0];
      return movDate >= prevStart.toISOString().split('T')[0] && 
             movDate <= prevEnd.toISOString().split('T')[0];
    });
  }, [movements, dateRange]);

  // Calcular rentabilidad
  const calculateProfitability = (movementsList) => {
    const data = {
      porTipo: {},
      porMoneda: {},
      porCliente: {},
      general: {
        totalOperaciones: 0,
        operacionesRentables: 0,
        gananciaTotal: 0,
        margenPromedio: 0
      }
    };

    // Procesar arbitrajes
    const arbitrajes = movementsList.filter(mov => 
      mov.operacion === 'TRANSACCIONES' && mov.subOperacion === 'ARBITRAJE'
    );

    arbitrajes.forEach(arb => {
      const montoCompra = safeParseFloat(arb.monto);
      const tcCompra = safeParseFloat(arb.tc);
      const montoVenta = safeParseFloat(arb.montoVenta || 0);
      const tcVenta = safeParseFloat(arb.tcVenta || 0);
      
      const totalCompra = montoCompra * tcCompra;
      const totalVenta = montoVenta * tcVenta;
      const ganancia = totalVenta - totalCompra;

      data.general.totalOperaciones++;
      if (ganancia > 0) data.general.operacionesRentables++;
      data.general.gananciaTotal += ganancia;

      const monedaKey = arb.monedaTCCmpra || 'PESO';
      if (!data.porMoneda[monedaKey]) {
        data.porMoneda[monedaKey] = {
          operaciones: 0,
          gananciaTotal: 0,
          margenPromedio: 0,
          volumen: 0
        };
      }
      data.porMoneda[monedaKey].operaciones++;
      data.porMoneda[monedaKey].gananciaTotal += ganancia;
      data.porMoneda[monedaKey].volumen += totalCompra;

      if (arb.cliente) {
        if (!data.porCliente[arb.cliente]) {
          data.porCliente[arb.cliente] = {
            operaciones: 0,
            gananciaTotal: 0,
            volumen: 0
          };
        }
        data.porCliente[arb.cliente].operaciones++;
        data.porCliente[arb.cliente].gananciaTotal += ganancia;
        data.porCliente[arb.cliente].volumen += totalCompra;
      }
    });

    // Procesar compras/ventas
    const comprasVentas = movementsList.filter(mov => 
      mov.operacion === 'TRANSACCIONES' && 
      ['COMPRA', 'VENTA'].includes(mov.subOperacion)
    );

    comprasVentas.forEach(op => {
      let ganancia = 0;
      const monto = safeParseFloat(op.monto);
      const tc = safeParseFloat(op.tc);
      const volumen = monto * tc;
      
      if (op.utilidadCalculada !== undefined) {
        ganancia = safeParseFloat(op.utilidadCalculada);
      } else if (op.comision && safeParseFloat(op.comision) > 0) {
        const comision = safeParseFloat(op.comision);
        ganancia = op.tipoComision === 'percentage' 
          ? (monto * comision / 100)
          : comision;
      } else {
        ganancia = volumen * 0.015; // 1.5% de margen
      }

      if (ganancia !== 0) {
        data.general.totalOperaciones++;
        if (ganancia > 0) data.general.operacionesRentables++;
        data.general.gananciaTotal += ganancia;

        const monedaKey = op.monedaTC || 'PESO';
        if (!data.porMoneda[monedaKey]) {
          data.porMoneda[monedaKey] = {
            operaciones: 0,
            gananciaTotal: 0,
            margenPromedio: 0,
            volumen: 0
          };
        }
        data.porMoneda[monedaKey].operaciones++;
        data.porMoneda[monedaKey].gananciaTotal += ganancia;
        data.porMoneda[monedaKey].volumen += volumen;

        if (op.cliente) {
          if (!data.porCliente[op.cliente]) {
            data.porCliente[op.cliente] = {
              operaciones: 0,
              gananciaTotal: 0,
              volumen: 0
            };
          }
          data.porCliente[op.cliente].operaciones++;
          data.porCliente[op.cliente].gananciaTotal += ganancia;
          data.porCliente[op.cliente].volumen += volumen;
        }
      }
    });

    // Calcular márgenes promedio
    Object.keys(data.porMoneda).forEach(moneda => {
      if (data.porMoneda[moneda].volumen > 0) {
        data.porMoneda[moneda].margenPromedio = 
          (data.porMoneda[moneda].gananciaTotal / data.porMoneda[moneda].volumen) * 100;
      }
    });

    if (data.general.totalOperaciones > 0) {
      data.general.margenPromedio = 
        (data.general.gananciaTotal / data.general.totalOperaciones);
    }

    return data;
  };

  // Calcular rentabilidad del período actual
  const currentProfitability = useMemo(() => {
    return calculateProfitability(filteredMovements);
  }, [filteredMovements]);

  // Calcular rentabilidad del período anterior
  const previousProfitability = useMemo(() => {
    return calculateProfitability(previousPeriodMovements);
  }, [previousPeriodMovements]);

  // Calcular comparación entre períodos
  const periodComparison = useMemo(() => {
    const current = currentProfitability.general;
    const previous = previousProfitability.general;

    return {
      gananciaTotal: {
        current: current.gananciaTotal,
        previous: previous.gananciaTotal,
        change: current.gananciaTotal - previous.gananciaTotal,
        percentage: previous.gananciaTotal !== 0 
          ? ((current.gananciaTotal - previous.gananciaTotal) / previous.gananciaTotal) * 100 
          : 0
      },
      operaciones: {
        current: current.totalOperaciones,
        previous: previous.totalOperaciones,
        change: current.totalOperaciones - previous.totalOperaciones,
        percentage: previous.totalOperaciones !== 0 
          ? ((current.totalOperaciones - previous.totalOperaciones) / previous.totalOperaciones) * 100 
          : 0
      },
      rentabilidad: {
        current: current.operacionesRentables / current.totalOperaciones * 100,
        previous: previous.operacionesRentables / previous.totalOperaciones * 100,
        change: 0,
        percentage: 0
      }
    };
  }, [currentProfitability, previousProfitability]);

  // Escuchar cambios en movimientos
  useEffect(() => {
    const unsubscribe = listen('data:movements:updated', (eventData) => {
      console.log('Movimientos actualizados, recalculando rentabilidad...');
    });
    return unsubscribe;
  }, [listen]);

  // Emitir eventos cuando cambian los cálculos
  useEffect(() => {
    if (currentProfitability.general.totalOperaciones > 0) {
      emit('calc:profitability:updated', {
        current: currentProfitability,
        previous: previousProfitability,
        comparison: periodComparison,
        dateRange,
        selectedPeriod
      });
    }
  }, [currentProfitability, previousProfitability, periodComparison, dateRange, selectedPeriod, emit]);

  return {
    // Estado
    dateRange,
    setDateRange,
    selectedMoneda,
    setSelectedMoneda,
    selectedPeriod,
    
    // Datos calculados
    filteredMovements,
    currentProfitability,
    previousProfitability,
    periodComparison,
    
    // Acciones
    handlePeriodChange,
    calculateDateRange
  };
};
