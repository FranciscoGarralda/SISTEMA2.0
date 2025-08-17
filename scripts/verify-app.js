/**
 * Script para verificar que la aplicación funciona correctamente después de la migración
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verificar que las carpetas principales existen
const requiredDirs = [
  'src/components',
  'src/components/forms',
  'src/components/ui',
  'src/components/layouts',
  'src/services',
  'src/services/api',
  'src/hooks',
  'src/utils',
  'src/store',
  'src/constants',
  'src/pages'
];

console.log('Verificando estructura de carpetas...');
let allDirsExist = true;

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} existe`);
  } else {
    console.log(`❌ ${dir} no existe`);
    allDirsExist = false;
  }
});

if (!allDirsExist) {
  console.error('Faltan algunas carpetas requeridas');
  process.exit(1);
}

// Verificar que los archivos principales existen
const requiredFiles = [
  'src/services/api/api.js',
  'jsconfig.json',
  'next.config.js',
  'src/components/ui/Footer.jsx'
];

console.log('\nVerificando archivos principales...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} no existe`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('Faltan algunos archivos requeridos');
  process.exit(1);
}

// Verificar que no hay carpetas duplicadas
const duplicatedDirs = [
  'src/shared'
];

console.log('\nVerificando que no hay carpetas duplicadas...');
let noDuplicates = true;

duplicatedDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`✅ ${dir} no existe (correcto)`);
  } else {
    console.log(`❌ ${dir} existe (debería haberse eliminado)`);
    noDuplicates = false;
  }
});

if (!noDuplicates) {
  console.error('Se encontraron carpetas duplicadas');
  process.exit(1);
}

// Verificar que la aplicación compila
console.log('\nCompilando la aplicación...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ La aplicación compila correctamente');
} catch (error) {
  console.error('❌ Error al compilar la aplicación');
  process.exit(1);
}

console.log('\n✅ Todas las pruebas pasaron correctamente');
