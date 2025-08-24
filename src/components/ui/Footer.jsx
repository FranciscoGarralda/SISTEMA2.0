import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "V57"; // Sistema completamente funcional - caché corrupto solucionado definitivamente y sincronizado

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">Alliance F&R</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Sistema Financiero</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} Todos los derechos reservados
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono text-sm bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
              {version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;