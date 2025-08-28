import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services';

// Módulos disponibles en el sistema
const SYSTEM_MODULES = [
  { id: 'operaciones', name: 'Operaciones Financieras', icon: '💰' },
  { id: 'clientes', name: 'Clientes', icon: '👥' },
  { id: 'movimientos', name: 'Movimientos', icon: '📊' },
  { id: 'pendientes', name: 'Pendientes de Retiro', icon: '⏰' },
  { id: 'gastos', name: 'Gastos', icon: '📝' },
  { id: 'cuentas-corrientes', name: 'Cuentas Corrientes', icon: '🏢' },
  { id: 'prestamistas', name: 'Prestamistas', icon: '💳' },
  { id: 'comisiones', name: 'Comisiones', icon: '💵' },
  { id: 'utilidad', name: 'Utilidad', icon: '📈' },
  { id: 'arbitraje', name: 'Arbitraje', icon: '🔄' },
  { id: 'saldos', name: 'Saldos', icon: '💼' },
  { id: 'caja', name: 'Caja Diaria', icon: '🧮' },
  { id: 'rentabilidad', name: 'Rentabilidad', icon: '📊' },
  { id: 'stock', name: 'Stock', icon: '📦' },
  { id: 'saldos-iniciales', name: 'Saldos Iniciales', icon: '⚙️' }
];

const ROLES = [
  { id: 'admin', name: 'Administrador', description: 'Acceso total al sistema' },
  { id: 'operator', name: 'Operador', description: 'Acceso a operaciones y consultas' },
  { id: 'viewer', name: 'Visualizador', description: 'Solo lectura' }
];

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFixButton, setShowFixButton] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator',
    permissions: [],
    active: true
  });

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-reparar si hay error de base de datos
  useEffect(() => {
    if (error && (error.includes('relation') || error.includes('does not exist') || error.includes('500'))) {
      console.log('🔧 Error detectado, intentando auto-reparación...');
      setTimeout(() => {
        fixUserSystem();
      }, 1000);
    }
  }, [error]);

  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Función de auto-reparación
  const fixUserSystem = async () => {
    try {
      console.log('🔧 Iniciando reparación automática del sistema de usuarios...');
      setError('');
      setSuccess('Reparando sistema de usuarios...');
      
      // Intentar crear la tabla de usuarios si no existe
      await apiService.createUserTable();
      
      setSuccess('Sistema de usuarios reparado correctamente');
      await loadUsers();
    } catch (fixError) {
      console.error('Error en reparación automática:', fixError);
      setError('No se pudo reparar automáticamente. Contacte al administrador.');
      setShowFixButton(true);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.name || !formData.email) {
      setError('Nombre y email son requeridos');
      return;
    }

    if (!editingUser && !formData.password) {
      setError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const updateData = { ...formData };
        // No enviar password vacío en actualización
        if (!updateData.password) {
          delete updateData.password;
        }
        await apiService.updateUser(editingUser.id, updateData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await apiService.createUser(formData);
        setSuccess('Usuario creado correctamente');
      }
      
      await loadUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      // Mejor manejo de errores del backend
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        // Si el error indica que necesita reparación
        if (error.response?.data?.requiresFix) {
          setShowFixButton(true);
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Error al guardar usuario. Por favor, intente nuevamente.');
      }
    } finally {
      setSaving(false);
    }
  }, [formData, editingUser, loadUsers]);

  // Manejar eliminación de usuario
  const handleDelete = useCallback(async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await apiService.deleteUser(userId);
      setSuccess('Usuario eliminado correctamente');
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error al eliminar usuario');
    }
  }, [loadUsers]);

  // Manejar edición de usuario
  const handleEdit = useCallback((user) => {
    // Asegurarse de que permissions sea un array
    let userPermissions = user.permissions || [];
    if (typeof userPermissions === 'string') {
      // Si viene como string de PostgreSQL, parsearlo
      userPermissions = userPermissions
        .replace(/^{/, '')
        .replace(/}$/, '')
        .split(',')
        .filter(p => p && p.trim());
    }
    
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't show existing password
      role: user.role,
      permissions: userPermissions,
      active: user.active !== false
    });
    setShowForm(true);
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'operator',
      permissions: [],
      active: true
    });
    setEditingUser(null);
    setShowForm(false);
  }, []);

  // Cambiar campo del formulario
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Alternar permiso
  const togglePermission = useCallback((moduleId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(moduleId)
        ? prev.permissions.filter(p => p !== moduleId)
        : [...prev.permissions, moduleId]
    }));
  }, []);

  // Limpiar mensajes
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  return {
    // Estado
    users,
    showForm,
    editingUser,
    loading,
    saving,
    error,
    success,
    showFixButton,
    formData,
    
    // Constantes
    SYSTEM_MODULES,
    ROLES,
    
    // Acciones
    loadUsers,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
    handleFieldChange,
    togglePermission,
    clearMessages,
    fixUserSystem,
    
    // Utilidades
    hasUsers: users.length > 0,
    userCount: users.length
  };
};
