# 🐄 MiRancho360# React + TypeScript + Vite



**MiRancho360** es una webapp mobile-first diseñada para la administración integral de ranchos familiares. La aplicación está enfocada en ser **simple, accesible y eficaz** para usuarios adultos mayores.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🎯 Características PrincipalesCurrently, two official plugins are available:



### MVP1 - Animales y Sitios- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

- ✅ **Autenticación con PIN de 4 dígitos**- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- ✅ **Gestión de Animales**: Registro, consulta y seguimiento

- ✅ **Gestión de Sitios**: Corrales, pasturas y áreas del rancho## Expanding the ESLint configuration

- ✅ **Interfaz mobile-first** con botones grandes y texto legible

- ✅ **Reportes básicos** (Excel/PDF)If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



### Características Técnicas```js

- 🚀 **React + Vite + TypeScript**export default defineConfig([

- 🎨 **Tailwind CSS** con tema personalizado  globalIgnores(['dist']),

- 🗄️ **Supabase** (Base de datos + Auth + Storage)  {

- 📱 **PWA Ready** para uso offline    files: ['**/*.{ts,tsx}'],

- 🔒 **Seguridad** con Row Level Security    extends: [

- 📊 **Trazabilidad completa** de datos      // Other configs...



## 🛠️ Tecnologías      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

- **Frontend**: React 18, TypeScript, Vite      // Alternatively, use this for stricter rules

- **Estilos**: Tailwind CSS con clases personalizadas      tseslint.configs.strictTypeChecked,

- **Backend**: Supabase (PostgreSQL + Auth + Storage)      // Optionally, add this for stylistic rules

- **Routing**: React Router DOM      tseslint.configs.stylisticTypeChecked,

- **Deploy**: Netlify / Vercel

- **CI/CD**: GitHub Actions      // Other configs...

    ],

## 🚀 Instalación y Configuración    languageOptions: {

      parserOptions: {

### 1. Prerrequisitos        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- Node.js 18+         tsconfigRootDir: import.meta.dirname,

- npm o yarn      },

- Cuenta de Supabase      // other options...

- Cuenta de Netlify/Vercel    },

  },

### 2. Clonar y configurar])

```

```bash

# Clonar el repositorioYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

git clone [url-repo]

cd mirancho360```js

// eslint.config.js

# Instalar dependenciasimport reactX from 'eslint-plugin-react-x'

npm installimport reactDom from 'eslint-plugin-react-dom'



# Configurar variables de entornoexport default defineConfig([

cp .env.example .env  globalIgnores(['dist']),

# Editar .env con tus credenciales de Supabase  {

```    files: ['**/*.{ts,tsx}'],

    extends: [

### 3. Configurar Supabase      // Other configs...

      // Enable lint rules for React

1. Crear proyecto en [Supabase](https://supabase.com)      reactX.configs['recommended-typescript'],

2. Ejecutar el schema SQL (ver `database/schema.sql`)      // Enable lint rules for React DOM

3. Configurar Row Level Security      reactDom.configs.recommended,

4. Obtener URL y API Key anónima    ],

5. Actualizar archivo `.env`    languageOptions: {

      parserOptions: {

### 4. Ejecutar localmente        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

```bash      },

# Desarrollo      // other options...

npm run dev    },

  },

# Build para producción])

npm run build```


# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes base (Button, Input, Layout)
│   ├── animals/        # Componentes de animales
│   └── sites/          # Componentes de sitios
├── hooks/              # Custom hooks
│   ├── useAuth.tsx     # Autenticación
│   ├── useAnimals.ts   # Gestión de animales
│   └── useSites.ts     # Gestión de sitios
├── pages/              # Páginas de la aplicación
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── AnimalsPage.tsx
│   └── SitesPage.tsx
├── services/           # Servicios de API
│   ├── supabase.ts     # Configuración
│   ├── auth.ts         # Autenticación
│   ├── animals.ts      # API de animales
│   └── sites.ts        # API de sitios
├── types/              # Tipos TypeScript
│   ├── auth.ts
│   ├── animals.ts
│   ├── sites.ts
│   └── index.ts
└── utils/              # Utilidades y constantes
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Ranch Blue**: Azul institucional del rancho
- **Earth Brown**: Tonos tierra para elementos secundarios
- **Semantic Colors**: Verde (éxito), Rojo (peligro), Amber (advertencia)

### Componentes Base
- **Button**: 3 variantes (primary, secondary, outline) en 3 tamaños
- **Input**: Inputs grandes con iconos y validación
- **Layout**: Layout responsivo con header y contenido
- **Card**: Tarjetas para mostrar información

### Mobile-First
- Botones mínimo 60px de altura
- Texto grande (18px+) para legibilidad
- Espaciado generoso entre elementos
- Touch targets de mínimo 44px

## 🗄️ Base de Datos

### Tablas Principales

#### usuarios
- Gestión de usuarios con roles (administrador, colaborador, familiar)
- Autenticación con PIN hasheado

#### animales
- Registro completo de animales con arete único
- Relación con razas y sitio actual

#### sitios
- Corrales, pasturas y áreas del rancho
- Tipificación flexible con tipos_sitio

#### movimientos_animales
- Historial completo de movimientos
- Trazabilidad de cambios de sitio

### Views y Funciones
- `sitios_con_animales`: Vista con conteo de animales por sitio
- RLS (Row Level Security) configurado por usuario

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conectar repositorio de GitHub
2. Configurar build commands:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. Configurar variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Vercel

```bash
# Deploy con Vercel CLI
npm install -g vercel
vercel --prod
```

## 📱 PWA y Offline

La aplicación está preparada para ser una PWA:
- Manifest configurado
- Service Worker (próximamente)
- Caching estratégico para uso offline

## 🔐 Seguridad

- **Row Level Security** en Supabase
- **PIN de 4 dígitos** con hash SHA-256
- **Validación client-side y server-side**
- **Sesiones con expiración automática**

## 📊 Roadmap

### ✅ Sprint 1 - MVP Animales + Sitios (Actual)
- [x] Setup técnico
- [x] Autenticación
- [x] CRUD Animales
- [x] CRUD Sitios
- [x] Dashboard básico

### 📋 Sprint 2 - Finanzas (Próximo)
- [ ] Registro de ingresos/gastos
- [ ] Flujo de caja básico
- [ ] Exportación a Excel

### 📋 Sprint 3 - Inventario
- [ ] Control de insumos
- [ ] Alertas de stock
- [ ] Proveedores

### 📋 Sprint 4 - Agenda & Personal
- [ ] Calendario de vacunaciones
- [ ] Registro de empleados
- [ ] Nómina básica

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- 📧 Email: [tu-email]
- 🐛 Issues: [GitHub Issues](https://github.com/[usuario]/mirancho360/issues)
- 📖 Docs: [Documentación completa](https://docs.mirancho360.com)

---

**MiRancho360** - Digitalizando el campo familiar 🌾