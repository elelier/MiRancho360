# Estructura del proyecto — MiRancho360

Fecha: 2025-10-02

Este documento detalla la estructura de carpetas, convenciones y ubicaciones importantes para que desarrolladores y agentes automáticos trabajen de forma consistente.

## Estructura principal

Raíz del repositorio (resumen):

```
/ (repo root)
├─ src/                   # Aplicación React + TypeScript
│  ├─ pages/              # Páginas (rutas)
│  ├─ components/         # Componentes UI organizados por dominio
│  ├─ hooks/              # Hooks reutilizables (useAnimals, useInventory, ...)
│  ├─ services/           # Abstracción sobre llamadas a Supabase
│  ├─ types/              # Definiciones TypeScript
│  └─ assets/             # Imágenes y recursos estáticos
├─ database/              # Schema SQL y migraciones
├─ docs/                  # Documentación (PRD, arquitectura, etc.)
├─ scripts/               # Scripts de soporte (setup DB, seeds)
├─ public/                # Recursos públicos (manifest, logos)
├─ package.json
└─ vite.config.ts
```

## Convenciones importantes

- Rutas / Pages: cada componente en `src/pages` debe corresponder a una ruta; nombrar con PascalCase ending in `Page.tsx` (ej. `AnimalProfilePage.tsx`).
- Componentes: `src/components/{domain}/` (ej. `components/animals/`) para agrupar por responsabilidad.
- Servicios: todo acceso a Supabase debe centralizarse en `src/services/*` para facilitar pruebas y cambios de proveedor.
- Hooks: hooks que encapsulan acceso a datos deben prefijarse `use` y devolver estado + helpers (`{ data, isLoading, error, refresh }`).

## Migraciones y base de datos

- Guardar migraciones ordenadas en `database/migrations/` con prefijo numérico. Nuevas migraciones: `00xx_add_inventory_table.sql`.
- Mantener `database/schema.sql` sincronizado con migraciones (script de dump recomendado cuando la DB cambie).

## Testing y CI

- Tests unitarios en `src/` junto a la lógica (e.g., `src/services/*.test.ts`).
- E2E en `tests/e2e/` si se adopta Playwright/Cypress.
- Añadir configuración de CI (GitHub Actions) en `.github/workflows/` para: lint, build y tests.

## Deploy

- Netlify/Vercel: variables de entorno deben configurarse en el host (Supabase URL/KEY, envs para feature flags).

## Guía rápida de archivos clave

- `src/services/supabase.ts` — cliente compartido de Supabase
- `src/pages/DashboardPage.tsx` — entrada para refinamiento del dashboard
- `database/migrations/` — migraciones SQL
- `docs/prd/PRD.md` — documento de producto maestro

## Recomendaciones para desarrolladores

- Antes de agregar una dependencia, evaluar coste vs beneficio para MVP.
- Mantener componentes lo más puros posible; lógica en hooks/servicios.
- Documentar cualquier excepción a las convenciones en `docs/architecture/`.
