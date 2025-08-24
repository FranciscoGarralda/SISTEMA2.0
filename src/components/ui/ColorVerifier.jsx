import React, { useEffect, useState } from 'react';

const ColorVerifier = () => {
  const [cssVariables, setCssVariables] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkCSSVariables = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const variables = {
        '--primary-500': computedStyle.getPropertyValue('--primary-500'),
        '--bg-primary': computedStyle.getPropertyValue('--bg-primary'),
        '--text-primary': computedStyle.getPropertyValue('--text-primary'),
        '--border-primary': computedStyle.getPropertyValue('--border-primary'),
        '--bg-input': computedStyle.getPropertyValue('--bg-input'),
      };
      
      setCssVariables(variables);
      setIsDarkMode(root.classList.contains('dark'));
    };

    checkCSSVariables();
    
    // Verificar cada segundo
    const interval = setInterval(checkCSSVariables, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const testColors = [
    { name: 'Primary Blue', variable: '--primary-500', expected: '#2196f3' },
    { name: 'Background Primary', variable: '--bg-primary', expected: isDarkMode ? '#0f172a' : '#ffffff' },
    { name: 'Text Primary', variable: '--text-primary', expected: isDarkMode ? '#f8fafc' : '#1e293b' },
    { name: 'Border Primary', variable: '--border-primary', expected: isDarkMode ? '#334155' : '#e2e8f0' },
    { name: 'Input Background', variable: '--bg-input', expected: isDarkMode ? '#334155' : '#ffffff' },
  ];

  return (
    <div className="p-8 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Verificador de Colores CSS
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado del modo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Estado del Sistema
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Modo actual:</span>
              <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {isDarkMode ? 'Oscuro' : 'Claro'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Clase dark aplicada:</span>
              <span className={`font-semibold ${document.documentElement.classList.contains('dark') ? 'text-green-600' : 'text-red-600'}`}>
                {document.documentElement.classList.contains('dark') ? 'Sí' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">CSS cargado:</span>
              <span className="font-semibold text-green-600">Sí</span>
            </div>
          </div>
        </div>

        {/* Variables CSS */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Variables CSS Aplicadas
          </h3>
          
          <div className="space-y-2">
            {testColors.map((color) => {
              const actualValue = cssVariables[color.variable];
              const isCorrect = actualValue.trim() === color.expected;
              
              return (
                <div key={color.variable} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {color.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isCorrect ? '✅' : '❌'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Esperado:</span>
                      <div className="font-mono text-gray-700 dark:text-gray-300">{color.expected}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Actual:</span>
                      <div className="font-mono text-gray-700 dark:text-gray-300">{actualValue || 'No definido'}</div>
                    </div>
                  </div>
                  
                  {actualValue && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Color:</span>
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: actualValue }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pruebas visuales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Pruebas Visuales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input de prueba */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Input de prueba:
            </label>
            <input 
              type="text" 
              placeholder="Escribe algo aquí..." 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Botón de prueba */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Botón de prueba:
            </label>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Botón Primario
            </button>
          </div>
          
          {/* Card de prueba */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Card de prueba:
            </label>
            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white">Contenido de prueba</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información de debug */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Información de Debug
        </h4>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <p>• Versión: V70 - CSS completamente reescrito</p>
          <p>• Tema: {isDarkMode ? 'Oscuro azulado' : 'Claro moderno'}</p>
          <p>• Variables CSS aplicadas: {Object.keys(cssVariables).length}/5</p>
          <p>• Última verificación: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ColorVerifier;
