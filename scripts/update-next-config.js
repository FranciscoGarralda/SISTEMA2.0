/**
 * Script para actualizar next.config.js con los aliases
 */
const fs = require('fs');
const path = require('path');

// Leer next.config.js existente
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

if (!fs.existsSync(nextConfigPath)) {
  console.error('next.config.js no encontrado');
  process.exit(1);
}

let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

// Verificar si ya tiene configuración de webpack
if (nextConfigContent.includes('webpack: (config)')) {
  // Ya tiene configuración de webpack, actualizar para añadir aliases
  console.log('Actualizando configuración webpack existente...');
  
  if (nextConfigContent.includes('@components')) {
    console.log('Los aliases ya están configurados en next.config.js');
  } else {
    nextConfigContent = nextConfigContent.replace(
      /webpack:\s*\(\s*config\s*\)\s*=>\s*{([\s\S]*?)return config;/,
      `webpack: (config) => {$1
    // Configurar aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@layouts': path.resolve(__dirname, 'src/components/layouts')
    };
    return config;`
    );
  }
} else {
  // No tiene configuración de webpack, añadir nueva
  console.log('Añadiendo nueva configuración webpack...');
  
  // Verificar si ya importa path
  if (!nextConfigContent.includes("const path = require('path');")) {
    nextConfigContent = nextConfigContent.replace(
      /const nextConfig = {/,
      `const path = require('path');\n\nconst nextConfig = {`
    );
  }
  
  nextConfigContent = nextConfigContent.replace(
    /const nextConfig = {([\s\S]*?)};/,
    `const nextConfig = {$1
  webpack: (config) => {
    // Configurar aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@layouts': path.resolve(__dirname, 'src/components/layouts')
    };
    return config;
  },
};`
  );
}

// Guardar next.config.js actualizado
fs.writeFileSync(nextConfigPath, nextConfigContent);
console.log('next.config.js actualizado con aliases');
