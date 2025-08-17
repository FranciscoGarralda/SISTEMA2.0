import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';
import bcrypt from 'bcryptjs';

async function usersHandler(event, context) {
  const httpMethod = event.httpMethod;

  try {
    switch (httpMethod) {
      case 'GET':
        return await getUsers();
      case 'POST':
        return await createUser(event);
      default:
        return error(`Método ${httpMethod} no soportado`, 405);
    }
  } catch (err) {
    console.error('Error en users:', err);
    return error('Error interno del servidor', 500);
  }
}

// Obtener todos los usuarios
async function getUsers() {
  try {
    const users = await sql`
      SELECT id, username, name, role, active, created_at 
      FROM users 
      WHERE active = true
      ORDER BY created_at DESC
    `;
    
    return success(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    return error('Error al obtener usuarios', 500);
  }
}

// Crear un nuevo usuario
async function createUser(event) {
  try {
    const body = JSON.parse(event.body);
    const { username, password, name, role = 'user' } = body;

    // Validar datos requeridos
    if (!username || !password || !name) {
      return error('Faltan datos requeridos', 400);
    }

    // Verificar si el usuario ya existe
    const existing = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;

    if (existing.length > 0) {
      return error('El usuario ya existe', 409);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const result = await sql`
      INSERT INTO users (username, password, name, role)
      VALUES (${username}, ${hashedPassword}, ${name}, ${role})
      RETURNING id, username, name, role, active, created_at
    `;

    return success(result[0]);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return error('Error al crear usuario', 500);
  }
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(usersHandler);