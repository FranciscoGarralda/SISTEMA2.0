import React from 'react';
import Link from 'next/link';

const ErrorPage = ({ 
  statusCode = 404, 
  title = 'Página no encontrada', 
  message = 'La página que buscas no existe o ha sido movida.',
  showHomeButton = true 
}) => {
  const getErrorIcon = () => {
    switch (statusCode) {
      case 404:
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        );
      case 500:
        return (
          <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          {getErrorIcon()}
        </div>
        
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {statusCode}
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Ir al Inicio
            </button>
          )}
          
          <button
            onClick={handleGoBack}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Volver Atrás
          </button>
        </div>
        
        {statusCode === 404 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              ¿Buscas algo específico?
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/operaciones" className="text-blue-600 hover:text-blue-800">Operaciones</Link>
              <Link href="/clientes" className="text-blue-600 hover:text-blue-800">Clientes</Link>
              <Link href="/movimientos" className="text-blue-600 hover:text-blue-800">Movimientos</Link>
              <Link href="/stock" className="text-blue-600 hover:text-blue-800">Stock</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
