import { useState, useMemo, useRef, useCallback } from 'react';
import { useClientsStore } from '../../../stores';

export const useClients = () => {
  const {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    loadClients,
    searchClients,
    filterClients
  } = useClientsStore();

  const [vista, setVista] = useState('lista'); // 'lista', 'form', 'analytics'
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clienteAnalytics, setClienteAnalytics] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // Referencia para evitar actualizar estado en componente desmontado
  const desmontado = useRef(false);
  
  React.useEffect(() => {
    return () => {
      desmontado.current = true;
    };
  }, []);

  // Funciones de navegación
  const crearNuevoCliente = useCallback(() => {
    setClienteEditando(null);
    setVista('form');
  }, []);

  const editarCliente = useCallback((cliente) => {
    setClienteEditando(cliente);
    setVista('form');
  }, []);

  const eliminarCliente = useCallback((clienteId) => {
    const clienteAEliminar = clients.find(c => c.id === clienteId);
    if (clienteAEliminar) {
      const confirmacion = window.confirm(
        `¿Estás seguro de eliminar a ${clienteAEliminar.nombre} ${clienteAEliminar.apellido}?`
      );
      if (confirmacion) {
        deleteClient(clienteId);
      }
    }
  }, [clients, deleteClient]);

  const guardarCliente = useCallback(async (clienteData) => {
    try {
      setGuardando(true);
      
      const clienteToSave = { ...clienteData };
      
      let result;
      if (clienteEditando) {
        result = await updateClient(clienteEditando.id, clienteToSave);
      } else {
        result = await addClient(clienteToSave);
      }
      
      if (result && !desmontado.current) {
        setVista('lista');
        setClienteEditando(null);
      }
      
      return result;
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      throw error;
    } finally {
      if (!desmontado.current) setGuardando(false);
    }
  }, [clienteEditando, addClient, updateClient]);

  const verAnalytics = useCallback((cliente) => {
    setClienteAnalytics(cliente);
    setVista('analytics');
  }, []);

  const volverALista = useCallback(() => {
    if (desmontado.current) return;
    
    setVista('lista');
    setClienteEditando(null);
    setClienteAnalytics(null);
  }, []);

  // Función para calcular frecuencia de operaciones
  const calcularFrecuencia = useCallback((cliente) => {
    if (!cliente.operaciones || cliente.operaciones.length < 2) return 30;

    const fechas = cliente.operaciones.map(op => new Date(op.fecha)).sort((a, b) => a - b);
    let totalDias = 0;

    for (let i = 1; i < fechas.length; i++) {
      const diasEntre = Math.floor((fechas[i] - fechas[i-1]) / (1000 * 60 * 60 * 24));
      totalDias += diasEntre;
    }

    return Math.round(totalDias / (fechas.length - 1));
  }, []);

  // Función para determinar estado de contacto
  const getEstadoContacto = useCallback((cliente) => {
    if (!cliente.ultimaOperacion) return { color: 'bg-light-surface dark:bg-dark-surface description-text', texto: 'Sin datos' };

    const dias = Math.floor((new Date() - new Date(cliente.ultimaOperacion)) / (1000 * 60 * 60 * 24));
    const frecuencia = calcularFrecuencia(cliente);

    if (dias > frecuencia * 1.5) return { color: 'bg-error-100 text-error-600', texto: 'Contactar urgente' };
    if (dias > frecuencia) return { color: 'bg-warning-100 text-warning-600', texto: 'Contactar pronto' };
    return { color: 'bg-success-100 text-success-600', texto: 'Activo' };
  }, [calcularFrecuencia]);

  // Filtrar clientes por búsqueda
  const clientesFiltrados = useMemo(() => {
    const searchTerm = busqueda.toLowerCase();
    if (!searchTerm) return clients;
    
    return clients.filter(cliente => {
      const nombre = cliente.nombre || '';
      const apellido = cliente.apellido || '';
      const telefono = cliente.telefono || '';
      const dni = cliente.dni || '';
      
      return `${nombre} ${apellido}`.toLowerCase().includes(searchTerm) ||
             telefono.includes(searchTerm) ||
             dni.includes(searchTerm);
    });
  }, [clients, busqueda]);

  // Separar por tipo
  const clientesOperaciones = useMemo(() => 
    clientesFiltrados.filter(c => c.tipoCliente === 'operaciones'), 
    [clientesFiltrados]
  );
  
  const clientesPrestamistas = useMemo(() => 
    clientesFiltrados.filter(c => c.tipoCliente === 'prestamistas'), 
    [clientesFiltrados]
  );

  return {
    // Estado
    vista,
    clienteEditando,
    clienteAnalytics,
    busqueda,
    guardando,
    isLoading,
    error,
    
    // Datos
    clients,
    clientesFiltrados,
    clientesOperaciones,
    clientesPrestamistas,
    
    // Acciones
    crearNuevoCliente,
    editarCliente,
    eliminarCliente,
    guardarCliente,
    verAnalytics,
    volverALista,
    setBusqueda,
    loadClients,
    
    // Utilidades
    calcularFrecuencia,
    getEstadoContacto
  };
};
