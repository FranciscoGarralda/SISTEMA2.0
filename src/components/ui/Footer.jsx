import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "V114"; // Corregido problema de autenticación

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="text-gray-900 dark:text-white font-semibold text-sm">Alliance F&R</span>
        </div>
        
        <div className="flex items-center space-x-4 pb-2">
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            © {currentYear} Todos los derechos reservados
          </span>
          <span className="text-light-primary dark:text-dark-primary font-mono text-xs bg-light-primary/10 dark:bg-dark-primary/20 px-2 py-0.5 rounded-md">
            {version}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;