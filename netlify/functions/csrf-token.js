import { authMiddleware } from './utils/auth';
import { success } from './utils/response';

async function handler(event, context) {
  // Generar token CSRF
  const csrfToken = Math.random().toString(36).substring(2);
  
  return success({ csrfToken });
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(handler);
