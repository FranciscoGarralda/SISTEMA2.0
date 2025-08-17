import { sql } from './utils/db';
import { generateToken, comparePassword } from './utils/auth';
import { success, error } from './utils/response';

export async function handler(event, context) {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return error('Método no permitido', 405);
  }

  try {
    // Parsear el cuerpo de la solicitud
    const { username, password } = JSON.parse(event.body);

    // Validar datos
    if (!username || !password) {
      return error('Usuario y contraseña son requeridos', 400);
    }

    // Buscar usuario en la base de datos
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} AND active = true
    `;

    // Verificar si el usuario existe
    if (users.length === 0) {
      return error('Credenciales inválidas', 401);
    }

    const user = users[0];

    // Verificar contraseña
    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      return error('Credenciales inválidas', 401);
    }

    // Generar token JWT
    const token = generateToken(user);

    // Generar token CSRF
    const csrfToken = Math.random().toString(36).substring(2);

    // Devolver respuesta exitosa
    return success({
      token,
      csrfToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    return error('Error interno del servidor', 500);
  }
}
