# GUÍA DE MEJORES PRÁCTICAS

## 📋 RESUMEN EJECUTIVO

**Propósito**: Documentar mejores prácticas identificadas durante la auditoría  
**Alcance**: React, Next.js, JavaScript, Arquitectura  
**Audiencia**: Desarrolladores del equipo  
**Última Actualización**: Diciembre 2024  

---

## 🎯 PRINCIPIOS FUNDAMENTALES

### **1. Estabilidad sobre Velocidad**
- **Prioridad**: Mantener sistema funcional
- **Enfoque**: Cambios incrementales y seguros
- **Verificación**: Testing exhaustivo antes de deploy
- **Rollback**: Plan de reversión siempre disponible

### **2. Código Limpio y Mantenible**
- **Legibilidad**: Código auto-documentado
- **Consistencia**: Patrones uniformes en todo el proyecto
- **Simplicidad**: Soluciones simples sobre complejas
- **DRY**: Evitar duplicación de código

### **3. Performance por Defecto**
- **Optimización**: Considerar performance desde el diseño
- **Monitoreo**: Medir antes de optimizar
- **Lazy Loading**: Cargar solo lo necesario
- **Memoización**: Usar cuando sea beneficioso

---

## ⚛️ REACT BEST PRACTICES

### **1. Hooks y Rendering**

#### **useEffect Guidelines**
```javascript
// ✅ CORRECTO - Dependencias explícitas
useEffect(() => {
  // Lógica del efecto
}, [dependency1, dependency2]);

// ❌ INCORRECTO - Dependencias faltantes
useEffect(() => {
  // Lógica del efecto
}, []); // Si usa variables del scope

// ✅ CORRECTO - Cleanup function
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

#### **useCallback Guidelines**
```javascript
// ✅ CORRECTO - Memoizar funciones costosas
const handleSubmit = useCallback((data) => {
  // Lógica compleja
}, [dependency]);

// ❌ INCORRECTO - Memoizar funciones simples
const handleClick = useCallback(() => {
  console.log('click');
}, []); // No necesario para funciones simples
```

#### **useMemo Guidelines**
```javascript
// ✅ CORRECTO - Cálculos costosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ❌ INCORRECTO - Valores simples
const simpleValue = useMemo(() => {
  return data.length;
}, [data]); // No necesario para operaciones simples
```

### **2. Component Architecture**

#### **Component Composition**
```javascript
// ✅ CORRECTO - Composición sobre herencia
const UserCard = ({ user, actions }) => (
  <Card>
    <UserInfo user={user} />
    <UserActions actions={actions} />
  </Card>
);

// ❌ INCORRECTO - Componente monolítico
const UserCard = ({ user }) => (
  <div>
    {/* 200+ líneas de JSX */}
  </div>
);
```

#### **Props Design**
```javascript
// ✅ CORRECTO - Props específicas
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  children 
}) => {
  // Implementación
};

// ❌ INCORRECTO - Props genéricas
const Button = ({ 
  className, 
  style, 
  ...rest 
}) => {
  // Difícil de mantener
};
```

### **3. State Management**

#### **Zustand Best Practices**
```javascript
// ✅ CORRECTO - Store bien estructurado
const useStore = create((set, get) => ({
  // State
  data: [],
  loading: false,
  error: null,
  
  // Actions
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Computed values
  getDataCount: () => get().data.length,
  getFilteredData: (filter) => get().data.filter(filter),
}));

// ✅ CORRECTO - Selectores optimizados
const useDataCount = () => useStore(state => state.getDataCount());
const useFilteredData = (filter) => useStore(state => state.getFilteredData(filter));
```

#### **Local vs Global State**
```javascript
// ✅ CORRECTO - Estado local para UI
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});

// ✅ CORRECTO - Estado global para datos compartidos
const { user, setUser } = useAuthStore();
const { clients, addClient } = useClientsStore();
```

---

## 🚀 NEXT.JS BEST PRACTICES

### **1. File Structure**
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── forms/          # Componentes de formularios
│   └── layouts/        # Layouts y wrappers
├── features/           # Funcionalidades específicas
│   ├── auth/           # Autenticación
│   ├── clients/        # Gestión de clientes
│   └── movements/      # Gestión de movimientos
├── hooks/              # Custom hooks
├── stores/             # Estado global (Zustand)
├── services/           # Servicios y APIs
├── utils/              # Utilidades
└── pages/              # Páginas de Next.js
```

### **2. API Routes**
```javascript
// ✅ CORRECTO - API route bien estructurado
export default async function handler(req, res) {
  try {
    // Validación de método
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validación de entrada
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Data required' });
    }

    // Lógica de negocio
    const result = await processData(data);

    // Respuesta exitosa
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    // Manejo de errores
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### **3. Performance Optimization**
```javascript
// ✅ CORRECTO - Lazy loading de páginas
const LazyComponent = lazy(() => import('../components/HeavyComponent'));

// ✅ CORRECTO - Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>

// ✅ CORRECTO - Image optimization
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority={true}
/>
```

---

## 🔧 JAVASCRIPT BEST PRACTICES

### **1. Error Handling**
```javascript
// ✅ CORRECTO - Try-catch específico
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  if (error.name === 'ValidationError') {
    throw new Error('Invalid data provided');
  }
  if (error.name === 'NetworkError') {
    throw new Error('Network connection failed');
  }
  throw error; // Re-throw unknown errors
}

// ✅ CORRECTO - Error boundaries en React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### **2. Async/Await Patterns**
```javascript
// ✅ CORRECTO - Async/await con error handling
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// ✅ CORRECTO - Promise.all para operaciones paralelas
const fetchMultipleData = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);
    return { users, posts, comments };
  } catch (error) {
    console.error('Parallel fetch error:', error);
    throw error;
  }
};
```

### **3. Data Validation**
```javascript
// ✅ CORRECTO - Validación de entrada
const validateUser = (user) => {
  const errors = [];
  
  if (!user.name || user.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Valid email is required');
  }
  
  if (!user.age || user.age < 18 || user.age > 120) {
    errors.push('Age must be between 18 and 120');
  }
  
  return errors;
};

// ✅ CORRECTO - Uso en componentes
const handleSubmit = (formData) => {
  const errors = validateUser(formData);
  if (errors.length > 0) {
    setErrors(errors);
    return;
  }
  // Procesar datos válidos
};
```

---

## 🎨 CSS/STYLING BEST PRACTICES

### **1. Tailwind CSS Guidelines**
```javascript
// ✅ CORRECTO - Clases organizadas
const buttonClasses = `
  px-4 py-2 
  bg-blue-500 hover:bg-blue-600 
  text-white font-medium 
  rounded-lg transition-colors
  focus:outline-none focus:ring-2 focus:ring-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
`;

// ✅ CORRECTO - Componentes con variantes
const Button = ({ variant = 'primary', size = 'medium', ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };
  
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    />
  );
};
```

### **2. Responsive Design**
```javascript
// ✅ CORRECTO - Mobile-first approach
<div className="
  w-full 
  md:w-1/2 
  lg:w-1/3 
  xl:w-1/4
  p-4 
  md:p-6 
  lg:p-8
">
  {/* Content */}
</div>

// ✅ CORRECTO - Responsive utilities
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};
```

---

## 🔒 SECURITY BEST PRACTICES

### **1. Input Validation**
```javascript
// ✅ CORRECTO - Sanitización de entrada
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remover caracteres peligrosos
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .trim()
    .substring(0, 1000); // Limitar longitud
};

// ✅ CORRECTO - Validación de tipos
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};
```

### **2. Authentication**
```javascript
// ✅ CORRECTO - JWT handling
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// ✅ CORRECTO - Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### **3. CORS and Headers**
```javascript
// ✅ CORRECTO - CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ CORRECTO - Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
};
```

---

## 📊 PERFORMANCE BEST PRACTICES

### **1. Bundle Optimization**
```javascript
// ✅ CORRECTO - Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Si no necesita SSR
});

// ✅ CORRECTO - Code splitting
const routes = {
  '/dashboard': () => import('./pages/Dashboard'),
  '/reports': () => import('./pages/Reports'),
  '/settings': () => import('./pages/Settings'),
};

// ✅ CORRECTO - Tree shaking
import { Button } from 'ui-library'; // Solo importa Button
// ❌ INCORRECTO
import * as UI from 'ui-library'; // Importa todo
```

### **2. Memory Management**
```javascript
// ✅ CORRECTO - Cleanup en useEffect
useEffect(() => {
  const subscription = subscribe();
  const timer = setInterval(updateData, 5000);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);

// ✅ CORRECTO - Event listener cleanup
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### **3. Caching Strategies**
```javascript
// ✅ CORRECTO - React Query para caching
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});

// ✅ CORRECTO - Memoización de cálculos costosos
const expensiveCalculation = useMemo(() => {
  return data?.reduce((acc, item) => {
    // Cálculo complejo
    return acc + item.value;
  }, 0);
}, [data]);
```

---

## 🧪 TESTING BEST PRACTICES

### **1. Unit Testing**
```javascript
// ✅ CORRECTO - Test structure
describe('UserService', () => {
  describe('validateUser', () => {
    it('should return errors for invalid user', () => {
      const invalidUser = { name: '', email: 'invalid' };
      const errors = validateUser(invalidUser);
      
      expect(errors).toContain('Name is required');
      expect(errors).toContain('Valid email is required');
    });

    it('should return empty array for valid user', () => {
      const validUser = { name: 'John', email: 'john@example.com' };
      const errors = validateUser(validUser);
      
      expect(errors).toHaveLength(0);
    });
  });
});

// ✅ CORRECTO - Component testing
describe('UserCard', () => {
  it('should render user information', () => {
    const user = { name: 'John', email: 'john@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    const user = { id: 1, name: 'John' };
    
    render(<UserCard user={user} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

### **2. Integration Testing**
```javascript
// ✅ CORRECTO - API testing
describe('User API', () => {
  it('should create user successfully', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body).toMatchObject({
      success: true,
      data: expect.objectContaining({
        id: expect.any(Number),
        name: userData.name,
        email: userData.email,
      }),
    });
  });
});
```

---

## 📝 DOCUMENTATION BEST PRACTICES

### **1. Code Documentation**
```javascript
/**
 * Calcula el balance total de un cliente
 * @param {Array} movements - Array de movimientos del cliente
 * @param {string} currency - Moneda para el cálculo
 * @returns {number} Balance total en la moneda especificada
 * @example
 * const balance = calculateBalance(clientMovements, 'USD');
 * console.log(balance); // 1500.50
 */
const calculateBalance = (movements, currency) => {
  return movements
    .filter(m => m.currency === currency)
    .reduce((total, m) => total + m.amount, 0);
};

/**
 * Hook personalizado para manejar formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Función a ejecutar al enviar
 * @returns {Object} Estado y funciones del formulario
 */
const useForm = (initialValues, onSubmit) => {
  // Implementación
};
```

### **2. README Guidelines**
```markdown
# Project Name

Brief description of the project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## Architecture

Brief description of the architecture and key decisions.

## Contributing

Guidelines for contributing to the project.
```

---

## 🚨 ANTI-PATTERNS TO AVOID

### **1. React Anti-patterns**
```javascript
// ❌ INCORRECTO - Mutar estado directamente
const [users, setUsers] = useState([]);

const addUser = (user) => {
  users.push(user); // Mutación directa
  setUsers(users); // No trigger re-render
};

// ✅ CORRECTO - Inmutabilidad
const addUser = (user) => {
  setUsers(prevUsers => [...prevUsers, user]);
};

// ❌ INCORRECTO - useEffect sin dependencias
useEffect(() => {
  fetchData();
}, []); // Si fetchData cambia, no se actualiza

// ✅ CORRECTO - Dependencias explícitas
useEffect(() => {
  fetchData();
}, [fetchData]); // Con useCallback en fetchData
```

### **2. Performance Anti-patterns**
```javascript
// ❌ INCORRECTO - Re-crear objetos en render
const Component = ({ data }) => {
  const config = { theme: 'dark', size: 'large' }; // Se recrea cada render
  
  return <Child config={config} />;
};

// ✅ CORRECTO - Memoizar objetos
const Component = ({ data }) => {
  const config = useMemo(() => ({ theme: 'dark', size: 'large' }), []);
  
  return <Child config={config} />;
};

// ❌ INCORRECTO - Funciones inline
const Component = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
};

// ✅ CORRECTO - Funciones memoizadas
const Component = ({ items }) => {
  const handleItemClick = useCallback((item) => {
    handleClick(item);
  }, [handleClick]);

  return (
    <div>
      {items.map(item => (
        <Item key={item.id} onClick={() => handleItemClick(item)} />
      ))}
    </div>
  );
};
```

---

## 📊 MONITORING AND METRICS

### **1. Performance Monitoring**
```javascript
// ✅ CORRECTO - Core Web Vitals
const reportWebVitals = (metric) => {
  console.log(metric);
  
  // Enviar a analytics
  if (metric.name === 'LCP') {
    analytics.track('web_vitals', {
      metric: 'LCP',
      value: metric.value,
    });
  }
};

// ✅ CORRECTO - Error tracking
const logError = (error, context) => {
  console.error('Error:', error, context);
  
  // Enviar a servicio de error tracking
  errorService.captureException(error, {
    extra: context,
    tags: {
      component: context.component,
      action: context.action,
    },
  });
};
```

### **2. User Analytics**
```javascript
// ✅ CORRECTO - Event tracking
const trackEvent = (eventName, properties = {}) => {
  analytics.track(eventName, {
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    ...properties,
  });
};

// ✅ CORRECTO - Page tracking
const trackPageView = (pageName) => {
  analytics.page(pageName, {
    url: window.location.href,
    referrer: document.referrer,
  });
};
```

---

## 📝 CONCLUSIONES

### **Principios Clave**
1. **Simplicidad**: Soluciones simples sobre complejas
2. **Consistencia**: Patrones uniformes en todo el proyecto
3. **Performance**: Optimizar desde el diseño
4. **Seguridad**: Validar y sanitizar todo input
5. **Testing**: Cobertura adecuada de tests
6. **Documentación**: Código auto-documentado

### **Próximos Pasos**
1. **Implementar**: Aplicar estas prácticas gradualmente
2. **Revisar**: Code reviews basados en estas guías
3. **Mejorar**: Iterar y refinar continuamente
4. **Compartir**: Difundir conocimiento en el equipo

### **Recursos Adicionales**
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Web Performance](https://web.dev/performance/)
