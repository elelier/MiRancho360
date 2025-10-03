# Story 5.1.B: Crear Componente Card Accesible

**Epic:** Epic 5 - UX / Accesibilidad  
**Story ID:** 5.1.B  
**Fecha de creación:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Crítica (Bloqueante para Epic 1)  
**Estimación:** 1 día

## Objetivo

Crear un componente `Card` accesible y reutilizable para mostrar información agrupada en el Dashboard y otras secciones. El componente debe soportar variantes semánticas (default, primary, warning, danger) y ser claramente visible para usuarios 60+.

## Contexto del Negocio

El Dashboard MVP (Epic 1) requiere tarjetas para mostrar tres áreas clave: Salud, Partos y Pendientes. Estas tarjetas deben ser claramente diferenciables visualmente y permitir navegación táctil fácil.

## Valor para el Usuario

- Información organizada y fácil de escanear
- Variantes de color para indicar prioridad/estado
- Área táctil grande para navegación
- Jerarquía visual clara (título, contenido, acciones)

## Referencias a PRD y Arquitectura

### Del PRD

**FR-1.1:** Mostrar tarjetas: Salud (alertas), Partos próximos/recientes, Pendientes/Acciones  
**FR-5.1:** Botones grandes, tipografía legible, contrastes altos  
**CA-1:** Las tres áreas son visibles sin scroll en vista móvil  
**NFR-ACC-1:** Contraste WCAG AA

**Ubicación PRD:**
- `docs/prd/requisitos-funcionales-fr.md` (FR-1, FR-5)
- `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md` (CA-1)

### De Arquitectura

**Tech Stack:** React 18 + TypeScript + Tailwind CSS  
**Tema visual:** Rancho Natural  
**Paleta:**
- Primary: #97B982 (Verde Dusty) - Salud
- Accent: #C5A34A (Amarillo Tierra) - Acciones importantes
- Background: #F0F4EF

**Ubicación Arquitectura:**
- `docs/architecture/tech-stack.md`
- `tailwind.config.js`

## Estado Actual del Código

**Búsqueda realizada:** No existe `src/components/common/Card.tsx`  
**Alternativa actual:** Divs con clases Tailwind inline en `DashboardPage.tsx`  
**Necesidad:** Componente reutilizable para consistencia

## Tareas Técnicas Detalladas

### Tarea 1: Crear Card.tsx

Crear `src/components/common/Card.tsx`:

```typescript
import type { ReactNode, HTMLAttributes } from ''react'';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  variant?: ''default'' | ''primary'' | ''warning'' | ''danger'' | ''success'';
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  clickable?: boolean;
  onCardClick?: () => void;
}

export function Card({ 
  title,
  subtitle,
  variant = ''default'',
  children,
  footer,
  icon,
  clickable = false,
  onCardClick,
  className = '''',
  ...props 
}: CardProps) {
  // Implementación aquí
}
```

### Tarea 2: Estructura del Card

**Layout:**
```

 [Icon] Title              [Badge]  Header
 Subtitle                         

                                  
 Children (contenido principal)     Body
                                  

 [Footer actions/info]              Footer (opcional)

```

**Implementación:**
```tsx
<div
  className={`
    rounded-2xl shadow-lg border
    ${clickable ? ''cursor-pointer hover:shadow-xl transition-shadow'' : ''''}
    ${variantClasses[variant]}
    ${className}
  `}
  onClick={clickable ? onCardClick : undefined}
  role={clickable ? ''button'' : undefined}
  tabIndex={clickable ? 0 : undefined}
  {...props}
>
  {/* Header */}
  {(title || icon) && (
    <div className="flex items-center justify-between p-6 pb-4">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <div>
          {title && <h3 className="text-2xl font-bold">{title}</h3>}
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  )}
  
  {/* Body */}
  <div className="p-6 pt-2">
    {children}
  </div>
  
  {/* Footer */}
  {footer && (
    <div className="border-t border-gray-200 p-4 bg-gray-50/50">
      {footer}
    </div>
  )}
</div>
```

### Tarea 3: Variantes Semánticas

```typescript
const variantClasses = {
  default: ''bg-white border-gray-200'',
  primary: ''bg-primary-50 border-primary-300'', // Para tarjeta de Salud
  warning: ''bg-yellow-50 border-yellow-300'',
  danger: ''bg-red-50 border-red-300'',
  success: ''bg-green-50 border-green-300''
};
```

**Casos de uso:**
- `default`: Contenido general
- `primary`: Tarjeta de Salud (Dashboard)
- `warning`: Tarjeta de Partos próximos (Dashboard)
- `danger`: Alertas críticas
- `success`: Confirmaciones/completados

### Tarea 4: Accesibilidad para Cards Clickables

```tsx
// Si el card es clickable (navega a otra pantalla)
onKeyDown={(e) => {
  if (clickable && (e.key === ''Enter'' || e.key === '' '')) {
    e.preventDefault();
    onCardClick?.();
  }
}}
```

### Tarea 5: Responsive Design

```css
/* Mobile-first */
p-4 sm:p-6  /* Padding ajustado */
text-xl sm:text-2xl  /* Títulos responsive */
```

### Tarea 6: Tests Unitarios

Crear `src/components/common/__tests__/Card.test.tsx`:

```typescript
import { render, screen, fireEvent } from ''@testing-library/react'';
import { Card } from ''../Card'';

describe(''Card'', () => {
  it(''renders title and children'', () => {
    render(
      <Card title="Test Card">
        <p>Content</p>
      </Card>
    );
    expect(screen.getByText(''Test Card'')).toBeInTheDocument();
    expect(screen.getByText(''Content'')).toBeInTheDocument();
  });

  it(''calls onCardClick when clicked'', () => {
    const handleClick = jest.fn();
    render(
      <Card clickable onCardClick={handleClick}>
        Content
      </Card>
    );
    fireEvent.click(screen.getByRole(''button''));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it(''applies correct variant classes'', () => {
    const { container } = render(<Card variant="primary">Content</Card>);
    expect(container.firstChild).toHaveClass(''bg-primary-50'');
  });

  it(''renders footer when provided'', () => {
    render(
      <Card footer={<button>Action</button>}>
        Content
      </Card>
    );
    expect(screen.getByText(''Action'')).toBeInTheDocument();
  });

  it(''supports keyboard navigation when clickable'', () => {
    const handleClick = jest.fn();
    render(
      <Card clickable onCardClick={handleClick}>
        Content
      </Card>
    );
    const card = screen.getByRole(''button'');
    fireEvent.keyDown(card, { key: ''Enter'' });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Tarea 7: Documentación

Crear `src/components/common/Card.md`:

```markdown
# Card Component

## Propósito
Contenedor accesible para agrupar información relacionada.

## Cuándo usar
- Tarjetas de Dashboard (Salud, Partos, Pendientes)
- Listados de animales/sitios
- Detalles agrupados

## Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| title | string | - | Título del card |
| subtitle | string | - | Subtítulo opcional |
| variant | string | ''default'' | Variante semántica |
| children | ReactNode | - | Contenido principal |
| footer | ReactNode | - | Área de acciones |
| icon | ReactNode | - | Ícono en header |
| clickable | boolean | false | Si el card es clickable |
| onCardClick | function | - | Handler para click |

## Variantes
- **default:** Contenido general (blanco)
- **primary:** Información importante (verde claro)
- **warning:** Alertas de atención (amarillo)
- **danger:** Alertas críticas (rojo)
- **success:** Confirmaciones (verde)

## Ejemplos

### Card básico
\`\`\`tsx
<Card title="Animales" subtitle="Total: 24">
  <p>Contenido aquí</p>
</Card>
\`\`\`

### Card clickable con ícono
\`\`\`tsx
<Card 
  title="Salud" 
  icon={<span></span>}
  variant="primary"
  clickable
  onCardClick={() => navigate(''/salud'')}
>
  <p>3 animales con alertas</p>
</Card>
\`\`\`

### Card con footer
\`\`\`tsx
<Card 
  title="Recordatorios"
  footer={<LargeButton>Ver todos</LargeButton>}
>
  <ul>...</ul>
</Card>
\`\`\`

## Accesibilidad
- Cards clickables son navegables por teclado (Tab, Enter, Space)
- role="button" cuando clickable=true
- Contraste WCAG AA en todas las variantes
```

## Criterios de Aceptación

### CA-1: Estructura y Contenido
- [ ] Card renderiza title correctamente
- [ ] Card renderiza subtitle cuando se provee
- [ ] Card renderiza children (contenido principal)
- [ ] Card renderiza footer cuando se provee
- [ ] Card renderiza icon cuando se provee

### CA-2: Variantes Visuales
- [ ] Variante ''default'' usa fondo blanco
- [ ] Variante ''primary'' usa bg-primary-50
- [ ] Variante ''warning'' usa bg-yellow-50
- [ ] Variante ''danger'' usa bg-red-50
- [ ] Variante ''success'' usa bg-green-50
- [ ] Todas las variantes cumplen contraste WCAG AA

### CA-3: Interactividad (Cards Clickables)
- [ ] Card con clickable=true muestra cursor pointer
- [ ] Card con clickable=true tiene role="button"
- [ ] onCardClick se ejecuta al hacer click
- [ ] onCardClick se ejecuta con Enter
- [ ] onCardClick se ejecuta con Space
- [ ] Hover muestra feedback visual (shadow-xl)

### CA-4: Responsive Design
- [ ] Card se adapta a viewport móvil
- [ ] Padding apropiado en móvil y desktop
- [ ] Texto legible en todos los tamaños

### CA-5: Tests
- [ ] Todos los tests unitarios pasan
- [ ] Cobertura de código  80%

### CA-6: Documentación
- [ ] README completo con ejemplos
- [ ] Props documentadas
- [ ] Variantes explicadas con casos de uso

## Plan de Validación

### Validación Manual

1. **Inspección visual:**
   - Renderizar Card con todas las variantes
   - Verificar colores del tema Rancho Natural
   - Comprobar espaciado y padding

2. **Prueba de interactividad:**
   - Click en card clickable
   - Navegación por teclado
   - Hover states

3. **Prueba responsive:**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)

### Validación Automatizada

```bash
npm test -- Card.test.tsx
npm run lighthouse
```

## Dependencias

**Bloqueantes:** Ninguna

**Usa:**
- LargeButton (Story 5.1.A) - opcional en footer

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Variantes de color no se distinguen bien | Media | Medio | Tests con usuarios, ajustar colores si necesario |
| Cards muy grandes en móvil | Baja | Medio | Diseño mobile-first, limitar contenido |
| Click accidental en cards | Baja | Bajo | Solo hacer clickable cuando sea navegación, no acciones |

## Definición de Hecho (DoD)

- [ ] Código implementado y revisado
- [ ] Todos los CA verificados
- [ ] Tests unitarios pasan (cobertura  80%)
- [ ] Documentación completa con ejemplos
- [ ] Lighthouse accessibility  90
- [ ] Probado en 3 navegadores
- [ ] Probado en dispositivo móvil real
- [ ] Sin warnings de TypeScript/ESLint
- [ ] Commiteado con mensaje descriptivo

## Archivos Afectados

**Nuevos:**
- `src/components/common/Card.tsx`
- `src/components/common/__tests__/Card.test.tsx`
- `src/components/common/Card.md`

**Modificados:**
- `src/components/common/index.ts` (exportar Card)

## Uso Anticipado en Epic 1

```tsx
// Dashboard Page - Tarjeta de Salud
<Card 
  title="Salud" 
  icon={<span></span>}
  variant="primary"
  clickable
  onCardClick={() => navigate(''/health'')}
>
  <p className="text-3xl font-bold">3</p>
  <p className="text-gray-600">Animales con alertas</p>
</Card>

// Dashboard Page - Tarjeta de Partos
<Card 
  title="Partos Próximos" 
  icon={<span></span>}
  variant="warning"
  clickable
  onCardClick={() => navigate(''/reproductive'')}
>
  <p className="text-3xl font-bold">2</p>
  <p className="text-gray-600">En los próximos 7 días</p>
</Card>
```

## Notas Adicionales

- Card es un componente presentacional puro
- Lógica de datos debe venir de hooks/servicios
- Considerar variant ''accent'' si se necesita más tarde
- Footer es opcional pero útil para CTAs

---

**Creado por:** Bob (Scrum Master)  
**Revisado por:** Pendiente  
**Listo para desarrollo:** 
