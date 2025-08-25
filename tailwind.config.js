/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/store/**/*.{js,ts,jsx,tsx,mdx}',
    './src/config/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ========================
        // 🎨 Paleta Tema Claro - Nueva
        // ========================
        light: {
          background: '#FFFFFF',        // Fondo principal: blanco puro
          text: '#1A1A1A',             // Texto primario: negro suave
          textSecondary: '#4D4D4D',    // Texto secundario: gris medio elegante
          primary: '#0D3B66',          // Color primario: azul marino profundo
          secondary: '#3A6EA5',        // Color secundario: azul medio
          border: '#E6E6E6',           // Detalles/bordes: gris claro
          success: '#3B9C6D',          // Éxito: verde sutil
          error: '#B23A48',            // Error: rojo elegante
          warning: '#F59E0B',          // Advertencia
          info: '#3B82F6',             // Información
          card: '#F8F9FA',             // Cards
          input: '#FFFFFF',            // Inputs
          header: '#FFFFFF',           // Header
          sidebar: '#0D3B66',          // Sidebar
        },
        // ========================
        // 🌙 Paleta Tema Oscuro - Nueva
        // ========================
        dark: {
          background: '#0D1B2A',       // Fondo principal: azul petróleo/marino oscuro
          text: '#F5F5F5',             // Texto primario: blanco humo
          textSecondary: '#B0B0B0',    // Texto secundario: gris claro elegante
          primary: '#1D4E89',          // Color primario: azul marino sofisticado
          secondary: '#3A6EA5',        // Color secundario: azul medio contrastante
          border: '#1E2E3D',           // Detalles/bordes: gris azulado profundo
          success: '#3B9C6D',          // Éxito: verde sutil
          error: '#B23A48',            // Error: rojo elegante
          warning: '#F39C12',          // Advertencia
          info: '#3498DB',             // Información
          card: '#112240',             // Cards
          input: '#1E2E3D',            // Inputs
          header: '#0D1B2A',           // Header
          sidebar: '#0D1B2A',          // Sidebar
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      boxShadow: {
        'netlify': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'netlify-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'netlify-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'netlify': '0.75rem',
        'netlify-lg': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
