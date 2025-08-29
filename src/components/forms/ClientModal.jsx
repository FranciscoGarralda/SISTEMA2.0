import React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Save } from 'lucide-react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const ClientModal = ({
  isOpen,
  onClose,
  onClientCreated,
  title = "Crear Nuevo Cliente"
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    dni: '',
    direccion: '',
    tipo: 'operaciones' // Default tipo
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencias para navegación
  const fieldRefs = useRef({});
  
  // Función para registrar referencias de campos
  const registerField = useCallback((fieldName, ref) => {
    if (ref) {
      fieldRefs.current[fieldName] = ref;
    }
  }, []);

  // Función básica para manejar Escape
  const handleModalNavigation = useCallback((currentField, event) => {
    switch (event.key) {
      case 'Escape':
        // Escape cierra el modal
        onClose();
        break;
    }
  }, [onClose]);

  const tiposCliente = [
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'prestamistas', label: 'Prestamistas' }
  ];

  // Manejar navegación con teclado cuando el modal está abierto
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Escape cierra el modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Navegación con flechas solo dentro del modal
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const modal = document.querySelector('.client-modal-content');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), button:not([disabled]), textarea:not([disabled])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (currentIndex !== -1) {
          e.preventDefault();
          let nextIndex = currentIndex;
          
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % focusableElements.length;
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
          }
          
          focusableElements[nextIndex]?.focus();
        }
      }
    };

    // Agregar listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus en el primer campo al abrir
    setTimeout(() => {
      const firstInput = document.querySelector('.client-modal-content input');
      firstInput?.focus();
    }, 100);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de cliente es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.nombre, formData.telefono, formData.tipo]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación del evento
    
    console.log('🔧 Formulario enviado, previniendo navegación HTTP');
    
    if (!validateForm()) {
      console.log('❌ Validación fallida');
      return false; // Prevenir envío
    }

    setIsLoading(true);
    setErrors({}); // Limpiar errores previos

    try {
      console.log('🔧 Iniciando creación de cliente:', formData);
      
      // Crear datos del cliente sin ID (el backend lo generará)
      const clientData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        dni: formData.dni.trim(),
        direccion: formData.direccion.trim(),
        tipoCliente: formData.tipo
      };
      
      console.log('📋 Datos del cliente a guardar:', clientData);
      
      // Llamar directamente a la función de guardado
      const result = await onClientCreated(clientData);
      
      console.log('📤 Resultado de guardado:', result);
      
      // Verificar si se guardó exitosamente
      if (result && result.id) {
        console.log('✅ Cliente creado exitosamente');
        
        // Éxito - resetear formulario y cerrar modal
        setFormData({
          nombre: '',
          apellido: '',
          telefono: '',
          email: '',
          dni: '',
          direccion: '',
          tipo: 'operaciones'
        });
        setErrors({});
        onClose();
      } else {
        console.log('❌ No se pudo guardar el cliente');
        // Error - mostrar mensaje
        setErrors({ general: 'No se pudo guardar el cliente. Verifica los datos.' });
      }
    } catch (error) {
      console.error('❌ Error creating client:', error);
      
      // Manejar errores específicos
      let errorMessage = 'Error al crear el cliente.';
      
      if (error.message) {
        if (error.message.includes('duplicate') || error.message.includes('duplicado')) {
          errorMessage = 'Ya existe un cliente con ese nombre o teléfono.';
        } else if (error.message.includes('network') || error.message.includes('conexión')) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        } else if (error.message.includes('localStorageBackend')) {
          errorMessage = 'Error interno del sistema. Intenta nuevamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
    
    return false; // Prevenir envío del formulario
  }, [validateForm, formData, onClientCreated, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-large max-w-md w-full max-h-[90vh] overflow-y-auto client-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User size={18} className="description-text" />
            </div>
            <h2 className="text-xl font-semibold table-cell">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X size={20} className="empty-state-text" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4">
          {/* Error general */}
          {errors.general && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-600">{errors.general}</p>
            </div>
          )}

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              ref={(el) => registerField('nombre', el)}
              label="Nombre"
              value={formData.nombre}
              onChange={(value) => handleInputChange('nombre', value)}
              placeholder="Ingresa el nombre"
              required
              error={errors.nombre}
            />
            <FormInput
              ref={(el) => registerField('apellido', el)}
              label="Apellido"
              value={formData.apellido}
              onChange={(value) => handleInputChange('apellido', value)}
              placeholder="Ingresa el apellido"
            />
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              ref={(el) => registerField('telefono', el)}
              label="Teléfono"
              type="tel"
              value={formData.telefono}
              onChange={(value) => handleInputChange('telefono', value)}
              placeholder="+54 9 11 1234-5678"
              required
              error={errors.telefono}
            />
            <FormInput
              ref={(el) => registerField('email', el)}
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="cliente@email.com"
            />
          </div>

          {/* DNI */}
          <FormInput
            ref={(el) => registerField('dni', el)}
            label="DNI"
            value={formData.dni}
            onChange={(value) => handleInputChange('dni', value)}
            placeholder="12345678"
          />

          {/* Tipo de Cliente */}
          <FormSelect
            ref={(el) => registerField('tipo', el)}
            label="Tipo de Cliente"
            value={formData.tipo}
            onChange={(value) => handleInputChange('tipo', value)}
            options={tiposCliente}
            required
            error={errors.tipo}
          />

          {/* Dirección */}
          <FormInput
            ref={(el) => registerField('direccion', el)}
            label="Dirección"
            value={formData.direccion}
            onChange={(value) => handleInputChange('direccion', value)}
            placeholder="Calle, número, ciudad"
          />

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              ref={(el) => registerField('cancelar', el)}
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 empty-state-text bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              ref={(el) => registerField('guardar', el)}
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 hover:bg-slate-800 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Crear Cliente</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;