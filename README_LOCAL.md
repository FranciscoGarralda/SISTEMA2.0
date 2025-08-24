# 🚀 SISTEMA 2.0 - DESARROLLO LOCAL

## 📋 REQUISITOS PREVIOS

- **Node.js** 18+ (recomendado 20+)
- **NPM** 9+
- **Git**
- **Cuenta en Neon** (PostgreSQL)

## 🛠️ INSTALACIÓN Y CONFIGURACIÓN

### 1. INSTALAR DEPENDENCIAS
```bash
npm install
```

### 2. CONFIGURAR BASE DE DATOS
1. Ve a [Neon](https://neon.tech) y crea una cuenta gratuita
2. Crea un nuevo proyecto PostgreSQL
3. Copia la URL de conexión
4. Actualiza `.env.local` con la URL real

### 3. VERIFICAR CONFIGURACIÓN
```bash
npm run health
```

## 🚀 COMANDOS PRINCIPALES

### DESARROLLO COMPLETO
```bash
npm run dev:full
```
- Inicia frontend en http://localhost:3000
- Inicia funciones Netlify en http://localhost:8888
- Modo desarrollo con hot reload

### VERIFICACIÓN DE SALUD
```bash
npm run health
```
- Verifica Node.js, NPM, dependencias
- Revisa archivos de configuración
- Comprueba puertos disponibles

### PRUEBAS COMPLETAS
```bash
npm run test:full
```
- Ejecuta todas las pruebas
- Incluye pruebas de integración
- Genera reporte de cobertura

### CONFIGURACIÓN DE BASE DE DATOS
```bash
npm run db:setup
npm run db:seed
```

## 🌐 ACCESO AL SISTEMA

### FRONTEND
- **URL**: http://localhost:3000
- **Login**: admin / admin

### FUNCIONES NETLIFY
- **URL**: http://localhost:8888
- **Health Check**: http://localhost:8888/.netlify/functions/health

## 📁 ESTRUCTURA DEL PROYECTO

```
SISTEMA2.0/
├── src/                    # Código fuente
│   ├── components/         # Componentes React
│   ├── features/          # Funcionalidades
│   ├── services/          # Servicios y APIs
│   └── pages/             # Páginas Next.js
├── netlify/functions/     # Funciones serverless
├── scripts/               # Scripts de utilidad
├── tests/                 # Pruebas
├── .env.local            # Variables de entorno
└── netlify.toml          # Configuración Netlify
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### PUERTO 3000 OCUPADO
```bash
# Detener procesos en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### ERROR DE DEPENDENCIAS
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ERROR DE BASE DE DATOS
1. Verificar URL en `.env.local`
2. Comprobar conexión a Neon
3. Ejecutar `npm run db:setup`

## 🚀 DESPLIEGUE

### DESPLIEGUE AUTOMÁTICO
```bash
npm run deploy
```
- Construye el proyecto
- Hace commit y push a GitHub
- Netlify despliega automáticamente

### DESPLIEGUE MANUAL
1. `git add .`
2. `git commit -m "🚀 Deploy"`
3. `git push origin main`

## 📞 SOPORTE

Si encuentras problemas:
1. Ejecuta `npm run health`
2. Revisa los logs en la consola
3. Verifica la configuración en `.env.local`
4. Comprueba la conexión a Neon

---

**¡El sistema está listo para desarrollo! 🎉**
