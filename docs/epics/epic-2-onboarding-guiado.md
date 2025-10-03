# Epic 2: Onboarding Guiado

**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Alta (MVP - Fase 1)

## Objetivo de la Épica

Implementar un sistema de onboarding guiado que ayude a nuevos usuarios (especialmente adultos mayores 60+) a familiarizarse con las funcionalidades clave de MiRancho360 en su primer uso. El sistema debe ser reiniciable y no intrusivo para usuarios experimentados.

## Contexto del Negocio

**Problema que resuelve:**  
Los usuarios adultos mayores pueden sentirse abrumados al abrir la aplicación por primera vez sin una guía clara. Un onboarding bien diseñado reduce la curva de aprendizaje y aumenta la adopción exitosa de la aplicación.

**Valor para el usuario:**
- Reducción de fricción en el primer uso
- Guía paso a paso para funcionalidades clave
- Confianza para usar la aplicación sin asistencia externa
- Posibilidad de repasar el tour cuando sea necesario

## Contexto Técnico

**Nuevos componentes a crear:**
- `src/hooks/useOnboarding.ts` (hook para gestionar estado del onboarding)
- `src/pages/OnboardingPage.tsx` o componente modal/tour
- `src/types/onboarding.ts` (tipos TypeScript)

**Opciones de implementación:**
1. **Página dedicada:** Flujo completo en página separada
2. **Modal overlay:** Tour sobre la UI existente
3. **Tooltips progresivos:** Destacar elementos uno a uno

**Stack técnico:**
- React 18 + TypeScript
- localStorage para persistir estado first-run
- Alternativa: Supabase user metadata para sincronización multi-dispositivo
- Considerar biblioteca: `react-joyride` o implementación custom

## Requisitos Funcionales (del PRD)

**FR-2: Onboarding guiado**
- FR-2.1: Detectar primer inicio y ofrecer tour de 3-5 pasos
- FR-2.2: Pasos sugeridos: registrar primer animal, ver alertas, abrir inventario

**FR-5: Accesibilidad y UX** (aplicable)
- FR-5.1: Botones grandes, tipografía legible
- FR-5.2: Navegación por teclado

## Criterios de Aceptación

**CA-2 (FR-2):**
- En primer inicio, el usuario recibe el tour automáticamente
- Completar los pasos guía a las pantallas indicadas
- El usuario puede saltar/cancelar el tour
- El usuario puede reiniciar el tour desde configuración
- El estado del tour se persiste (no se repite en cada inicio)

**CA-5 (FR-5) - Aplicable:**
- Elementos del tour son accesibles y legibles
- Navegación por teclado funciona correctamente

## Requisitos No Funcionales

- **NFR-ACC-1:** Controles táctiles  44x44 px, contraste WCAG AA
- **NFR-MNT-1:** Código con tests unitarios (cobertura  60%)
- **NFR-PERF-1:** El tour no debe bloquear la UI más de 100ms

## Historias de Usuario

### Story 2.1: Crear Hook useOnboarding y componente de tour
**Como** nuevo usuario del sistema  
**Quiero** recibir una guía paso a paso en mi primer uso  
**Para** aprender las funcionalidades básicas sin confusión

**Tareas técnicas:**
- [ ] Diseñar flujo de onboarding (3-5 pasos)
- [ ] Crear `src/types/onboarding.ts` con interfaces
- [ ] Implementar `src/hooks/useOnboarding.ts`:
  - Detectar first-run
  - Gestionar paso actual
  - Marcar completado
  - Permitir reinicio
- [ ] Crear componente UI (modal/overlay/página)
- [ ] Diseñar pasos:
  1. Bienvenida + overview
  2. Registrar primer animal
  3. Ver alertas de salud
  4. Acceder a inventario (si disponible)
  5. Completar tour
- [ ] Aplicar diseño accesible (botones grandes, contraste alto)
- [ ] Tests unitarios del hook

**Referencias de diseño:**
- Paleta: Rancho Natural (verde dusty, amarillo tierra)
- Componentes base: `src/components/common/Button.tsx`

### Story 2.2: Persistir estado y opción de re-ejecutar tour
**Como** usuario de la aplicación  
**Quiero** que el tour no se repita en cada inicio pero poder accederlo cuando necesite  
**Para** no sentirme interrumpido pero tener ayuda disponible

**Tareas técnicas:**
- [ ] Implementar persistencia en localStorage:
  - Key: `mirancho360_onboarding_completed`
  - Value: `{ completed: boolean, lastShown: ISO timestamp }`
- [ ] Alternativa: evaluar Supabase user metadata para multi-dispositivo
- [ ] Añadir opción en menú/configuración: "Repetir tour"
- [ ] Implementar lógica de detección first-run en `App.tsx`
- [ ] Tests de persistencia (mock localStorage)
- [ ] Documentación de uso

**Consideraciones:**
- Manejo de errores si localStorage no está disponible
- Fallback graceful (no mostrar tour si falla detección)

## Dependencias

**Precedentes:**
- Epic 1 (Dashboard) debe estar funcional para mostrar en tour

**Bloqueantes:**
- Ninguna crítica

**Relacionadas:**
- Epic 3 (Inventario): paso de inventario será opcional si no está implementado aún
- Epic 5 (UX/Accesibilidad): componentes accesibles se usan en el tour

## Estimación y Esfuerzo

- **Story 2.1:** 3-4 días (diseño, implementación, tests)
- **Story 2.2:** 1-2 días (persistencia, re-ejecución)
- **Total estimado:** 4-6 días de desarrollo

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Tour demasiado técnico o complejo para usuarios 60+ | Alta | Alto | Tests de usabilidad con 3 usuarios objetivo, iteración rápida |
| Usuarios saltan el tour y no aprenden funcionalidades | Media | Medio | Hacer tour atractivo, permitir re-ejecución fácil, tooltips contextuales |
| Conflictos con localStorage en navegadores restrictivos | Baja | Medio | Fallback graceful, considerar Supabase metadata |

## Definición de Hecho (DoD)

- [ ] Ambas historias completadas y revisadas
- [ ] Tour se muestra en primer inicio
- [ ] Estado se persiste correctamente
- [ ] Opción de re-ejecutar tour funciona
- [ ] Tests unitarios con cobertura  60%
- [ ] Tests de usabilidad con 3 usuarios (CA-5)
- [ ] Documentación actualizada
- [ ] Sin regresiones en flujos existentes

## Plan de Testing con Usuarios

**Protocolo de prueba:**
1. Usuario nuevo abre la app por primera vez
2. Observar reacción al tour (¿lo entiende? ¿lo salta?)
3. Medir tiempo para completar tour
4. Preguntar: ¿fue útil? ¿demasiado largo? ¿algo confuso?
5. Verificar que puede re-ejecutar el tour

**Métricas objetivo:**
- 80% de usuarios completan el tour
- Tiempo promedio < 3 minutos
- Calificación de utilidad  4/5

## Pasos Sugeridos del Tour

### Paso 1: Bienvenida
- **Título:** "¡Bienvenido a MiRancho360!"
- **Contenido:** "Te vamos a enseñar lo básico en 4 pasos rápidos"
- **CTA:** "Comenzar" / "Saltar tour"

### Paso 2: Dashboard
- **Título:** "Tu vista principal"
- **Contenido:** "Aquí ves el estado de tus animales, partos y pendientes"
- **CTA:** "Siguiente"

### Paso 3: Registrar Animal
- **Título:** "Registra tu primer animal"
- **Contenido:** "Toca aquí para agregar un animal a tu rancho"
- **Acción:** Destacar botón "+ Nuevo Animal"
- **CTA:** "Entendido"

### Paso 4: Alertas de Salud
- **Título:** "Mantente al tanto"
- **Contenido:** "Las alertas te avisan de animales que necesitan atención"
- **CTA:** "Siguiente"

### Paso 5: Completado
- **Título:** "¡Listo para empezar!"
- **Contenido:** "Puedes repetir este tour desde el menú cuando quieras"
- **CTA:** "Ir al Dashboard"

## Referencias

- **PRD:** `docs/prd/PRD.md`
- **Requisitos Funcionales:** `docs/prd/requisitos-funcionales-fr.md`
- **Criterios de Aceptación:** `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md`
- **Arquitectura:** `docs/architecture/architecture.md`
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`

## Notas Adicionales

- Considerar biblioteca `react-joyride` para simplificar implementación
- Priorizar simplicidad sobre características avanzadas
- El tour debe ser completable en < 3 minutos
- Textos deben ser claros y en lenguaje no técnico
- Evaluar animaciones sutiles para guiar la atención
