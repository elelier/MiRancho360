# Árbol de Código Fuente — MiRancho360

**Fecha:** 3 de octubre de 2025  
**Versión:** 1.0  
**Propósito:** Documentar la estructura detallada del código fuente para desarrolladores y agentes automáticos.

## Visión General

Este documento describe la organización del código en `src/` y otras carpetas clave del repositorio. Cada sección explica el propósito, convenciones de nombre y responsabilidades de los archivos/carpetas principales.

---

## Estructura Completa del Repositorio

```
MiRancho360/
├── .ai/                          # Logs y reportes de agentes AI (debug, lighthouse)
├── .bmad-core/                   # Configuración BMAD Method (agentes, tareas, templates)
├── .github/                      # Workflows de CI/CD (pendiente configurar)
├── coverage/                     # Reportes de cobertura de tests (generado)
├── database/                     # Schema SQL y migraciones
│   ├── schema.sql                # Schema completo de la base de datos
│   ├── migrations/               # Migraciones SQL ordenadas numéricamente
│   │   ├── 001_add_estado_field.sql
│   │   ├── 002_add_foto_url_field.sql
│   │   ├── 003_create_animal_fotos_table.sql
│   │   ├── 004_animal_reproductive_status.sql
│   │   ├── 005_allow_direct_pregnancy.sql
│   │   ├── 006_observaciones_system.sql
│   │   └── 007_genealogy_and_archive.sql
│   ├── setup_animal_fotos_rls.sql
│   ├── setup_storage_bucket.sql
│   └── verify_animal_fotos_table.sql
├── docs/                         # Documentación del proyecto
│   ├── architecture/             # Documentos de arquitectura
│   │   ├── architecture.md       # Visión general de arquitectura
│   │   ├── coding-standards.md   # Estándares de código
│   │   ├── project-structure.md  # Convenciones de estructura
│   │   ├── tech-stack.md         # Stack tecnológico
│   │   └── source-tree.md        # Este documento
│   ├── briefs/                   # Briefs de proyecto
│   ├── epics/                    # Épicas y planificación
│   ├── prd/                      # Product Requirements Documents
│   └── stories/                  # User stories detalladas
├── public/                       # Recursos públicos (manifest, iconos)
│   ├── manifest.json
│   └── vite.svg
├── scripts/                      # Scripts de soporte y setup
│   ├── doc_check.ps1
│   ├── setup-database.js
│   └── setup-health-system*.js
├── src/                          # ⭐ CÓDIGO FUENTE PRINCIPAL
│   ├── assets/                   # Recursos estáticos (imágenes, SVGs)
│   ├── components/               # Componentes React organizados por dominio
│   │   ├── animals/              # Componentes específicos de animales
│   │   ├── calendar/             # Componentes de calendario
│   │   └── common/               # Componentes reutilizables y base
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Layout.tsx
│   │       ├── LargeButton.tsx   # Componente accesible para usuarios 60+
│   │       ├── LargeButton.md    # Documentación del componente
│   │       ├── index.ts          # Barrel export
│   │       └── __tests__/        # Tests unitarios de componentes
│   ├── hooks/                    # React hooks personalizados
│   │   ├── auth-context.ts       # Context de autenticación
│   │   ├── auth-provider.tsx     # Provider de autenticación
│   │   ├── useAnimals.ts         # Hook para gestión de animales
│   │   ├── useAuth.ts            # Hook principal de auth
│   │   ├── useCrias.ts           # Hook para gestión de crías
│   │   ├── useHealth.ts          # Hook para sistema de salud
│   │   ├── useMovements.ts       # Hook para movimientos de animales
│   │   ├── useObservaciones.ts   # Hook para observaciones
│   │   ├── useRancho.ts          # Hook para datos del rancho
│   │   ├── useRazas.ts           # Hook para razas de animales
│   │   ├── useReminders.ts       # Hook para recordatorios
│   │   ├── useReproductive.ts    # Hook para sistema reproductivo
│   │   ├── useSites.ts           # Hook para sitios/ubicaciones
│   │   └── useSitiosConAnimales.ts
│   ├── pages/                    # Páginas/rutas de la aplicación
│   │   ├── AnimalFormPage.tsx    # Formulario de creación/edición de animales
│   │   ├── AnimalProfilePage.tsx # Perfil detallado de animal
│   │   ├── AnimalsListPage.tsx   # Lista de animales del inventario
│   │   ├── DashboardPage.tsx     # Dashboard principal
│   │   ├── HealthDashboardPage.tsx # Dashboard de salud
│   │   ├── LargeButtonShowcasePage.tsx # DEMO de componente LargeButton
│   │   ├── LoginPage.tsx         # Página de autenticación (PIN)
│   │   ├── RemindersPage.tsx     # Gestión de recordatorios
│   │   ├── ReproductivePage.tsx  # Dashboard reproductivo
│   │   └── SitesPage.tsx         # Gestión de sitios/ubicaciones
│   ├── services/                 # Capa de servicios (API/Supabase)
│   │   ├── album.ts              # Servicio de álbum de fotos
│   │   ├── animals.ts            # CRUD de animales
│   │   ├── auth.ts               # Autenticación y gestión de sesión
│   │   ├── genealogy.ts          # Servicios de genealogía
│   │   ├── health.ts             # Sistema de salud
│   │   ├── imageUpload.ts        # Subida de imágenes a Supabase Storage
│   │   ├── observaciones.ts      # Sistema de observaciones
│   │   ├── reproductive.ts       # Sistema reproductivo
│   │   ├── sites.ts              # CRUD de sitios/ubicaciones
│   │   └── supabase.ts           # ⭐ Cliente compartido de Supabase
│   ├── types/                    # Definiciones TypeScript globales
│   │   └── *.d.ts                # Tipos compartidos
│   ├── utils/                    # Utilidades y helpers
│   ├── App.tsx                   # Componente raíz de la aplicación
│   ├── App.css                   # Estilos globales de App
│   ├── index.css                 # Estilos globales (Tailwind imports)
│   ├── main.tsx                  # Punto de entrada de la aplicación
│   ├── setupTests.ts             # Configuración de Vitest
│   └── vite-env.d.ts             # Tipos de Vite
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore
├── eslint.config.js              # Configuración de ESLint
├── index.html                    # HTML raíz para Vite
├── netlify.toml                  # Configuración de despliegue en Netlify
├── package.json                  # Dependencias y scripts npm
├── postcss.config.js             # Configuración de PostCSS
├── README.md                     # Documentación principal del proyecto
├── tailwind.config.js            # Configuración de Tailwind CSS (tema Rancho Natural)
├── tsconfig.json                 # Configuración principal de TypeScript
├── tsconfig.app.json             # Configuración TS para aplicación
├── tsconfig.node.json            # Configuración TS para Node scripts
├── vite.config.ts                # Configuración de Vite
└── vitest.config.ts              # Configuración de Vitest (testing)
```

---

## Descripción Detallada por Carpeta

### 📁 `src/` — Código Fuente Principal

Contiene todo el código de la aplicación React. Organizado por responsabilidades claras.

#### 📁 `src/components/` — Componentes React

Componentes UI organizados por dominio de negocio y reutilización:

**`common/`** — Componentes base reutilizables en toda la app:
- `Button.tsx` — Botón estándar con variantes
- `Input.tsx` — Input accesible para formularios
- `Layout.tsx` — Layout principal con navegación
- **`LargeButton.tsx`** — Botón accesible optimizado para usuarios 60+ (48x48px mínimo, WCAG AA)
- `index.ts` — Barrel export para importaciones limpias
- `__tests__/` — Tests unitarios (Vitest + React Testing Library)

**`animals/`** — Componentes específicos del dominio de animales:
- Tarjetas de animal, listados, formularios especializados

**`calendar/`** — Componentes de calendario y planificación:
- Recordatorios, eventos reproductivos, visualizaciones de tiempo

**Convenciones:**
- Nombres en PascalCase (ej: `AnimalCard.tsx`)
- Props tipadas con TypeScript interfaces
- Tests en carpeta `__tests__/` con sufijo `.test.tsx`
- Documentación en archivos `.md` para componentes base

#### 📁 `src/hooks/` — React Hooks Personalizados

Encapsulan lógica de estado, efectos y acceso a datos. Todos prefijados con `use`.

**Hooks de Autenticación:**
- `useAuth.ts` — Hook principal de autenticación
- `auth-context.ts` — Context de estado de auth
- `auth-provider.tsx` — Provider que envuelve la app

**Hooks de Datos:**
- `useAnimals.ts` — Gestión de animales (CRUD, listados, búsqueda)
- `useCrias.ts` — Gestión de crías y descendencia
- `useHealth.ts` — Sistema de salud (registros, alertas)
- `useMovements.ts` — Movimientos de animales entre sitios
- `useObservaciones.ts` — Sistema de observaciones
- `useRancho.ts` — Datos generales del rancho
- `useRazas.ts` — Catálogo de razas
- `useReminders.ts` — Recordatorios y notificaciones
- `useReproductive.ts` — Sistema reproductivo (gestaciones, partos)
- `useSites.ts` — Gestión de sitios/ubicaciones
- `useSitiosConAnimales.ts` — Relación sitios-animales

**Patrón de retorno estándar:**
```typescript
{
  data: T | null,
  isLoading: boolean,
  error: Error | null,
  refresh: () => void,
  // Métodos específicos del hook
}
```

#### 📁 `src/pages/` — Páginas/Rutas de la Aplicación

Cada archivo representa una ruta en la aplicación. Sufijo `Page.tsx` obligatorio.

**Páginas principales:**
- `LoginPage.tsx` — Autenticación con PIN de 4 dígitos
- `DashboardPage.tsx` — Dashboard principal con resumen de operaciones
- `AnimalsListPage.tsx` — Inventario de animales con búsqueda y filtros
- `AnimalProfilePage.tsx` — Perfil detallado de un animal individual
- `AnimalFormPage.tsx` — Formulario de creación/edición de animales
- `SitesPage.tsx` — Gestión de sitios/ubicaciones del rancho
- `HealthDashboardPage.tsx` — Dashboard de salud con alertas
- `ReproductivePage.tsx` — Dashboard reproductivo con calendario
- `RemindersPage.tsx` — Gestión de recordatorios y tareas
- `LargeButtonShowcasePage.tsx` — DEMO interactivo del componente LargeButton

**Configuración de rutas:**
- Definidas en `App.tsx` usando React Router DOM
- Rutas protegidas verifican autenticación

#### 📁 `src/services/` — Capa de Servicios

Abstracción sobre llamadas a Supabase. Centraliza lógica de API/backend.

**Servicios disponibles:**
- **`supabase.ts`** — ⭐ Cliente compartido de Supabase (punto de entrada único)
- `auth.ts` — Autenticación (login con PIN, logout, sesión)
- `animals.ts` — CRUD de animales, búsqueda, archivado
- `sites.ts` — CRUD de sitios/ubicaciones
- `health.ts` — Sistema de salud (registros médicos, vacunas)
- `reproductive.ts` — Sistema reproductivo (gestaciones, partos, crías)
- `observaciones.ts` — Sistema de observaciones generales
- `genealogy.ts` — Servicios de genealogía y árboles familiares
- `album.ts` — Gestión de álbum de fotos por animal
- `imageUpload.ts` — Subida de imágenes a Supabase Storage

**Principios:**
- Todo acceso a Supabase DEBE pasar por estos servicios
- Manejo de errores centralizado
- Tipos de retorno consistentes (Promise con data/error)
- No exponer detalles de implementación de Supabase a componentes

#### 📁 `src/types/` — Definiciones TypeScript

Tipos compartidos globalmente en la aplicación:
- Interfaces de entidades (Animal, Site, Health, Reproductive)
- Tipos de props de componentes
- Tipos de respuestas de servicios
- Enums y constantes tipadas

#### 📁 `src/utils/` — Utilidades y Helpers

Funciones auxiliares reutilizables:
- Formateo de fechas
- Validaciones
- Transformaciones de datos
- Constantes de configuración

#### 📄 Archivos Raíz de `src/`

- **`main.tsx`** — Punto de entrada de React, renderiza `<App />` en el DOM
- **`App.tsx`** — Componente raíz, define rutas y estructura principal
- **`App.css`** — Estilos globales del componente App
- **`index.css`** — Estilos globales (importa Tailwind CSS)
- **`setupTests.ts`** — Configuración de Vitest para testing
- **`vite-env.d.ts`** — Tipos de Vite para TypeScript

---

### 📁 `database/` — Base de Datos y Migraciones

**`schema.sql`** — Schema completo de la base de datos PostgreSQL en Supabase

**`migrations/`** — Migraciones SQL ordenadas numéricamente:
- `001_add_estado_field.sql` — Añade campo estado a animales
- `002_add_foto_url_field.sql` — Añade URL de foto principal
- `003_create_animal_fotos_table.sql` — Tabla de álbum de fotos
- `004_animal_reproductive_status.sql` — Sistema reproductivo
- `005_allow_direct_pregnancy.sql` — Permite gestación directa sin servicio previo
- `006_observaciones_system.sql` — Sistema de observaciones
- `007_genealogy_and_archive.sql` — Genealogía y archivado

**Scripts de setup:**
- `setup_animal_fotos_rls.sql` — Row Level Security para fotos
- `setup_storage_bucket.sql` — Configuración del bucket de Storage
- `verify_animal_fotos_table.sql` — Verificación de tablas

**Convención de migraciones:**
- Prefijo numérico: `00x_descripcion.sql`
- Idempotentes cuando sea posible
- Documentar breaking changes

---

### 📁 `docs/` — Documentación del Proyecto

#### `docs/architecture/` — Documentos de Arquitectura

- **`architecture.md`** — Visión general de arquitectura del sistema
- **`tech-stack.md`** — Stack tecnológico (React, TypeScript, Supabase, Tailwind)
- **`project-structure.md`** — Convenciones de estructura y organización
- **`coding-standards.md`** — Estándares de código y mejores prácticas
- **`source-tree.md`** — Este documento (árbol detallado del código)

#### `docs/prd/` — Product Requirements Documents

Requisitos funcionales, no funcionales, criterios de aceptación, etc.

#### `docs/epics/` — Épicas y Planificación

Épicas agrupadas por funcionalidad (Dashboard, Onboarding, Inventario, Reportes, UX/Accesibilidad)

#### `docs/stories/` — User Stories Detalladas

Stories individuales con tareas técnicas, criterios de aceptación y estado de implementación.

---

### 📁 `scripts/` — Scripts de Soporte

Scripts para setup, testing y mantenimiento:
- `setup-database.js` — Inicialización de base de datos
- `setup-health-system*.js` — Setup del sistema de salud
- `doc_check.ps1` — Validación de documentación (PowerShell)

---

### 📁 `public/` — Recursos Públicos

Archivos servidos directamente sin procesamiento:
- `manifest.json` — Web App Manifest para PWA
- Iconos y assets estáticos

---

## Archivos de Configuración Raíz

### Configuración de Build y Dev

- **`vite.config.ts`** — Configuración de Vite (bundler)
- **`vitest.config.ts`** — Configuración de Vitest (testing framework)
- **`tsconfig.json`** — Configuración principal de TypeScript
- **`tsconfig.app.json`** — TS config específica para app
- **`tsconfig.node.json`** — TS config para scripts Node

### Configuración de Estilos

- **`tailwind.config.js`** — Configuración de Tailwind CSS con tema Rancho Natural:
  - Primary: Verde Dusty (#97B982)
  - Accent: Amarillo Tierra (#C5A34A)
  - Background: Verde Muy Claro (#F0F4EF)
- **`postcss.config.js`** — Configuración de PostCSS

### Configuración de Linting y Calidad

- **`eslint.config.js`** — Configuración de ESLint para TypeScript/React
- **`.gitignore`** — Archivos excluidos de Git

### Configuración de Deploy

- **`netlify.toml`** — Configuración de despliegue en Netlify
- **`.env.example`** — Ejemplo de variables de entorno necesarias

### Gestión de Dependencias

- **`package.json`** — Dependencias, scripts y metadata del proyecto
- **`package-lock.json`** — Lock de versiones exactas de dependencias

---

## Convenciones de Nomenclatura

### Archivos TypeScript/React

- **Componentes:** PascalCase + `.tsx` (ej: `LargeButton.tsx`)
- **Hooks:** camelCase + `use` prefix (ej: `useAnimals.ts`)
- **Servicios:** camelCase + `.ts` (ej: `animals.ts`)
- **Tipos:** PascalCase + `.d.ts` (ej: `Animal.d.ts`)
- **Tests:** Mismo nombre + `.test.tsx` (ej: `LargeButton.test.tsx`)
- **Páginas:** PascalCase + `Page.tsx` (ej: `DashboardPage.tsx`)

### Organización de Imports

1. Librerías externas (React, terceros)
2. Servicios y hooks propios
3. Componentes propios
4. Tipos
5. Estilos

Ejemplo:
```typescript
import { useState, useEffect } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { LargeButton } from '../components/common/LargeButton';
import type { Animal } from '../types/Animal';
import './styles.css';
```

---

## Flujos de Datos Clave

### Flujo de Autenticación

```
LoginPage → auth.ts → Supabase Auth → useAuth hook → AuthContext → App protegida
```

### Flujo de Datos de Animales

```
AnimalsListPage → useAnimals hook → animals.ts → Supabase DB → Estado local → UI
```

### Flujo de Subida de Imágenes

```
AnimalProfilePage → imageUpload.ts → Supabase Storage → URL → animals.ts → DB
```

---

## Puntos de Extensión

### Añadir una Nueva Página

1. Crear `src/pages/NuevoPage.tsx`
2. Añadir ruta en `App.tsx`
3. Crear hook si necesita datos: `src/hooks/useNuevo.ts`
4. Crear servicio si necesita API: `src/services/nuevo.ts`

### Añadir un Nuevo Componente Común

1. Crear `src/components/common/NuevoComponente.tsx`
2. Crear tests: `src/components/common/__tests__/NuevoComponente.test.tsx`
3. Documentar: `src/components/common/NuevoComponente.md`
4. Exportar en `src/components/common/index.ts`

### Añadir una Nueva Migración

1. Crear `database/migrations/00x_descripcion.sql` con número secuencial
2. Actualizar `database/schema.sql` si es necesario
3. Documentar en commit y en `database/README.md` (si existe)

---

## Scripts NPM Disponibles

Ver `package.json` para la lista completa. Principales:

- `npm run dev` — Servidor de desarrollo (Vite)
- `npm run build` — Build de producción
- `npm run preview` — Preview del build
- `npm run lint` — Ejecutar ESLint
- `npm run test` — Ejecutar tests con Vitest
- `npm run test:ui` — UI interactiva de tests
- `npm run test:coverage` — Reporte de cobertura

---

## Consideraciones de Seguridad

### Variables de Entorno

NO commitear `.env` al repositorio. Usar `.env.example` como plantilla.

Variables críticas:
- `VITE_SUPABASE_URL` — URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` — Clave pública de Supabase

### Row Level Security (RLS)

- Todas las tablas DEBEN tener políticas RLS activas
- Scripts en `database/setup_*_rls.sql`
- Verificar que usuarios solo accedan a sus datos

### Autenticación

- PIN hasheado, NUNCA en texto plano
- Sesión manejada por Supabase Auth
- Tokens JWT con expiración

---

## Testing

### Estrategia de Testing

- **Unitarios:** Componentes y hooks (Vitest + React Testing Library)
- **Integración:** Servicios con Supabase (mock o test DB)
- **E2E:** Flujos críticos (pendiente: Playwright/Cypress)

### Cobertura Mínima

- Componentes base (common): 80%+
- Hooks críticos: 70%+
- Servicios: 60%+

---

## Referencias Rápidas

### Documentos Relacionados

- Arquitectura general: `docs/architecture/architecture.md`
- Estándares de código: `docs/architecture/coding-standards.md`
- Tech stack: `docs/architecture/tech-stack.md`
- PRD: `docs/prd/`

### Recursos Externos

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com

---

**Última actualización:** 3 de octubre de 2025  
**Mantenido por:** Equipo de arquitectura MiRancho360  
**Contacto:** Referirse a README.md principal
