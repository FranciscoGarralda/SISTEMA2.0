import { neon } from '@netlify/neon';

// Configuración de base de datos
let sql;

// Inicializar la conexión a la base de datos
try {
  // Intentar conectar a Neon
  sql = neon();
  console.log('✅ Conectado a Neon Database');
} catch (error) {
  console.log('⚠️  No se pudo conectar a Neon, usando modo local');
  // En modo local, simular la base de datos
  sql = {
    // Simular consultas para desarrollo local
    async query(strings, ...values) {
      console.log('🔧 Modo local: Simulando consulta SQL');
      return [];
    },
    // Agregar método para template literals
    async template(strings, ...values) {
      console.log('🔧 Modo local: Simulando consulta SQL template');
      return [];
    }
  };
  
  // Hacer que sql sea callable como función
  const sqlFunction = async (...args) => {
    if (args.length === 1 && Array.isArray(args[0])) {
      return sqlFunction.template(args[0], ...args.slice(1));
    }
    return sqlFunction.query(args[0], ...args.slice(1));
  };
  
  // Copiar métodos
  sqlFunction.query = sql.query;
  sqlFunction.template = sql.template;
  
  // Agregar método para template literals (neon style)
  sqlFunction.template = async (strings, ...values) => {
    console.log('🔧 Modo local: Simulando consulta SQL template');
    // Simular respuesta para verificar admin
    if (strings[0]?.includes('SELECT COUNT(*) FROM users WHERE username = \'admin\'')) {
      return [{ count: '1' }];
    }
    return [];
  };
  
  sql = sqlFunction;
}

export { sql };

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    // Si estamos en modo local, no hacer nada
    if (!process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) {
      console.log('🔧 Modo local: Saltando inicialización de base de datos');
      return true;
    }

    // Crear tabla de usuarios si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de clientes si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefono VARCHAR(50),
        tipoCliente VARCHAR(50) DEFAULT 'regular',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de movimientos si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS movements (
        id SERIAL PRIMARY KEY,
        fecha DATE NOT NULL,
        clienteId INTEGER REFERENCES clients(id),
        tipo VARCHAR(50) NOT NULL,
        monto DECIMAL(12, 2) NOT NULL,
        moneda VARCHAR(10) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Verificar si existe el usuario admin
    const adminExists = await sql`
      SELECT COUNT(*) FROM users WHERE username = 'admin'
    `;

    // Si no existe el usuario admin, crearlo
    if (adminExists[0].count === '0') {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin', 10);

      await sql`
        INSERT INTO users (username, password, name, role)
        VALUES ('admin', ${hashedPassword}, 'Administrador', 'admin')
      `;
      console.log('Usuario administrador creado');
    }

    console.log('Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  }
}
