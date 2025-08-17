module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next',
    'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // Reglas personalizadas
    'react/prop-types': 'off', // Desactivado porque usamos TypeScript para tipos
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Advertir sobre variables no usadas
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Advertir sobre console.logs
    'react/react-in-jsx-scope': 'off', // No es necesario importar React en Next.js
    'react/display-name': 'off', // Desactivar para componentes anónimos
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
