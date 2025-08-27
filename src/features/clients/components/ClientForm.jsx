import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FormInput, FormSelect } from '../../../components/forms';

const ClientForm = ({ cliente, onSave, onCancel, guardando }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    dni: '',
    direccion: '',
    tipoCliente: '',
    email: '',
    observaciones: ''
  });
  
  const [errores, setErrores] = useState({});
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Inicializar formulario con datos del cliente si es edición
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        telefono: cliente.telefono || '',
        dni: cliente.dni || '',
        direccion: cliente.direccion || '',
        tipoCliente: cliente.tipoCliente || '',
        email: cliente.email || '',
        observaciones: cliente.observaciones || ''
      });
    }
  }, [cliente]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
    if (!formData.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio';
    if (!formData.dni.trim()) nuevosErrores.dni = 'El DNI es obligatorio';
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria';
    if (!formData.tipoCliente) nuevosErrores.tipoCliente = 'Debe seleccionar el tipo de cliente';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    try {
      const datosCliente = { 
        ...cliente, 
        ...formData, 
        id: cliente?.id,
        operaciones: cliente?.operaciones || [],
        ultimaOperacion: cliente?.ultimaOperacion || null,
        totalOperaciones: cliente?.totalOperaciones || 0,
        volumenTotal: cliente?.volumenTotal || 0,
        createdAt: cliente?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave(datosCliente);
    } catch (error) {
      console.error('Error al guardar:', error);
      if (isMounted.current) {
        setErrores({ general: 'Error al guardar el cliente' });
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="">
          {/* Header */}
          <div className="section-header">
            <div className="flex items-center gap-3">
              <button 
                onClick={onCancel} 
                className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target flex-shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                  {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h1>
                <p className="description-text">
                  {cliente ? 'Modifica la información del cliente' : 'Completa los datos del nuevo cliente'}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Nombres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <FormInput
                    label="Nombre"
                    value={formData.nombre}
                    onChange={(value) => handleInputChange('nombre', value)}
                    placeholder="Ingrese el nombre"
                    required
                    error={errores.nombre}
                  />
                </div>
                <div>
                  <FormInput
                    label="Apellido"
                    value={formData.apellido}
                    onChange={(value) => handleInputChange('apellido', value)}
                    placeholder="Ingrese el apellido"
                    required
                    error={errores.apellido}
                  />
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <FormInput
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(value) => handleInputChange('telefono', value)}
                    placeholder="Ingrese el teléfono"
                    required
                    error={errores.telefono}
                  />
                </div>
                <div>
                  <FormInput
                    label="DNI"
                    value={formData.dni}
                    onChange={(value) => handleInputChange('dni', value)}
                    placeholder="Ingrese el DNI"
                    required
                    error={errores.dni}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <FormInput
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(value) => handleInputChange('direccion', value)}
                  placeholder="Ingrese la dirección completa"
                  required
                  error={errores.direccion}
                />
              </div>

              {/* Tipo de Cliente */}
              <div>
                <FormSelect
                  label="Tipo de Cliente"
                  value={formData.tipoCliente}
                  onChange={(value) => handleInputChange('tipoCliente', value)}
                  options={[
                    { value: 'operaciones', label: 'Operaciones' },
                    { value: 'prestamistas', label: 'Prestamistas' }
                  ]}
                  placeholder="Seleccione el tipo de cliente"
                  required
                  error={errores.tipoCliente}
                />
              </div>

              {/* Email y Observaciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <FormInput
                    label="Email (opcional)"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Ingrese el email"
                    type="email"
                  />
                </div>
                <div>
                  <FormInput
                    label="Observaciones (opcional)"
                    value={formData.observaciones}
                    onChange={(value) => handleInputChange('observaciones', value)}
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </div>

              {/* Error general */}
              {errores.general && (
                <div className="bg-error-100 border border-error-300 text-error-700 px-4 py-3 rounded-lg">
                  {errores.general}
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={guardando}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 touch-target"
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{cliente ? 'Actualizar Cliente' : 'Crear Cliente'}</span>
                  )}
                </button>
                <button
                  onClick={onCancel}
                  disabled={guardando}
                  className="btn-secondary flex-1 touch-target"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
