#!/usr/bin/env node

/**
 * Script de Refactorización Automática de Colores
 * Reemplaza colores hardcodeados por variables del tema
 */

const fs = require('fs');
const path = require('path');

// Mapeo de colores hardcodeados a variables del tema
const colorMappings = {
  // Grises
  'bg-gray-50': 'bg-light-surface dark:bg-dark-surface',
  'bg-gray-100': 'bg-light-surface dark:bg-dark-surface',
  'bg-gray-200': 'bg-light-cardHover dark:bg-dark-cardHover',
  'bg-gray-300': 'bg-light-border dark:bg-dark-border',
  'bg-gray-400': 'bg-light-textMuted dark:bg-dark-textMuted',
  'bg-gray-500': 'bg-light-textSecondary dark:bg-dark-textSecondary',
  'bg-gray-600': 'bg-light-textSecondary dark:bg-dark-textSecondary',
  'bg-gray-700': 'bg-light-sidebar dark:bg-dark-sidebar',
  'bg-gray-800': 'bg-light-sidebar dark:bg-dark-sidebar',
  'bg-gray-900': 'bg-light-sidebar dark:bg-dark-sidebar',
  
  // Textos grises
  'text-gray-400': 'text-light-textMuted dark:text-dark-textMuted',
  'text-gray-500': 'text-light-textSecondary dark:text-dark-textSecondary',
  'text-gray-600': 'text-light-textSecondary dark:text-dark-textSecondary',
  'text-gray-700': 'text-light-text dark:text-dark-text',
  'text-gray-800': 'text-light-text dark:text-dark-text',
  'text-gray-900': 'text-light-text dark:text-dark-text',
  
  // Bordes grises
  'border-gray-100': 'border-light-border dark:border-dark-border',
  'border-gray-200': 'border-light-border dark:border-dark-border',
  'border-gray-300': 'border-light-border dark:border-dark-border',
  'border-gray-400': 'border-light-border dark:border-dark-border',
  'border-gray-500': 'border-light-border dark:border-dark-border',
  'border-gray-600': 'border-light-border dark:border-dark-border',
  'border-gray-700': 'border-light-border dark:border-dark-border',
  'border-gray-800': 'border-light-border dark:border-dark-border',
  'border-gray-900': 'border-light-border dark:border-dark-border',
  
  // Rojos
  'text-red-400': 'text-light-error dark:text-dark-error',
  'text-red-500': 'text-light-error dark:text-dark-error',
  'text-red-600': 'text-light-error dark:text-dark-error',
  'text-red-800': 'text-light-error dark:text-dark-error',
  'bg-red-50': 'bg-light-error/10 dark:bg-dark-error/10',
  'border-red-400': 'border-light-error dark:border-dark-error',
  'border-red-500': 'border-light-error dark:border-dark-error',
  'focus:ring-red-500': 'focus:ring-light-error dark:focus:ring-dark-error',
  
  // Verdes
  'text-green-600': 'text-light-success dark:text-dark-success',
  'bg-green-50': 'bg-light-success/10 dark:bg-dark-success/10',
  
  // Azules
  'text-blue-600': 'text-light-primary dark:text-dark-primary',
  'bg-blue-50': 'bg-light-primary/10 dark:bg-dark-primary/10',
  
  // Amarillos/Naranjas
  'text-yellow-600': 'text-light-warning dark:text-dark-warning',
  'text-orange-600': 'text-light-accent dark:text-dark-accent',
  
  // Blancos y negros
  'bg-white': 'bg-light-card dark:bg-dark-card',
  'text-white': 'text-light-sidebarText dark:text-dark-sidebarText',
  'bg-black': 'bg-light-sidebar dark:bg-dark-sidebar',
  'text-black': 'text-light-text dark:text-dark-text',
};

// Función para procesar un archivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Aplicar reemplazos
    for (const [oldColor, newColor] of Object.entries(colorMappings)) {
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newColor);
        modified = true;
        console.log(`  ✅ ${oldColor} → ${newColor}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para buscar archivos JSX
function findJsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Función principal
function main() {
  console.log('🎨 Iniciando refactorización automática de colores...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const jsxFiles = findJsxFiles(srcDir);
  
  console.log(`📁 Encontrados ${jsxFiles.length} archivos para procesar\n`);
  
  let processedCount = 0;
  
  for (const file of jsxFiles) {
    const relativePath = path.relative(__dirname, file);
    console.log(`🔍 Procesando: ${relativePath}`);
    
    if (processFile(file)) {
      processedCount++;
      console.log(`  ✅ Modificado\n`);
    } else {
      console.log(`  ⏭️  Sin cambios\n`);
    }
  }
  
  console.log(`\n🎉 Refactorización completada!`);
  console.log(`📊 Archivos procesados: ${jsxFiles.length}`);
  console.log(`✅ Archivos modificados: ${processedCount}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { processFile, colorMappings };
