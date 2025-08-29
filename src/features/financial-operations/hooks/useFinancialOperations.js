import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  safeParseFloat, 
  validateDate, 
  safeCalculation,
  safeArray 
} from '../../../services/utilityService';
import { getTodayLocalDate, getDayName } from '../../../utils/dateUtils';
import { useMixedPayments } from '../../../hooks/useMixedPayments';
import { operaciones } from '../../../constants/constants';

export const useFinancialOperations = ({ 
  onSaveMovement, 
  initialMovementData, 
  onCancelEdit, 
  clients, 
  onSaveClient, 
  reloadClients 
}) => {
  const [formData, setFormData] = useState({
    cliente: '',
    fecha: getTodayLocalDate(), // Fecha actual por defecto
    nombreDia: getDayName(getTodayLocalDate()), // Día actual
    detalle: '',
    operacion: '', // Sin predeterminado
    subOperacion: '', // Sin auto-selección
    proveedorCC: '',
    monto: '',
    moneda: '',
    cuenta: '',
    total: '',
    estado: '',
    por: '',
    nombreOtro: '',
    tc: '',
    monedaTC: '',
    monedaTCCmpra: '',
    monedaTCVenta: '',
    monedaVenta: '',
    tcVenta: '',
    comision: '',
    tipoComision: 'percentage', // 'percentage' o 'fixed'
    monedaComision: '',
    cuentaComision: '',
    interes: '',
    lapso: '',
    fechaLimite: '',
    socioSeleccionado: '',
    totalCompra: '',
    totalVenta: '',
    montoVenta: '',
    cuentaSalida: '',
    cuentaIngreso: '',
    // Mixed payment system - controlled by walletTC === 'pago_mixto'
    mixedPayments: [],
    expectedTotalForMixedPayments: '',
    ...initialMovementData
  });

  // Filter clients for prestamistas
  const prestamistaClientsOptions = useMemo(() => {
    const filtered = clients?.filter(c => c.tipoCliente === 'prestamistas') || [];
    return filtered.map(c => ({ value: c.nombre, label: `${c.nombre} ${c.apellido}` }));
  }, [clients]);

  // Custom hooks for clean separation of concerns
  const {
    isMixedPaymentActive,
    handleMixedPaymentChange,
    addMixedPayment,
    removeMixedPayment,
    validateMixedPayments
  } = useMixedPayments(formData, setFormData);

  // Navegación por teclado deshabilitada temporalmente
  const createElementRef = () => undefined;

  // Función para actualizar tabIndex en elementos dinámicos
  const updateTabIndexes = useCallback(() => {
    const formElement = document.getElementById('financial-operations-form');
    if (!formElement) return;
    
    // Asegurar que todos los botones de sub-operaciones tengan tabIndex
    const subOperationButtons = formElement.querySelectorAll('.grid button:not([tabindex])');
    subOperationButtons.forEach(button => {
      button.setAttribute('tabindex', '0');
    });
  }, []);

  // Configurar MutationObserver para detectar cambios en el DOM
  useEffect(() => {
    const observer = new MutationObserver(updateTabIndexes);
    const formElement = document.getElementById('financial-operations-form');
    if (formElement) {
      observer.observe(formElement, { childList: true, subtree: true });
    }
    
    return () => observer.disconnect();
  }, [updateTabIndexes]);

  // Configurar manejador de navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo procesar si estamos dentro del formulario
      const formElement = document.getElementById('financial-operations-form');
      if (!formElement || !formElement.contains(document.activeElement)) {
        return;
      }

      // Navegación con flechas - MEJORADA para todos los elementos
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // No interferir si estamos en un textarea o si se está usando con modificadores
        if (document.activeElement.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.shiftKey) {
          return;
        }
        
        // Incluir TODOS los elementos focusables, incluyendo botones con tabIndex
        const focusableElements = formElement.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), button:not([disabled]):not([type="submit"]), textarea:not([disabled]), [tabindex="0"]:not([disabled])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        // Si no hay elemento activo, empezar desde el primero
        if (currentIndex === -1 && focusableElements.length > 0) {
          e.preventDefault();
          focusableElements[0]?.focus();
          return;
        }
        
        if (currentIndex !== -1) {
          e.preventDefault(); // Solo prevenir default si vamos a cambiar el foco
          let nextIndex = currentIndex;
          
          // Para botones de operación/sub-operación, usar lógica especial
          const currentElement = document.activeElement;
          const isOperationButton = currentElement.closest('.grid');
          
          if (isOperationButton) {
            // Navegación especial para grids de botones
            const gridButtons = isOperationButton.querySelectorAll('button[tabindex="0"]');
            const gridIndex = Array.from(gridButtons).indexOf(currentElement);
            
            if (gridIndex !== -1) {
              let newGridIndex = gridIndex;
              
              if (e.key === 'ArrowRight') {
                newGridIndex = (gridIndex + 1) % gridButtons.length;
                gridButtons[newGridIndex]?.focus();
                return;
              } else if (e.key === 'ArrowLeft') {
                newGridIndex = (gridIndex - 1 + gridButtons.length) % gridButtons.length;
                gridButtons[newGridIndex]?.focus();
                return;
              }
            }
          }
          
          // Navegación normal para otros elementos
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % focusableElements.length;
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
          }
          
          focusableElements[nextIndex]?.focus();
        }
      }
      
      // Enter para abrir dropdowns
      if (e.key === 'Enter' && document.activeElement.tagName === 'SELECT') {
        e.preventDefault();
        document.activeElement.click();
      }
      
      // Escape para cancelar
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
      
      // Ctrl+S para guardar
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCancel, handleSubmit]);

  // Manejadores de eventos del formulario
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Lógica específica por campo
      if (field === 'fecha') {
        newData.nombreDia = getDayName(value);
      }
      
      if (field === 'operacion') {
        // Resetear sub-operación cuando cambia la operación
        newData.subOperacion = '';
      }
      
      if (field === 'cliente') {
        // Actualizar información del cliente si existe
        const selectedClient = clients?.find(c => c.nombre === value);
        if (selectedClient) {
          newData.nombreOtro = selectedClient.apellido || '';
        }
      }
      
      return newData;
    });
  }, [clients]);

  const handleSubmit = useCallback(async () => {
    try {
      // Validaciones básicas
      if (!formData.operacion) {
        alert('Por favor selecciona una operación');
        return;
      }
      
      if (!formData.cliente) {
        alert('Por favor selecciona un cliente');
        return;
      }
      
      if (!formData.fecha) {
        alert('Por favor ingresa una fecha');
        return;
      }
      
      // Validaciones específicas por operación
      const operation = operaciones.find(op => op.value === formData.operacion);
      if (!operation) {
        alert('Operación no válida');
        return;
      }
      
      // Validar campos requeridos según la operación
      const requiredFields = operation.requiredFields || [];
      for (const field of requiredFields) {
        if (!formData[field]) {
          alert(`Por favor completa el campo: ${field}`);
          return;
        }
      }
      
      // Validar pagos mixtos si están activos
      if (isMixedPaymentActive && !validateMixedPayments()) {
        return;
      }
      
      // Preparar datos para guardar
      const movementData = {
        ...formData,
        id: formData.id || Date.now().toString(),
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Llamar a la función de guardado
      await onSaveMovement(movementData);
      
      // Limpiar formulario después de guardar
      setFormData({
        cliente: '',
        fecha: getTodayLocalDate(),
        nombreDia: getDayName(getTodayLocalDate()),
        detalle: '',
        operacion: '',
        subOperacion: '',
        proveedorCC: '',
        monto: '',
        moneda: '',
        cuenta: '',
        total: '',
        estado: '',
        por: '',
        nombreOtro: '',
        tc: '',
        monedaTC: '',
        monedaTCCmpra: '',
        monedaTCVenta: '',
        monedaVenta: '',
        tcVenta: '',
        comision: '',
        tipoComision: 'percentage',
        monedaComision: '',
        cuentaComision: '',
        interes: '',
        lapso: '',
        fechaLimite: '',
        socioSeleccionado: '',
        totalCompra: '',
        totalVenta: '',
        montoVenta: '',
        cuentaSalida: '',
        cuentaIngreso: '',
        mixedPayments: [],
        expectedTotalForMixedPayments: ''
      });
      
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      alert('Error al guardar el movimiento. Por favor intenta de nuevo.');
    }
  }, [formData, onSaveMovement, isMixedPaymentActive, validateMixedPayments]);

  const handleCancel = useCallback(() => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  }, [onCancelEdit]);

  // Validaciones
  const isFormValid = useMemo(() => {
    return formData.operacion && formData.cliente && formData.fecha;
  }, [formData]);

  return {
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
  };
};
