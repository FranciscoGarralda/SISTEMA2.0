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
        // 🌅 Paleta Tema Claro - Elegante y Profesional
        // ========================
        light: {
          background: '#FFFFFF',        // Fondo principal: blanco puro
          surface: '#FAFBFC',           // Superficies: gris muy claro
          text: '#1A202C',             // Texto primario: gris muy oscuro
          textSecondary: '#4A5568',    // Texto secundario: gris medio
          textMuted: '#718096',        // Texto atenuado: gris claro
          primary: '#3182CE',          // Color primario: azul profesional
          primaryHover: '#2C5282',     // Primario hover: azul oscuro
          secondary: '#805AD5',        // Color secundario: púrpura elegante
          accent: '#ED8936',           // Acento: naranja cálido
          border: '#E2E8F0',           // Bordes: gris muy claro
          borderHover: '#CBD5E0',      // Bordes hover: gris claro
          success: '#38A169',          // Éxito: verde profesional
          error: '#E53E3E',            // Error: rojo profesional
          warning: '#D69E2E',          // Advertencia: amarillo profesional
          info: '#3182CE',             // Información: azul
          card: '#FFFFFF',             // Cards: blanco
          cardHover: '#F7FAFC',        // Cards hover: gris muy claro
          input: '#FFFFFF',            // Inputs: blanco
          inputFocus: '#EBF8FF',       // Inputs focus: azul muy claro
          header: '#FFFFFF',           // Header: blanco
          sidebar: '#2D3748',          // Sidebar: gris oscuro elegante
          sidebarText: '#F7FAFC',      // Texto sidebar: gris muy claro
        },
        // ========================
        // 🌙 Paleta Tema Oscuro - Elegante y Sofisticada
        // ========================
        dark: {
          background: '#1A202C',       // Fondo principal: gris muy oscuro
          surface: '#2D3748',          // Superficies: gris oscuro
          text: '#F7FAFC',             // Texto primario: gris muy claro
          textSecondary: '#E2E8F0',    // Texto secundario: gris claro
          textMuted: '#A0AEC0',        // Texto atenuado: gris medio
          primary: '#63B3ED',          // Color primario: azul claro vibrante
          primaryHover: '#4299E1',     // Primario hover: azul medio
          secondary: '#B794F4',        // Color secundario: púrpura claro
          accent: '#F6AD55',           // Acento: naranja claro
          border: '#4A5568',           // Bordes: gris medio
          borderHover: '#718096',      // Bordes hover: gris claro
          success: '#68D391',          // Éxito: verde claro
          error: '#FC8181',            // Error: rojo claro
          warning: '#F6E05E',          // Advertencia: amarillo claro
          info: '#63B3ED',             // Información: azul claro
          card: '#2D3748',             // Cards: gris oscuro
          cardHover: '#4A5568',        // Cards hover: gris medio
          input: '#4A5568',            // Inputs: gris medio
          inputFocus: '#718096',       // Inputs focus: gris claro
          header: '#1A202C',           // Header: gris muy oscuro
          sidebar: '#1A202C',          // Sidebar: gris muy oscuro
          sidebarText: '#F7FAFC',      // Texto sidebar: gris muy claro
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
