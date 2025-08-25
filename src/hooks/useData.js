import { useState, useCallback } from 'react';
import { apiService } from '../services';

export const useData = () => {
  const [movements, setMovements] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingMovement, setEditingMovement] = useState(null);

  const loadDataFromBackend = useCallback(async () => {
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const [backendMovements, backendClients] = await Promise.all([
        apiService.getMovements().catch(() => []),
        apiService.getClients().catch(() => [])
      ]);
      
      setMovements(Array.isArray(backendMovements) ? backendMovements : []);
      setClients(Array.isArray(backendClients) ? backendClients : []);
    } catch (error) {
      console.error('Error loading data from backend:', error);
    }
  }, []);

  const handleSaveMovement = useCallback(async (movementData) => {
    try {
      let savedMovement;
      
      // Verificar si estamos en modo local
      if (apiService.baseURL === 'local') {
        
        if (editingMovement) {
          savedMovement = await apiService.updateMovement(editingMovement.id, movementData);
        } else {
          savedMovement = await apiService.createMovement(movementData);
        }
        
        // Actualizar estado local
        if (savedMovement) {
          setMovements(prevMovements => {
            if (!Array.isArray(prevMovements)) return [savedMovement];
            
            const updatedMovements = [...prevMovements];
            const existingIndex = updatedMovements.findIndex(m => m.id === savedMovement.id);
            
            if (existingIndex >= 0) {
              updatedMovements[existingIndex] = savedMovement;
            } else {
              updatedMovements.push(savedMovement);
            }
            
            return updatedMovements;
          });
        }
      } else {
        // Modo backend
        if (editingMovement) {
          savedMovement = await apiService.updateMovement(editingMovement.id, movementData);
        } else {
          savedMovement = await apiService.createMovement(movementData);
        }
        
        // Si se guardó en backend exitosamente, recargar datos
        if (savedMovement) {
          await loadDataFromBackend();
        }
      }
      
      setEditingMovement(null);
      return savedMovement;
    } catch (error) {
      console.error('Error saving movement:', error);
      alert(`Error al guardar el movimiento: ${error.message}`);
      throw error;
    }
  }, [editingMovement, loadDataFromBackend]);

  const handleDeleteMovement = useCallback(async (id) => {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await apiService.deleteMovement(id);
        await loadDataFromBackend();
      } catch (error) {
        console.error('Error deleting movement:', error);
        alert('Error al eliminar el movimiento');
      }
    }
  }, [loadDataFromBackend]);

  const handleEditMovement = useCallback((movement) => {
    setEditingMovement(movement);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMovement(null);
  }, []);

  const handleSaveClient = useCallback(async (clientData) => {
    try {
      
      // Verificar duplicados
      const existingClient = clients.find(c => 
        c.nombre.toLowerCase() === clientData.nombre.toLowerCase() && c.id !== clientData.id
      );

      if (existingClient) {
        alert('Ya existe un cliente con ese nombre');
        return null;
      }

      let savedClient;
      
      // Verificar si estamos en modo local
      if (apiService.baseURL === 'local') {
        // Guardar en localStorage
        savedClient = await apiService.createClient(clientData);
      } else {
        // Guardar en backend
        if (clientData.id && typeof clientData.id === 'number') {
          savedClient = await apiService.updateClient(clientData.id, clientData);
        } else {
          savedClient = await apiService.createClient(clientData);
        }
      }
      
      // Si se guardó exitosamente
      if (savedClient && savedClient.id) {
        setClients(prevClients => {
          if (!Array.isArray(prevClients)) return [savedClient];
          
          const updatedClients = [...prevClients];
          const existingIndex = updatedClients.findIndex(c => c.id === savedClient.id);
          
          if (existingIndex >= 0) {
            updatedClients[existingIndex] = savedClient;
          } else {
            updatedClients.push(savedClient);
          }
          
          return updatedClients;
        });
        
        return savedClient;
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }, [clients]);

  const handleDeleteClient = useCallback(async (id) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    const clientMovements = movements && Array.isArray(movements) 
      ? movements.filter(m => m.cliente === client.nombre)
      : [];
    
    if (clientMovements && clientMovements.length > 0) {
      alert(`No se puede eliminar el cliente "${client.nombre}" porque tiene ${clientMovements.length} movimientos asociados.`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar al cliente "${client.nombre}"?`)) {
      try {
        await apiService.deleteClient(id);
        await loadDataFromBackend();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
  }, [clients, movements, loadDataFromBackend]);

  return {
    movements,
    clients,
    editingMovement,
    loadDataFromBackend,
    handleSaveMovement,
    handleDeleteMovement,
    handleEditMovement,
    handleCancelEdit,
    handleSaveClient,
    handleDeleteClient
  };
};
