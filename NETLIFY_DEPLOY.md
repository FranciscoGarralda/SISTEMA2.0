# 🚀 Despliegue en Netlify - Sistema Financiero

## 📋 Pasos para desplegar en Netlify

### 1. **Conectar con GitHub**
1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New site from Git"
4. Selecciona "GitHub" como proveedor
5. Busca y selecciona el repositorio: `FranciscoGarralda/SISTEMA2.0`

### 2. **Configuración del Build**
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18` (configurado automáticamente)

### 3. **Variables de Entorno (Opcional)**
No necesitas configurar variables de entorno ya que el sistema funciona en modo local.

### 4. **Desplegar**
1. Haz clic en "Deploy site"
2. Netlify comenzará el proceso de build
3. El sitio estará disponible en una URL como: `https://random-name.netlify.app`

## 🔐 Credenciales de Acceso

Una vez desplegado, puedes acceder con:
- **Usuario**: `admin`
- **Contraseña**: `admin`

## 📱 Acceso desde Celular

1. **Abre el navegador** de tu celular
2. **Ve a la URL** que te proporciona Netlify
3. **Inicia sesión** con las credenciales de arriba
4. **¡Listo!** El sistema funcionará completamente

## 🔧 Características del Despliegue

- ✅ **Modo local activado**: No requiere servidor backend
- ✅ **Responsive design**: Optimizado para móviles
- ✅ **PWA ready**: Instalable como app
- ✅ **Fast loading**: Optimizado para velocidad
- ✅ **HTTPS**: Seguridad automática

## 🛠️ Solución de Problemas

### Si el build falla:
1. Verifica que el repositorio esté actualizado
2. Revisa los logs de build en Netlify
3. Asegúrate de que `package.json` tenga los scripts correctos

### Si no puedes hacer login:
1. Verifica que estés usando `admin` / `admin`
2. Limpia el caché del navegador
3. Intenta en modo incógnito

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de build en Netlify
2. Verifica que el repositorio esté actualizado
3. Contacta al desarrollador

---

**¡El sistema está listo para usar en Netlify! 🎉**
