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
        // 🎨 Paleta Tema Claro - Elegante y Moderna
        // ========================
        light: {
          background: '#F8FAFC',        // Fondo principal: azul muy claro
          surface: '#FFFFFF',           // Superficies: blanco puro
          text: '#0F172A',             // Texto primario: slate muy oscuro
          textSecondary: '#475569',    // Texto secundario: slate medio
          textMuted: '#64748B',        // Texto atenuado: slate claro
          primary: '#0EA5E9',          // Color primario: sky azul
          primaryHover: '#0284C7',     // Primario hover: sky azul oscuro
          secondary: '#6366F1',        // Color secundario: indigo
          accent: '#F59E0B',           // Acento: ámbar
          border: '#E2E8F0',           // Bordes: slate muy claro
          borderHover: '#CBD5E1',      // Bordes hover: slate claro
          success: '#10B981',          // Éxito: verde esmeralda
          error: '#EF4444',            // Error: rojo
          warning: '#F59E0B',          // Advertencia: ámbar
          info: '#3B82F6',             // Información: azul
          card: '#FFFFFF',             // Cards: blanco
          cardHover: '#F1F5F9',        // Cards hover: slate muy claro
          input: '#FFFFFF',            // Inputs: blanco
          inputFocus: '#F8FAFC',       // Inputs focus: azul muy claro
          header: '#FFFFFF',           // Header: blanco
          sidebar: '#0F172A',          // Sidebar: slate muy oscuro
          sidebarText: '#F8FAFC',      // Texto sidebar: azul muy claro
        },
        // ========================
        // 🌙 Paleta Tema Oscuro - Elegante y Sofisticada
        // ========================
        dark: {
          background: '#0F172A',       // Fondo principal: slate muy oscuro
          surface: '#1E293B',          // Superficies: slate oscuro
          text: '#F8FAFC',             // Texto primario: azul muy claro
          textSecondary: '#CBD5E1',    // Texto secundario: slate claro
          textMuted: '#94A3B8',        // Texto atenuado: slate medio
          primary: '#0EA5E9',          // Color primario: sky azul
          primaryHover: '#0284C7',     // Primario hover: sky azul oscuro
          secondary: '#6366F1',        // Color secundario: indigo
          accent: '#F59E0B',           // Acento: ámbar
          border: '#334155',           // Bordes: slate oscuro
          borderHover: '#475569',      // Bordes hover: slate medio
          success: '#10B981',          // Éxito: verde esmeralda
          error: '#EF4444',            // Error: rojo
          warning: '#F59E0B',          // Advertencia: ámbar
          info: '#3B82F6',             // Información: azul
          card: '#1E293B',             // Cards: slate oscuro
          cardHover: '#334155',        // Cards hover: slate medio
          input: '#334155',            // Inputs: slate oscuro
          inputFocus: '#475569',       // Inputs focus: slate medio
          header: '#0F172A',           // Header: slate muy oscuro
          sidebar: '#0F172A',          // Sidebar: slate muy oscuro
          sidebarText: '#F8FAFC',      // Texto sidebar: azul muy claro
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
