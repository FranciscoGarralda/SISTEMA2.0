import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Sistema de comunicación entre hooks - Versión simplificada
 * Permite que los hooks emitan y escuchen eventos de forma segura
 */
export const useHookCommunication = () => {
  const [events, setEvents] = useState({});
  const listenersRef = useRef(new Map());
  const eventHistoryRef = useRef(new Map());

  // Emitir un evento de forma segura
  const emit = useCallback((eventName, data, options = {}) => {
    const { persistent = false, timestamp = Date.now() } = options;
    
    const eventData = {
      data,
      timestamp,
      persistent
    };

    // Actualizar estado de eventos de forma segura
    setEvents(prev => {
      const newEvents = { ...prev };
      newEvents[eventName] = eventData;
      return newEvents;
    });

    // Guardar en historial si es persistente
    if (persistent) {
      eventHistoryRef.current.set(eventName, eventData);
    }

    // Notificar a todos los listeners de forma segura
    const listeners = listenersRef.current.get(eventName) || [];
    listeners.forEach(callback => {
      try {
        callback(eventData);
      } catch (error) {
        console.error(`Error en listener de ${eventName}:`, error);
      }
    });
  }, []);

  // Escuchar un evento de forma segura
  const listen = useCallback((eventName, callback, options = {}) => {
    const { immediate = false, once = false } = options;
    
    // Registrar el listener de forma segura
    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, []);
    }
    
    const listeners = listenersRef.current.get(eventName);
    const wrappedCallback = once 
      ? (...args) => {
          try {
            callback(...args);
          } catch (error) {
            console.error(`Error en callback de ${eventName}:`, error);
          }
          // Remover después de ejecutar
          const index = listeners.indexOf(wrappedCallback);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      : (...args) => {
          try {
            callback(...args);
          } catch (error) {
            console.error(`Error en callback de ${eventName}:`, error);
          }
        };
    
    listeners.push(wrappedCallback);

    // Cleanup function
    return () => {
      const listeners = listenersRef.current.get(eventName);
      if (listeners) {
        const index = listeners.indexOf(wrappedCallback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }, []); // Remover dependencia de events para evitar bucles

  // Obtener el último valor de un evento
  const getLastEvent = useCallback((eventName) => {
    return events[eventName] || eventHistoryRef.current.get(eventName);
  }, [events]);

  // Verificar si un evento existe
  const hasEvent = useCallback((eventName) => {
    return !!events[eventName] || eventHistoryRef.current.has(eventName);
  }, [events]);

  // Limpiar eventos no persistentes
  const clearNonPersistent = useCallback(() => {
    setEvents(prev => {
      const newEvents = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (value.persistent) {
          newEvents[key] = value;
        }
      });
      return newEvents;
    });
  }, []);

  // Limpiar todos los eventos y listeners
  const clearAll = useCallback(() => {
    setEvents({});
    listenersRef.current.clear();
    eventHistoryRef.current.clear();
  }, []);

  return {
    emit,
    listen,
    getLastEvent,
    hasEvent,
    clearNonPersistent,
    clearAll,
    events
  };
};

// Hook para crear un contexto de comunicación simplificado
export const useCommunicationContext = () => {
  const communication = useHookCommunication();
  
  // Eventos estándar del sistema - versión simplificada
  const standardEvents = {
    // Eventos de datos
    'data:movements:updated': (movements) => communication.emit('data:movements:updated', movements, { persistent: true }),
    'data:clients:updated': (clients) => communication.emit('data:clients:updated', clients, { persistent: true }),
    'data:operations:updated': (operations) => communication.emit('data:operations:updated', operations, { persistent: true }),
   
    // Eventos de UI
    'ui:navigation:changed': (page) => communication.emit('ui:navigation:changed', page),
    'ui:filter:changed': (filter) => communication.emit('ui:filter:changed', filter),
    'ui:date:selected': (date) => communication.emit('ui:date:selected', date),
   
    // Eventos de estado
    'state:loading:start': (context) => communication.emit('state:loading:start', context),
    'state:loading:end': (context) => communication.emit('state:loading:end', context),
    'state:error:occurred': (error) => communication.emit('state:error:occurred', error),
   
    // Eventos de cálculos
    'calc:utility:updated': (utility) => communication.emit('calc:utility:updated', utility, { persistent: true }),
    'calc:balance:updated': (balance) => communication.emit('calc:balance:updated', balance, { persistent: true }),
    'calc:stock:updated': (stock) => communication.emit('calc:stock:updated', stock, { persistent: true }),
    'calc:prestamistas:updated': (data) => communication.emit('calc:prestamistas:updated', data, { persistent: true }),
    'calc:profitability:updated': (data) => communication.emit('calc:profitability:updated', data, { persistent: true }),
   
    // Eventos de autenticación
    'auth:login:success': (user) => communication.emit('auth:login:success', user),
    'auth:logout': () => communication.emit('auth:logout'),
    'auth:permissions:changed': (permissions) => communication.emit('auth:permissions:changed', permissions),
  };

  return {
    ...communication,
    events: standardEvents
  };
};
