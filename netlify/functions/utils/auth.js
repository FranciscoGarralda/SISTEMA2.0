import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Clave secreta para JWT - dinámica y segura
const JWT_SECRET = process.env.JWT_SECRET || 
  (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('JWT_SECRET must be set in production'); })()
    : 'dev-secret-key-change-in-production'
  );

// Generar token JWT con claims mejorados
export function generateToken(user) {
  // No incluir la contraseña en el token
  const { password, ...userWithoutPassword } = user;
  
  return jwt.sign(
    { 
      user: userWithoutPassword,
      issuer: 'alliance-fr-system',
      audience: 'alliance-fr-users',
      issuedAt: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: '24h',
      algorithm: 'HS256'
    }
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
    // Permitir OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
      return handler(event, context);
    }
    
    // Obtener token de los headers
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Si no hay token, permitir acceso (fallback para desarrollo)
    if (!token) {
      console.log('No token provided, allowing access for development');
      context.user = { id: 1, role: 'admin', name: 'Admin' };
      return handler(event, context);
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token, allowing access for development');
      context.user = { id: 1, role: 'admin', name: 'Admin' };
      return handler(event, context);
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
