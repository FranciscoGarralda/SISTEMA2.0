// Cache service para mejorar el rendimiento
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos por defecto
    this.MAX_CACHE_SIZE = 100; // Límite de entradas en caché
    this.lastCleanup = Date.now();
    this.CLEANUP_INTERVAL = 60 * 1000; // 1 minuto
  }

  set(key, data, ttl = this.DEFAULT_TTL) {
    // Controlar tamaño del caché
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this._enforceLimit();
    }
    
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
    
    // Limpieza periódica
    if (Date.now() - this.lastCleanup > this.CLEANUP_INTERVAL) {
      this.clearExpired();
    }
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    
    // Si no existe o expiró
    if (!timestamp || Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  clearExpired() {
    const now = Date.now();
    this.lastCleanup = now;
    
    const expiredKeys = [];
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        expiredKeys.push(key);
      }
    }
    
    // Borrar claves expiradas en segundo paso para evitar problemas de iteración
    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.timestamps.delete(key);
    });
    
    return expiredKeys.length;
  }
  
  // Método para forzar límite de tamaño eliminando entradas más antiguas
  _enforceLimit() {
    // Ordenar por tiempo de expiración
    const sortedEntries = [...this.timestamps.entries()]
      .sort((a, b) => a[1] - b[1]);
      
    // Eliminar 25% más antiguo
    const toRemove = Math.ceil(this.MAX_CACHE_SIZE * 0.25);
    sortedEntries.slice(0, toRemove).forEach(([key]) => {
      this.cache.delete(key);
      this.timestamps.delete(key);
    });
  }
}

export const cacheService = new CacheService();