#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗄️  CONFIGURACIÓN DE BASE DE DATOS - SISTEMA 2.0');
console.log('================================================\n');

// Verificar si existe el archivo de configuración de Neon
const neonConfigPath = 'netlify/functions/setup-db.js';
if (fs.existsSync(neonConfigPath)) {
  console.log('✅ Configuración de base de datos encontrada');
  
  // Leer y mostrar la configuración
  const setupContent = fs.readFileSync(neonConfigPath, 'utf8');
  console.log('📋 Configuración actual:');
  console.log(setupContent);
} else {
  console.log('❌ Configuración de base de datos no encontrada');
}

// Crear script de inicialización de datos de prueba
const seedData = `// Datos de prueba para el sistema
const testData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: 'admin', // En producción usar hash
      name: 'Administrador',
      role: 'admin',
      email: 'admin@sistema2.com'
    }
  ],
  clients: [
    {
      id: 1,
      nombre: 'Cliente Demo',
      apellido: 'Test',
      telefono: '+54 11 1234-5678',
      email: 'demo@test.com',
      dni: '12345678',
      direccion: 'Calle Demo 123'
    }
  ],
  movements: [
    {
      id: 1,
      tipo: 'compra',
      monto: 1000,
      moneda: 'USD',
      cliente_id: 1,
      fecha: new Date().toISOString(),
      estado: 'completado'
    }
  ]
};

console.log('🌱 Datos de prueba cargados:', testData);
module.exports = testData;`;

fs.writeFileSync('scripts/seed-data.js', seedData);
console.log('✅ Script de datos de prueba creado');

// Crear instrucciones de configuración
const instructions = `
📋 INSTRUCCIONES PARA CONFIGURAR LA BASE DE DATOS:

1. CREAR CUENTA EN NEON:
   - Ve a https://neon.tech
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. CONFIGURAR VARIABLES DE ENTORNO:
   - Copia la URL de conexión de Neon
   - Actualiza .env.local con la URL real

3. EJECUTAR MIGRACIONES:
   - npm run db:setup
   - npm run db:seed

4. VERIFICAR CONEXIÓN:
   - npm run health

🔗 URL de ejemplo para .env.local:
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/sistema2_0
`;

fs.writeFileSync('DATABASE_SETUP.md', instructions);
console.log('✅ Instrucciones de configuración creadas');

console.log('\n🎯 CONFIGURACIÓN COMPLETA');
console.log('Revisa DATABASE_SETUP.md para las instrucciones detalladas');
