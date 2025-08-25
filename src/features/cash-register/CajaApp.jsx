import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Calendar, DollarSign, TrendingUp, TrendingDown, Check, X, Printer, Save, RefreshCw } from 'lucide-react';
import { formatAmountWithCurrency } from '../../components/forms';
import { safeParseFloat } from '../../services/utilityService';
import { cajaService } from '../../services';
import { monedas } from '../../constants';

function CajaApp({ movements = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashCounts, setCashCounts] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [hayCierreHoy, setHayCierreHoy] = useState(false);

  // Cargar apertura cuando cambia la fecha
  useEffect(() => {
    // Asegurarse de que el servicio esté inicializado
    if (!cajaService || typeof cajaService.getApertura !== 'function') {
      return;
    }
    
    const apertura = cajaService.getApertura(selectedDate);
    setCashCounts(apertura || {});
    
    // Verificar si ya hay cierre para esta fecha
    setHayCierreHoy(cajaService.hayCierre(selectedDate));
  }, [selectedDate]);

  // Filtrar movimientos del día seleccionado
  const dailyMovements = useMemo(() => {
    return movements.filter(mov => {
      const movDate = new Date(mov.fecha).toISOString().split('T')[0];
      return movDate === selectedDate;
    });
  }, [movements, selectedDate]);

  // Calcular totales por moneda y tipo
  const dailySummary = useMemo(() => {
    const summary = new Map();
    const apertura = cajaService.getApertura(selectedDate);

    // Inicializar todas las combinaciones
    monedas.forEach(moneda => {
      ['efectivo', 'digital'].forEach(tipo => {
        if (moneda.value === 'USDT' && tipo === 'efectivo') return;
        
        const key = `${moneda.value}-${tipo}`;
        summary.set(key, {
          moneda: moneda.value,
          monedaLabel: moneda.label,
          tipo,
          apertura: apertura[key] || 0, // Usar apertura del cierre anterior
          ingresos: 0,
          egresos: 0,
          esperado: 0,
          contado: 0,
          diferencia: 0,
          movimientos: []
        });
      });
    });

    // Procesar movimientos
    dailyMovements.forEach(mov => {
      if (!mov.cuenta || !mov.moneda || !mov.monto) return;
      
      // Validar que cuenta es string
      if (typeof mov.cuenta !== 'string' || !mov.cuenta.includes('_')) return;
      
      const cuentaParts = mov.cuenta.split('_');
      if (cuentaParts.length !== 2) return;
      
      const [socio, tipo] = cuentaParts;
      if (!['socio1', 'socio2', 'all'].includes(socio)) return;
      if (!['digital', 'efectivo'].includes(tipo)) return;
      
      const key = `${mov.moneda}-${tipo}`;
      const caja = summary.get(key);
      
      if (caja) {
        const monto = safeParseFloat(mov.monto);
        
        // Determinar si es ingreso o egreso
        let esIngreso = false;
        switch (mov.operacion) {
          case 'TRANSACCIONES':
            esIngreso = mov.subOperacion === 'VENTA';
            break;
          case 'CUENTAS_CORRIENTES':
            esIngreso = mov.subOperacion === 'INGRESO';
            break;
          case 'SOCIOS':
            esIngreso = ['INGRESO', 'PRESTAMO'].includes(mov.subOperacion);
            break;
          case 'ADMINISTRATIVAS':
            esIngreso = mov.subOperacion === 'AJUSTE' && monto > 0;
            break;
          case 'PRESTAMISTAS':
            esIngreso = mov.subOperacion === 'PRESTAMO';
            break;
        }
        
        if (esIngreso) {
          caja.ingresos += monto;
        } else {
          caja.egresos += monto;
        }
        
        caja.movimientos.push({
          ...mov,
          esIngreso,
          monto
        });
      }
      
      // Procesar pagos mixtos si existen
      if (mov.walletTC === 'pago_mixto' && mov.mixedPayments && Array.isArray(mov.mixedPayments)) {
        mov.mixedPayments.forEach(payment => {
          if (!payment.socio || !payment.tipo || !payment.monto) return;
          
          const montoMixto = safeParseFloat(payment.monto);
          if (montoMixto <= 0) return;
          
          const keyMixto = `${mov.monedaTC || mov.moneda}-${payment.tipo}`;
          const cajaMixto = summary.get(keyMixto);
          
          if (cajaMixto) {
            // Para pago mixto, siempre es egreso (estamos pagando)
            cajaMixto.egresos += montoMixto;
            cajaMixto.movimientos.push({
              ...mov,
              esIngreso: false,
              monto: montoMixto,
              esPagoMixto: true,
              socio: payment.socio,
              tipo: payment.tipo
            });
          }
        });
      }
    });

    // Calcular esperado
    summary.forEach(caja => {
      caja.esperado = caja.apertura + caja.ingresos - caja.egresos;
      caja.contado = safeParseFloat(cashCounts[`${caja.moneda}-${caja.tipo}`] || 0);
      caja.diferencia = caja.contado - caja.esperado;
    });

    return [...summary.values()];
  }, [dailyMovements, cashCounts, selectedDate]);

  // Manejar cambio en conteo de efectivo
  const handleCashCountChange = (key, value) => {
    setCashCounts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Guardar cierre de caja
  const handleGuardarCierre = () => {
    // Preparar resumen para guardar
    const resumen = {};
    dailySummary.forEach((caja, key) => {
      if (caja.tipo === 'efectivo' && (caja.esperado !== 0 || cashCounts[key])) {
        resumen[key] = {
          apertura: caja.apertura,
          ingresos: caja.ingresos,
          egresos: caja.egresos,
          esperado: caja.esperado,
          contado: safeParseFloat(cashCounts[key]) || 0,
          diferencia: caja.diferencia
        };
      }
    });

    // Guardar cierre
    cajaService.guardarCierre(selectedDate, cashCounts, resumen);
    setHayCierreHoy(true);
    
    alert('Cierre de caja guardado exitosamente');
  };

  // Recargar apertura
  const handleRecargarApertura = () => {
    const apertura = cajaService.getApertura(selectedDate);
    setCashCounts(apertura);
  };

  // Generar reporte
  const generateReport = () => {
    const report = {
      fecha: selectedDate,
      cajas: dailySummary,
      totalMovimientos: dailyMovements.length,
      generadoEn: new Date().toISOString()
    };
    
    // Idealmente se exportaría o imprimiría
    // Se omite el console.log en producción
    alert('Reporte generado');
  };

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="section-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 description-text" />
                </div>
                <div>
                  <h1 className="text-xl font-bold table-cell">Caja Diaria</h1>
                  <p className="text-sm description-text">Cuadre y control de efectivo</p>
                </div>
              </div>
              <button
                onClick={generateReport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Printer size={18} />
                <span className="hidden sm:inline">Generar Reporte</span>
              </button>
            </div>
          </div>

          {/* Controles */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="text-gray-500" size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 form-input focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <span className="text-sm description-text">
                  {dailyMovements.length} movimientos
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleRecargarApertura}
                  className="px-3 py-1.5 bg-gray-100 empty-state-text rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                  title="Recargar apertura del día anterior"
                >
                  <RefreshCw size={14} />
                  Apertura
                </button>
                
                <button
                  onClick={handleGuardarCierre}
                  disabled={hayCierreHoy}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    hayCierreHoy 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                  title={hayCierreHoy ? 'Ya existe un cierre para esta fecha' : 'Guardar cierre del día'}
                >
                  <Save size={14} />
                  {hayCierreHoy ? 'Guardado' : 'Guardar Cierre'}
                </button>
              </div>
            </div>
          </div>

          {/* Toggle detalles */}
          <div className="p-3 sm:p-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm description-text hover:table-cell transition-colors"
            >
              {showDetails ? 'Ocultar' : 'Mostrar'} detalles de movimientos
            </button>
          </div>
        </div>

        {/* Cuadre de cajas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {dailySummary.map(caja => (
            <div key={`${caja.moneda}-${caja.tipo}`} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold description-text">
                  {caja.monedaLabel} - {caja.tipo === 'efectivo' ? 'Efectivo' : 'Digital'}
                </h3>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  Math.abs(caja.diferencia) < 0.01 
                    ? 'table-header empty-state-text' 
                    : 'bg-gray-100 description-text'
                }`}>
                  {Math.abs(caja.diferencia) < 0.01 ? (
                    <Check size={14} className="inline" />
                  ) : (
                    <X size={14} className="inline" />
                  )}
                  {' '}
                  {formatAmountWithCurrency(caja.diferencia, caja.moneda)}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {/* Apertura */}
                <div className="flex justify-between">
                  <span className="description-text">Apertura:</span>
                  <span className="font-medium">{formatAmountWithCurrency(caja.apertura, caja.moneda)}</span>
                </div>

                {/* Ingresos */}
                <div className="flex justify-between">
                  <span className="description-text flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-600" />
                    Ingresos:
                  </span>
                  <span className="font-medium text-green-600">
                    +{formatAmountWithCurrency(caja.ingresos, caja.moneda)}
                  </span>
                </div>

                {/* Egresos */}
                <div className="flex justify-between">
                  <span className="description-text flex items-center gap-1">
                    <TrendingDown size={14} className="text-red-600" />
                    Egresos:
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatAmountWithCurrency(caja.egresos, caja.moneda)}
                  </span>
                </div>

                {/* Línea divisoria */}
                <div className="border-t border-gray-200 pt-2">
                  {/* Esperado */}
                  <div className="flex justify-between">
                    <span className="description-text font-medium">Esperado:</span>
                    <span className="font-bold">{formatAmountWithCurrency(caja.esperado, caja.moneda)}</span>
                  </div>

                  {/* Contado - Solo para efectivo */}
                  {caja.tipo === 'efectivo' && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="description-text font-medium">Contado:</span>
                      <input
                        type="number"
                        value={cashCounts[`${caja.moneda}-${caja.tipo}`] || ''}
                        onChange={(e) => handleCashCountChange(`${caja.moneda}-${caja.tipo}`, e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles de movimientos */}
              {showDetails && caja.movimientos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-medium empty-state-text mb-2">Movimientos:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {caja.movimientos.map((mov, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="description-text">
                          {mov.cliente} - {mov.operacion}
                        </span>
                        <span className={mov.esIngreso ? 'text-green-600' : 'text-red-600'}>
                          {mov.esIngreso ? '+' : '-'}{formatAmountWithCurrency(mov.monto, caja.moneda)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumen general */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold description-text mb-4">Resumen del Día</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm description-text">Total Operaciones</p>
              <p className="main-title">{dailyMovements.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm description-text">Cajas Activas</p>
              <p className="main-title">{dailySummary.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm description-text">Estado General</p>
              <p className="text-2xl font-bold">
                {dailySummary.every(c => Math.abs(c.diferencia) < 0.01) ? (
                  <span className="text-green-600">✓ Cuadrado</span>
                ) : (
                  <span className="text-red-600">✗ Descuadre</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CajaApp;