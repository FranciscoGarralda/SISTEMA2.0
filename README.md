# Sistema Financiero Frontend

Frontend optimizado para el sistema de gestión financiera, construido con Next.js y React.

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

## Configuración de Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Crear archivo `.env.local` basado en `.env.example`

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run test` - Ejecuta los tests unitarios

## Despliegue

El proyecto está configurado para desplegar automáticamente en Netlify cuando se hace push a la rama principal.

## Convenciones de Código

Este proyecto utiliza ESLint y Prettier para asegurar consistencia y calidad del código. Por favor, asegúrate de que tu código pase los linters antes de enviar pull requests.