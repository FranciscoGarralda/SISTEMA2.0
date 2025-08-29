# DEPENDENCY_MAP.md

*Auditoría generada automáticamente - No modificar manualmente*

## 📊 MAPA DE DEPENDENCIAS - SISTEMA FINANCIERO ALLIANCE F&R

**Fecha**: Diciembre 2024  
**Versión del Sistema**: V125  
**Auditor**: Principal Software Architect + Staff QA  

---

## 🏗️ ARQUITECTURA DE DEPENDENCIAS

### **Niveles de Arquitectura**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Pages     │ │ Components  │ │   Layouts   │           │
│  │  (Next.js)  │ │    (UI)     │ │  (Shared)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FEATURE LAYER                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Features   │ │    Hooks    │ │   Stores    │           │
│  │ (Business)  │ │ (Custom)    │ │  (Zustand)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ dataService │ │businessSvc  │ │ utilitySvc  │           │
│  │   (API)     │ │ (Logic)     │ │ (Helpers)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Netlify     │ │  Local      │ │   Utils     │           │
│  │ Functions   │ │ Storage     │ │ (Constants) │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 DEPENDENCIAS POR MÓDULO

### **1. PAGES (src/pages/)**
```
pages/
├── index.js
│   ├── useAuth (hooks)
│   ├── useData (hooks)
│   └── Feature Components
├── _app.js
│   ├── NavigationApp
│   └── Global Styles
└── Feature Pages
    ├── clientes.js → ClientesApp
    ├── operaciones.js → FinancialOperationsApp
    ├── movimientos.js → MovimientosApp
    └── [otros] → [Feature Apps]
```

### **2. FEATURES (src/features/)**
```
features/
├── clients/
│   ├── ClientesApp.jsx
│   ├── hooks/useClients.js
│   └── components/
├── movements/
│   ├── MovimientosApp.jsx
│   ├── hooks/useMovements.js
│   └── components/
├── financial-operations/
│   ├── FinancialOperationsApp.jsx
│   ├── hooks/useFinancialOperations.js
│   └── components/
└── [otros features]/
```

### **3. HOOKS (src/hooks/)**
```
hooks/
├── useAuth.js
│   ├── useAuthStore (stores)
│   └── dataService (services)
├── useData.js
│   ├── useClientsStore (stores)
│   ├── useMovementsStore (stores)
│   └── dataService (services)
├── useHookCommunication.js
│   └── Event Bus (internal)
└── [otros hooks]/
```

### **4. STORES (src/stores/)**
```
stores/
├── authStore.js
│   ├── dataService (services)
│   └── localStorage (infrastructure)
├── clientsStore.js
│   ├── dataService (services)
│   └── localStorage (infrastructure)
├── movementsStore.js
│   ├── dataService (services)
│   └── localStorage (infrastructure)
├── sharedUIStore.js
│   └── Zustand (framework)
└── index.js (exports)
```

### **5. SERVICES (src/services/)**
```
services/
├── dataService.js
│   ├── Netlify Functions (infrastructure)
│   ├── localStorage (infrastructure)
│   └── utils (infrastructure)
├── businessService.js
│   ├── dataService (services)
│   └── utils (infrastructure)
├── utilityService.js
│   └── utils (infrastructure)
└── index.js (exports)
```

### **6. COMPONENTS (src/components/)**
```
components/
├── ui/
│   ├── NavigationApp.jsx
│   ├── Footer.jsx
│   └── [UI components]
├── forms/
│   ├── ClientAutocomplete.jsx
│   ├── CurrencyInput.jsx
│   └── [Form components]
└── layouts/
    └── [Layout components]
```

---

## 🔄 FLUJO DE DATOS

### **Flujo Principal de Autenticación**
```
useAuth → authStore → dataService → Netlify Functions → Database
```

### **Flujo de Datos de Clientes**
```
useClients → clientsStore → dataService → Netlify Functions → Database
```

### **Flujo de Operaciones Financieras**
```
FinancialOperationsApp → useFinancialOperations → dataService → Netlify Functions → Database
```

### **Flujo de Comunicación Entre Hooks**
```
Hook A → useHookCommunication → Hook B
```

---

## ⚠️ DEPENDENCIAS CRÍTICAS

### **Dependencias de Alto Riesgo**
1. **dataService.js**: Punto único de fallo para todas las operaciones de datos
2. **useAuth.js**: Controla acceso a toda la aplicación
3. **useHookCommunication.js**: Sistema de comunicación entre hooks

### **Dependencias Circulares Detectadas**
- Ninguna detectada en esta fase

### **Dependencias Inestables**
- `useHookCommunication.emit`: Usado en múltiples hooks
- `dataService`: Referenciado en todos los stores

---

## 📊 MÉTRICAS DE DEPENDENCIAS

### **Complejidad Ciclomática**
- **Pages**: Baja (1-2 dependencias por página)
- **Features**: Media (3-5 dependencias por feature)
- **Hooks**: Alta (5-8 dependencias por hook)
- **Stores**: Media (2-4 dependencias por store)
- **Services**: Baja (1-3 dependencias por servicio)

### **Acoplamiento**
- **Alto**: Hooks y Stores
- **Medio**: Features y Services
- **Bajo**: Pages y Components

### **Cohesión**
- **Alta**: Services (responsabilidades bien definidas)
- **Media**: Features (lógica de negocio encapsulada)
- **Baja**: Hooks (múltiples responsabilidades)

---

## 🎯 RECOMENDACIONES DE OPTIMIZACIÓN

### **Inmediatas**
1. **Reducir dependencias de dataService**: Crear servicios específicos por dominio
2. **Optimizar useHookCommunication**: Implementar memoización para evitar re-renders
3. **Consolidar stores**: Eliminar duplicación entre stores

### **Medio Plazo**
1. **Implementar lazy loading**: Para features menos usadas
2. **Crear interfaces**: Para desacoplar implementaciones
3. **Optimizar selectores**: En Zustand stores

### **Largo Plazo**
1. **Migrar a TypeScript**: Para mejor control de dependencias
2. **Implementar DI**: Para testing y flexibilidad
3. **Crear micro-frontends**: Para features independientes

---

## 🔍 PUNTOS DE ATENCIÓN

### **Monitoreo Continuo**
1. **Dependencias circulares**: Verificar en cada cambio
2. **Acoplamiento excesivo**: Revisar en refactoring
3. **Puntos únicos de fallo**: Identificar y mitigar

### **Testing de Dependencias**
1. **Unit tests**: Para cada módulo independiente
2. **Integration tests**: Para flujos de datos
3. **E2E tests**: Para flujos completos

---

## 📝 NOTAS IMPORTANTES

1. **La arquitectura sigue principios de Clean Architecture**
2. **Las dependencias fluyen de afuera hacia adentro**
3. **Los hooks actúan como orquestadores entre capas**
4. **Los stores centralizan el estado global**
5. **Los services encapsulan la lógica de negocio**

**Estado**: ✅ MAPA COMPLETADO - LISTO PARA ANÁLISIS
