# Tech Stack — MiRancho360

Fecha: 2025-10-02

Este documento enumera y justifica las decisiones de tecnología para MiRancho360, con foco en el MVP (docs/prd/PRD.md).

## Resumen

- Frontend: React 18 + TypeScript, construido con Vite.
- UI: Tailwind CSS (configurado en `tailwind.config.js`).
- Backend/BaaS: Supabase (Postgres, Auth, Storage, Realtime).
- Bundler/Dev: Vite.
- Hosting: Netlify / Vercel (configuración preparada).

## Detalle por capa

### Frontend

- React 18 + TypeScript — beneficios: ecosistema, tipado, DX y compatibilidad con Vite.
- Vite — arranque rápido en desarrollo y bundles optimizados.
- Tailwind CSS — sistema de utilidades para iteración rápida y diseños accesibles. `tailwind.config.js` contiene tema personalizado (paleta Rancho Natural).
- React Router DOM — navegación entre páginas (present in project).  

### Servicios / API

- Supabase — elegido para acelerar MVP: autentificación (PIN), Postgres gestionado, Storage para fotos, Realtime para actualizaciones. Reusar `src/services/supabase.ts` para encapsular cliente.

### Preservación offline

- Estrategia: cola de cambios local para `inventory` + reintentos (implementación cliente). Considerar IndexedDB (via idb-keyval o tanstack/query persist) si la complejidad lo justifica.

### Export (PDF / Excel)

- Cliente: jsPDF (PDF) y SheetJS (XLSX) como primera opción para evitar infra adicional.
- Alternativa: función serverless para generación de reportes si el render en dispositivo es lento o pesado.

### Testing

- Unit tests: Jest (o vitest si preferimos mantener ecosistema Vite). Proyecto actual usa TypeScript y estructuras compatibles con Vitest.
- E2E: Playwright o Cypress para flujos críticos (registro animal, onboarding, export).

### Linters / Formatters

- ESLint + Prettier — `eslint.config.js` presente en el repo.
- TypeScript strict mode: `tsconfig.json` (ajustar reglas según necesidades).

## Dependencias recomendadas (ejemplos)

- core: react, react-dom, react-router-dom
- styling: tailwindcss, postcss
- data/export: xlsx (SheetJS), jspdf
- tests: vitest, @testing-library/react, playwright (opcional)
- dev: eslint, prettier, husky (pre-commit hooks)

## Razonamiento y trade-offs

- Usar Supabase reduce tiempo de entrega a costa de depender de un proveedor externo — aceptable para MVP.
- Generar PDFs en cliente reduce costes pero puede fallar en dispositivos de baja potencia; por eso proponemos servidor como opción fallback.

## Referencias

- `package.json` y `vite.config.ts` en la raíz del repo.
