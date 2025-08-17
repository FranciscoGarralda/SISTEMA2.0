/**
 * Script para desplegar los cambios a producción
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verificar que estamos en un repositorio Git
if (!fs.existsSync('.git')) {
  console.error('No se encontró un repositorio Git.');
  process.exit(1);
}

// Actualizar versión en Footer
console.log('Actualizando versión...');
try {
  execSync('node scripts/update-version.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error al actualizar versión:', error.message);
  
  // Preguntar si continuar
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('¿Continuar con el despliegue a pesar del error? (s/n): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() !== 's') {
      console.log('Despliegue cancelado.');
      process.exit(1);
    }
  });
}

// Ejecutar pruebas de estructura
console.log('\nEjecutando pruebas de estructura...');
try {
  execSync('node scripts/verify-app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error en las pruebas de estructura:', error.message);
  
  // Preguntar si continuar
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('¿Continuar con el despliegue a pesar del error? (s/n): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() !== 's') {
      console.log('Despliegue cancelado.');
      process.exit(1);
    }
  });
}

// Verificar si hay cambios sin commit
const status = execSync('git status --porcelain').toString();
if (status.trim()) {
  // Commit de los cambios
  console.log('\nCreando commit...');
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "refactor: Reestructuración completa de la arquitectura del sistema"', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error al crear commit:', error.message);
    process.exit(1);
  }
} else {
  console.log('\nNo hay cambios para commit.');
}

// Obtener la rama actual
const currentBranch = execSync('git branch --show-current').toString().trim();

// Si no estamos en main, cambiar a main
if (currentBranch !== 'main') {
  console.log(`\nCambiando de rama ${currentBranch} a main...`);
  try {
    execSync('git checkout main', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error al cambiar a la rama main:', error.message);
    process.exit(1);
  }
}

// Push a main
console.log('\nPush a main...');
try {
  execSync('git push origin main', { stdio: 'inherit' });
} catch (error) {
  console.error('Error al hacer push:', error.message);
  process.exit(1);
}

console.log('\n✅ Despliegue completado con éxito!');
console.log('Los cambios se han subido a GitHub y Netlify debería iniciar el despliegue automáticamente.');
console.log('Puedes verificar el estado del despliegue en la consola de Netlify.');
