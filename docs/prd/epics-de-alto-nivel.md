# Epics de alto nivel

- Epic 1: Dashboard MVP
 - Epic 1: Dashboard MVP
  - Story 1.1: Refinar `DashboardPage.tsx` (existing file) para cumplir CA-1: asegurar que las tres áreas (Salud, Partos, Pendientes) sean visibles en la vista inicial y que las CTAs naveguen a detalle.
  - Story 1.2: Verificar y/o añadir integración con servicios de datos reales (alerts, partos, pendientes). En el repo existen `useMovements` y `useRancho` que ya proveen datos; reusar y mapearlos a las tarjetas.

- Epic 2: Onboarding guiado
 - Epic 2: Onboarding guiado
  - Story 2.1: Crear Hook `useOnboarding` y `OnboardingPage.tsx` o componente modal/tour.
  - Story 2.2: Persistir estado first-run (localStorage / Supabase user meta) y opción de re-ejecutar tour.

- Epic 3: Inventario básico
 - Epic 3: Inventario básico
  - Story 3.1: Añadir migración DB `inventory` + tipos/columnas.
  - Story 3.2: Implementar `services/inventory.ts` y `useInventory` + UI CRUD.
  - Story 3.3: Sync y manejo offline básico (optimista o cola de cambios) con reintentos.

- Epic 4: Reportes exportables
 - Epic 4: Reportes exportables
  - Story 4.1: Implementar `src/services/export.ts` (PDF/Excel) y UI para selección de campos/rango. Evaluar usar SheetJS para Excel y jsPDF para PDF; considerar delegar a una función serverless si el render en cliente es lento.

- Epic 5: UX / Accesibilidad
  - Story 5.1: Componentes accesibles (`LargeButton`, `Card`).
  - Story 5.2: Tests de usabilidad con 3 usuarios objetivo y ajustes.
