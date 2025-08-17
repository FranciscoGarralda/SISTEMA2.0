import { neon } from '@netlify/neon';

// Inicializar la conexión a la base de datos
export const sql = neon();

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
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
