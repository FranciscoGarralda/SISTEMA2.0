import { useState, useMemo, useCallback } from 'react';
import { useMovementsStore } from '../../../stores';

export const useMovements = () => {
  const {
    movements,
    isLoading,
    error,
    addMovement,
    updateMovement,
    deleteMovement,
    loadMovements,
    setFilters,
    setPagination,
    clearError,
    stats
  } = useMovementsStore();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [ordenarPor, setOrdenarPor] = useState('fecha');
  const [orden, setOrden] = useState('desc');

  // Filtrar movimientos por búsqueda
  const movimientosFiltrados = useMemo(() => {
    let filtrados = movements;

    // Filtro por búsqueda
    if (busqueda) {
      const searchTerm = busqueda.toLowerCase();
      filtrados = filtrados.filter(movimiento => {
        const cliente = movimiento.cliente || '';
        const descripcion = movimiento.descripcion || '';
        const monto = movimiento.monto?.toString() || '';
        const fecha = movimiento.fecha || '';
        
        return cliente.toLowerCase().includes(searchTerm) ||
               descripcion.toLowerCase().includes(searchTerm) ||
               monto.includes(searchTerm) ||
               fecha.includes(searchTerm);
      });
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      filtrados = filtrados.filter(movimiento => movimiento.tipo === filtroTipo);
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(movimiento => movimiento.estado === filtroEstado);
    }

    return filtrados;
  }, [movements, busqueda, filtroTipo, filtroEstado]);

  // Ordenar movimientos
  const movimientosOrdenados = useMemo(() => {
    const ordenados = [...movimientosFiltrados];
    
    ordenados.sort((a, b) => {
      let valorA, valorB;
      
      switch (ordenarPor) {
        case 'fecha':
          valorA = new Date(a.fecha);
          valorB = new Date(b.fecha);
          break;
        case 'monto':
          valorA = parseFloat(a.monto) || 0;
          valorB = parseFloat(b.monto) || 0;
          break;
        case 'cliente':
          valorA = (a.cliente || '').toLowerCase();
          valorB = (b.cliente || '').toLowerCase();
          break;
        case 'tipo':
          valorA = (a.tipo || '').toLowerCase();
          valorB = (b.tipo || '').toLowerCase();
          break;
        default:
          valorA = new Date(a.fecha);
          valorB = new Date(b.fecha);
      }
      
      if (orden === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });
    
    return ordenados;
  }, [movimientosFiltrados, ordenarPor, orden]);

  // Estadísticas de movimientos
  const estadisticas = useMemo(() => {
    const total = movements.length;
    const totalMonto = movements.reduce((sum, m) => sum + (parseFloat(m.monto) || 0), 0);
    const porTipo = movements.reduce((acc, m) => {
      acc[m.tipo] = (acc[m.tipo] || 0) + 1;
      return acc;
    }, {});
    const porEstado = movements.reduce((acc, m) => {
      acc[m.estado] = (acc[m.estado] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      totalMonto,
      porTipo,
      porEstado,
      promedio: total > 0 ? totalMonto / total : 0
    };
  }, [movements]);

  // Funciones de filtrado
  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setFiltroTipo('todos');
    setFiltroEstado('todos');
    setOrdenarPor('fecha');
    setOrden('desc');
  }, []);

  const aplicarFiltros = useCallback((nuevosFiltros) => {
    if (nuevosFiltros.busqueda !== undefined) setBusqueda(nuevosFiltros.busqueda);
    if (nuevosFiltros.tipo !== undefined) setFiltroTipo(nuevosFiltros.tipo);
    if (nuevosFiltros.estado !== undefined) setFiltroEstado(nuevosFiltros.estado);
    if (nuevosFiltros.ordenarPor !== undefined) setOrdenarPor(nuevosFiltros.ordenarPor);
    if (nuevosFiltros.orden !== undefined) setOrden(nuevosFiltros.orden);
  }, []);

  return {
    // Estado
    busqueda,
    filtroTipo,
    filtroEstado,
    ordenarPor,
    orden,
    isLoading,
    error,
    
    // Datos
    movements,
    movimientosFiltrados: movimientosOrdenados,
    estadisticas,
    stats,
    
    // Acciones
    addMovement,
    updateMovement,
    deleteMovement,
    loadMovements,
    setFilters,
    setPagination,
    clearError,
    
    // Filtros
    setBusqueda,
    setFiltroTipo,
    setFiltroEstado,
    setOrdenarPor,
    setOrden,
    limpiarFiltros,
    aplicarFiltros,
    
    // Utilidades
    hasMovements: movements.length > 0,
    movementCount: movements.length,
    filteredCount: movimientosOrdenados.length
  };
};
