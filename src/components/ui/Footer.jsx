import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "V26"; // Corregido modo local - localStorageBackend funcionando

  return (
    <footer className="bg-gray-800 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-400">
          <span>© {currentYear} Sistema Financiero</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono text-teal-400 dark:text-teal-400">{version}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-400">
          <span>Desarrollado con ❤️</span>
          <span className="hidden sm:inline">•</span>
          <span>Next.js + Netlify</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;