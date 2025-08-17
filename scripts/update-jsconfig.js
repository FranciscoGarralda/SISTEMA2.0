/**
 * Script para actualizar jsconfig.json con los aliases
 */
const fs = require('fs');
const path = require('path');

// Leer jsconfig.json existente o crear uno nuevo
let jsconfig = {};
const jsconfigPath = path.join(process.cwd(), 'jsconfig.json');

if (fs.existsSync(jsconfigPath)) {
  try {
    jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));
    console.log('jsconfig.json encontrado, actualizando...');
  } catch (error) {
    console.error('Error al leer jsconfig.json:', error);
    console.log('Creando nuevo jsconfig.json...');
  }
} else {
  console.log('jsconfig.json no encontrado, creando nuevo...');
}

// Asegurar que existe la estructura básica
if (!jsconfig.compilerOptions) {
  jsconfig.compilerOptions = {};
}

// Configurar baseUrl
jsconfig.compilerOptions.baseUrl = '.';

// Configurar paths
jsconfig.compilerOptions.paths = {
  "@components/*": ["src/components/*"],
  "@services/*": ["src/services/*"],
  "@hooks/*": ["src/hooks/*"],
  "@utils/*": ["src/utils/*"],
  "@store/*": ["src/store/*"],
  "@constants/*": ["src/constants/*"],
  "@features/*": ["src/features/*"],
  "@styles/*": ["src/styles/*"],
  "@types/*": ["src/types/*"],
  "@layouts/*": ["src/components/layouts/*"]
};

// Guardar jsconfig.json
fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
console.log('jsconfig.json actualizado con aliases');
