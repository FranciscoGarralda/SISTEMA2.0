import { useState, useMemo, useEffect } from 'react';
import { safeParseFloat } from '../../../services/utilityService';
import { useCommunicationContext } from '../../../hooks/useHookCommunication';

export const useUtility = (movements = []) => {
  const [selectedDate, setSelectedDate] = useState('');
  
  // Sistema de comunicación
  const { emit, listen } = useCommunicationContext();

  // Procesar movimientos para calcular WAC histórico y utilidad
  const processedMovements = useMemo(() => {
    const tempStockData = {}; // { currency: { cantidad, totalCostoEnMonedaTC, costoPromedio } }
    
    return movements
      .filter(mov => mov.operacion === 'TRANSACCIONES')
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(mov => {
        let gananciaCalculada = 0;

        const currency = mov.moneda; // Activo siendo comprado/vendido
        const currencyTC = mov.monedaTC; // Moneda del valor total de la transacción

        if (!tempStockData[currency]) {
          tempStockData[currency] = { 
            cantidad: 0, 
            totalCostoEnMonedaTC: 0, 
            costoPromedio: 0,
            monedaTCAsociada: currencyTC 
          };
        }

        const amount = safeParseFloat(mov.monto);
        const total = safeParseFloat(mov.total);

        if (mov.subOperacion === 'COMPRA') {
          // Acumular costo total y cantidad
          tempStockData[currency].totalCostoEnMonedaTC += total;
          tempStockData[currency].cantidad += amount;
          tempStockData[currency].monedaTCAsociada = currencyTC;
          
          // Actualizar costo promedio
          if (tempStockData[currency].cantidad > 0) {
            tempStockData[currency].costoPromedio = 
              tempStockData[currency].totalCostoEnMonedaTC / tempStockData[currency].cantidad;
          }
        } else if (mov.subOperacion === 'VENTA') {
          if (amount > tempStockData[currency].cantidad) {
            console.warn(`Stock insuficiente para vender ${amount} de ${currency} en ${mov.fecha}`);
            // Usar solo el stock disponible
            const stockDisponible = tempStockData[currency].cantidad;
            const costoUnitarioEnMonedaTC = tempStockData[currency].costoPromedio;
            const costoTotalVenta = stockDisponible * costoUnitarioEnMonedaTC;
            
            // Calcular utilidad proporcional
            const factorProporcional = stockDisponible / amount;
            const ingresoProporcional = total * factorProporcional;
            gananciaCalculada = ingresoProporcional - costoTotalVenta;
          } else {
            const costoUnitarioEnMonedaTC = tempStockData[currency].costoPromedio;
            const costoTotalVenta = amount * costoUnitarioEnMonedaTC;

            // Utilidad = Ingreso - Costo
            gananciaCalculada = total - costoTotalVenta;
          }

          // Actualizar stock
          const cantidadAVender = amount > tempStockData[currency].cantidad ? tempStockData[currency].cantidad : amount;
          const costoTotalVentaStock = cantidadAVender * tempStockData[currency].costoPromedio;
          tempStockData[currency].cantidad -= cantidadAVender;
          tempStockData[currency].totalCostoEnMonedaTC -= costoTotalVentaStock;
          
          if (tempStockData[currency].cantidad <= 0) {
            tempStockData[currency].cantidad = 0;
            tempStockData[currency].totalCostoEnMonedaTC = 0;
            tempStockData[currency].costoPromedio = 0;
          }
        }
        // ARBITRAJE no se incluye en utilidad histórica - solo compra/venta de divisas

        return { ...mov, gananciaCalculada };
      });
  }, [movements]);

  // Calcular datos finales de stock después de todos los movimientos
  const finalStockData = useMemo(() => {
    const stockData = {};
    
    processedMovements.forEach(mov => {
      if (mov.operacion === 'TRANSACCIONES') {
        const currency = mov.moneda;
        const currencyTC = mov.monedaTC;

        if (!stockData[currency]) {
          stockData[currency] = { 
            cantidad: 0, 
            totalCostoEnMonedaTC: 0, 
            costoPromedio: 0, 
            utilidadPorVenta: 0,
            monedaTCAsociada: currencyTC 
          };
        }

        const amount = safeParseFloat(mov.monto);
        const total = safeParseFloat(mov.total);

        if (mov.subOperacion === 'COMPRA') {
          stockData[currency].totalCostoEnMonedaTC += total;
          stockData[currency].cantidad += amount;
          stockData[currency].monedaTCAsociada = currencyTC;
          
          if (stockData[currency].cantidad > 0) {
            stockData[currency].costoPromedio = 
              stockData[currency].totalCostoEnMonedaTC / stockData[currency].cantidad;
          }
        } else if (mov.subOperacion === 'VENTA') {
          // Mantener utilidad en moneda TC original (donde se deposita la ganancia)
          stockData[currency].utilidadPorVenta += mov.gananciaCalculada;

          const costoUnitarioEnMonedaTC = stockData[currency].costoPromedio;
          const costoTotalVenta = amount * costoUnitarioEnMonedaTC;

          stockData[currency].cantidad -= amount;
          stockData[currency].totalCostoEnMonedaTC -= costoTotalVenta;
          
          if (stockData[currency].cantidad <= 0) {
            stockData[currency].cantidad = 0;
            stockData[currency].totalCostoEnMonedaTC = 0;
            stockData[currency].costoPromedio = 0;
          }
        }
        // ARBITRAJE no se procesa para utilidad histórica
      }
    });
    
    return stockData;
  }, [processedMovements]);

  // Utilidad total combinada - solo ventas, por divisa de la ganancia
  const totalUtilityCombined = useMemo(() => {
    const totals = {};
    
    // Procesar directamente los movimientos de venta para obtener divisa correcta
    processedMovements.forEach(mov => {
      if (mov.subOperacion === 'VENTA' && mov.gananciaCalculada !== 0) {
        const monedaUtilidad = mov.monedaTC || 'PESO'; // Divisa de la ganancia
        totals[monedaUtilidad] = (totals[monedaUtilidad] || 0) + mov.gananciaCalculada;
      }
    });
    
    return totals;
  }, [processedMovements]);

  // Calcular utilidad mensual para gráficos - solo VENTA por divisa
  const monthlyUtilityCombined = useMemo(() => {
    const monthly = {};

    processedMovements.forEach(mov => {
      if (mov.gananciaCalculada !== 0 && mov.subOperacion === 'VENTA') {
        const date = new Date(mov.fecha);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        // Usar moneda TC original (donde se deposita la ganancia)
        const monedaUtilidad = mov.monedaTC || 'PESO';
        const key = `${monedaUtilidad}_VENTA`;

        if (!monthly[yearMonth]) {
          monthly[yearMonth] = {};
        }
        monthly[yearMonth][key] = (monthly[yearMonth][key] || 0) + mov.gananciaCalculada;
      }
    });

    const chartData = Object.entries(monthly).map(([month, currencies]) => {
      const data = { name: month };
      for (const currencyKey in currencies) {
        data[currencyKey] = currencies[currencyKey];
      }
      return data;
    }).sort((a, b) => a.name.localeCompare(b.name));

    return chartData;
  }, [processedMovements]);

  // Calcular utilidad por día para gráficos
  const dailyUtilityCombined = useMemo(() => {
    const daily = {};

    processedMovements.forEach(mov => {
      if (mov.gananciaCalculada !== 0 && mov.subOperacion === 'VENTA') {
        const date = new Date(mov.fecha);
        const dateKey = date.toISOString().split('T')[0];
        
        const monedaUtilidad = mov.monedaTC || 'PESO';
        const key = `${monedaUtilidad}_VENTA`;

        if (!daily[dateKey]) {
          daily[dateKey] = {};
        }
        daily[dateKey][key] = (daily[dateKey][key] || 0) + mov.gananciaCalculada;
      }
    });

    const chartData = Object.entries(daily).map(([date, currencies]) => {
      const data = { name: date };
      for (const currencyKey in currencies) {
        data[currencyKey] = currencies[currencyKey];
      }
      return data;
    }).sort((a, b) => a.name.localeCompare(b.name));

    return chartData;
  }, [processedMovements]);

  // Calcular estadísticas generales
  const utilityStats = useMemo(() => {
    const stats = {
      totalMovements: processedMovements.length,
      totalBuys: processedMovements.filter(mov => mov.subOperacion === 'COMPRA').length,
      totalSells: processedMovements.filter(mov => mov.subOperacion === 'VENTA').length,
      totalUtility: Object.values(totalUtilityCombined).reduce((sum, value) => sum + value, 0),
      currencies: Object.keys(totalUtilityCombined),
      stockCurrencies: Object.keys(finalStockData)
    };

    return stats;
  }, [processedMovements, totalUtilityCombined, finalStockData]);

  // Escuchar cambios en movimientos para recalcular utilidad
  useEffect(() => {
    const unsubscribe = listen('data:movements:updated', (eventData) => {
      // Los movimientos se actualizan automáticamente a través de props
      // Este listener permite reaccionar a cambios externos
      console.log('Movimientos actualizados, recalculando utilidad...');
    });

    return unsubscribe;
  }, []); // Remover listen de dependencias

  // Emitir eventos cuando cambian los cálculos
  useEffect(() => {
    if (Object.keys(totalUtilityCombined).length > 0) {
      emit('calc:utility:updated', {
        totalUtility: totalUtilityCombined,
        monthlyUtility: monthlyUtilityCombined,
        dailyUtility: dailyUtilityCombined,
        stats: utilityStats
      });
    }
  }, [totalUtilityCombined, monthlyUtilityCombined, dailyUtilityCombined, utilityStats]); // Remover emit

  // Emitir eventos cuando cambia el stock
  useEffect(() => {
    if (Object.keys(finalStockData).length > 0) {
      emit('calc:stock:updated', finalStockData);
    }
  }, [finalStockData]); // Remover emit

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    
    // Datos procesados
    processedMovements,
    finalStockData,
    totalUtilityCombined,
    monthlyUtilityCombined,
    dailyUtilityCombined,
    utilityStats
  };
};
