// Script para limpiar caché y forzar recarga
console.log('🧹 LIMPIANDO CACHÉ Y FORZANDO RECARGA...');

// Limpiar localStorage y sessionStorage
localStorage.clear();
sessionStorage.clear();

// Limpiar caché del navegador
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
}

// Forzar recarga sin caché
window.location.reload(true);

// Mostrar mensaje
console.log('✅ Caché limpiado - página recargada');
console.log('📝 INSTRUCCIONES PARA LIMPIAR CACHÉ MANUALMENTE:');
console.log('1. Presiona Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)');
console.log('2. O ve a DevTools (F12) → Network → Disable cache');
console.log('3. O ve a DevTools → Application → Storage → Clear storage');
