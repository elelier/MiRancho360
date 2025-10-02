# PRD — MiRancho360

Fecha: 2025-10-02

## Resumen ejecutivo

MiRancho360 es una aplicación mobile-first para facilitar la administración de un rancho familiar. Este PRD cubre el MVP inicial orientado a usuarios adultos mayores: dashboard resumido, experiencia simplificada, onboarding guiado, módulo de inventario básico y reportes exportables. El objetivo es reducir fricción en tareas clave (registro de animales, seguimiento de salud/partos, control de inventario) y asegurar una sola fuente de verdad en Supabase.

## Alcance del MVP

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

## Usuarios y actores

- Administrador (primary): gestiona animales, movimientos, partos y salud.
- Colaboradores / Veterinario: registrar observaciones y validar eventos.
- Sistema: Supabase como backend BaaS y almacenamiento de imágenes.

## Objetivos medibles (KPI)

- Registrar un animal nuevo < 1 min en pruebas con usuarios objetivo.
- Dashboard muestra 3 bloques clave (salud/partos/pendientes) en una vista sin scroll: objetivo de tiempo al primer vistazo < 5s.
- Inventario refleja consumos diarios correctamente (saldo coincidente en > 98% de operaciones en pruebas).
- Al menos 2 miembros usando la app en piloto y completando tareas básicas.

## Requisitos funcionales (FR)

FR-1 Dashboard resumido
- FR-1.1 Mostrar tarjetas: Salud (alertas), Partos próximos/recientes, Pendientes/Acciones.
- FR-1.2 Cada tarjeta permite acción rápida (CTA) y navegación a detalle.

FR-2 Onboarding guiado
- FR-2.1 Detectar primer inicio y ofrecer tour de 3–5 pasos.
- FR-2.2 Pasos sugeridos: registrar primer animal, ver alertas, abrir inventario.

FR-3 Inventario básico
- FR-3.1 CRUD para items: tipo (paca/alimento/medicina), cantidad, unidad, fecha, notas.
- FR-3.2 Registrar consumo y ajustar saldo automáticamente.
- FR-3.3 Sincronizar con Supabase y manejar conflictos simples (last-write-wins con auditoría).

FR-4 Reportes exportables
- FR-4.1 Permitirá exportar historial de salud y movimientos por rango de fechas a PDF y Excel.
- FR-4.2 Exportación configurable: campos a incluir y rango de fechas.

FR-5 Accesibilidad y UX
- FR-5.1 Botones grandes, tipografía legible, contrastes altos.
- FR-5.2 Soporte básico para navegación por teclado/tamaño de fuente ajustable.

FR-6 Integración y seguridad
- FR-6.1 Autenticación por PIN (ya existente). Reusar mecanismo de `src/services/auth.ts`.
- FR-6.2 Permisos: solo Admin puede modificar inventario; colaboradores registro limitado.

## Criterios de aceptación (CA) — mapeados por FR

CA-1 (FR-1)
- El Dashboard carga en < 2s en red local y muestra: 1) número de animales con alerta, 2) partos próximos (7d), 3) 3 items pendientes.
- Al pulsar CTA de tarjeta, se navega al detalle correspondiente.

CA-2 (FR-2)
- En primer inicio, el usuario recibe el tour; completar los pasos guía a las pantallas indicadas.

CA-3 (FR-3)
- Crear item de inventario y verificar saldo actualizado tras 3 operaciones consecutivas (creación, consumo, ajuste).

CA-4 (FR-4)
- Exportar historial a PDF y Excel: el archivo descargado contiene las columnas seleccionadas y filtra por rango de fechas.

CA-5 (FR-5)
- Tests de usabilidad con 3 usuarios objetivo muestran que la mayoría completa la tarea «registrar animal» en < 1 min y califica legibilidad ≥ 4/5.

CA-6 (FR-6)
- Usuarios sin rol Admin no pueden crear/editar items de inventario (respuesta 403/API o UI deshabilitada).

## Requisitos no funcionales (NFR)

- NFR-SEC-1 Seguridad: No exponer PII en exportaciones por defecto. Revisar campos exportables; solicitar confirmación del usuario antes de exportar datos personales.
- NFR-PERF-1 Rendimiento: API para Dashboard debe responder < 200ms para los endpoints críticos bajo condiciones normales (p50).
- NFR-REL-1 Disponibilidad: aplicación móvil debe manejar fallos de red — modo offline básico para inventario con reintento automático.
- NFR-MNT-1 Mantenibilidad: código TypeScript con tests unitarios (objetivo mínimo: cobertura 60% en lógica nueva); servicios documentados.
- NFR-ACC-1 Accesibilidad: Contraste WCAG AA para texto principal y controles táctiles ≥ 44x44 px.

## Epics de alto nivel

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

## Trazabilidad problema → requisito

Problema identificado: "UI pensada para desarrolladores, no para adultos mayores"
- Req: FR-5 (Accesibilidad y UX)
- CA: CA-5 (pruebas de usabilidad)

Problema: "No existe una pantalla inicial resumen"
- Req: FR-1 (Dashboard)
- CA: CA-1 (tiempos y navegación)

Problema: "Inventario y reportes no implementados"
- Req: FR-3 y FR-4
- CA: CA-3 y CA-4

Cada requisito en la sección FR está vinculado directa y claramente a al menos un criterio de aceptación medible.

## Data model & migración

- Tabla propuesta `inventory` (ejemplo):

```sql
CREATE TABLE inventory (
  id uuid primary key,
  type text,
  name text,
  quantity numeric,
  unit text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid
);
```

- Añadir migration: `database/migrations/00xx_add_inventory_table.sql` (incluir índices sobre `type`, `created_at`).

## APIs y servicios a crear/modificar

- `src/services/inventory.ts` — CRUD + sync
- `src/services/export.ts` — exportación PDF/Excel (puede delegar a backend si se decide)
- Reusar `src/services/auth.ts` para autorización por roles

## Riesgos y mitigaciones

- Riesgo: cambios UI rompen flujos existentes — Mitigación: feature flags, pruebas de regresión automatizadas (priorizar tests en historias críticas).
- Riesgo: exportación de datos con PII — Mitigación: revisar campos exportados, confirmar consentimiento en UI, enmascarar datos sensibles.
- Riesgo: onboarding demasiado técnico — Mitigación: test con 3 usuarios objetivo e iteración rápida.

## Plan de lanzamiento (Fases)

- Fase 1 (0–2 meses): Dashboard + UX simplificada + Onboarding (entregable mínimo: `DashboardPage` estático + tour interactivo).
- Fase 2 (3–4 meses): Inventario + Reportes.
- Fase 3 (5–6 meses): Optimización visual, multiusuario, analítica simple.

## Criterios de éxito para release

- Todos los AC enumerados se cumplen (manual + automatizados donde aplica).
- Tests de usabilidad completados y actas con >2 usuarios en piloto.
- Migración `inventory` aplicada en staging y sincronización verificada.

## Entregables y checklist para PR / Commit

## Entregables y checklist para PR / Commit

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

## Siguientes pasos (recomendado)

## Siguientes pasos (recomendado)

1. Hacer un spike de 1 día para validar visuales y accesibilidad en la `DashboardPage` existente: generar snapshots/visual check y ajustar tamaños/contrastes.
2. Crear PR de refinamiento del Dashboard (1–2 días) que adapte el layout actual a CA-1 y reuses `useMovements` / `useRancho`.
3. Implementar `useOnboarding` y `OnboardingPage.tsx` (Spike 2 días).
4. Añadir migración `inventory` y `src/services/inventory.ts` + `useInventory` (Spike 2–3 días).
5. Investigar y decidir enfoque para export (cliente vs serverless) e implementar `src/services/export.ts` (Spike 1 día para decisión, 2–3 días para implementación básica).
6. Ejecutar pruebas de usabilidad con 3 usuarios objetivo y priorizar ajustes.

---