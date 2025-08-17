/**
 * Script para consolidar servicios
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Directorios
const srcDir = 'src/services';
const sharedDir = 'src/shared/services';
const targetDir = 'temp/services';

// Verificar si glob está instalado
try {
  require.resolve('glob');
} catch (e) {
  console.log('Instalando dependencia glob...');
  require('child_process').execSync('npm install glob --save-dev', { stdio: 'inherit' });
}

// Crear directorio de destino
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Crear subdirectorios
if (!fs.existsSync(path.join(targetDir, 'api'))) {
  fs.mkdirSync(path.join(targetDir, 'api'), { recursive: true });
}

if (!fs.existsSync(path.join(targetDir, 'utils'))) {
  fs.mkdirSync(path.join(targetDir, 'utils'), { recursive: true });
}

// Función para obtener archivos de un directorio
function getFiles(dir, pattern = '**/*.js') {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return glob.sync(path.join(dir, pattern));
}

// Obtener todos los archivos
const srcFiles = getFiles(srcDir);
const sharedFiles = getFiles(sharedDir);

console.log(`Encontrados ${srcFiles.length} archivos en ${srcDir}`);
console.log(`Encontrados ${sharedFiles.length} archivos en ${sharedDir}`);

// Mapear archivos por ruta relativa
const fileMap = {};

srcFiles.forEach(file => {
  const relPath = path.relative(srcDir, file);
  fileMap[relPath] = { src: file };
});

sharedFiles.forEach(file => {
  const relPath = path.relative(sharedDir, file);
  if (fileMap[relPath]) {
    fileMap[relPath].shared = file;
  } else {
    fileMap[relPath] = { shared: file };
  }
});

// Procesar cada archivo
Object.entries(fileMap).forEach(([relPath, paths]) => {
  let content;
  const targetFile = path.join(targetDir, relPath);
  
  // Asegurar que el directorio de destino existe
  const targetFileDir = path.dirname(targetFile);
  if (!fs.existsSync(targetFileDir)) {
    fs.mkdirSync(targetFileDir, { recursive: true });
  }
  
  // Si existe en ambos lugares, comparar y elegir el más reciente
  if (paths.src && paths.shared) {
    const srcStat = fs.statSync(paths.src);
    const sharedStat = fs.statSync(paths.shared);
    
    // Usar el archivo más reciente
    if (srcStat.mtime > sharedStat.mtime) {
      console.log(`Usando versión más reciente de ${relPath} desde src/services`);
      content = fs.readFileSync(paths.src, 'utf8');
    } else {
      console.log(`Usando versión más reciente de ${relPath} desde src/shared/services`);
      content = fs.readFileSync(paths.shared, 'utf8');
    }
    
    // Caso especial para api.js
    if (relPath === 'api.js' || relPath === 'api/api.js') {
      console.log('Procesando servicio API (crítico)...');
      
      // Preferir siempre la versión más reciente de api.js
      const srcApiContent = paths.src ? fs.readFileSync(paths.src, 'utf8') : '';
      const sharedApiContent = paths.shared ? fs.readFileSync(paths.shared, 'utf8') : '';
      
      // Verificar si alguno contiene la configuración correcta para Netlify
      if (srcApiContent.includes('this.baseURL = \'/api\';')) {
        console.log('Usando versión de API con configuración correcta para Netlify desde src/services');
        content = srcApiContent;
      } else if (sharedApiContent.includes('this.baseURL = \'/api\';')) {
        console.log('Usando versión de API con configuración correcta para Netlify desde src/shared/services');
        content = sharedApiContent;
      } else {
        console.log('Ninguna versión tiene la configuración correcta para Netlify, modificando...');
        
        // Usar la versión más reciente y modificarla
        content = srcStat.mtime > sharedStat.mtime ? srcApiContent : sharedApiContent;
        
        // Asegurar que la baseURL es correcta
        content = content.replace(
          /this\.baseURL = .*?;/,
          'this.baseURL = \'/api\';'
        );
      }
    }
  } 
  // Si solo existe en una ubicación
  else if (paths.src) {
    console.log(`Copiando ${relPath} desde src/services`);
    content = fs.readFileSync(paths.src, 'utf8');
  } else {
    console.log(`Copiando ${relPath} desde src/shared/services`);
    content = fs.readFileSync(paths.shared, 'utf8');
  }
  
  // Guardar el archivo consolidado
  fs.writeFileSync(targetFile, content);
});

// Crear archivo index.js para exportaciones
const rootServices = fs.readdirSync(targetDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

const indexContent = rootServices.map(file => {
  const serviceName = file.replace('.js', '');
  if (serviceName === 'api') {
    return `export { default as apiService } from './api';`;
  } else {
    return `export { default as ${serviceName}Service } from './${file}';`;
  }
}).join('\n');

fs.writeFileSync(path.join(targetDir, 'index.js'), indexContent);
console.log(`Servicios consolidados en ${targetDir}`);
console.log(`Total de servicios procesados: ${Object.keys(fileMap).length}`);
