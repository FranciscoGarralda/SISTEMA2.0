import React from 'react';

const ColorTest = () => {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Prueba de Colores Modernos
      </h2>
      
      {/* Colores primarios */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Colores Primarios (Google Material Design)
        </h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="w-full h-8 bg-blue-50 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Blue 50</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="w-full h-8 bg-blue-100 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Blue 100</p>
          </div>
          <div className="bg-blue-500 dark:bg-blue-400 p-4 rounded-lg">
            <div className="w-full h-8 bg-blue-500 dark:bg-blue-400 rounded mb-2"></div>
            <p className="text-xs text-white dark:text-gray-900">Blue 500</p>
          </div>
          <div className="bg-blue-600 dark:bg-blue-500 p-4 rounded-lg">
            <div className="w-full h-8 bg-blue-600 dark:bg-blue-500 rounded mb-2"></div>
            <p className="text-xs text-white dark:text-gray-900">Blue 600</p>
          </div>
          <div className="bg-blue-900 dark:bg-blue-600 p-4 rounded-lg">
            <div className="w-full h-8 bg-blue-900 dark:bg-blue-600 rounded mb-2"></div>
            <p className="text-xs text-white dark:text-gray-900">Blue 900</p>
          </div>
        </div>
      </div>

      {/* Modo oscuro azulado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Modo Oscuro Azulado
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
            <div className="w-full h-8 bg-slate-50 dark:bg-slate-900 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Slate 50/900</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border">
            <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Slate 100/800</p>
          </div>
          <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg border">
            <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Slate 200/700</p>
          </div>
          <div className="bg-slate-300 dark:bg-slate-600 p-4 rounded-lg border">
            <div className="w-full h-8 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Slate 300/600</p>
          </div>
        </div>
      </div>

      {/* Botones de prueba */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Botones con Colores Modernos
        </h3>
        <div className="flex gap-4 flex-wrap">
          <button className="btn-primary">
            Botón Primario
          </button>
          <button className="btn-secondary">
            Botón Secundario
          </button>
          <button className="btn-success">
            Botón Éxito
          </button>
          <button className="btn-warning">
            Botón Advertencia
          </button>
          <button className="btn-danger">
            Botón Peligro
          </button>
        </div>
      </div>

      {/* Inputs de prueba */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Inputs con Colores Modernos
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Input de texto" 
            className="input-modern"
          />
          <input 
            type="number" 
            placeholder="Input numérico" 
            className="input-modern"
          />
          <input 
            type="email" 
            placeholder="Input de email" 
            className="input-modern"
          />
          <input 
            type="date" 
            className="input-modern"
          />
        </div>
      </div>

      {/* Cards de prueba */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Cards con Colores Modernos
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Card Normal
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Esta es una card con los colores modernos aplicados.
            </p>
          </div>
          <div className="card-hover">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Card Hover
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Esta card tiene efectos hover.
            </p>
          </div>
          <div className="card-elevated">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Card Elevada
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Esta card tiene sombra elevada.
            </p>
          </div>
        </div>
      </div>

      {/* Información del tema */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Información del Tema
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Modo actual:</strong> {typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'Oscuro' : 'Claro'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Color primario:</strong> #2196f3 (Google Blue)
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Fondo oscuro:</strong> #0f172a (Azul muy oscuro)
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Texto primario:</strong> #1e293b (Claro) / #f8fafc (Oscuro)
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Bordes:</strong> #e2e8f0 (Claro) / #334155 (Oscuro)
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Versión:</strong> V68 - Colores modernos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTest;
