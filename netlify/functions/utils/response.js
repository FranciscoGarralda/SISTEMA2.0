// Función para crear respuestas con formato estándar
export function createResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
}

// Respuesta exitosa
export function success(data, statusCode = 200) {
  return createResponse(statusCode, { success: true, data });
}

// Respuesta de error
export function error(message, statusCode = 400) {
  return createResponse(statusCode, { success: false, message });
}
