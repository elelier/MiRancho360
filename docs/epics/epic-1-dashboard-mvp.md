# Epic 1: Dashboard MVP

**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Alta (MVP - Fase 1)

## Objetivo de la Épica

Refinar y completar el Dashboard existente (`src/pages/DashboardPage.tsx`) para proporcionar una vista resumida y accesible del estado del rancho, enfocada en usuarios adultos mayores (60+). El dashboard debe mostrar claramente tres áreas clave: Salud (alertas), Partos próximos y Pendientes/Acciones, con CTAs para navegación a detalle.

## Contexto del Negocio

**Problema que resuelve:**  
Los usuarios necesitan una vista rápida del estado general del rancho sin tener que navegar por múltiples pantallas. Actualmente existe una implementación base del Dashboard, pero requiere refinamiento para cumplir con los criterios de accesibilidad y experiencia de usuario del MVP.

**Valor para el usuario:**
- Visibilidad inmediata del estado de salud de los animales
- Alertas tempranas de partos próximos
- Lista clara de acciones pendientes
- Navegación rápida a detalles mediante CTAs accesibles

## Contexto Técnico

**Archivo existente:** `src/pages/DashboardPage.tsx`  
**Hooks disponibles:** `useMovements`, `useRancho` (ya implementados)  
**Servicios relacionados:** `src/services/animals.ts`, `src/services/health.ts`, `src/services/reproductive.ts`

**Stack técnico:**
- React 18 + TypeScript
- Tailwind CSS (tema personalizado: Rancho Natural)
- Supabase para datos
- React Router DOM para navegación

## Requisitos Funcionales (del PRD)

**FR-1: Dashboard resumido**
- FR-1.1: Mostrar tarjetas: Salud (alertas), Partos próximos/recientes, Pendientes/Acciones
- FR-1.2: Cada tarjeta permite acción rápida (CTA) y navegación a detalle

**FR-5: Accesibilidad y UX** (aplicable)
- FR-5.1: Botones grandes, tipografía legible, contrastes altos
- FR-5.2: Soporte básico para navegación por teclado

## Criterios de Aceptación

**CA-1 (FR-1):**
- El Dashboard carga en < 2s en red local
- Muestra:
  1. Número de animales con alerta de salud
  2. Partos próximos (7 días)
  3. 3 items pendientes principales
- Al pulsar CTA de tarjeta, navega al detalle correspondiente
- Las tres áreas son visibles sin scroll en vista móvil

**CA-5 (FR-5) - Aplicable a Dashboard:**
- Elementos táctiles  44x44 px
- Contraste de texto cumple WCAG AA
- Tipografía legible para usuarios 60+

## Requisitos No Funcionales

- **NFR-PERF-1:** API para Dashboard debe responder < 200ms (p50)
- **NFR-ACC-1:** Contraste WCAG AA y controles táctiles  44x44 px
- **NFR-MNT-1:** Tests unitarios con cobertura  60% en lógica nueva

## Historias de Usuario

### Story 1.1: Refinar DashboardPage para cumplir CA-1
**Como** administrador del rancho  
**Quiero** ver en una sola vista el estado de salud, partos próximos y pendientes  
**Para** tomar decisiones rápidas sin navegar múltiples pantallas

**Tareas técnicas:**
- [ ] Revisar layout actual de `DashboardPage.tsx`
- [ ] Ajustar visualización de las tres áreas clave (Salud, Partos, Pendientes)
- [ ] Implementar CTAs accesibles con navegación
- [ ] Validar que todo sea visible sin scroll en viewport móvil
- [ ] Aplicar tema Rancho Natural y verificar contrastes
- [ ] Snapshots/visual checks

**Referencias de código:**
- Archivo: `src/pages/DashboardPage.tsx`
- Componentes: `src/components/common/Button.tsx`, `src/components/common/Card.tsx`

### Story 1.2: Integración con servicios de datos reales
**Como** administrador del rancho  
**Quiero** que el dashboard muestre datos reales y actualizados  
**Para** confiar en la información mostrada y tomar decisiones informadas

**Tareas técnicas:**
- [ ] Mapear datos de `useMovements` a tarjeta de Pendientes
- [ ] Mapear datos de `useRancho` o `useHealth` a tarjeta de Salud
- [ ] Integrar datos de partos próximos desde `useReproductive`
- [ ] Implementar manejo de errores y estados de carga
- [ ] Añadir tests de integración con datos mock

**Referencias de código:**
- Hooks: `src/hooks/useMovements.ts`, `src/hooks/useRancho.ts`, `src/hooks/useReproductive.ts`
- Servicios: `src/services/animals.ts`, `src/services/health.ts`, `src/services/reproductive.ts`

## Dependencias

**Precedentes:**
- Ninguna (primera épica del MVP)

**Bloqueantes:**
- Hooks `useMovements`, `useRancho` deben estar funcionales (ya existen)
- Componentes base `Button` y `Card` deben cumplir requisitos de accesibilidad

**Relacionadas:**
- Epic 5 (UX/Accesibilidad): componentes accesibles serán usados en el Dashboard

## Estimación y Esfuerzo

- **Story 1.1:** 2-3 días (refinamiento visual y funcional)
- **Story 1.2:** 2-3 días (integración de datos)
- **Total estimado:** 4-6 días de desarrollo

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Los cambios en Dashboard rompen flujos existentes | Media | Alto | Feature flags, pruebas de regresión, snapshots visuales |
| Performance del Dashboard en dispositivos lentos | Media | Alto | Lazy loading, caché local, optimización de queries |
| Datos no disponibles o inconsistentes | Baja | Medio | Manejo robusto de errores, estados de carga claros |

## Definición de Hecho (DoD)

- [ ] Ambas historias completadas y revisadas
- [ ] Dashboard cumple CA-1 (tiempos, visualización, navegación)
- [ ] Tests unitarios con cobertura  60%
- [ ] Tests de usabilidad preliminares positivos
- [ ] Documentación actualizada (README, comentarios)
- [ ] Sin regresiones en funcionalidad existente
- [ ] Deploy en staging exitoso

## Referencias

- **PRD:** `docs/prd/PRD.md`
- **Requisitos Funcionales:** `docs/prd/requisitos-funcionales-fr.md`
- **Criterios de Aceptación:** `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md`
- **Arquitectura:** `docs/architecture/architecture.md`
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`

## Notas Adicionales

- El archivo `DashboardPage.tsx` ya existe con implementación base (hero, estadísticas, últimos movimientos, acciones rápidas)
- No es necesario crear desde cero, solo refinar para cumplir criterios
- Priorizar accesibilidad desde el inicio (usuarios 60+)
- Considerar progressive enhancement para dispositivos de baja potencia
