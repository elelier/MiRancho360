# Entregables y checklist para PR / Commit

- `docs/prd/PRD.md` (este documento)
- Migración: `database/migrations/00xx_add_inventory_table.sql`
- Código (presencia/estado actual):
  - `src/pages/DashboardPage.tsx` — ya existe en el repo; invertir en refinamiento y visual checks.
  - `src/pages/OnboardingPage.tsx` + `src/hooks/useOnboarding.ts` — faltan (crear).
  - `src/services/inventory.ts` + `src/hooks/useInventory.ts` — faltan (crear).
  - `src/services/export.ts` — falta (crear o evaluar delegar a backend).
  - `src/types/inventory.ts` — falta (crear).

Checklist mínimo antes de PR de la Fase 1:
- [ ] Refinamiento visual y funcional de `DashboardPage.tsx` (comprobar CA-1) + snapshot/visual check
- [ ] `OnboardingPage.tsx` funcional con pasos persistidos (hook `useOnboarding`)
- [ ] Componentes accesibles creados y documentados (`LargeButton`, `Card`)
- [ ] PRD actualizado y aprobado por PO
