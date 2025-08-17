import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Clave secreta para JWT (en producción, usar variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generar token JWT
export function generateToken(user) {
  // No incluir la contraseña en el token
  const { password, ...userWithoutPassword } = user;
  
  return jwt.sign(
    { user: userWithoutPassword },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verificar token JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware para verificar autenticación
export function authMiddleware(handler) {
  return async (event, context) => {
    // Obtener token de los headers
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No autorizado' })
      };
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token inválido o expirado' })
      };
    }
    
    // Añadir usuario al contexto
    context.user = decoded.user;
    
    // Continuar con el handler
    return handler(event, context);
  };
}

// Comparar contraseña con hash
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Hashear contraseña
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
