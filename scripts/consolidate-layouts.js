/**
 * Script para consolidar layouts
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Directorios
const srcDir = 'src/components/layouts';
const sharedDir = 'src/shared/layouts';
const targetDir = 'temp/components/layouts';

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

// Función para obtener archivos de un directorio
function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return glob.sync(`${dir}/*.jsx`);
}

// Obtener todos los archivos
const srcFiles = getFiles(srcDir);
const sharedFiles = getFiles(sharedDir);

console.log(`Encontrados ${srcFiles.length} archivos en ${srcDir}`);
console.log(`Encontrados ${sharedFiles.length} archivos en ${sharedDir}`);

// Mapear archivos por nombre base
const fileMap = {};

srcFiles.forEach(file => {
  const baseName = path.basename(file);
  fileMap[baseName] = { src: file };
});

sharedFiles.forEach(file => {
  const baseName = path.basename(file);
  if (fileMap[baseName]) {
    fileMap[baseName].shared = file;
  } else {
    fileMap[baseName] = { shared: file };
  }
});

// Procesar cada archivo
Object.entries(fileMap).forEach(([fileName, paths]) => {
  let content;
  
  // Si existe en ambos lugares, comparar y elegir el más reciente
  if (paths.src && paths.shared) {
    const srcStat = fs.statSync(paths.src);
    const sharedStat = fs.statSync(paths.shared);
    
    // Usar el archivo más reciente
    if (srcStat.mtime > sharedStat.mtime) {
      console.log(`Usando versión más reciente de ${fileName} desde src/components/layouts`);
      content = fs.readFileSync(paths.src, 'utf8');
    } else {
      console.log(`Usando versión más reciente de ${fileName} desde src/shared/layouts`);
      content = fs.readFileSync(paths.shared, 'utf8');
      
      // Actualizar importaciones
      content = content.replace(
        /from ['"]\.\.\/components['"]/g,
        `from '@components'`
      );
      content = content.replace(
        /from ['"]\.\.\/services['"]/g,
        `from '@services'`
      );
    }
  } 
  // Si solo existe en una ubicación
  else if (paths.src) {
    console.log(`Copiando ${fileName} desde src/components/layouts`);
    content = fs.readFileSync(paths.src, 'utf8');
  } else {
    console.log(`Copiando ${fileName} desde src/shared/layouts`);
    content = fs.readFileSync(paths.shared, 'utf8');
    
    // Actualizar importaciones
    content = content.replace(
      /from ['"]\.\.\/components['"]/g,
      `from '@components'`
    );
    content = content.replace(
      /from ['"]\.\.\/services['"]/g,
      `from '@services'`
    );
  }
  
  // Guardar el archivo consolidado
  fs.writeFileSync(path.join(targetDir, fileName), content);
});

// Crear archivo index.js para exportaciones
const indexContent = Object.keys(fileMap).map(fileName => {
  const componentName = fileName.replace('.jsx', '');
  return `export { default as ${componentName} } from './${fileName}';`;
}).join('\n');

fs.writeFileSync(path.join(targetDir, 'index.js'), indexContent);
console.log(`Layouts consolidados en ${targetDir}`);
console.log(`Total de layouts procesados: ${Object.keys(fileMap).length}`);
