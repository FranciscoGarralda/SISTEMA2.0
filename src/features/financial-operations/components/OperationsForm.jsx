import React from 'react';
import { DollarSign, Save, X } from 'lucide-react';
import {
  FormInput,
  FormSelect,
  FormFieldGroup,
  MixedPaymentGroup,
  ClientAutocomplete,
  SubOperationButtons,
  ButtonSelectGroup
} from '../../../components/forms';
import {
  monedas,
  cuentas,
  socios,
  estados,
  operaciones,
  proveedoresCC,
  specificFieldsConfig
} from '../../../constants';

/**
 * Dynamic Form Field Groups Component
 */
function DynamicFormFieldGroups({ groups, formData, onFieldChange, onSaveClient }) {
  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <FormFieldGroup 
          key={groupIndex} 
          fields={group} 
          formData={formData}
          onFieldChange={onFieldChange}
          onSaveClient={onSaveClient}
        />
      ))}
    </div>
  );
}

const OperationsForm = ({
  formData,
  onFieldChange,
  onSaveClient,
  onSaveMovement,
  onCancelEdit,
  clients,
  prestamistaClientsOptions,
  isMixedPaymentActive,
  handleMixedPaymentChange,
  addMixedPayment,
  removeMixedPayment,
  isFormValid
}) => {
  // Obtener configuración de campos específicos
  const getSpecificFieldsConfig = () => {
    const operation = operaciones.find(op => op.value === formData.operacion);
    if (!operation) return [];

    let configKey = operation.value;
    
    // Configuraciones específicas por sub-operación
    if (formData.subOperacion) {
      if (['COMPRA', 'VENTA'].includes(formData.subOperacion) && formData.operacion === 'CUENTAS_CORRIENTES') {
        configKey = 'CUENTAS_CORRIENTES_COMPRA_VENTA';
      } else if (['INGRESO', 'SALIDA', 'PRESTAMO', 'DEVOLUCION'].includes(formData.subOperacion) && formData.operacion === 'SOCIOS') {
        configKey = 'SOCIOS_SHARED';
      } else if (formData.subOperacion === 'PRESTAMO' && formData.operacion === 'PRESTAMISTAS') {
        configKey = 'PRESTAMISTAS_PRESTAMO';
      } else if (formData.subOperacion === 'RETIRO' && formData.operacion === 'PRESTAMISTAS') {
        configKey = 'PRESTAMISTAS_RETIRO';
      } else if (formData.subOperacion === 'MOV ENTRE CUENTAS' && formData.operacion === 'INTERNAS') {
        configKey = 'MOV_ENTRE_CUENTAS';
      }
    }

    return specificFieldsConfig[configKey] || [];
  };

  const specificFields = getSpecificFieldsConfig();

  return (
    <form 
      id="financial-operations-form"
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSaveMovement();
      }}
    >
      {/* Header del formulario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-light-primary/10 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center">
            <DollarSign size={20} className="text-light-primary dark:text-dark-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold table-cell">Nueva Operación Financiera</h1>
            <p className="description-text">Completa los datos de la operación</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-secondary flex items-center gap-2"
          >
            <X size={16} />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Campos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="Fecha"
          type="date"
          value={formData.fecha}
          onChange={(value) => onFieldChange('fecha', value)}
          required
        />
        
        <FormInput
          label="Día"
          value={formData.nombreDia}
          readOnly
          className="bg-light-surface dark:bg-dark-surface"
        />
        
        <ClientAutocomplete
          label="Cliente"
          value={formData.cliente}
          onChange={(value) => onFieldChange('cliente', value)}
          clients={clients}
          onSaveClient={onSaveClient}
          required
        />
      </div>

      {/* Operación y Sub-operación */}
      <div className="space-y-4">
        <div>
          <label className="form-label">Operación</label>
          <ButtonSelectGroup
            options={operaciones}
            value={formData.operacion}
            onChange={(value) => onFieldChange('operacion', value)}
            className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          />
        </div>

        {formData.operacion && (
          <div>
            <label className="form-label">Sub-operación</label>
            <SubOperationButtons
              operation={formData.operacion}
              value={formData.subOperacion}
              onChange={(value) => onFieldChange('subOperacion', value)}
            />
          </div>
        )}
      </div>

      {/* Detalle */}
      <FormInput
        label="Detalle"
        value={formData.detalle}
        onChange={(value) => onFieldChange('detalle', value)}
        multiline
        rows={3}
      />

      {/* Campos específicos dinámicos */}
      {specificFields.length > 0 && (
        <DynamicFormFieldGroups
          groups={specificFields}
          formData={formData}
          onFieldChange={onFieldChange}
          onSaveClient={onSaveClient}
        />
      )}

      {/* Pagos mixtos */}
      {isMixedPaymentActive && (
        <MixedPaymentGroup
          mixedPayments={formData.mixedPayments}
          expectedTotal={formData.expectedTotalForMixedPayments}
          onMixedPaymentChange={handleMixedPaymentChange}
          onAddMixedPayment={addMixedPayment}
          onRemoveMixedPayment={removeMixedPayment}
        />
      )}

      {/* Campos adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormSelect
          label="Estado"
          value={formData.estado}
          onChange={(value) => onFieldChange('estado', value)}
          options={estados}
        />
        
        <FormInput
          label="Autorizado/Ejecutado por"
          value={formData.por}
          onChange={(value) => onFieldChange('por', value)}
        />
        
        <FormInput
          label="Nombre (Otro)"
          value={formData.nombreOtro}
          onChange={(value) => onFieldChange('nombreOtro', value)}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-6 border-t border-light-border dark:border-dark-border">
        <button
          type="button"
          onClick={onCancelEdit}
          className="btn-secondary flex items-center gap-2"
        >
          <X size={16} />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          <span>Guardar Operación</span>
        </button>
      </div>
    </form>
  );
};

export default OperationsForm;
