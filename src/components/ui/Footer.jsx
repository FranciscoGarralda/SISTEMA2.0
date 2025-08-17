import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Footer component for the Alliance F&R application
 * Minimal thin line footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = "V13"; // Versión restaurada con backend local

  return (
    <footer className="bg-white border-t border-gray-200 flex-shrink-0">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center text-xs text-gray-700">
          <div className="flex items-center space-x-2">
            <span>© {currentYear} Alliance F&R</span>
            <span className="px-1.5 py-0.5 bg-gray-200 rounded-md font-medium">{version}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Hecho con</span>
            <Heart size={10} className="text-red-500" />
            <span>para optimizar tu gestión</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;