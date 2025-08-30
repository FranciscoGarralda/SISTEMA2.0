module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true, // Agregar soporte para Jest
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Reglas que desactivamos para permitir la compilación
    'no-unused-vars': 'warn',
    'no-case-declarations': 'off',
    'no-useless-escape': 'off',
    'no-empty': 'off',
    'no-undef': 'error',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    // Desactivar reglas problemáticas temporalmente
    'import/no-anonymous-default-export': 'off',
  },
  globals: {
    React: 'writable',
    // Agregar globals de Jest
    jest: 'readonly',
    describe: 'readonly',
    test: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
  },
  // Excluir archivos de test de algunas reglas
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-unused-vars': 'off', // Desactivar para tests
      },
    },
  ],
};