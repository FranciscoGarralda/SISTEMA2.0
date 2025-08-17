import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';

async function movementsHandler(event, context) {
  const httpMethod = event.httpMethod;

  try {
    switch (httpMethod) {
      case 'GET':
        return await getMovements(event);
      case 'POST':
        return await createMovement(event);
      default:
        return error(`Método ${httpMethod} no soportado`, 405);
    }
  } catch (err) {
    console.error('Error en movements:', err);
    return error('Error interno del servidor', 500);
  }
}

// Obtener todos los movimientos
async function getMovements(event) {
  try {
    const { queryStringParameters } = event;
    let query = sql`SELECT * FROM movements`;
    
    // Aplicar filtros si existen
    if (queryStringParameters) {
      const conditions = [];
      const values = [];
      
      if (queryStringParameters.tipo) {
        conditions.push('tipo = $' + (values.length + 1));
        values.push(queryStringParameters.tipo);
      }
      
      if (queryStringParameters.clienteId) {
        conditions.push('clienteId = $' + (values.length + 1));
        values.push(queryStringParameters.clienteId);
      }
      
      if (queryStringParameters.estado) {
        conditions.push('estado = $' + (values.length + 1));
        values.push(queryStringParameters.estado);
      }
      
      // Si hay condiciones, construir query con WHERE
      if (conditions.length > 0) {
        const whereClause = conditions.join(' AND ');
        query = sql`SELECT * FROM movements WHERE ${sql.unsafe(whereClause)}`;
      }
    }
    
    const movements = await query;
    return success(movements);
  } catch (err) {
    console.error('Error al obtener movimientos:', err);
    return error('Error al obtener movimientos', 500);
  }
}

// Crear un nuevo movimiento
async function createMovement(event) {
  try {
    const body = JSON.parse(event.body);
    const { fecha, clienteId, tipo, monto, moneda, estado = 'pendiente' } = body;

    // Validar datos requeridos
    if (!fecha || !tipo || !monto || !moneda) {
      return error('Faltan datos requeridos', 400);
    }

    const result = await sql`
      INSERT INTO movements (fecha, clienteId, tipo, monto, moneda, estado)
      VALUES (${fecha}, ${clienteId}, ${tipo}, ${monto}, ${moneda}, ${estado})
      RETURNING *
    `;

    return success(result[0]);
  } catch (err) {
    console.error('Error al crear movimiento:', err);
    return error('Error al crear movimiento', 500);
  }
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(movementsHandler);