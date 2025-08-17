/**
 * Script para implementar la nueva estructura
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para crear directorio si no existe
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directorio creado: ${dir}`);
  }
}

// Función para copiar directorio recursivamente
function copyDir(src, dest) {
  ensureDir(dest);
  
  if (!fs.existsSync(src)) {
    console.log(`Directorio de origen no existe: ${src}`);
    return;
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Respaldar la estructura actual
console.log('Respaldando estructura actual...');
ensureDir('backup/src');
copyDir('src', 'backup/src');

// Limpiar carpetas duplicadas
console.log('Limpiando carpetas duplicadas...');
if (fs.existsSync('src/shared')) {
  fs.rmSync('src/shared', { recursive: true, force: true });
  console.log('Carpeta src/shared eliminada');
}

// Crear nueva estructura
console.log('Creando nueva estructura...');

// Componentes
ensureDir('src/components/forms');
ensureDir('src/components/ui');
ensureDir('src/components/layouts');
copyDir('temp/components/forms', 'src/components/forms');
copyDir('temp/components/ui', 'src/components/ui');
copyDir('temp/components/layouts', 'src/components/layouts');

// Servicios
ensureDir('src/services/api');
ensureDir('src/services/utils');
copyDir('temp/services/api', 'src/services/api');
copyDir('temp/services/utils', 'src/services/utils');

// Copiar archivos de servicios en la raíz
if (fs.existsSync('temp/services')) {
  const serviceFiles = fs.readdirSync('temp/services').filter(file => 
    fs.existsSync(path.join('temp/services', file)) && 
    fs.statSync(path.join('temp/services', file)).isFile()
  );

  serviceFiles.forEach(file => {
    fs.copyFileSync(
      path.join('temp/services', file),
      path.join('src/services', file)
    );
  });
}

// Hooks
ensureDir('src/hooks');
copyDir('temp/hooks', 'src/hooks');

// Utils
ensureDir('src/utils');
copyDir('temp/utils', 'src/utils');

// Store
ensureDir('src/store');
copyDir('temp/store', 'src/store');

// Constants
ensureDir('src/constants');
if (fs.existsSync('src/shared/constants')) {
  copyDir('src/shared/constants', 'src/constants');
}

console.log('Nueva estructura implementada correctamente');

// Crear archivo .gitkeep en directorios vacíos
const ensureGitKeep = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.writeFileSync(path.join(dir, '.gitkeep'), '');
      console.log(`Creado .gitkeep en ${dir}`);
    }
  }
};

ensureGitKeep('src/components/forms');
ensureGitKeep('src/components/ui');
ensureGitKeep('src/components/layouts');
ensureGitKeep('src/services/api');
ensureGitKeep('src/services/utils');
ensureGitKeep('src/hooks');
ensureGitKeep('src/utils');
ensureGitKeep('src/store');
ensureGitKeep('src/constants');

console.log('Implementación completada con éxito');
