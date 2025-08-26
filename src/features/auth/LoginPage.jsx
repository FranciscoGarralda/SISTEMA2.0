import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services';

export default function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!formData.username || !formData.password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    setLoading(true);

    try {
      // Simplificar el proceso de login para modo local
      console.log('Intentando login con:', formData.username);
      
      const response = await apiService.login(formData.username, formData.password);
      
      console.log('Login response:', response);
      
      // Verificar si la respuesta es exitosa y tiene un usuario
      if (response && response.success && response.user) {
        console.log('Login exitoso, usuario:', response.user);
        onLoginSuccess(response.user);
      } else if (response && response.success === false) {
        // Mensajes de error más específicos
        setError(response.message || 'Usuario o contraseña incorrectos');
      } else {
        // Si la respuesta no tiene la estructura esperada
        console.error('Respuesta inesperada:', response);
        setError('Error al procesar la respuesta. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error de login:', err);
      
      // Manejo específico de errores para modo local
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Error de conexión. Verifica tu internet.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="main-container flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="main-title text-center mb-2">
            Sistema Financiero
          </h2>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              Modo local activo
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium empty-state-text mb-2">
                Usuario (no email)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                autoFocus
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 form-input focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Ingresa tu usuario"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium empty-state-text mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 form-input focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:empty-state-text"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}