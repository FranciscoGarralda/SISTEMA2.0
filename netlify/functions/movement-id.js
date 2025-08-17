import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';

async function movementIdHandler(event, context) {
  const httpMethod = event.httpMethod;
  const movementId = event.path.split('/').pop();

  // Validar ID
  if (!movementId || isNaN(movementId)) {
    return error('ID de movimiento inválido', 400);
  }

  try {
    switch (httpMethod) {
      case 'GET':
        return await getMovement(movementId);
      case 'PUT':
        return await updateMovement(movementId, event);
      case 'DELETE':
        return await deleteMovement(movementId);
      default:
        return error(`Método ${httpMethod} no soportado`, 405);
    }
  } catch (err) {
    console.error('Error en movement-id:', err);
    return error('Error interno del servidor', 500);
  }
}

// Obtener un movimiento por ID
async function getMovement(id) {
  try {
    const movements = await sql`
      SELECT * FROM movements WHERE id = ${id}
    `;

    if (movements.length === 0) {
      return error('Movimiento no encontrado', 404);
    }

    return success(movements[0]);
  } catch (err) {
    console.error('Error al obtener movimiento:', err);
    return error('Error al obtener movimiento', 500);
  }
}

// Actualizar un movimiento
async function updateMovement(id, event) {
  try {
    const body = JSON.parse(event.body);
    
    // Verificar que el movimiento existe
    const existing = await sql`
      SELECT * FROM movements WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return error('Movimiento no encontrado', 404);
    }

    // Construir la actualización dinámica
    const updates = [];
    const values = [id];
    let paramCount = 2;

    if (body.fecha !== undefined) {
      updates.push(`fecha = $${paramCount}`);
      values.push(body.fecha);
      paramCount++;
    }
    if (body.clienteId !== undefined) {
      updates.push(`clienteId = $${paramCount}`);
      values.push(body.clienteId);
      paramCount++;
    }
    if (body.tipo !== undefined) {
      updates.push(`tipo = $${paramCount}`);
      values.push(body.tipo);
      paramCount++;
    }
    if (body.monto !== undefined) {
      updates.push(`monto = $${paramCount}`);
      values.push(body.monto);
      paramCount++;
    }
    if (body.moneda !== undefined) {
      updates.push(`moneda = $${paramCount}`);
      values.push(body.moneda);
      paramCount++;
    }
    if (body.estado !== undefined) {
      updates.push(`estado = $${paramCount}`);
      values.push(body.estado);
      paramCount++;
    }

    if (updates.length === 0) {
      return error('No hay campos para actualizar', 400);
    }

    const updateQuery = `
      UPDATE movements 
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await sql.unsafe(updateQuery, values);
    return success(result[0]);
  } catch (err) {
    console.error('Error al actualizar movimiento:', err);
    return error('Error al actualizar movimiento', 500);
  }
}

// Eliminar un movimiento
async function deleteMovement(id) {
  try {
    const result = await sql`
      DELETE FROM movements WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return error('Movimiento no encontrado', 404);
    }

    return success({ message: 'Movimiento eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar movimiento:', err);
    return error('Error al eliminar movimiento', 500);
  }
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(movementIdHandler);