import React from 'react';
import { Edit3, Trash2, Shield, Check, X } from 'lucide-react';

const UserList = ({ users, loading, onEdit, onDelete, SYSTEM_MODULES, ROLES }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center py-8 description-text">
            Cargando usuarios...
          </div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center py-8 description-text">
            No hay usuarios registrados
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Usuarios del Sistema</h2>
      </div>
      <div className="card-content">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell text-left">Usuario</th>
                <th className="table-cell text-left">Email</th>
                <th className="table-cell text-left">Rol</th>
                <th className="table-cell text-left">Estado</th>
                <th className="table-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium description-text">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium table-cell">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-sm description-text">
                    {user.email}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'operator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-light-surface dark:bg-dark-surface description-text'
                    }`}>
                      <Shield size={12} className="mr-1" />
                      {ROLES.find(r => r.id === user.role)?.name || user.role}
                    </span>
                  </td>
                  <td className="table-cell">
                    {user.active !== false ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check size={16} />
                        <span className="text-sm">Activo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <X size={16} />
                        <span className="text-sm">Inactivo</span>
                      </span>
                    )}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1.5 description-text hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-1.5 description-text hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
