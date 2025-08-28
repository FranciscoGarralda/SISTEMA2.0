import React from 'react';
import { Save, X } from 'lucide-react';

const UserForm = ({
  formData,
  editingUser,
  saving,
  onFieldChange,
  onTogglePermission,
  onSubmit,
  onCancel,
  SYSTEM_MODULES,
  ROLES
}) => {
  const selectAllPermissions = () => {
    const allModuleIds = SYSTEM_MODULES.map(module => module.id);
    onFieldChange('permissions', allModuleIds);
  };

  const clearAllPermissions = () => {
    onFieldChange('permissions', []);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
      </div>
      <div className="card-content">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">
                Contraseña {editingUser && '(dejar vacío para mantener actual)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => onFieldChange('password', e.target.value)}
                className="form-input"
                required={!editingUser}
              />
            </div>
            
            <div>
              <label className="form-label">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => onFieldChange('role', e.target.value)}
                className="form-select"
              >
                {ROLES.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions */}
          {formData.role !== 'admin' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="form-label">Permisos de Acceso</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllPermissions}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Seleccionar todos
                  </button>
                  <span className="text-light-textMuted dark:text-dark-textMuted">|</span>
                  <button
                    type="button"
                    onClick={clearAllPermissions}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Limpiar todos
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 table-header rounded-lg max-h-96 overflow-y-auto">
                {SYSTEM_MODULES.map(module => (
                  <label
                    key={module.id}
                    className="flex items-center gap-2 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors bg-white border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(module.id)}
                      onChange={() => onTogglePermission(module.id)}
                      className="w-4 h-4 rounded border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary flex-shrink-0"
                    />
                    <span className="text-sm flex-shrink-0">{module.icon}</span>
                    <span className="text-sm empty-state-text truncate">{module.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => onFieldChange('active', e.target.checked)}
              className="rounded border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
            />
            <label htmlFor="active" className="text-sm empty-state-text">
              Usuario activo
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{editingUser ? 'Actualizar' : 'Crear'} Usuario</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
