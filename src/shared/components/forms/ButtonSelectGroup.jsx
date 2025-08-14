import React from 'react';

const ButtonSelectGroup = ({
  label,
  value,
  onChange,
  options = [],
  name,
  required = false,
  error = '',
  readOnly = false,
  className = '',
  hideLabel = false // Nueva prop para ocultar el label
}) => {
  const handleButtonClick = (optionValue) => {
    if (!readOnly) {
      onChange(optionValue);
    }
  };

  const getButtonClasses = (optionValue) => {
    const isActive = value === optionValue;
    const baseClasses = isMoneda
      ? 'px-1 py-1 text-xs font-medium flex items-center justify-center rounded-md border transition-all min-w-[40px]'
      : isOperacion
        ? 'px-2.5 py-3 text-xs sm:text-sm font-medium flex items-center justify-center rounded-lg border transition-none min-h-[72px]'
        : 'px-4 py-2.5 text-sm font-medium flex items-center justify-center rounded-lg border transition-all';
    
    return `${baseClasses} ${
      readOnly
        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
        : isActive
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-200'
    }`;
  };

  // Para monedas, usar flex en línea horizontal
  const isMoneda = name?.includes('moneda') || name?.includes('Moneda');
  
  // Para operaciones principales (las que tienen emoji)
  const isOperacion = name === 'operacion';
  
  // Si hay más de 6 opciones, usar grid de 3 columnas
  const getGridCols = () => {
    if (!options || !Array.isArray(options)) return 'grid-cols-1';
    const optLength = options.length || 0;
    
    if (isMoneda) {
      // Para monedas, siempre en una línea horizontal
      if (optLength === 8) return 'grid-cols-8 gap-1';
      if (optLength === 7) return 'grid-cols-7 gap-1';
      if (optLength === 6) return 'grid-cols-6 gap-1';
      if (optLength === 5) return 'grid-cols-5 gap-1';
      return 'grid-cols-4 gap-1';
    }
    // Para operaciones principales (6 opciones), usar 3x2
    if (isOperacion && optLength === 6) return 'grid-cols-3 gap-2';
    // Para operaciones normales (6 opciones), usar 3 columnas
    if (optLength === 6) return 'grid-cols-2 sm:grid-cols-3';
    // Para 2 opciones, mostrar lado a lado
    if (optLength === 2) return 'grid-cols-2';
    return optLength > 6 ? 'grid-cols-3' : optLength > 3 ? 'grid-cols-2' : 'grid-cols-1';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && !hideLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`grid ${getGridCols()}`}>
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => handleButtonClick(optionValue)}
              className={getButtonClasses(optionValue)}
              disabled={readOnly}
              tabIndex={0}
              onKeyDown={(e) => {
                // Solo manejar Enter para activar el botón
                // El espacio ya es manejado nativamente por los botones
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleButtonClick(optionValue);
                }
              }}
            >
              {isMoneda ? (
                // Para monedas, separar emoji y texto
                (() => {
                  const parts = optionLabel.split(' ');
                  const emoji = parts[0];
                  const code = parts[1];
                  return (
                    <div className="flex flex-col items-center gap-0">
                      <span className="text-sm leading-none">{emoji}</span>
                      <span className="text-[8px] leading-none">{code}</span>
                    </div>
                  );
                })()
              ) : isOperacion ? (
                // Para operaciones principales, separar emoji y texto
                (() => {
                  const parts = optionLabel.split(' ');
                  const emoji = parts[0];
                  const text = parts.slice(1).join(' ').replace('_', ' ');
                  return (
                    <div className="flex flex-col items-center justify-center h-full">
                                             <span className="text-xl mb-0.5">{emoji}</span>
                       <span className="text-xs leading-tight text-center break-words hyphens-auto px-2 text-gray-800">
                         {text}
                       </span>
                    </div>
                  );
                })()
              ) : (
                optionLabel
              )}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-xs text-red-600 mt-2">
          {error}
        </p>
      )}
      
      <input
        type="hidden"
        name={name}
        value={value || ''}
      />
    </div>
  );
};

export default ButtonSelectGroup;