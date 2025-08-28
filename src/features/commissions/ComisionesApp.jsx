import React from 'react';
import { useCommissions } from './hooks/useCommissions';
import { CommissionsSummary } from './components/CommissionsSummary';

/** COMPONENTE PRINCIPAL DE ANÁLISIS DE COMISIONES */
function ComisionesApp({ movements = [], onNavigate = () => {} }) {
  const {
    selectedDate,
    setSelectedDate,
    commissionMovements,
    providerCommissions,
    totalCommissions,
    totalProviderCommissions,
    monthlyCommissions,
    dailyCommissionsForSelectedDate,
    commissionsByProvider,
    commissionsByOperation,
    commissionStats
  } = useCommissions(movements);

  return (
    <CommissionsSummary
      commissionMovements={commissionMovements}
      totalCommissions={totalCommissions}
      totalProviderCommissions={totalProviderCommissions}
      monthlyCommissions={monthlyCommissions}
      dailyCommissionsForSelectedDate={dailyCommissionsForSelectedDate}
      commissionsByProvider={commissionsByProvider}
      commissionsByOperation={commissionsByOperation}
      commissionStats={commissionStats}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}

export default ComisionesApp;