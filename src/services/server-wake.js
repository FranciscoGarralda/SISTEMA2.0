// Server Wake Service - Mantiene el servidor activo
class ServerWakeService {
  constructor() {
    // Detectar si estamos en producción o desarrollo
    if (typeof window !== 'undefined') {
      const currentHost = window.location.origin;
      
      // Si estamos en Netlify o en producción, usar Netlify Functions
      if (currentHost.includes('netlify.app') || 
          currentHost.includes('casadecambio') ||
          process.env.NODE_ENV === 'production') {
        this.baseURL = '/.netlify/functions';
      } else {
        // En desarrollo local
        this.baseURL = '/api';
      }
      
      console.log('ServerWake Service initialized with baseURL:', this.baseURL);
    } else {
      // Servidor - siempre usar Netlify Functions
      this.baseURL = '/.netlify/functions';
    }
    
    this.isWaking = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async wakeServer() {
    if (this.isWaking) {
      return this.wakePromise;
    }
    
    this.isWaking = true;
    this.wakePromise = this._performWake();
    
    try {
      const result = await this.wakePromise;
      return result;
    } finally {
      this.isWaking = false;
      this.wakePromise = null;
    }
  }

  async _performWake() {
    // Intentar despertar el servidor
    return this._attemptWake();
  }

  async _attemptWake() {
    console.log('🔄 Verificando API de Netlify...');
    
    // En desarrollo local, no intentar conectar a la API
    if (this.baseURL === '/api') {
      console.log('✅ Modo desarrollo local - saltando verificación de API');
      return true;
    }
    
    try {
      // Hacer ping al endpoint de health
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 segundos para el ping
      });
      
      if (response.ok) {
        console.log('✅ API de Netlify activa');
        return true;
      }
    } catch (error) {
      console.log('⏳ Conectando a API de Netlify...');
    }
    
    // Si falla, intentar nuevamente
    let attempts = 0;
    const maxAttempts = 3; // 15 segundos total
    
    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
        
        const response = await fetch(`${this.baseURL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          console.log('✅ API de Netlify lista después de', attempts * 5, 'segundos');
          return true;
        }
      } catch (error) {
        console.log(`⏳ Intento ${attempts}/${maxAttempts}...`);
      }
    }
    
    // Si no podemos conectar, devolver true de todos modos para no bloquear la aplicación
    console.log('⚠️ No se pudo conectar a la API, pero continuando...');
    return true;
  }

  reset() {

  }
}

export const serverWakeService = new ServerWakeService();