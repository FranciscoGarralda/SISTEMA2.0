import { sql } from './utils/db';
import { authMiddleware } from './utils/auth';
import { success, error } from './utils/response';

async function clientsHandler(event, context) {
  // Obtener método HTTP
  const httpMethod = event.httpMethod;

  try {
    // Manejar según el método HTTP
    switch (httpMethod) {
      case 'GET':
        return await getClients(event, context);
      case 'POST':
        return await createClient(event, context);
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
    console.error('Error en clients:', err);
    return error('Error interno del servidor', 500);
  }
}

// Obtener todos los clientes
async function getClients(event, context) {
  try {
    // Si estamos en modo local, devolver datos simulados
    if (!process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) {
      console.log('🔧 Modo local: Devolviendo clientes simulados');
      return success([
        {
          id: 1,
          nombre: 'Cliente',
          apellido: 'Demo',
          email: 'demo@test.com',
          telefono: '+54 11 1234-5678',
          tipoCliente: 'regular',
          created_at: new Date().toISOString()
        }
      ]);
    }

    const clients = await sql`
      SELECT * FROM clients ORDER BY apellido, nombre
    `;
    
    return success(clients);
  } catch (err) {
    console.error('Error obteniendo clientes:', err);
    return error('Error al obtener clientes', 500);
  }
}

// Crear un nuevo cliente
async function createClient(event, context) {
  try {
    const clientData = JSON.parse(event.body);
    
    // Validar datos requeridos
    if (!clientData.nombre || !clientData.apellido) {
      return error('Nombre y apellido son requeridos', 400);
    }
    
    // Si estamos en modo local, simular creación
    if (!process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) {
      console.log('🔧 Modo local: Creando cliente simulado');
      const newClient = {
        id: Date.now(),
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        email: clientData.email || null,
        telefono: clientData.telefono || null,
        tipoCliente: clientData.tipoCliente || 'regular',
        created_at: new Date().toISOString()
      };
      return success(newClient, 201);
    }
    
    // Insertar cliente en la base de datos
    const result = await sql`
      INSERT INTO clients (nombre, apellido, email, telefono, tipoCliente)
      VALUES (
        ${clientData.nombre},
        ${clientData.apellido},
        ${clientData.email || null},
        ${clientData.telefono || null},
        ${clientData.tipoCliente || 'regular'}
      )
      RETURNING *
    `;
    
    return success(result[0], 201);
  } catch (err) {
    console.error('Error creando cliente:', err);
    return error('Error al crear cliente', 500);
  }
}

// Aplicar middleware de autenticación
export const handler = authMiddleware(clientsHandler);
