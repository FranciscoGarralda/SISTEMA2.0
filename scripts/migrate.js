/**
 * Script principal de migración
 * Este script orquesta todo el proceso de migración de la estructura del proyecto
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const config = {
  backupBranch: 'backup-estructura-actual',
  tempDir: 'temp',
  backupDir: 'backup'
};

// Función para ejecutar comandos
function runCommand(command, silent = false) {
  console.log(`Ejecutando: ${command}`);
  try {
    execSync(command, { stdio: silent ? 'pipe' : 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error ejecutando: ${command}`);
    console.error(error.message);
    return false;
  }
}

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

// Pasos de migración
const migrationSteps = [
  {
    name: 'Crear respaldo de Git',
    action: () => {
      // Verificar si estamos en un repositorio Git
      if (!fs.existsSync('.git')) {
        console.log('No se encontró un repositorio Git. Saltando respaldo de Git.');
        return true;
      }
      
      // Verificar si hay cambios sin commit
      const status = execSync('git status --porcelain').toString();
      if (status.trim()) {
        console.log('Hay cambios sin commit. Creando commit de respaldo...');
        runCommand('git add .');
        runCommand('git commit -m "Respaldo automático antes de migración"');
      }
      
      // Crear rama de respaldo
      console.log(`Creando rama de respaldo: ${config.backupBranch}`);
      
      // Verificar si la rama ya existe
      const branches = execSync('git branch').toString();
      if (branches.includes(config.backupBranch)) {
        console.log(`La rama ${config.backupBranch} ya existe. Actualizándola...`);
        const currentBranch = execSync('git branch --show-current').toString().trim();
        runCommand(`git branch -D ${config.backupBranch}`);
        runCommand(`git checkout -b ${config.backupBranch}`);
        runCommand(`git checkout ${currentBranch}`);
      } else {
        runCommand(`git checkout -b ${config.backupBranch}`);
        runCommand('git checkout -');
      }
      
      return true;
    }
  },
  {
    name: 'Crear respaldo de archivos',
    action: () => {
      ensureDir(config.backupDir);
      ensureDir(path.join(config.backupDir, 'src'));
      
      console.log('Respaldando archivos...');
      copyDir('src', path.join(config.backupDir, 'src'));
      
      // Respaldar archivos de configuración
      const configFiles = ['package.json', 'package-lock.json', 'next.config.js', 'jsconfig.json'];
      configFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, path.join(config.backupDir, file));
        }
      });
      
      return true;
    }
  },
  {
    name: 'Preparar directorios temporales',
    action: () => {
      // Limpiar directorio temporal si existe
      if (fs.existsSync(config.tempDir)) {
        fs.rmSync(config.tempDir, { recursive: true, force: true });
      }
      
      // Crear estructura temporal
      ensureDir(config.tempDir);
      ensureDir(path.join(config.tempDir, 'components'));
      ensureDir(path.join(config.tempDir, 'components/forms'));
      ensureDir(path.join(config.tempDir, 'components/ui'));
      ensureDir(path.join(config.tempDir, 'components/layouts'));
      ensureDir(path.join(config.tempDir, 'services'));
      ensureDir(path.join(config.tempDir, 'services/api'));
      ensureDir(path.join(config.tempDir, 'services/utils'));
      ensureDir(path.join(config.tempDir, 'hooks'));
      ensureDir(path.join(config.tempDir, 'utils'));
      ensureDir(path.join(config.tempDir, 'store'));
      ensureDir(path.join(config.tempDir, 'constants'));
      
      return true;
    }
  },
  {
    name: 'Consolidar componentes',
    action: () => {
      // Crear scripts para consolidar componentes
      fs.writeFileSync('scripts/consolidate-forms.js', fs.readFileSync('scripts/consolidate-forms.js', 'utf8'));
      fs.writeFileSync('scripts/consolidate-ui.js', fs.readFileSync('scripts/consolidate-ui.js', 'utf8'));
      fs.writeFileSync('scripts/consolidate-layouts.js', fs.readFileSync('scripts/consolidate-layouts.js', 'utf8'));
      
      // Ejecutar scripts
      runCommand('node scripts/consolidate-forms.js');
      runCommand('node scripts/consolidate-ui.js');
      runCommand('node scripts/consolidate-layouts.js');
      
      return true;
    }
  },
  {
    name: 'Consolidar servicios',
    action: () => {
      // Crear script para consolidar servicios
      fs.writeFileSync('scripts/consolidate-services.js', fs.readFileSync('scripts/consolidate-services.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/consolidate-services.js');
      
      return true;
    }
  },
  {
    name: 'Consolidar hooks y utils',
    action: () => {
      // Crear scripts para consolidar hooks y utils
      fs.writeFileSync('scripts/consolidate-hooks.js', fs.readFileSync('scripts/consolidate-hooks.js', 'utf8'));
      fs.writeFileSync('scripts/consolidate-utils.js', fs.readFileSync('scripts/consolidate-utils.js', 'utf8'));
      
      // Ejecutar scripts
      runCommand('node scripts/consolidate-hooks.js');
      runCommand('node scripts/consolidate-utils.js');
      
      return true;
    }
  },
  {
    name: 'Consolidar store/contexts',
    action: () => {
      // Crear script para consolidar store/contexts
      fs.writeFileSync('scripts/consolidate-store.js', fs.readFileSync('scripts/consolidate-store.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/consolidate-store.js');
      
      return true;
    }
  },
  {
    name: 'Actualizar configuración',
    action: () => {
      // Crear scripts para actualizar configuración
      fs.writeFileSync('scripts/update-jsconfig.js', fs.readFileSync('scripts/update-jsconfig.js', 'utf8'));
      fs.writeFileSync('scripts/update-next-config.js', fs.readFileSync('scripts/update-next-config.js', 'utf8'));
      
      // Ejecutar scripts
      runCommand('node scripts/update-jsconfig.js');
      runCommand('node scripts/update-next-config.js');
      
      return true;
    }
  },
  {
    name: 'Implementar nueva estructura',
    action: () => {
      // Crear script para implementar nueva estructura
      fs.writeFileSync('scripts/implement-structure.js', fs.readFileSync('scripts/implement-structure.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/implement-structure.js');
      
      return true;
    }
  },
  {
    name: 'Actualizar importaciones',
    action: () => {
      // Crear script para actualizar importaciones
      fs.writeFileSync('scripts/update-imports.js', fs.readFileSync('scripts/update-imports.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/update-imports.js');
      
      return true;
    }
  },
  {
    name: 'Estandarizar hooks',
    action: () => {
      // Crear script para estandarizar hooks
      fs.writeFileSync('scripts/standardize-hooks.js', fs.readFileSync('scripts/standardize-hooks.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/standardize-hooks.js');
      
      return true;
    }
  },
  {
    name: 'Actualizar versión',
    action: () => {
      // Crear script para actualizar versión
      fs.writeFileSync('scripts/update-version.js', fs.readFileSync('scripts/update-version.js', 'utf8'));
      
      // Ejecutar script
      runCommand('node scripts/update-version.js');
      
      return true;
    }
  },
  {
    name: 'Verificar aplicación',
    action: () => {
      // Crear script para verificar aplicación
      fs.writeFileSync('scripts/verify-app.js', fs.readFileSync('scripts/verify-app.js', 'utf8'));
      
      // Ejecutar script
      return runCommand('node scripts/verify-app.js');
    }
  },
  {
    name: 'Limpiar directorios temporales',
    action: () => {
      // Limpiar directorio temporal
      if (fs.existsSync(config.tempDir)) {
        fs.rmSync(config.tempDir, { recursive: true, force: true });
      }
      
      return true;
    }
  }
];

// Ejecutar pasos en secuencia
async function runMigration() {
  console.log('Iniciando migración...');
  
  for (let i = 0; i < migrationSteps.length; i++) {
    const step = migrationSteps[i];
    console.log(`\n=== Paso ${i + 1}/${migrationSteps.length}: ${step.name} ===\n`);
    
    try {
      const success = await step.action();
      
      if (success) {
        console.log(`✅ Completado: ${step.name}`);
      } else {
        console.error(`❌ Error en: ${step.name}`);
        
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          readline.question('¿Continuar con la migración? (s/n): ', resolve);
        });
        
        readline.close();
        
        if (answer.toLowerCase() !== 's') {
          console.log('Migración interrumpida.');
          return;
        }
      }
    } catch (error) {
      console.error(`❌ Error en: ${step.name}`);
      console.error(error);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('¿Continuar con la migración? (s/n): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 's') {
        console.log('Migración interrumpida.');
        return;
      }
    }
  }
  
  console.log('\n✅ Migración completada con éxito!');
}

runMigration().catch(console.error);
