import React from 'react';
import { useProfitability } from './hooks/useProfitability';
import { ProfitabilitySummary } from './components/ProfitabilitySummary';

/** COMPONENTE PRINCIPAL DE RENTABILIDAD */
function RentabilidadApp({ movements = [] }) {
  const {
    dateRange,
    setDateRange,
    selectedMoneda,
    setSelectedMoneda,
    selectedPeriod,
    currentProfitability,
    previousProfitability,
    periodComparison,
    handlePeriodChange
  } = useProfitability(movements);

  return (
    <ProfitabilitySummary
      currentProfitability={currentProfitability}
      previousProfitability={previousProfitability}
      periodComparison={periodComparison}
      dateRange={dateRange}
      selectedPeriod={selectedPeriod}
      selectedMoneda={selectedMoneda}
      setSelectedMoneda={setSelectedMoneda}
      handlePeriodChange={handlePeriodChange}
    />
  );
}

export default RentabilidadApp;