# Arquitectura — MiRancho360

Fecha: 2025-10-02

Este documento resume la arquitectura actual del proyecto MiRancho360, enfocada en el MVP descrito en `docs/prd/PRD.md`. Cubre visión general, componentes principales, integración con Supabase, modelo de datos y decisiones arquitectónicas relevantes para desarrollos futuros.

## Visión general

MiRancho360 es una aplicación web/mobile-first construida con React + TypeScript (Vite). Usamos Supabase como BaaS (autenticación, Postgres gestionado, almacenamiento de archivos). La app está pensada para dispositivos móviles y usuarios 60+ — por eso la arquitectura prioriza simplicidad, disponibilidad offline parcial (inventario) y facilidad de despliegue (Netlify/Vercel).

## Componentes principales

- Frontend (SPA): `src/` — React + TypeScript, rutas en `src/pages`, componentes reutilizables en `src/components`.
- Servicios cliente: `src/services/*.ts` — encapsulan llamadas a Supabase y abstracciones (auth, animals, inventory, export, etc.).
- Hooks: `src/hooks/*` — encapsulan lógica de acceso a datos y estados (e.g., `useAnimals`, `useInventory`, `useOnboarding`).
- Backend administrado: Supabase (Postgres, Auth, Storage, Realtime).
- Base de datos y migraciones: `database/` (schema.sql y carpeta `migrations/`).
- Scripts y utilidades: `scripts/` — inicialización y tareas de soporte (ej. setup-database.js).

## Flujo de datos

1. Frontend llama a `src/services/*`.
2. Los servicios usan `src/services/supabase.ts` para comunicación con Supabase (cliente compartido y control de errores).
3. Las respuestas se consumen por `hooks` que exponen estados y helpers para UI.
4. Operaciones sensibles (e.g., export) pueden delegarse a una función serverless si la carga/red lo requiere.

## Supabase & seguridad

- Autenticación: PIN (ya implementado) reusará `src/services/auth.ts`.
- Reglas RLS/Storage: Mantener políticas en `database/setup_*_rls.sql` y revisar `database/` antes de deploy.
- En exportaciones: respetar NFR-SEC-1 (no exponer PII por defecto). Implementar confirmación de usuario antes de incluir datos personales.

## Base de datos

- Tablas principales: `animals`, `movements`, `health`, `inventory` (nueva migración), `users`.
- Migraciones: usar `database/migrations/` con prefijo numérico. Nueva migración sugerida: `00xx_add_inventory_table.sql` (ver `docs/prd/PRD.md`).

## Decisiones arquitectónicas relevantes

- Cliente pesado con lógica offline mínima: inventario debe soportar cola local y reintento (optimista o cola) para cumplir NFR-REL-1.
- Mantener la lógica de negocio en servicios/hook del cliente; minimizar funciones server-side salvo para tareas costosas (render PDF masivo) o seguridad estricta.
- Priorizar APIs rápidas para la vista Dashboard — caché local de corto plazo y carga incremental (paginación / límites).

## Observaciones operativas

- Despliegue: Netlify/Vercel (configuración en `netlify.toml` y `vite.config.ts`).
- Entorno local: `npm run dev` (Vite). Ver `package.json` para scripts.
- Monitoreo y logging: añadir Sentry o similar si el proyecto escala.

## Referencias

- PRD: `docs/prd/PRD.md`
- Migraciones: `database/migrations/`
- Scripts de inicialización: `scripts/`
