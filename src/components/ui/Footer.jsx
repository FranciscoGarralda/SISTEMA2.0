import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "V97"; // Correcciones críticas completadas - Sistema estable

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-gray-900 dark:text-white font-semibold">Alliance F&R</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Todos los derechos reservados
          </span>
          <span className="text-light-primary dark:text-dark-primary font-mono text-sm bg-light-primary/10 dark:bg-dark-primary/20 px-2 py-1 rounded-md">
            {version}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;