import React from 'react';
import { useFinancialOperations } from './hooks/useFinancialOperations';
import OperationsForm from './components/OperationsForm';

/** COMPONENTE PRINCIPAL DE OPERACIONES FINANCIERAS - REFACTORIZADO */
const FinancialOperationsApp = ({ 
  onSaveMovement, 
  initialMovementData, 
  onCancelEdit, 
  clients, 
  onSaveClient, 
  reloadClients 
}) => {
  const {
    // Estado
    formData,
    
    // Opciones
    prestamistaClientsOptions,
    
    // Hooks personalizados
    isMixedPaymentActive,
    handleMixedPaymentChange,
    addMixedPayment,
    removeMixedPayment,
    
    // Utilidades
    createElementRef,
    
    // Manejadores
    handleFieldChange,
    handleSubmit,
    handleCancel,
    
    // Validaciones
    isFormValid
  } = useFinancialOperations({
    onSaveMovement,
    initialMovementData,
    onCancelEdit,
    clients,
    onSaveClient,
    reloadClients
  });

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="card">
          <div className="card-content">
            <OperationsForm
              formData={formData}
              onFieldChange={handleFieldChange}
              onSaveClient={onSaveClient}
              onSaveMovement={handleSubmit}
              onCancelEdit={handleCancel}
              clients={clients}
              prestamistaClientsOptions={prestamistaClientsOptions}
              isMixedPaymentActive={isMixedPaymentActive}
              handleMixedPaymentChange={handleMixedPaymentChange}
              addMixedPayment={addMixedPayment}
              removeMixedPayment={removeMixedPayment}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOperationsApp;