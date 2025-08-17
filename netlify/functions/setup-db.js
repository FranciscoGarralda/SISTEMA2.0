import { initializeDatabase } from './utils/db';
import { success, error } from './utils/response';

export async function handler(event, context) {
  try {
    // Inicializar base de datos
    const result = await initializeDatabase();
    
    if (result) {
      return success({ message: 'Base de datos inicializada correctamente' });
    } else {
      return error('Error al inicializar la base de datos', 500);
    }
  } catch (err) {
    console.error('Error en setup-db:', err);
    return error(`Error interno del servidor: ${err.message}`, 500);
  }
}
