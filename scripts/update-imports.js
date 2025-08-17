/**
 * Script para actualizar importaciones después de la consolidación
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapeo de rutas antiguas a nuevas
const importMappings = [
  { from: /from ['"]\.\.\/shared\/components\/ui/g, to: "from '../components/ui" },
  { from: /from ['"]\.\.\/shared\/components\/forms/g, to: "from '../components/forms" },
  { from: /from ['"]\.\.\/shared\/components\/layouts/g, to: "from '../components/layouts" },
  { from: /from ['"]\.\.\/shared\/services/g, to: "from '../services" },
  { from: /from ['"]\.\.\/shared\/hooks/g, to: "from '../hooks" },
  { from: /from ['"]\.\.\/shared\/utils/g, to: "from '../utils" },
  { from: /from ['"]\.\.\/shared\/store/g, to: "from '../store" },
  { from: /from ['"]\.\.\/\.\.\/shared\/components\/ui/g, to: "from '../../components/ui" },
  { from: /from ['"]\.\.\/\.\.\/shared\/components\/forms/g, to: "from '../../components/forms" },
  { from: /from ['"]\.\.\/\.\.\/shared\/components\/layouts/g, to: "from '../../components/layouts" },
  { from: /from ['"]\.\.\/\.\.\/shared\/services/g, to: "from '../../services" },
  { from: /from ['"]\.\.\/\.\.\/shared\/hooks/g, to: "from '../../hooks" },
  { from: /from ['"]\.\.\/\.\.\/shared\/utils/g, to: "from '../../utils" },
  { from: /from ['"]\.\.\/\.\.\/shared\/store/g, to: "from '../../store" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/components\/ui/g, to: "from '../../../components/ui" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/components\/forms/g, to: "from '../../../components/forms" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/components\/layouts/g, to: "from '../../../components/layouts" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/services/g, to: "from '../../../services" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/hooks/g, to: "from '../../../hooks" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/utils/g, to: "from '../../../utils" },
  { from: /from ['"]\.\.\/\.\.\/\.\.\/shared\/store/g, to: "from '../../../store" },
  // Importaciones absolutas
  { from: /from ['"]src\/shared\/components\/ui/g, to: "from 'src/components/ui" },
  { from: /from ['"]src\/shared\/components\/forms/g, to: "from 'src/components/forms" },
  { from: /from ['"]src\/shared\/components\/layouts/g, to: "from 'src/components/layouts" },
  { from: /from ['"]src\/shared\/services/g, to: "from 'src/services" },
  { from: /from ['"]src\/shared\/hooks/g, to: "from 'src/hooks" },
  { from: /from ['"]src\/shared\/utils/g, to: "from 'src/utils" },
  { from: /from ['"]src\/shared\/store/g, to: "from 'src/store" },
  { from: /from ['"]src\/shared\/layouts/g, to: "from 'src/components/layouts" },
  // Alias @/
  { from: /from ['"]@\/shared\/components\/ui/g, to: "from '@/components/ui" },
  { from: /from ['"]@\/shared\/components\/forms/g, to: "from '@/components/forms" },
  { from: /from ['"]@\/shared\/components\/layouts/g, to: "from '@/components/layouts" },
  { from: /from ['"]@\/shared\/services/g, to: "from '@/services" },
  { from: /from ['"]@\/shared\/hooks/g, to: "from '@/hooks" },
  { from: /from ['"]@\/shared\/utils/g, to: "from '@/utils" },
  { from: /from ['"]@\/shared\/store/g, to: "from '@/store" },
  { from: /from ['"]@\/shared\/layouts/g, to: "from '@/components/layouts" },
];

// Función para actualizar importaciones en un archivo
function updateFileImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  importMappings.forEach(mapping => {
    if (mapping.from.test(content)) {
      content = content.replace(mapping.from, mapping.to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Actualizado: ${filePath}`);
    return true;
  }
  
  return false;
}

// Buscar todos los archivos JavaScript y JSX
const patterns = [
  'src/**/*.js',
  'src/**/*.jsx',
  'pages/**/*.js',
  'pages/**/*.jsx'
];

let totalFiles = 0;
let updatedFiles = 0;

console.log('Actualizando importaciones...\n');

patterns.forEach(pattern => {
  const files = glob.sync(pattern);
  
  files.forEach(file => {
    totalFiles++;
    if (updateFileImports(file)) {
      updatedFiles++;
    }
  });
});

console.log(`\n✅ Proceso completado`);
console.log(`📊 Archivos procesados: ${totalFiles}`);
console.log(`📝 Archivos actualizados: ${updatedFiles}`);