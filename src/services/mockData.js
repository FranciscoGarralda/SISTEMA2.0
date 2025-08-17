/**
 * Datos mock temporales mientras se implementan las funciones de Netlify
 */

export const mockMovements = [];
export const mockUsers = [];

export const mockApiResponses = {
  // Movements
  getMovements: () => {
    console.log('Mock: getMovements called');
    return [];
  },
  
  createMovement: (data) => {
    console.log('Mock: createMovement called with:', data);
    const newMovement = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    mockMovements.push(newMovement);
    return newMovement;
  },
  
  updateMovement: (id, data) => {
    console.log('Mock: updateMovement called with:', id, data);
    const index = mockMovements.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMovements[index] = { ...mockMovements[index], ...data };
      return mockMovements[index];
    }
    return null;
  },
  
  deleteMovement: (id) => {
    console.log('Mock: deleteMovement called with:', id);
    const index = mockMovements.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMovements.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  },
  
  // Users
  getUsers: () => {
    console.log('Mock: getUsers called');
    return [];
  },
  
  createUser: (data) => {
    console.log('Mock: createUser called with:', data);
    const newUser = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },
  
  updateUser: (id, data) => {
    console.log('Mock: updateUser called with:', id, data);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
      return mockUsers[index];
    }
    return null;
  },
  
  deleteUser: (id) => {
    console.log('Mock: deleteUser called with:', id);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }
};

export default mockApiResponses;