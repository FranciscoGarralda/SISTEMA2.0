import React from 'react';
import { ArrowLeft, TrendingUp, Bell, Phone, CreditCard, MapPin } from 'lucide-react';

const ClientAnalytics = ({ cliente, onBack, calcularFrecuencia }) => {
  const frecuencia = calcularFrecuencia(cliente);
  
  const getRecomendacion = () => {
    if (!cliente.ultimaOperacion) return 'Cliente sin historial de operaciones. Recomendamos hacer seguimiento inicial.';
    
    const dias = Math.floor((new Date() - new Date(cliente.ultimaOperacion)) / (1000 * 60 * 60 * 24));
    
    if (dias > frecuencia * 1.5) {
      return `Cliente inactivo por ${dias} días. Frecuencia normal: ${frecuencia} días. CONTACTO URGENTE recomendado.`;
    } else if (dias > frecuencia) {
      return `Cliente próximo a su frecuencia normal (${frecuencia} días). Contacto preventivo recomendado.`;
    } else {
      return 'Cliente activo dentro de su patrón normal. Mantener seguimiento regular.';
    }
  };

  const recomendacion = getRecomendacion();

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="">
          {/* Header */}
          <div className="section-header">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack} 
                className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors touch-target flex-shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold table-cell truncate">
                  Análisis de {cliente.nombre} {cliente.apellido}
                </h1>
                <p className="description-text">
                  Métricas y patrones de comportamiento del cliente
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="table-header rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold description-text truncate">
                  {cliente.totalOperaciones || 0}
                </div>
                <div className="text-xs sm:text-sm description-text font-medium">Operaciones Totales</div>
              </div>

              <div className="bg-success-50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-success-600 truncate">
                  {cliente.volumenTotal ? cliente.volumenTotal.toLocaleString('es-AR') : '0'}
                </div>
                <div className="text-xs sm:text-sm text-success-600 font-medium">Volumen Total</div>
              </div>

              <div className="bg-warning-50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-warning-600">
                  {frecuencia}
                </div>
                <div className="text-xs sm:text-sm text-warning-600 font-medium">Días de Frecuencia</div>
              </div>

              <div className="bg-error-50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-error-600 truncate">
                  {cliente.ultimaOperacion ? 
                    Math.floor((new Date() - new Date(cliente.ultimaOperacion)) / (1000 * 60 * 60 * 24)) : 
                    'N/A'
                  }
                </div>
                <div className="text-xs sm:text-sm text-error-600 font-medium">Días Desde Última Op.</div>
              </div>
            </div>

            {/* Análisis de frecuencia */}
            <div className="bg-warning-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <TrendingUp size={16} className="text-warning-600 flex-shrink-0" />
                <span className="font-semibold table-cell text-sm sm:text-base">Patrón de Operaciones</span>
              </div>
              <p className="text-xs sm:text-sm text-warning-700">
                <strong>Frecuencia calculada:</strong> Este cliente opera cada <strong>{frecuencia} días</strong> en promedio.
                {cliente.operaciones && cliente.operaciones.length > 1 && (
                  <span> (Basado en {cliente.operaciones.length} operaciones históricas)</span>
                )}
              </p>
            </div>

            {/* Recomendaciones */}
            <div className="table-header rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <Bell size={16} className="description-text mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold table-cell block mb-2 sm:mb-3 text-base">Recomendación de Contacto</span>
                  <p className="description-text">{recomendacion}</p>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="border-t pt-24 sm:pt-6">
              <h3 className="font-semibold table-cell mb-3 sm:mb-4 text-sm sm:text-base">Información de Contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="description-text flex-shrink-0" />
                  <span className="truncate"><strong>Teléfono:</strong> {cliente.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="description-text flex-shrink-0" />
                  <span className="truncate"><strong>DNI:</strong> {cliente.dni}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin size={14} className="description-text flex-shrink-0" />
                  <span className="truncate"><strong>Dirección:</strong> {cliente.direccion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics;
