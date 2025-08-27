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
        // 🌙 Paleta Tema Oscuro - Alto Contraste y Legibilidad
        // ========================
        dark: {
          background: '#0F172A',       // Fondo principal: azul muy oscuro (mejor contraste)
          surface: '#1E293B',          // Superficies: azul oscuro (más diferenciado)
          text: '#F8FAFC',             // Texto primario: blanco puro (máximo contraste)
          textSecondary: '#CBD5E1',    // Texto secundario: gris claro (buen contraste)
          textMuted: '#94A3B8',        // Texto atenuado: gris medio (visible)
          primary: '#3B82F6',          // Color primario: azul vibrante
          primaryHover: '#2563EB',     // Primario hover: azul más oscuro
          secondary: '#8B5CF6',        // Color secundario: violeta vibrante
          accent: '#F59E0B',           // Acento: ámbar vibrante
          border: '#334155',           // Bordes: gris oscuro (más visible)
          borderHover: '#475569',      // Bordes hover: gris medio
          success: '#10B981',          // Éxito: verde vibrante
          error: '#EF4444',            // Error: rojo vibrante
          warning: '#F59E0B',          // Advertencia: ámbar vibrante
          info: '#3B82F6',             // Información: azul vibrante
          card: '#1E293B',             // Cards: azul oscuro (contraste con texto)
          cardHover: '#334155',        // Cards hover: gris oscuro
          input: '#1E293B',            // Inputs: azul oscuro (contraste con texto)
          inputFocus: '#334155',       // Inputs focus: gris oscuro
          header: '#0F172A',           // Header: azul muy oscuro
          sidebar: '#0F172A',          // Sidebar: azul muy oscuro
          sidebarText: '#F8FAFC',      // Texto sidebar: blanco puro
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
