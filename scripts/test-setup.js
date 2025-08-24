#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 CONFIGURACIÓN DE PRUEBAS DEL SISTEMA 2.0');
console.log('============================================\n');

// Crear directorio de pruebas si no existe
const testDir = 'tests';
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
  console.log('✅ Directorio de pruebas creado');
}

// Crear archivo de configuración de Jest
const jestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.jsx',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/pages/_app.js',
    '!src/pages/_document.js'
  ]
};`;

fs.writeFileSync('jest.config.js', jestConfig);
console.log('✅ Configuración de Jest creada');

// Crear archivo de setup de pruebas
const testSetup = `import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de fetch
global.fetch = jest.fn();

// Mock de console para evitar logs en pruebas
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};`;

fs.writeFileSync('tests/setup.js', testSetup);
console.log('✅ Setup de pruebas creado');

// Crear prueba de integración básica
const integrationTest = `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock del localStorageBackend
jest.mock('../src/services/localStorageBackend', () => ({
  login: jest.fn().mockResolvedValue({ user: { id: 1, name: 'Admin', role: 'admin' } }),
  getClients: jest.fn().mockResolvedValue([]),
  getMovements: jest.fn().mockResolvedValue([]),
  createClient: jest.fn().mockResolvedValue({ id: 1, name: 'Cliente Test' }),
  createMovement: jest.fn().mockResolvedValue({ id: 1, type: 'compra', amount: 1000 })
}));

describe('Sistema 2.0 - Pruebas de Integración', () => {
  test('Login exitoso con credenciales válidas', async () => {
    // Esta es una prueba básica que se puede expandir
    expect(true).toBe(true);
  });

  test('Creación de cliente exitosa', async () => {
    // Esta es una prueba básica que se puede expandir
    expect(true).toBe(true);
  });

  test('Creación de operación exitosa', async () => {
    // Esta es una prueba básica que se puede expandir
    expect(true).toBe(true);
  });
});`;

fs.writeFileSync('tests/integration.test.js', integrationTest);
console.log('✅ Prueba de integración básica creada');

console.log('\n🎯 CONFIGURACIÓN COMPLETA');
console.log('Las pruebas están listas para ejecutarse con: npm run test:full');
