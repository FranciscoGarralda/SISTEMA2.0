import React, { useCallback } from 'react';

// Importar errorHandler si está disponible, o crear un fallback
let errorHandler;
try {
  errorHandler = require('../../services/errorHandler').default;
} catch (e) {
  errorHandler = {
    handleCriticalError: (error) => console.error('Critical error:', error)
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retry: 0 
    };
    
    // Permitir reintentos limitados
    this.maxRetries = props.maxRetries || 1;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar con sistema central
    try {
      errorHandler.handleCriticalError(error, {
        component: this.props.componentName || 'Unknown',
        context: 'ErrorBoundary',
        errorInfo
      });
    } catch (e) {
      console.error('Error al registrar error en ErrorBoundary:', e);
    }
    
    // Enviar a servicio de monitoreo si existe
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }
  
  // Método para reiniciar el componente
  resetError = () => {
    if (this.state.retry < this.maxRetries) {
      this.setState(state => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retry: state.retry + 1
      }));
    } else {
      // Si superó reintentos, recargar página
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Error de Aplicación</h2>
                <p className="text-sm text-gray-600">Se ha producido un error inesperado</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer hover:text-gray-800">Detalles técnicos</summary>
                  <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40">{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={this.state.retry >= this.maxRetries}
              >
                Reintentar
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Recargar Página
              </button>
            </div>
            
            {this.state.retry > 0 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Intento {this.state.retry} de {this.maxRetries}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;