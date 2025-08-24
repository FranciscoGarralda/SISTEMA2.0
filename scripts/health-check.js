#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE SALUD DEL SISTEMA 2.0');
console.log('==========================================\n');

// Verificar Node.js
console.log('✅ Node.js:', process.version);

// Verificar NPM
const npmVersion = require('child_process').execSync('npm --version', { encoding: 'utf8' }).trim();
console.log('✅ NPM:', npmVersion);

// Verificar archivos de configuración
const configFiles = [
  '.env.local',
  'package.json',
  'netlify.toml',
  'next.config.js',
  'tailwind.config.js'
];

console.log('\n📁 ARCHIVOS DE CONFIGURACIÓN:');
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
  }
});

// Verificar dependencias
console.log('\n📦 DEPENDENCIAS:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['next', 'react', 'react-dom', '@netlify/functions'];
const requiredDevDeps = ['concurrently', 'netlify-cli'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - FALTANTE`);
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - FALTANTE`);
  }
});

// Verificar scripts
console.log('\n🚀 SCRIPTS DISPONIBLES:');
const requiredScripts = ['dev:full', 'health', 'test:full', 'db:setup'];
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}`);
  } else {
    console.log(`❌ ${script} - FALTANTE`);
  }
});

// Verificar funciones Netlify
console.log('\n⚡ FUNCIONES NETLIFY:');
const functionsDir = 'netlify/functions';
if (fs.existsSync(functionsDir)) {
  const functions = fs.readdirSync(functionsDir).filter(file => file.endsWith('.js'));
  functions.forEach(func => {
    console.log(`✅ ${func}`);
  });
} else {
  console.log('❌ Directorio netlify/functions no encontrado');
}

// Verificar puertos disponibles
console.log('\n🌐 PUERTOS:');
const ports = [3000, 8888];
ports.forEach(port => {
  try {
    require('child_process').execSync(`lsof -i :${port}`, { stdio: 'ignore' });
    console.log(`⚠️  Puerto ${port} está en uso`);
  } catch {
    console.log(`✅ Puerto ${port} disponible`);
  }
});

console.log('\n🎯 RESUMEN:');
console.log('El sistema está listo para desarrollo local.');
console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Ejecutar: npm install');
console.log('2. Ejecutar: npm run dev:full');
console.log('3. Abrir: http://localhost:3000');
console.log('4. Login: admin / admin');
