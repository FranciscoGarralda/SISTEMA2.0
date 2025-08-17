import { initializeDatabase } from './utils/db';
import { success, error } from './utils/response';

export async function handler(event, context) {
  try {
    // Inicializar base de datos si es necesario
    await initializeDatabase();
    
    return success({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Error en health check:', err);
    return error('Error interno del servidor', 500);
  }
}
