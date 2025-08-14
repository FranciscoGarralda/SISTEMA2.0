import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
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
  }, [onChange]);

  const handleCreateClient = useCallback(() => {
    setShowModal(true);
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
    
    // Para teclas de escritura, abrir dropdown
    if (e.key.length === 1) {
      setIsOpen(true);
    }
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

      focusManager.openMenu(dropdownRef.current, menuItems, {
        onClose: () => {
          setIsOpen(false);
          setSelectedIndex(-1);
        }
      });
    }, 50); // Pequeño delay para que el DOM se actualice
  };

  const handleInputFocus = () => {
    // NO abrir automáticamente el dropdown al recibir foco
    // Solo abrir cuando el usuario realmente quiera (Enter o escribir)
  };

  const clearSelection = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
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
              ref={(el) => {
                inputRef.current = el;
                if (ref) {
                  if (typeof ref === 'function') {
                    // Pasar el elemento con método openDropdown
                    const elementWithMethods = el ? {
                      ...el,
                      openDropdown: openDropdownWithKeyboard
                    } : el;
                    ref(elementWithMethods);
                  } else {
                    ref.current = el;
                  }
                }
              }}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full px-3 py-2 pr-12 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent placeholder:text-gray-800 sm:px-4 sm:py-2.5 sm:text-sm ${
                error 
                  ? 'border-error-500 focus:ring-error-500' 
                  : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
              } ${className}`}
              {...rest}
            />
            
            {/* Botón limpiar */}
            {inputValue && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Icono dropdown */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              } text-gray-500`} />
            </div>
          </div>

          {/* Dropdown de opciones */}
          {isOpen && (
            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredClients.length > 0 ? (
                <>
                  {filteredClients.map((client, index) => (
                    <button
                      key={client.id || client.nombre || index}
                      type="button"
                      onClick={() => handleClientSelect(client)}
                      className={`client-item w-full px-2 py-2 text-left focus:outline-none border-b border-gray-100 transition-colors duration-150 ${
                        index === selectedIndex 
                          ? 'bg-gray-50 text-gray-900' 
                          : 'hover:bg-gray-50 focus:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-gray-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {client.nombre} {client.apellido || ''}
                          </p>
                          {client.telefono && (
                            <p className="text-xs text-gray-700 truncate">
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
                    className="create-client-item w-full px-2 py-2 text-left focus:outline-none border-t border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
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
                  <div className="px-2 py-2 text-sm text-gray-700 text-center border-b border-gray-200">
                    {inputValue ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
                  </div>
                  
                  {/* Opción crear nuevo cliente cuando no hay resultados */}
                  <button
                    type="button"
                    onClick={handleCreateClient}
                    className="create-client-item w-full px-2 py-2 text-left focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
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

          className="flex-shrink-0 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gray-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-soft hover:shadow-medium focus:ring-1 focus:ring-gray-500 focus:ring-offset-2"
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