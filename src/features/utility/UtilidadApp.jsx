import React from 'react';
import { useUtility } from './hooks/useUtility';
import { UtilitySummary } from './components/UtilitySummary';

/** COMPONENTE PRINCIPAL DE ANÁLISIS DE UTILIDAD */
function UtilidadApp({ movements = [], onNavigate = () => {} }) {
  const {
    selectedDate,
    setSelectedDate,
    processedMovements,
    finalStockData,
    totalUtilityCombined,
    monthlyUtilityCombined,
    dailyUtilityCombined,
    utilityStats
  } = useUtility(movements);

  return (
    <UtilitySummary
      utilityStats={utilityStats}
      totalUtilityCombined={totalUtilityCombined}
      monthlyUtilityCombined={monthlyUtilityCombined}
      dailyUtilityCombined={dailyUtilityCombined}
      finalStockData={finalStockData}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      onNavigate={onNavigate}
    />
  );
}

export default UtilidadApp;