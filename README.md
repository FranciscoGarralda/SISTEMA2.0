# 🏦 Sistema Financiero Alliance F&R - V96

Sistema de gestión financiera completo para casa de cambio, optimizado y refactorizado para máxima eficiencia y mantenibilidad.

## 🚀 Características Principales

### 📊 **Módulos Funcionales (19)**
- **Operaciones Financieras**: 8 tipos de operaciones con pagos mixtos
- **Gestión de Clientes**: CRUD completo con validaciones
- **Movimientos**: Historial y gestión de transacciones
- **Saldos**: Balance general y por moneda
- **Stock**: Control de inventario de divisas
- **Comisiones**: Gestión de comisiones por operación
- **Arbitraje**: Análisis de oportunidades de arbitraje
- **Rentabilidad**: Reportes de rentabilidad y utilidad
- **Caja**: Control de caja y efectivo
- **Cuentas Corrientes**: Gestión de cuentas por cobrar/pagar
- **Gastos**: Control de gastos operativos
- **Prestamistas**: Gestión de prestamistas
- **Pendientes de Retiro**: Operaciones pendientes
- **Saldos Iniciales**: Configuración de saldos base
- **Gestión de Usuarios**: Control de acceso y permisos

### 🎨 **Interfaz Moderna**
- **Modo Claro/Oscuro**: Paleta elegante y profesional
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Navegación Intuitiva**: Sidebar colapsible y navegación fluida
- **Componentes Reutilizables**: UI consistente y mantenible

### ⚡ **Optimizaciones de Rendimiento**
- **Lazy Loading**: Carga bajo demanda de componentes
- **Memoización**: useCallback y useMemo para optimización
- **Chunk Splitting**: Webpack optimizado para mejor caching
- **Hooks Personalizados**: useAuth y useData para gestión de estado

## 🏗️ Arquitectura Optimizada

### **Estructura del Proyecto**
```
src/
├── components/          # 33 componentes UI
│   ├── forms/          # 18 componentes de formularios
│   ├── layouts/        # 4 layouts principales
│   └── ui/             # 11 componentes de interfaz
├── features/           # 19 módulos funcionales
├── hooks/              # 4 hooks personalizados
├── pages/              # 26 páginas Next.js
├── services/           # 6 servicios consolidados
├── styles/             # CSS global unificado
└── utils/              # Utilidades y helpers
```

### **Servicios Consolidados**
- **dataService.js**: Gestión centralizada de datos (API + LocalStorage)
- **businessService.js**: Lógica de negocio
- **clientService.js**: Gestión de clientes
- **systemService.js**: Servicios del sistema
- **utilityService.js**: Utilidades y helpers
- **index.js**: Exportaciones centralizadas

## 🛠️ Tecnologías

- **Frontend**: Next.js 14.2.31, React 18.3.1
- **Estilos**: Tailwind CSS 3.4.17
- **Iconos**: Lucide React
- **Testing**: Jest, React Testing Library
- **Deploy**: Netlify Functions

## 📦 Instalación

```bash
# Clonar repositorio
git clone [URL_DEL_REPO]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔐 Acceso

- **Usuario**: admin
- **Contraseña**: admin
- **URL**: http://localhost:3000

## 📈 Métricas de Optimización

### **Antes vs Después**
- **index.js**: 714 → 385 líneas (46% reducción)
- **Servicios**: 15+ → 6 servicios (60% consolidación)
- **Console.log**: 32 → 23 instancias (28% limpieza)
- **Archivos temporales**: Eliminados completamente

### **Rendimiento**
- **Build Time**: Optimizado con webpack simplificado
- **Bundle Size**: Chunks optimizados para mejor caching
- **Lazy Loading**: Todos los componentes cargados bajo demanda
- **Memoización**: React hooks optimizados

## 🎯 Funcionalidades Destacadas

### **Autenticación Robusta**
- Verificación de tokens con timeout
- Fallback a modo local para desarrollo
- Gestión de sesiones con sessionStorage/localStorage

### **Gestión de Datos Inteligente**
- Cache automático con TTL
- Sincronización local/remota
- Validaciones en tiempo real
- Manejo de errores robusto

### **UI/UX Moderna**
- Paleta de colores elegante (claro/oscuro)
- Transiciones suaves y animaciones
- Componentes accesibles y responsive
- Navegación optimizada

## 🔧 Configuración

### **Variables de Entorno**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### **Webpack Optimizado**
- Configuración simplificada y estable
- Chunks básicos sin optimizaciones complejas
- Mejor compatibilidad y estabilidad

## 📊 Estado del Proyecto

### **✅ Completado**
- [x] Refactorización completa del código
- [x] Optimización de rendimiento
- [x] Limpieza de archivos temporales
- [x] Consolidación de servicios
- [x] Actualización de estilos
- [x] Testing de funcionalidad

### **🚀 Próximos Pasos**
- [ ] Implementación de pruebas unitarias
- [ ] Migración a TypeScript
- [ ] Documentación de API
- [ ] Optimización de bundle size

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Alliance F&R** - [contacto@alliance.com](mailto:contacto@alliance.com)

---

**Versión**: V96 - Refactorización completa y optimización masiva  
**Última actualización**: Agosto 2024  
**Estado**: ✅ Producción lista