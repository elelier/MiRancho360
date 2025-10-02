# Brief del Proyecto — MiRancho360

Fecha: 2025-10-02

## Objetivo

Simplificar la administración del rancho familiar mediante una aplicación mobile-first, intuitiva y accesible para usuarios adultos mayores. Priorizar claridad, flujos cortos (máx. 3 taps) y datos como fuente única de verdad para animales, sitios, observaciones e inventario básico.

## Usuarios clave

- Administrador (ej. papá): gestiona animales, partos, enfermedades y movimientos. 
- Colaboradores familiares / Veterinario: registros puntuales y verificación.

## Estado actual (resumen)

- Implementado: autenticación por PIN, gestión de animales, observaciones, Supabase en producción. 
- Módulo de salud conectado a datos reales. 
- Falta: inventario básico, reportes exportables, dashboard familiar y onboarding guiado.

## Problemas detectados

- UI pensada para desarrolladores, no para adultos mayores (tamaños, lenguaje). 
- No existe una pantalla inicial resumen (dashboard) con el estado del rancho. 
- Inventario y reportes no implementados → información dispersa. 
- Ausencia de onboarding o tutorial inicial.

## Prioridades inmediatas (MVP)

1. Dashboard resumido: salud, partos, pendientes visibles en una sola pantalla.
2. UX simplificada: tarjetas grandes, tipografía accesible, acciones rápidas (swipe/CTA claros).
3. Onboarding guiado: tour paso a paso al primer inicio.
4. Inventario básico: pacas, alimento, medicinas (entrada/consumo/saldo).
5. Reportes exportables (PDF/Excel): historial de salud y movimientos por rango de fechas.

## Roadmap (0–6 meses)

- Fase 1 (0–2 meses): Dashboard + UX simplificada + Onboarding guiado.
- Fase 2 (3–4 meses): Inventario básico + Reportes exportables.
- Fase 3 (5–6 meses): Optimización visual, multiusuario familiar y analítica simple (tendencias).

## Criterios de éxito (KPIs)

- Registrar un animal nuevo en < 1 min (pruebas con usuarios objetivo).
- Dashboard muestra estado clave en un vistazo (salud/partos/pendientes).
- Inventario refleja consumos diarios correctamente en pruebas.
- Al menos 2 miembros de la familia usan la app en piloto y confían en los datos.

## Riesgos y mitigaciones

- Riesgo: cambios UI rompen flujos existentes — Mitigación: usar feature flags y pruebas de regresión.
- Riesgo: exportación de datos con PII — Mitigación: revisar campos exportados y consentimiento del usuario.
- Riesgo: onboarding demasiado técnico — Mitigación: validación con 3 usuarios objetivo y iteración rápida.

## Contrato mínimo (inputs / outputs)

- Inputs: credenciales Supabase, esquema DB migrado, datos de prueba, diseño UX (baja fidelidad). 
- Outputs: `DashboardPage` responsive, `Onboarding` flow, modelo `Inventory` con CRUD, exportación básica.
- Criterio de éxito: pruebas unitarias básicas + validación con usuarios objetivo.

## Mapa técnico rápido — archivos a tocar / crear

- UI / páginas
  - `src/pages/DashboardPage.tsx` — iterar para mostrar tarjetas resumidas (salud, partos, pendientes).
  - `src/pages/OnboardingPage.tsx` — nuevo flujo guiado / modal-tour.
  - `src/components/common/` — `Card`, `LargeButton`, `SwipeAction` (accesibilidad y tamaño).
- Hooks / estado
  - `src/hooks/useOnboarding.ts` — estado de first-run y gestión de pasos.
  - `src/hooks/useInventory.ts` — lógica CRUD local + sync con Supabase.
- Servicios / API
  - `src/services/inventory.ts` — operaciones Supabase para inventario.
  - `src/services/export.ts` — generación de PDF/Excel (explorar jsPDF / SheetJS o delegar a función backend).
- Tipos / DB
  - `src/types/inventory.ts` — tipos TS para inventario.
  - `database/migrations/00xx_add_inventory_table.sql` — migración para tabla `inventory`.
- Documentación
  - `PRODUCT_DEFINITION.md` — añadir secciones: Dashboard MVP, Onboarding, Inventory, Reports.
  - `ROADMAP.md` — reflejar fases y fechas.

## Estimación rápida (equipo pequeño)

- Fase 1 (Dashboard + UX + Onboarding): 2–4 semanas (1 dev + 1 diseñador part‑time).
- Fase 2 (Inventario + Reportes): 3–4 semanas.
- Fase 3 (Optimización y multiusuario): 4–6 semanas.

## Próximos pasos inmediatos (0–2 semanas)

1. Diseñar en baja fidelidad el dashboard (1–2 pantallas). Owner: PO / UX.
2. Crear issue / PR mínimo: tarjeta estática en `src/pages/DashboardPage.tsx` para validar layout. Spike: 1–2 días. Owner: Dev.
3. Implementar `useOnboarding.ts` + `OnboardingPage.tsx` con pasos: registrar animal, ver alertas, abrir inventario. Spike: 2 días.
4. Añadir migración `inventory` + `src/services/inventory.ts` con endpoints CRUD. Spike: 2–3 días.
5. Investigar librerías para export (jsPDF / SheetJS) y crear issue con recomendación. Spike: 1 día.
6. Test de usabilidad con 3 usuarios objetivo (ajustar tipografía y lenguaje).

## Checklist para el sprint 0 (Fase 1)

- [ ] Diseño baja fidelidad del Dashboard.
- [ ] PR: tarjetas estáticas en `DashboardPage.tsx`.
- [ ] Implementación básica de `OnboardingPage.tsx` y hook `useOnboarding`.
- [ ] Validación rápida con 3 usuarios y ajustes de accesibilidad (fuente, contraste, tamaños).

---

Si quieres que genere automáticamente los issues para Sprint 0 o que cree el PR con la tarjeta estática y el onboarding mínimo, dime: **1** para crear issues o **2** para empezar el PR (implemento el cambio y ejecuto pruebas rápidas). 
