import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';

async function authMeHandler(event, context) {
  try {
    // El usuario ya está disponible gracias al middleware de autenticación
    const { user } = context;

    // Generar token CSRF
    const csrfToken = Math.random().toString(36).substring(2);

    // Devolver información del usuario
    return success(user);
  } catch (err) {
    console.error('Error en auth-me:', err);
    return error('Error interno del servidor', 500);
  }
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(authMeHandler);
