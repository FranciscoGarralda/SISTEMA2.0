/**
 * Script para actualizar la versión en el componente Footer
 */
const fs = require('fs');
const path = require('path');

// Buscar el archivo Footer.jsx
let footerPath;
const possiblePaths = [
  path.join('src', 'components', 'ui', 'Footer.jsx'),
  path.join('src', 'shared', 'components', 'ui', 'Footer.jsx')
];

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    footerPath = p;
    break;
  }
}

if (!footerPath) {
  console.error('No se encontró el archivo Footer.jsx');
  process.exit(1);
}

// Leer el archivo
let footerContent = fs.readFileSync(footerPath, 'utf8');

// Buscar la versión actual
const versionRegex = /const version = ["']V(\d+)["'];/;
const match = footerContent.match(versionRegex);

if (match) {
  const currentVersion = parseInt(match[1], 10);
  const newVersion = currentVersion + 1;
  
  // Actualizar la versión
  footerContent = footerContent.replace(
    versionRegex,
    `const version = "V${newVersion}"; // Actualizar esta versión con cada nuevo despliegue`
  );
  
  // Guardar el archivo actualizado
  fs.writeFileSync(footerPath, footerContent);
  console.log(`Versión actualizada de V${currentVersion} a V${newVersion}`);
} else {
  console.error('No se pudo encontrar la versión en Footer.jsx');
  process.exit(1);
}
