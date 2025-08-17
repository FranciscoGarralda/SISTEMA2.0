import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Phone, 
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { getClientName, formatAmountWithCurrency } from '../../shared/services/formatters';

/**
 * Módulo para gestionar operaciones pendientes de retiro
 * Muestra operaciones con estado: pendiente_retiro y pendiente_entrega
 */
const PendientesRetiroApp = ({ movements = [], clients = [], onEditMovement, onDeleteMovement, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  // Filtrar movimientos pendientes de retiro
  const pendientesRetiro = useMemo(() => {
    return movements.filter(movement => 
      movement.estado === 'pendiente_retiro' || movement.estado === 'pendiente_entrega'
    );
  }, [movements]);

  // Aplicar filtros de búsqueda
  const filteredMovements = useMemo(() => {
    let filtered = pendientesRetiro;

    // Filtro por estado
    if (filterEstado !== 'all') {
      filtered = filtered.filter(movement => movement.estado === filterEstado);
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(movement => 
        getClientName(movement.cliente, clients).toLowerCase().includes(searchLower) ||
        movement.monto?.toString().includes(searchLower) ||
        movement.moneda?.toLowerCase().includes(searchLower) ||
        movement.direccion?.toLowerCase().includes(searchLower) ||
        movement.telefono?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar por fecha (más recientes primero)
    return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [pendientesRetiro, searchTerm, filterEstado]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

    // Removed duplicate formatAmount function - using formatAmountWithCurrency instead

  const getEstadoBadge = (estado) => {
    const badges = {
      'pendiente_retiro': { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'P. Retiro' 
      },
      'pendiente_entrega': { 
        bg: 'bg-gray-200', 
        text: 'text-gray-900', 
        label: 'P. Entrega' 
      }
    };
    
    const badge = badges[estado] || { bg: 'bg-gray-100', text: 'text-gray-800', label: estado };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Clock className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-2 lg:p-3 safe-top safe-bottom pt-24">
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="">
          {/* Header */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-orange-600" />
              Pendientes
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de operaciones pendientes de retiro y entrega
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-700">Total pendientes</div>
            <div className="text-2xl font-bold text-orange-600">
              {filteredMovements.length}
            </div>
          </div>
        </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por cliente, monto, moneda, dirección o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente_retiro">P. Retiro</option>
              <option value="pendiente_entrega">P. Entrega</option>
            </select>
            </div>
          </div>
          </div>

          {/* Lista de operaciones pendientes */}
          <div className="p-3 sm:p-4 lg:p-6">
      {filteredMovements.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay operaciones pendientes
          </h3>
          <p className="text-gray-700">
            {searchTerm || filterEstado !== 'all' 
              ? 'No se encontraron operaciones con los filtros aplicados'
              : 'Todas las operaciones están completadas'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMovements.map((movement, index) => (
            <div
              key={movement.id || index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                       {getClientName(movement.cliente, clients)}
                     </h3>
                    <p className="text-sm text-gray-700">
                      {movement.operacion} - {movement.subOperacion}
                    </p>
                  </div>
                </div>
                {getEstadoBadge(movement.estado)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-800" />
                  <div>
                    <div className="text-sm text-gray-700">Fecha</div>
                    <div className="font-medium">{formatDate(movement.fecha)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-800" />
                  <div>
                    <div className="text-sm text-gray-700">Monto</div>
                    <div className="font-medium text-green-600">
                      {formatAmountWithCurrency(movement.monto, movement.moneda, { showSymbol: false })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-800" />
                  <div>
                    <div className="text-sm text-gray-700">Dirección</div>
                    <div className="font-medium text-sm">
                      {movement.direccion || 'No especificada'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-800" />
                  <div>
                    <div className="text-sm text-gray-700">Teléfono</div>
                    <div className="font-medium">
                      {movement.telefono || 'No especificado'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onEditMovement && onEditMovement(movement)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => onDeleteMovement && onDeleteMovement(movement.id)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendientesRetiroApp;