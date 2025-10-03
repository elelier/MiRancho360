# Índice de Épicas - MiRancho360 MVP

**Proyecto:** MiRancho360  
**Fecha de creación:** 2 de octubre de 2025  
**Estado general:** Planificado  
**Versión PRD:** v4 (fragmentado)

## Resumen Ejecutivo

Este documento índice las 5 épicas principales del MVP de MiRancho360, derivadas del PRD fragmentado. Cada épica está diseñada para ser manejable por un Scrum Master y contiene contexto esencial del PRD y arquitectura.

## Épicas del MVP

###  Fase 1 (0-2 meses) - Fundamentos

#### [Epic 1: Dashboard MVP](./epic-1-dashboard-mvp.md)
**Prioridad:** Alta | **Estimación:** 4-6 días  
**Objetivo:** Refinar dashboard existente para mostrar resumen accesible del rancho

**Historias:**
- 1.1: Refinar DashboardPage.tsx para cumplir CA-1
- 1.2: Integración con servicios de datos reales

**Valor clave:** Vista rápida del estado del rancho sin navegación compleja

---

#### [Epic 2: Onboarding Guiado](./epic-2-onboarding-guiado.md)
**Prioridad:** Alta | **Estimación:** 4-6 días  
**Objetivo:** Sistema de onboarding para usuarios 60+ en primer uso

**Historias:**
- 2.1: Crear Hook useOnboarding y componente de tour
- 2.2: Persistir estado y opción de re-ejecutar tour

**Valor clave:** Reducir curva de aprendizaje y aumentar adopción exitosa

---

#### [Epic 5: UX / Accesibilidad](./epic-5-ux-accesibilidad.md) 
**Prioridad:** Alta (Transversal) | **Estimación:** 7-9 días  
**Objetivo:** Componentes accesibles y validación con usuarios objetivo

**Historias:**
- 5.1: Componentes accesibles base (LargeButton, Card, Input mejorado)
- 5.2: Tests de usabilidad con 3 usuarios objetivo (60+)

**Valor clave:** Garantizar usabilidad para usuarios adultos mayores

---

###  Fase 2 (3-4 meses) - Funcionalidades Core

#### [Epic 3: Inventario Básico](./epic-3-inventario-basico.md)
**Prioridad:** Alta | **Estimación:** 9-12 días  
**Objetivo:** Sistema completo de gestión de inventario con sync offline

**Historias:**
- 3.1: Añadir migración DB + tipos
- 3.2: Implementar servicio y hook + UI CRUD
- 3.3: Sync offline y manejo de conflictos

**Valor clave:** Control preciso de recursos y planificación de compras

---

#### [Epic 4: Reportes Exportables](./epic-4-reportes-exportables.md)
**Prioridad:** Media | **Estimación:** 6-8 días  
**Objetivo:** Exportación configurable de reportes a PDF y Excel

**Historias:**
- 4.1: Implementar servicio de exportación y UI (PDF/Excel)

**Valor clave:** Reportes profesionales para veterinarios y registros oficiales

---

## Orden de Implementación Recomendado

### Sprint 1-2 (Fase 1A)
1. **Epic 5 - Story 5.1** (Componentes base) - **PRIMERO**
   - Razón: Otros componentes dependen de estos
   - 4-5 días
2. **Epic 1** (Dashboard MVP) - Usa componentes de Epic 5
   - 4-6 días

### Sprint 3 (Fase 1B)
3. **Epic 2** (Onboarding) - Usa Dashboard y componentes
   - 4-6 días
4. **Epic 5 - Story 5.2** (Tests usabilidad) - **CRÍTICO**
   - 3-4 días
   - Hacer después de Epic 1 y 2 para validar flujos

### Sprint 4-5 (Fase 2)
5. **Epic 3** (Inventario) - Independiente, funcionalidad nueva
   - 9-12 días
6. **Epic 4** (Reportes) - Puede hacerse en paralelo con Epic 3
   - 6-8 días

## Dependencias Críticas

```
Epic 5.1 (Componentes)
    
Epic 1 (Dashboard)  Epic 2 (Onboarding)
                            
Epic 5.2 (Tests)  
    
Epic 3 (Inventario) + Epic 4 (Reportes) [paralelo]
```

## Métricas de Éxito del MVP

### Técnicas
- [ ] Dashboard carga en < 2s
- [ ] Todos los controles táctiles  44x44 px
- [ ] Contraste WCAG AA cumplido
- [ ] Tests unitarios  60% cobertura en código nuevo

### Usuario
- [ ] 80% de usuarios completan onboarding
- [ ] Registrar animal en < 1 min (objetivo CA-5)
- [ ] Calificación legibilidad  4/5
- [ ] Al menos 2 miembros usan app en piloto

### Funcionales
- [ ] Las 5 épicas completadas y en producción
- [ ] Sin regresiones en funcionalidad existente
- [ ] Documentación actualizada

## Riesgos Transversales

| Riesgo | Épica(s) | Probabilidad | Impacto | Mitigación |
|--------|----------|--------------|---------|------------|
| Usuarios no disponibles para tests | Epic 5 | Media | Alto | Reclutar anticipadamente, incentivos |
| Cambios rompen flujos existentes | Todas | Media | Alto | Feature flags, tests de regresión |
| Performance en dispositivos lentos | Epic 1, 4 | Media | Medio | Optimización, lazy loading, serverless |
| Diseño no agrada a usuarios 60+ | Epic 5 | Media | Alto | Tests tempranos, iteración rápida |

## Contexto de Documentación

Cada épica referencia:
-  **PRD fragmentado:** `docs/prd/*.md`
-  **Arquitectura:** `docs/architecture/architecture.md`
-  **Tech Stack:** `docs/architecture/tech-stack.md`
-  **Coding Standards:** `docs/architecture/coding-standards.md`

## Próximos Pasos

1. **Validar épicas con equipo:** Revisar estimaciones y prioridades
2. **Refinar Story 5.1:** Crear componentes base PRIMERO
3. **Preparar Sprint 1:** Planificar Epic 5.1 + Epic 1
4. **Reclutar usuarios para tests:** Comenzar contactos para Epic 5.2

## Notas Importantes

- **Epic 5 es transversal:** Sus componentes son usados por todas las demás épicas
- **Tests de usabilidad (Epic 5.2) son críticos:** No lanzar MVP sin validación de usuarios
- **Epic 3 y 4 pueden ejecutarse en paralelo:** Si hay recursos disponibles
- **Cada épica es autocontenida:** Incluye contexto técnico y de negocio completo
- **PRD v4 fragmentado:** Facilita referencia específica sin leer documento completo

---

**Actualizado:** 2 de octubre de 2025  
**Responsable PO:** Sarah  
**Revisión requerida:** Scrum Master para planning
