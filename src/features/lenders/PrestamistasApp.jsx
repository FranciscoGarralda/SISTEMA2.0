import React from 'react';
import { usePrestamistas } from './hooks/usePrestamistas';
import { PrestamistaSummary } from './components/PrestamistaSummary';
import { PrestamistaDetail } from './components/PrestamistaDetail';

/** COMPONENTE PRINCIPAL DE PRESTAMISTAS */
function PrestamistasApp({ clients = [], movements = [], onNavigate = () => {} }) {
  const {
    currentView,
    selectedPrestamista,
    prestamistaSummary,
    handleViewDetail,
    handleBackToSummary
  } = usePrestamistas(clients, movements);

  // Renderizar vista de resumen o detalle
  if (currentView === 'summary') {
    return (
      <PrestamistaSummary
        prestamistaSummary={prestamistaSummary}
        onViewDetail={handleViewDetail}
        onNavigate={onNavigate}
      />
    );
  }

  // Vista de detalle
  return (
    <PrestamistaDetail
      prestamista={selectedPrestamista}
      movements={movements}
      clients={clients}
      onBack={handleBackToSummary}
    />
  );
}

export default PrestamistasApp;