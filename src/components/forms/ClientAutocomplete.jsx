import React from 'react';
import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { Plus, User, ChevronDown, X } from 'lucide-react';
import ClientModal from './ClientModal';



const ClientAutocomplete = forwardRef(({
  label,
  value,
  onChange,
  clients = [],
  required = false,
  error = '',
  placeholder = 'Buscar o seleccionar cliente',
  className = '',
  onClientCreated,
  onKeyDown,
  onRegisterCreateButton,
  ...rest
}, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Inicializar inputValue con el cliente seleccionado
  useEffect(() => {
    if (value && clients && Array.isArray(clients) && clients.length > 0) {
      const selectedClient = clients.find(client => 
        (client.id || client.nombre) === value
      );
      if (selectedClient) {
        // Verificar si el nombre ya incluye el apellido
      let displayName = selectedClient.nombre || '';
      if (selectedClient.apellido && !displayName.includes(selectedClient.apellido)) {
        displayName = `${displayName} ${selectedClient.apellido}`.trim();
      }
      setInputValue(displayName);
      }
    } else if (!value) {
      setInputValue('');
    }
  }, [value, clients]);

  // Filtrar clientes basado en el input
  useEffect(() => {
    if (!clients || !Array.isArray(clients)) {
      setFilteredClients([]);
      return;
    }
    
    if (!inputValue.trim()) {
      setFilteredClients(clients.slice(0, 10)); // Mostrar primeros 10
    } else {
      const filtered = clients.filter(client => {
        const fullName = `${client.nombre} ${client.apellido || ''}`.toLowerCase();
        const searchTerm = inputValue.toLowerCase();
        return fullName.includes(searchTerm) || 
               client.telefono?.includes(searchTerm) ||
               client.dni?.includes(searchTerm);
      }).slice(0, 10);
      setFilteredClients(filtered);
    }
  }, [inputValue, clients]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setSelectedIndex(-1); // Reset selection when typing
    
    // Si se borra el input, limpiar la selección
    if (!newValue.trim()) {
      onChange('');
    }
  };

  const handleClientSelect = useCallback((client) => {
    const clientValue = client.id || client.nombre;
    
    // Verificar si el nombre ya incluye el apellido
    let clientLabel = client.nombre || '';
    if (client.apellido && !clientLabel.includes(client.apellido)) {
      clientLabel = `${clientLabel} ${client.apellido}`.trim();
    }
    
    setInputValue(clientLabel);
    onChange(clientValue);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [onChange]);

  const handleCreateClient = useCallback(() => {
    setShowModal(true);
    setIsOpen(false); // Cerrar dropdown al abrir modal
    setSelectedIndex(-1);
  }, []);

  // Handle basic input events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }
    
    if (e.key === 'Tab') {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredClients.length > 0 && selectedIndex >= 0) {
        // Seleccionar cliente actual
        const selectedClient = filteredClients[selectedIndex];
        if (selectedClient) {
          handleClientSelect(selectedClient);
        }
      } else if (isOpen) {
        // Si no hay selección pero el dropdown está abierto, abrir modal
        handleCreateClient();
      } else {
        // Si el dropdown está cerrado, abrirlo
        setIsOpen(true);
      }
      return;
    }
    
    // Para teclas de escritura, abrir dropdown
    if (e.key.length === 1) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    // NO abrir automáticamente el dropdown al recibir foco
    // Solo abrir cuando el usuario realmente quiera (Enter o escribir)
  };

  const clearSelection = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSelectedIndex(-1);
  };

  // Abrir dropdown con navegación por teclado - SIMPLIFIED
  const openDropdownWithKeyboard = () => {
    setIsOpen(true);
    
    // Preparar items para navegación
    const menuItems = filteredClients.map((client, index) => ({
      element: null, // Se asignará después
      text: (() => {
        let displayName = client.nombre || '';
        if (client.apellido && !displayName.includes(client.apellido)) {
          displayName = `${displayName} ${client.apellido}`.trim();
        }
        return displayName;
      })(),
      value: client.id || client.nombre,
      client: client,
      onSelect: () => {
        handleClientSelect(client);
      }
    }));

    // Agregar opción "Crear nuevo cliente"
    menuItems.push({
      element: null,
      text: 'Crear nuevo cliente',
      value: 'create-new',
      onSelect: () => {
        handleCreateClient();
      }
    });

    setTimeout(() => {
      // Asignar elementos DOM a los items
      const dropdownItems = dropdownRef.current?.querySelectorAll('.client-item, .create-client-item');
      if (dropdownItems) {
        dropdownItems.forEach((element, index) => {
          if (menuItems[index]) {
            menuItems[index].element = element;
          }
        });
      }

      // focusManager.openMenu(dropdownRef.current, menuItems, {
      //   onClose: () => {
      //     setIsOpen(false);
      //     setSelectedIndex(-1);
      //   }
      // });
    }, 50); // Pequeño delay para que el DOM se actualice
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs sm:text-sm font-medium empty-state-text">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Container para input + botón */}
      <div className="flex space-x-2">
        {/* Input con dropdown */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              ref={inputRef}
              id={`${label || 'cliente'}-input`}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              className={`w-full px-3 py-2 pr-12 text-base border rounded-lg focus:outline-none placeholder:description-text sm:px-4 sm:py-2.5 sm:text-sm ${
                error 
                  ? 'border-error-500' 
                  : 'bg-white table-cell border-gray-300'
              }`}
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={`${label || 'cliente'}-dropdown`}
              role="combobox"
              aria-label={`Seleccionar ${label || 'cliente'}`}
            />
            
            {/* Botón limpiar */}
            {inputValue && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Icono dropdown */}
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:description-text"
              aria-label="Desplegar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Dropdown de opciones */}
          {isOpen && (
            <div 
              id={`${label || 'cliente'}-dropdown`}
              className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto"
              role="listbox"
              aria-label={`Opciones de ${label || 'cliente'}`}
            >
              {filteredClients.length > 0 ? (
                <>
                  {filteredClients.map((client, index) => (
                    <button
                      key={client.id || client.nombre || index}
                      type="button"
                      onClick={() => handleClientSelect(client)}
                      className={`client-item w-full px-2 py-2 text-left focus:outline-none border-b border-gray-100 ${
                        selectedIndex === index
                          ? 'table-header'
                          : ''
                      }`}
                      role="option"
                      aria-selected={selectedIndex === index}
                      aria-label={`${client.nombre} ${client.apellido || ''}${client.telefono ? ` - ${client.telefono}` : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="description-text" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium table-cell truncate">
                            {client.nombre} {client.apellido || ''}
                          </p>
                          {client.telefono && (
                            <p className="text-xs empty-state-text truncate">
                              {client.telefono}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Opción crear nuevo cliente */}
                  <button
                    type="button"
                    onClick={handleCreateClient}
                    className="create-client-item w-full px-2 py-2 text-left focus:outline-none border-t border-gray-200 table-header"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Plus size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700">
                          Crear nuevo cliente
                        </p>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-2 py-2 text-sm empty-state-text text-center border-b border-gray-200">
                    {inputValue ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
                  </div>
                  
                  {/* Opción crear nuevo cliente cuando no hay resultados */}
                  <button
                    type="button"
                    onClick={handleCreateClient}
                    className="create-client-item w-full px-2 py-2 text-left focus:outline-none table-header"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Plus size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700">
                          Crear nuevo cliente
                        </p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Botón para crear cliente */}
        <button
          ref={(el) => onRegisterCreateButton && onRegisterCreateButton(el)}
          type="button"
          onClick={handleCreateClient}
          className="flex-shrink-0 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gray-900 text-white rounded-lg flex items-center justify-center"
          title="Crear nuevo cliente"
          aria-label="Crear nuevo cliente"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-error-600 mt-2 flex items-center">
          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Modal para crear cliente */}
      <ClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClientCreated={async (newClient) => {
          try {
            // Primero guardar el cliente
            if (onClientCreated) {
              const result = await onClientCreated(newClient);
              // Solo cerrar el modal si se retornó un resultado exitoso
              if (result) {
                // Autoseleccionar el cliente creado
                const idValue = result.id || result.nombre;
                let displayName = result.nombre || '';
                if (result.apellido && !displayName.includes(result.apellido)) {
                  displayName = `${displayName} ${result.apellido}`.trim();
                }
                setInputValue(displayName);
                onChange(idValue);
                setIsOpen(false);
                setShowModal(false);
                return result;
              }
            }
          } catch (error) {
            console.error('Error al crear cliente:', error);
            // Re-lanzar el error para que el modal lo maneje
            throw error;
          }
        }}
      />
    </div>
  );
});

ClientAutocomplete.displayName = 'ClientAutocomplete';

export default ClientAutocomplete;