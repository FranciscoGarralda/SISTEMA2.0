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
        // 🎨 Paleta Tema Claro - Profesional y Elegante
        // ========================
        light: {
          background: '#FAFAFA',        // Fondo principal: blanco suave
          surface: '#FFFFFF',           // Superficies: blanco puro
          text: '#1F2937',             // Texto primario: gris muy oscuro
          textSecondary: '#6B7280',    // Texto secundario: gris medio
          textMuted: '#9CA3AF',        // Texto atenuado: gris claro
          primary: '#2563EB',          // Color primario: azul moderno
          primaryHover: '#1D4ED8',     // Primario hover: azul más oscuro
          secondary: '#64748B',        // Color secundario: slate gris
          accent: '#F59E0B',           // Acento: ámbar
          border: '#E5E7EB',           // Bordes: gris muy claro
          borderHover: '#D1D5DB',      // Bordes hover: gris claro
          success: '#10B981',          // Éxito: verde esmeralda
          error: '#EF4444',            // Error: rojo moderno
          warning: '#F59E0B',          // Advertencia: ámbar
          info: '#3B82F6',             // Información: azul
          card: '#FFFFFF',             // Cards: blanco
          cardHover: '#F9FAFB',        // Cards hover: gris muy claro
          input: '#FFFFFF',            // Inputs: blanco
          inputFocus: '#F3F4F6',       // Inputs focus: gris muy claro
          header: '#FFFFFF',           // Header: blanco
          sidebar: '#1F2937',          // Sidebar: gris muy oscuro
          sidebarText: '#F9FAFB',      // Texto sidebar: blanco
        },
        // ========================
        // 🌙 Paleta Tema Oscuro - Profesional y Elegante
        // ========================
        dark: {
          background: '#111827',       // Fondo principal: gris muy oscuro
          surface: '#1F2937',          // Superficies: gris oscuro
          text: '#F9FAFB',             // Texto primario: blanco
          textSecondary: '#D1D5DB',    // Texto secundario: gris claro
          textMuted: '#9CA3AF',        // Texto atenuado: gris medio
          primary: '#3B82F6',          // Color primario: azul moderno
          primaryHover: '#2563EB',     // Primario hover: azul más oscuro
          secondary: '#64748B',        // Color secundario: slate gris
          accent: '#F59E0B',           // Acento: ámbar
          border: '#374151',           // Bordes: gris oscuro
          borderHover: '#4B5563',      // Bordes hover: gris medio
          success: '#10B981',          // Éxito: verde esmeralda
          error: '#EF4444',            // Error: rojo moderno
          warning: '#F59E0B',          // Advertencia: ámbar
          info: '#3B82F6',             // Información: azul
          card: '#1F2937',             // Cards: gris oscuro
          cardHover: '#374151',        // Cards hover: gris medio
          input: '#374151',            // Inputs: gris oscuro
          inputFocus: '#4B5563',       // Inputs focus: gris medio
          header: '#111827',           // Header: gris muy oscuro
          sidebar: '#111827',          // Sidebar: gris muy oscuro
          sidebarText: '#F9FAFB',      // Texto sidebar: blanco
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
