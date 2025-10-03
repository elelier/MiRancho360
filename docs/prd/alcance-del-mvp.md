# Alcance del MVP

Nota importante: el proyecto ya contiene una implementación de `DashboardPage` en `src/pages/DashboardPage.tsx` (hero, estadísticas, últimos movimientos y acciones rápidas). El PRD asume que ese archivo se refina para cumplir los AC descritos abajo (no es estrictamente necesario crear desde cero).

In-Scope (Fase 1 - MVP):
- Refinamiento de `DashboardPage` existente para mostrar claramente: Salud (alertas), Partos próximos y Pendientes/Acciones con CTAs accesibles.
- `Onboarding` guiado (primer arranque) con pasos clave (nuevo flujo/página o modal).
- Componentes accesibles: `Card`, `LargeButton`, `SwipeAction` (tamaños y contraste pensados para 60+).
- Hook `useOnboarding` (nuevo) y `useInventory` (CRUD + sync Supabase) — hooks aún no presentes.
- Migración `inventory` en la DB y `src/services/inventory.ts` (servicio nuevo).
- Exportación básica (PDF/Excel) de historial de salud y movimientos (`src/services/export.ts`).

Out-of-Scope (Fase 1):
- Multiusuario avanzado y roles finos (post-MVP).
- Analítica profunda y dashboards avanzados (Fase 3).
