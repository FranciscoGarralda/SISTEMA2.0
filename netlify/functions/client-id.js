import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';

async function handler(event, context) {
  // Obtener método HTTP y ID del cliente
  const httpMethod = event.httpMethod;
  const clientId = event.path.split('/').pop();
  
  if (!clientId || isNaN(parseInt(clientId))) {
    return error('ID de cliente inválido', 400);
  }

  try {
    // Manejar según el método HTTP
    switch (httpMethod) {
      case 'GET':
        return await getClient(clientId);
      case 'PUT':
        return await updateClient(clientId, event);
      case 'DELETE':
        return await deleteClient(clientId);
      case 'OPTIONS':
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
          },
          body: ''
        };
      default:
        return error(`Método ${httpMethod} no soportado`, 405);
    }
  } catch (err) {
    console.error(`Error en client-id (${clientId}):`, err);
    return error('Error interno del servidor', 500);
  }
}

// Obtener un cliente por ID
async function getClient(clientId) {
  const clients = await sql`
    SELECT * FROM clients WHERE id = ${clientId}
  `;
  
  if (clients.length === 0) {
    return error('Cliente no encontrado', 404);
  }
  
  return success(clients[0]);
}

// Actualizar un cliente
async function updateClient(clientId, event) {
  const clientData = JSON.parse(event.body);
  
  // Validar datos requeridos
  if (!clientData.nombre || !clientData.apellido) {
    return error('Nombre y apellido son requeridos', 400);
  }
  
  // Verificar que el cliente existe
  const existingClients = await sql`
    SELECT id FROM clients WHERE id = ${clientId}
  `;
  
  if (existingClients.length === 0) {
    return error('Cliente no encontrado', 404);
  }
  
  // Actualizar cliente
  const updatedClient = await sql`
    UPDATE clients
    SET 
      nombre = ${clientData.nombre},
      apellido = ${clientData.apellido},
      email = ${clientData.email || null},
      telefono = ${clientData.telefono || null},
      tipoCliente = ${clientData.tipoCliente || 'regular'}
    WHERE id = ${clientId}
    RETURNING *
  `;
  
  return success(updatedClient[0]);
}

// Eliminar un cliente
async function deleteClient(clientId) {
  // Verificar que el cliente existe
  const existingClients = await sql`
    SELECT id FROM clients WHERE id = ${clientId}
  `;
  
  if (existingClients.length === 0) {
    return error('Cliente no encontrado', 404);
  }
  
  // Eliminar cliente
  await sql`
    DELETE FROM clients WHERE id = ${clientId}
  `;
  
  return success({ message: 'Cliente eliminado correctamente' });
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(handler);
