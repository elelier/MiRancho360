# Epic 5: UX / Accesibilidad

**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Alta (MVP - Fase 1, transversal)

## Objetivo de la Épica

Crear componentes base accesibles y realizar tests de usabilidad con usuarios objetivo (60+) para garantizar que la aplicación sea fácil de usar, intuitiva y cumpla con estándares de accesibilidad. Esta épica es transversal y afecta a todas las demás.

## Contexto del Negocio

**Problema que resuelve:**  
La aplicación está diseñada principalmente para usuarios adultos mayores (60+) con poca experiencia tecnológica. Sin componentes accesibles y validación con usuarios reales, corremos el riesgo de crear una aplicación que no cumpla las necesidades de nuestra audiencia principal.

**Valor para el usuario:**
- Interfaz clara y fácil de usar
- Elementos táctiles grandes (menos errores)
- Texto legible sin esfuerzo
- Navegación intuitiva
- Confianza al usar la aplicación sin asistencia

## Contexto Técnico

**Componentes base a crear:**
- `src/components/common/LargeButton.tsx` (botones táctiles grandes)
- `src/components/common/Card.tsx` (tarjetas accesibles)
- `src/components/common/Input.tsx` (mejorar accesibilidad)
- `src/components/common/SwipeAction.tsx` (acciones por deslizamiento)

**Herramientas:**
- Tailwind CSS (tema Rancho Natural ya configurado)
- React + TypeScript
- Lighthouse para auditorías de accesibilidad
- axe-core para testing automático

## Requisitos Funcionales (del PRD)

**FR-5: Accesibilidad y UX**
- FR-5.1: Botones grandes, tipografía legible, contrastes altos
- FR-5.2: Soporte básico para navegación por teclado/tamaño de fuente ajustable

## Criterios de Aceptación

**CA-5 (FR-5):**
- Tests de usabilidad con 3 usuarios objetivo (60+)
- La mayoría completa la tarea "registrar animal" en < 1 min
- Calificación de legibilidad  4/5
- Todos los controles táctiles  44x44 px
- Contraste de texto cumple WCAG AA
- Navegación por teclado funciona en flujos críticos

## Requisitos No Funcionales

- **NFR-ACC-1:** Contraste WCAG AA para texto principal, controles táctiles  44x44 px
- **NFR-MNT-1:** Componentes documentados con Storybook (opcional) o README
- **Objetivo general:** Cumplir WCAG 2.1 Nivel AA en elementos críticos

## Tema Visual: Rancho Natural

**Paleta de colores (ya en tailwind.config.js):**
- **Primary (Verde Dusty):** `#97B982` - pastizales, ambiente natural
- **Background:** `#F0F4EF` - fondo calmado y accesible
- **Accent (Amarillo Tierra):** `#C5A34A` - contraste para acciones importantes

**Características del diseño:**
- Sin gradientes - colores sólidos y limpios
- Alta legibilidad para usuarios 60+
- Diseño moderno con identidad rural auténtica

## Historias de Usuario

### Story 5.1: Componentes accesibles base
**Como** desarrollador  
**Quiero** tener componentes base accesibles reutilizables  
**Para** construir interfaces consistentes que cumplan estándares

**Tareas técnicas:**

#### A. LargeButton Component

- [ ] Crear `src/components/common/LargeButton.tsx`:
  ```typescript
  interface LargeButtonProps {
    variant: ''primary'' | ''secondary'' | ''danger'';
    size?: ''medium'' | ''large''; // default: large
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
    fullWidth?: boolean;
  }
  ```
- [ ] Características:
  - Tamaño mínimo: 48x48 px (superior a 44x44 requerido)
  - Padding generoso: py-4 px-6
  - Texto grande: text-lg o text-xl
  - Estados claros: hover, active, disabled, focus
  - Ripple effect opcional
  - Soporte para ícono + texto
- [ ] Aplicar tema Rancho Natural
- [ ] Tests: render, eventos click, estados

#### B. Card Component

- [ ] Crear `src/components/common/Card.tsx`:
  ```typescript
  interface CardProps {
    title?: string;
    subtitle?: string;
    variant?: ''default'' | ''primary'' | ''warning'' | ''danger'';
    onClick?: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
  }
  ```
- [ ] Características:
  - Esquinas redondeadas
  - Sombra sutil
  - Padding apropiado
  - Variantes con colores semánticos
  - Clickable opcional
  - Área de footer para acciones
- [ ] Aplicar tema Rancho Natural
- [ ] Tests: render, variantes, interactividad

#### C. Mejorar Input Component

- [ ] Mejorar `src/components/common/Input.tsx`:
  - Label siempre visible (no floating)
  - Texto de error claro y grande
  - Estados visuales (focus, error, disabled)
  - Ícono opcional (prefijo/sufijo)
  - Tamaño mínimo de área táctil: 48px altura
- [ ] Accesibilidad:
  - aria-label o htmlFor correcto
  - aria-describedby para errores
  - aria-invalid cuando hay error
- [ ] Tests: validación, estados, a11y

#### D. SwipeAction Component (opcional MVP)

- [ ] Crear `src/components/common/SwipeAction.tsx`:
  - Deslizar para revelar acciones (editar, eliminar)
  - Alternativa touch-friendly para menús contextuales
  - Feedback visual claro
  - Cancelar deslizamiento fácilmente
- [ ] Tests: gestos, acciones

#### E. Documentación

- [ ] README para cada componente:
  - Cuándo usar
  - Props disponibles
  - Ejemplos de uso
  - Consideraciones de accesibilidad
- [ ] Opcional: Storybook stories para catálogo visual

### Story 5.2: Tests de usabilidad con usuarios objetivo
**Como** Product Owner  
**Quiero** validar que la aplicación es usable para adultos mayores  
**Para** asegurar que cumple las necesidades de nuestros usuarios

**Tareas:**

#### A. Preparación

- [ ] Reclutar 3 usuarios objetivo:
  - Edad: 60+ años
  - Experiencia: baja-media con tecnología
  - Rol: administradores actuales o potenciales de ranchos
- [ ] Preparar escenarios de prueba:
  1. **Tarea 1:** Registrar un nuevo animal
  2. **Tarea 2:** Ver alertas de salud
  3. **Tarea 3:** Navegar al inventario
  4. **Tarea 4:** Exportar reporte (si implementado)
- [ ] Preparar ambiente de prueba (staging con datos demo)
- [ ] Preparar cuestionarios:
  - Pre-test: experiencia tecnológica
  - Post-test: facilidad de uso, legibilidad, satisfacción

#### B. Ejecución de pruebas

- [ ] Sesiones individuales (30-45 min cada una):
  - Observar sin intervenir (think-aloud protocol)
  - Grabar sesión (con consentimiento)
  - Medir tiempo por tarea
  - Anotar dificultades y comentarios
- [ ] Métricas a recopilar:
  - Tiempo para completar cada tarea
  - Número de errores / veces que se perdieron
  - Calificación de legibilidad (1-5)
  - Calificación de facilidad de uso (1-5)
  - Comentarios cualitativos

#### C. Análisis y ajustes

- [ ] Compilar resultados:
  - Tiempo promedio por tarea
  - Problemas comunes identificados
  - Sugerencias de usuarios
- [ ] Priorizar ajustes:
  - **P0 (bloquean uso):** resolver inmediatamente
  - **P1 (dificultan uso):** resolver antes de MVP
  - **P2 (mejoras):** backlog para post-MVP
- [ ] Implementar ajustes prioritarios
- [ ] Documentar hallazgos en `docs/usability-tests/`

**Verificación CA-5:**
-  3 usuarios probaron la aplicación
-  Al menos 2/3 completaron "registrar animal" en < 1 min
-  Calificación promedio de legibilidad  4/5
-  Ajustes críticos implementados

## Dependencias

**Precedentes:**
- Ninguna (componentes base son foundation)

**Bloqueantes:**
- Ninguna

**Relacionadas:**
- **Todas las épicas:** utilizan estos componentes base
- Epic 1 (Dashboard): usa LargeButton y Card
- Epic 2 (Onboarding): usa todos los componentes
- Epic 3 (Inventario): usa formularios accesibles

## Estimación y Esfuerzo

- **Story 5.1 (Componentes):** 4-5 días
  - LargeButton: 1 día
  - Card: 1 día
  - Input mejorado: 1 día
  - SwipeAction: 1 día (opcional)
  - Documentación: 0.5 días
- **Story 5.2 (Tests usabilidad):** 3-4 días
  - Preparación: 1 día
  - Ejecución: 1 día (3 sesiones)
  - Análisis y ajustes: 1-2 días
- **Total estimado:** 7-9 días

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Usuarios no disponibles para pruebas | Media | Alto | Reclutar con anticipación, ofrecer incentivos, tener plan B con usuarios similares |
| Componentes no cumplen accesibilidad | Baja | Alto | Usar herramientas automáticas (axe, Lighthouse), revisión manual, consultar WCAG |
| Ajustes post-pruebas rompen funcionalidad | Media | Medio | Tests de regresión, cambios incrementales, revisión cuidadosa |
| Diseño no agrada a usuarios | Media | Medio | Validar paleta de colores temprano, iterar rápido basado en feedback |

## Definición de Hecho (DoD)

- [ ] Todos los componentes base creados y documentados
- [ ] Componentes cumplen requisitos de accesibilidad (44x44 px, WCAG AA)
- [ ] Tests automáticos de accesibilidad pasan (axe-core)
- [ ] Lighthouse accessibility score > 90
- [ ] 3 sesiones de usabilidad completadas
- [ ] CA-5 verificado (tiempos, calificaciones)
- [ ] Ajustes prioritarios implementados
- [ ] Documentación actualizada (componentes + hallazgos)

## Guidelines de Accesibilidad

### Contraste de Colores (WCAG AA)

**Ratios mínimos:**
- Texto normal: 4.5:1
- Texto grande (18pt o 14pt negrita): 3:1
- Componentes UI: 3:1

**Verificación:**
```bash
# Usar herramientas online:
# - WebAIM Contrast Checker
# - Colour Contrast Analyser

# Verificar con Lighthouse en cada página
npm run lighthouse
```

### Tamaños Táctiles

**Mínimos:**
- Botones: 48x48 px (6px superior a 44x44 estándar)
- Checkboxes/radios: 24x24 px con padding
- Área de tap alrededor de links: 44x44 px

### Navegación por Teclado

**Elementos críticos:**
- Tab order lógico
- Focus visible (outline)
- Enter/Space para activar botones
- Escape para cerrar modales
- Arrow keys en listas/menús

### ARIA Labels

```tsx
//  Correcto
<button aria-label="Cerrar modal">
  <XIcon />
</button>

//  Correcto
<input 
  id="nombre-animal"
  aria-describedby="nombre-error"
  aria-invalid={hasError}
/>
<span id="nombre-error" role="alert">
  Campo requerido
</span>

//  Incorrecto
<button><XIcon /></button>
<input /> {/* sin label */}
```

## Protocolo de Test de Usabilidad

### Pre-Test (5 min)

1. Bienvenida y explicación
2. Consentimiento grabación
3. Cuestionario inicial:
   - Edad
   - Experiencia con smartphones
   - Experiencia con apps de gestión

### Test Tasks (20 min)

**Think-Aloud Protocol:** pedir al usuario que verbalice sus pensamientos

**Tarea 1: Registrar Animal (objetivo: < 1 min)**
- Inicio: Dashboard
- Instrucción: "Registra un animal nuevo llamado Vaca #15"
- Observar: dificultades, tiempo, errores

**Tarea 2: Ver Alertas (objetivo: < 30 seg)**
- Inicio: Dashboard
- Instrucción: "¿Cuántos animales tienen alertas de salud?"
- Observar: comprensión visual, navegación

**Tarea 3: Navegar Inventario (objetivo: < 30 seg)**
- Inicio: Dashboard
- Instrucción: "Abre la sección de inventario"
- Observar: claridad de navegación

### Post-Test (10 min)

**Cuestionario:**
1. ¿Qué tan fácil fue usar la aplicación? (1-5)
2. ¿Qué tan legible era el texto? (1-5)
3. ¿Algo fue confuso o difícil?
4. ¿Qué cambiarías?
5. ¿Usarías esta app regularmente?

### Análisis

**Calcular:**
- Tiempo promedio por tarea
- Tasa de éxito por tarea
- Calificaciones promedio
- Temas comunes en feedback

## Referencias

- **PRD:** `docs/prd/PRD.md`
- **Requisitos Funcionales:** `docs/prd/requisitos-funcionales-fr.md`
- **Criterios de Aceptación:** `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md`
- **Requisitos No Funcionales:** `docs/prd/requisitos-no-funcionales-nfr.md`
- **Arquitectura:** `docs/architecture/architecture.md`
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

## Notas Adicionales

- Esta épica es transversal y bloquea/afecta a todas las demás
- Priorizar componentes base antes que features avanzadas
- Tests de usabilidad deben hacerse temprano y con frecuencia
- Considerar grabaciones de sesiones para referencia futura
- Documentar todos los hallazgos para aprendizaje del equipo
- Feedback de usuarios es el criterio más valioso
