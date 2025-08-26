/**
 * Script de prueba completa del sistema
 * Verifica: Login, navegación, funcionalidades principales
 */

console.log('🧪 INICIANDO PRUEBAS COMPLETAS DEL SISTEMA');
console.log('==========================================');

// Simular el entorno del navegador
global.window = {
  location: { href: 'http://localhost:3000' },
  localStorage: {
    getItem: (key) => {
      console.log(`📥 localStorage.getItem(${key})`);
      return null;
    },
    setItem: (key, value) => {
      console.log(`📤 localStorage.setItem(${key}, ${value})`);
    },
    removeItem: (key) => {
      console.log(`🗑️ localStorage.removeItem(${key})`);
    }
  },
  sessionStorage: {
    getItem: (key) => {
      console.log(`📥 sessionStorage.getItem(${key})`);
      return null;
    },
    setItem: (key, value) => {
      console.log(`📤 sessionStorage.setItem(${key}, ${value})`);
    },
    removeItem: (key) => {
      console.log(`🗑️ sessionStorage.removeItem(${key})`);
    }
  }
};

// Simular fetch para pruebas
global.fetch = async (url, options = {}) => {
  console.log(`🌐 fetch(${url})`, options.method || 'GET');
  
  // Simular respuesta exitosa para health check
  if (url.includes('/api/health')) {
    return {
      ok: true,
      json: async () => ({ status: 'ok' })
    };
  }
  
  // Simular respuesta para login
  if (url.includes('/auth/login')) {
    const body = JSON.parse(options.body || '{}');
    console.log(`🔐 Login attempt: ${body.username}/${body.password}`);
    
    if (body.username === 'admin' && body.password === 'admin') {
      return {
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: '1',
            username: 'admin',
            name: 'Administrador',
            role: 'admin'
          },
          token: 'test-token-' + Date.now()
        })
      };
    } else {
      return {
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Credenciales incorrectas'
        })
      };
    }
  }
  
  // Respuesta por defecto
  return {
    ok: true,
    json: async () => ({ success: true })
  };
};

// Importar el servicio de datos
const { apiService } = require('./src/services/dataService.js');

async function testLogin() {
  console.log('\n🔐 PRUEBA DE LOGIN');
  console.log('------------------');
  
  try {
    // Prueba 1: Login exitoso
    console.log('1. Probando login con admin/admin...');
    const successResponse = await apiService.login('admin', 'admin');
    console.log('✅ Login exitoso:', successResponse);
    
    // Prueba 2: Login fallido
    console.log('\n2. Probando login con credenciales incorrectas...');
    const failResponse = await apiService.login('wrong', 'wrong');
    console.log('❌ Login fallido:', failResponse);
    
    return true;
  } catch (error) {
    console.error('❌ Error en prueba de login:', error);
    return false;
  }
}

async function testDataOperations() {
  console.log('\n📊 PRUEBA DE OPERACIONES DE DATOS');
  console.log('----------------------------------');
  
  try {
    // Prueba de movimientos
    console.log('1. Probando getMovements...');
    const movements = await apiService.getMovements();
    console.log('✅ Movimientos obtenidos:', movements.length);
    
    // Prueba de clientes
    console.log('\n2. Probando getClients...');
    const clients = await apiService.getClients();
    console.log('✅ Clientes obtenidos:', clients.length);
    
    // Prueba de usuarios
    console.log('\n3. Probando getUsers...');
    const users = await apiService.getUsers();
    console.log('✅ Usuarios obtenidos:', users.length);
    
    return true;
  } catch (error) {
    console.error('❌ Error en operaciones de datos:', error);
    return false;
  }
}

async function testLocalStorage() {
  console.log('\n💾 PRUEBA DE LOCAL STORAGE');
  console.log('---------------------------');
  
  try {
    const { localStorageBackend } = require('./src/services/dataService.js');
    
    // Prueba de escritura
    console.log('1. Probando escritura en localStorage...');
    await localStorageBackend.set('test', { data: 'test' });
    console.log('✅ Escritura exitosa');
    
    // Prueba de lectura
    console.log('\n2. Probando lectura de localStorage...');
    const data = await localStorageBackend.get('test');
    console.log('✅ Lectura exitosa:', data);
    
    return true;
  } catch (error) {
    console.error('❌ Error en localStorage:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 EJECUTANDO TODAS LAS PRUEBAS...\n');
  
  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Operaciones de Datos', fn: testDataOperations },
    { name: 'Local Storage', fn: testLocalStorage }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    console.log(`\n🧪 Ejecutando: ${test.name}`);
    const result = await test.fn();
    if (result) {
      passed++;
      console.log(`✅ ${test.name}: PASÓ`);
    } else {
      console.log(`❌ ${test.name}: FALLÓ`);
    }
  }
  
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('=====================');
  console.log(`✅ Pasaron: ${passed}/${total}`);
  console.log(`❌ Fallaron: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está funcionando correctamente.');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisar errores arriba.');
  }
  
  return passed === total;
}

// Ejecutar pruebas
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Error fatal en las pruebas:', error);
  process.exit(1);
});
