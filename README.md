# 🚀 Sistema Financiero 2.0

Sistema de gestión financiera completo y optimizado, construido con Next.js, React y Netlify Functions.

## 🎯 Características Principales

- **Operaciones Financieras** con todas las sub-operaciones (compra, venta, arbitraje, etc.)
- **Sistema completo de menús y navegación** con tema claro/oscuro
- **Cálculos automáticos** (TC, totales, comisiones, WAC)
- **Pago mixto** con múltiples socios
- **Sistema de permisos** por usuario
- **Autocompletado de clientes** con creación inline
- **Autenticación local y remota**
- **Optimización de rendimiento** con lazy loading
- **Arquitectura consolidada** con servicios unificados

## Estructura del Proyecto

El proyecto sigue una arquitectura optimizada por características (feature-driven architecture) con un énfasis en la separación de responsabilidades:

```
📁 sistema-financiero-frontend/
├── 📁 public/                  # Archivos públicos estáticos
│   └── 📁 assets/              # Activos organizados (iconos, imágenes)
├── 📁 src/                     # Código fuente
│   ├── 📁 components/          # Componentes reutilizables globales
│   ├── 📁 features/            # Módulos específicos organizados por característica
│   ├── 📁 hooks/               # Custom hooks globales
│   ├── 📁 pages/               # Páginas de Next.js (routing)
│   ├── 📁 services/            # Servicios globales (API, utilidades)
│   ├── 📁 store/               # Estado global (contextos)
│   ├── 📁 styles/              # Estilos globales
│   ├── 📁 types/               # Definiciones de tipos
│   └── 📁 utils/               # Utilidades globales
└── 📁 tests/                   # Tests
```

## Características Principales

- **Operaciones Financieras** con todas las sub-operaciones (compra, venta, arbitraje, etc.)
- **Sistema completo de menús y navegación**
- **Cálculos automáticos** (TC, totales, comisiones, WAC)
- **Pago mixto** con múltiples socios
- **Sistema de permisos** por usuario
- **Autocompletado de clientes** con creación inline

## Módulos

- Movimientos
- Pendientes de Retiro
- Gastos
- Cuentas Corrientes
- Prestamistas
- Comisiones
- Utilidad
- Arbitraje
- Saldos
- Caja Diaria
- Stock
- Saldos Iniciales
- Gestión de Usuarios
- Clientes

## 🛠️ Configuración de Desarrollo

### Requisitos Previos
- **Node.js** 18+ (recomendado 20+)
- **NPM** 9+
- **Git**

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir [http://localhost:3000](http://localhost:3000)**

### Acceso al Sistema
- **Login**: `admin` / `admin`
- **Modo**: Desarrollo local con localStorage

## 📜 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run test` - Ejecuta los tests unitarios

## 🏗️ Arquitectura Optimizada

### Servicios Consolidados
- **Data Service** - API, localStorage, cache, server wake
- **Utility Service** - Operaciones seguras, validación, formateo
- **Business Service** - Lógica de negocio (balances, stock, caja, movimientos)
- **System Service** - Manejo de errores, preload, utilidades del sistema
- **Client Service** - Gestión de clientes

### Optimizaciones Implementadas
- **Lazy Loading** - Carga diferida de componentes
- **Memoización** - useCallback y useMemo para rendimiento
- **Chunk Splitting** - División inteligente de bundles
- **CSS Optimizado** - Paleta de colores unificada
- **Error Boundaries** - Manejo robusto de errores

## Despliegue

El proyecto está configurado para desplegar automáticamente en Netlify cuando se hace push a la rama principal.

## Convenciones de Código

Este proyecto utiliza ESLint y Prettier para asegurar consistencia y calidad del código. Por favor, asegúrate de que tu código pase los linters antes de enviar pull requests.