import React, { useState, useEffect } from 'react';
import { Wallet, Save, RefreshCw, AlertCircle, Building2, Users } from 'lucide-react';
import { formatAmountWithCurrency, proveedoresCC } from '../../components/forms';
import { balanceService } from '../../services';
import { walletTypes, walletTypesTC, monedas } from '../../constants';
import { safeParseFloat } from '../../services/utilityService';

function SaldosInicialesApp() {
  const [activeTab, setActiveTab] = useState('cuentas'); // 'cuentas' o 'cc'
  const [balances, setBalances] = useState({});
  const [ccBalances, setCCBalances] = useState({});
  const [selectedMoneda, setSelectedMoneda] = useState('PESO');
  const [hasChanges, setHasChanges] = useState(false);
  const [hasCCChanges, setHasCCChanges] = useState(false);

  // Cargar saldos iniciales al montar
  useEffect(() => {
    loadBalances();
  }, []);

  const loadBalances = () => {
    const currentBalances = balanceService.getAllInitialBalancesByCuenta();
    setBalances(currentBalances);
    setHasChanges(false);
    
    const currentCCBalances = balanceService.getAllCCBalancesByProveedor();
    setCCBalances(currentCCBalances);
    setHasCCChanges(false);
  };

  // Obtener todas las cuentas disponibles
  const allWallets = [...new Set([
    ...walletTypes.map(w => w.value),
    ...walletTypesTC.map(w => w.value)
  ])].filter(w => w !== 'pago_mixto'); // Excluir pago_mixto que no es una cuenta real

  // Manejar cambio de saldo
  const handleBalanceChange = (cuenta, moneda, value) => {
    const newBalances = { ...balances };
    if (!newBalances[cuenta]) {
      newBalances[cuenta] = {};
    }
    newBalances[cuenta][moneda] = value;
    setBalances(newBalances);
    setHasChanges(true);
  };

  // Manejar cambio de saldo CC
  const handleCCBalanceChange = (proveedor, moneda, value) => {
    const newBalances = { ...ccBalances };
    if (!newBalances[proveedor]) {
      newBalances[proveedor] = {};
    }
    newBalances[proveedor][moneda] = value;
    setCCBalances(newBalances);
    setHasCCChanges(true);
  };

  // Guardar todos los cambios
  const handleSaveAll = () => {
    if (activeTab === 'cuentas') {
      Object.entries(balances).forEach(([cuenta, monedas]) => {
        Object.entries(monedas).forEach(([moneda, monto]) => {
          balanceService.setInitialBalance(cuenta, moneda, monto);
        });
      });
      setHasChanges(false);
      alert('Saldos iniciales de cuentas guardados correctamente');
    } else {
      Object.entries(ccBalances).forEach(([proveedor, monedas]) => {
        Object.entries(monedas).forEach(([moneda, monto]) => {
          balanceService.setCCBalance(proveedor, moneda, monto);
        });
      });
      setHasCCChanges(false);
      alert('Saldos iniciales de CC guardados correctamente');
    }
  };

  // Calcular total por moneda
  const totalesPorMoneda = {};
  if (balances && typeof balances === 'object') {
    Object.values(balances).forEach(cuentaMonedas => {
      if (cuentaMonedas && typeof cuentaMonedas === 'object') {
        Object.entries(cuentaMonedas).forEach(([moneda, monto]) => {
          if (!totalesPorMoneda[moneda]) {
            totalesPorMoneda[moneda] = 0;
          }
          totalesPorMoneda[moneda] += safeParseFloat(monto, 0);
        });
      }
    });
  }

  return (
    <div className="main-container p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="section-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 description-text" />
                </div>
                <div>
                  <h1 className="text-xl font-bold table-cell">Saldos Iniciales</h1>
                  <p className="text-sm description-text">
                    {activeTab === 'cuentas' 
                      ? 'Configurar saldos de apertura por cuenta' 
                      : 'Configurar deudas iniciales con proveedores'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadBalances}
                  className="p-2 description-text hover:table-cell hover:bg-gray-100 rounded-lg transition-colors"
                  title="Recargar"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={activeTab === 'cuentas' ? !hasChanges : !hasCCChanges}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    (activeTab === 'cuentas' ? hasChanges : hasCCChanges)
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('cuentas')}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'cuentas'
                  ? 'table-cell border-b-2 border-gray-900'
                  : 'text-gray-500 hover:empty-state-text'
              }`}
            >
              <Users size={18} />
              Cuentas (Stock)
            </button>
            <button
              onClick={() => setActiveTab('cc')}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'cc'
                  ? 'table-cell border-b-2 border-gray-900'
                  : 'text-gray-500 hover:empty-state-text'
              }`}
            >
              <Building2 size={18} />
              Cuentas Corrientes
            </button>
          </div>

          {/* Content */}
          {activeTab === 'cuentas' ? (
            <>
              {/* Selector de moneda */}
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {monedas.filter(m => m.value !== '').map(moneda => (
                    <button
                      key={moneda.value}
                      onClick={() => setSelectedMoneda(moneda.value)}
                      className={`px-2 py-3 rounded-lg font-medium transition-colors flex flex-col items-center justify-center ${
                        selectedMoneda === moneda.value
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 empty-state-text hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-2xl mb-1">{moneda.emoji}</span>
                      <span className="text-xs">{moneda.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de cuentas */}
              <div className="p-3 sm:p-4">
                <div className="space-y-3">
                  {allWallets.map(wallet => {
                    // Validar que wallet es string y tiene el formato correcto
                    if (typeof wallet !== 'string' || !wallet.includes('_')) {
                      return null;
                    }
                    
                    const [socio, tipo] = wallet.split('_');
                    const balance = balances[wallet]?.[selectedMoneda] || '';
                    
                    return (
                      <div key={wallet} className="flex items-center justify-between p-3 table-header rounded-lg">
                        <div>
                          <span className="font-medium table-cell">
                            {socio.toUpperCase()} - {tipo === 'efectivo' ? 'Efectivo' : 'Digital'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={balance}
                            onChange={(e) => handleBalanceChange(wallet, selectedMoneda, e.target.value)}
                            placeholder="0.00"
                            className="w-32 px-3 py-1.5 text-right border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white dark:bg-gray-700 table-cell dark:text-white"
                          />
                          <span className="text-sm description-text w-12">{selectedMoneda}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totales - Solo monedas con saldo */}
                {Object.entries(totalesPorMoneda).filter(([_, total]) => total > 0).length > 0 && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold description-text mb-3">Totales por Moneda</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(totalesPorMoneda)
                        .filter(([_, total]) => total > 0)
                        .map(([moneda, total]) => {
                          const monedaObj = monedas.find(m => m.value === moneda);
                          return (
                            <div key={moneda} className="flex items-center justify-between p-2 bg-white rounded">
                              <span className="text-sm font-medium">{monedaObj?.label || moneda}:</span>
                              <span className="text-sm font-bold">{formatAmountWithCurrency(total, moneda)}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Contenido de CC */}
              <div className="p-3 sm:p-4">
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Importante:</p>
                    <p>• Saldo negativo (-) = Les debemos</p>
                    <p>• Saldo positivo (+) = Nos deben</p>
                    <p>• Estos saldos NO afectan el stock</p>
                  </div>
                </div>

                {/* Lista de proveedores */}
                <div className="space-y-4">
                  {proveedoresCC.filter(p => p.value !== '').map(proveedor => (
                    <div key={proveedor.value} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold table-cell mb-3">{proveedor.label}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {proveedor.allowedCurrencies.map(moneda => {
                          const balance = ccBalances[proveedor.value]?.[moneda] || '';
                          const monedaObj = monedas.find(m => m.value === moneda);
                          
                          return (
                            <div key={moneda} className="flex items-center justify-between p-3 table-header rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{monedaObj?.emoji}</span>
                                <span className="font-medium">{moneda}</span>
                              </div>
                              <input
                                type="number"
                                value={balance}
                                onChange={(e) => handleCCBalanceChange(proveedor.value, moneda, e.target.value)}
                                placeholder="0.00"
                                className="w-32 px-3 py-1.5 text-right border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white dark:bg-gray-700 table-cell dark:text-white"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaldosInicialesApp;