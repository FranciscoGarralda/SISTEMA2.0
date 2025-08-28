import { useState, useMemo, useEffect } from 'react';
import { safeParseFloat } from '../../../services/utilityService';
import { useCommunicationContext } from '../../../hooks/useHookCommunication';

export const usePrestamistas = (clients = [], movements = []) => {
  const [currentView, setCurrentView] = useState('summary');
  const [selectedPrestamista, setSelectedPrestamista] = useState(null);
  
  // Sistema de comunicación
  const { emit, listen } = useCommunicationContext();

  // Filtrar clientes prestamistas
  const prestamistaClients = useMemo(() => {
    return clients.filter(client => client.tipo === 'prestamistas');
  }, [clients]);

  // Función para calcular balances de un prestamista específico
  const calculatePrestamistaBalances = (prestamistaId, allMovements, allClients) => {
    const prestamistaClient = allClients.find(c => c.id === prestamistaId);
    if (!prestamistaClient) return null;

    const clientFullName = `${prestamistaClient.nombre} ${prestamistaClient.apellido}`;

    // Obtener movimientos relevantes y ordenarlos cronológicamente
    const relevantMovements = allMovements
      .filter(mov => 
        mov.operacion === 'PRESTAMISTAS' && 
        (mov.cliente === prestamistaClient.nombre || mov.cliente === clientFullName)
      )
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const balancesByCurrency = {};

    // Procesar cada movimiento cronológicamente
    relevantMovements.forEach(mov => {
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
        // Actualizar tasa solo si es mayor a 0
        const newRate = safeParseFloat(mov.interes, 0);
        if (newRate > 0) {
          currentBalance.effectiveRate = newRate;
        }
      } else if (mov.subOperacion === 'RETIRO') {
        const amount = safeParseFloat(mov.monto, 0);
        // Aplicar retiro: primero a intereses, luego a principal
        if (currentBalance.interestAccrued >= amount) {
          currentBalance.interestAccrued -= amount;
        } else {
          const remainingAmount = amount - currentBalance.interestAccrued;
          currentBalance.interestAccrued = 0;
          currentBalance.principal = Math.max(0, currentBalance.principal - remainingAmount);
        }
      }
      
      currentBalance.lastCalculationDate = movementDate;
    });

    // Acumular intereses hasta hoy para el balance final
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
    }

    // Calcular resúmenes finales
    const finalSummary = {
      totalPrincipalLent: {},
      totalRetiros: {},
      totalAccruedInterest: {},
      netBalance: {},
      movimientosCount: relevantMovements.length,
    };

    // Calcular totales de préstamos y retiros por separado
    relevantMovements.forEach(mov => {
      const currency = mov.moneda;
      const amount = safeParseFloat(mov.monto, 0);
      if (mov.subOperacion === 'PRESTAMO') {
        finalSummary.totalPrincipalLent[currency] = 
          (finalSummary.totalPrincipalLent[currency] || 0) + amount;
      } else if (mov.subOperacion === 'RETIRO') {
        finalSummary.totalRetiros[currency] = 
          (finalSummary.totalRetiros[currency] || 0) + amount;
      }
    });

    // Calcular balances netos finales
    for (const currency in balancesByCurrency) {
      const balance = balancesByCurrency[currency];
      finalSummary.totalAccruedInterest[currency] = balance.interestAccrued;
      finalSummary.netBalance[currency] = balance.principal + balance.interestAccrued;
    }

    return finalSummary;
  };

  // Calcular resumen para cada prestamista
  const prestamistaSummary = useMemo(() => {
    return prestamistaClients.map(client => {
      const summary = calculatePrestamistaBalances(client.id, movements, clients);
      return {
        client: client,
        summary: summary,
      };
    });
  }, [prestamistaClients, movements, clients]);

  // Handlers
  const handleViewDetail = (prestamistaClient) => {
    setSelectedPrestamista(prestamistaClient);
    setCurrentView('detail');
  };

  const handleBackToSummary = () => {
    setCurrentView('summary');
    setSelectedPrestamista(null);
  };

  // Escuchar cambios en movimientos para recalcular balances
  useEffect(() => {
    const unsubscribe = listen('data:movements:updated', (eventData) => {
      console.log('Movimientos actualizados, recalculando balances de prestamistas...');
    });

    return unsubscribe;
  }, []); // Remover listen de dependencias

  // Emitir eventos cuando cambian los cálculos de prestamistas
  useEffect(() => {
    if (prestamistaSummary.length > 0) {
      emit('calc:prestamistas:updated', {
        summary: prestamistaSummary,
        clients: prestamistaClients
      });
    }
  }, [prestamistaSummary, prestamistaClients]); // Remover emit

  return {
    // Estado
    currentView,
    selectedPrestamista,
    prestamistaClients,
    prestamistaSummary,
    
    // Acciones
    handleViewDetail,
    handleBackToSummary,
    
    // Utilidades
    calculatePrestamistaBalances
  };
};
