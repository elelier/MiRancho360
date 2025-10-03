
**Análisis del código actual:**
- `Input`, `Select`, `Textarea` ya existen
- Altura actual: min-h-[60px]  (56px)
- Texto: text-lg  (18px)
- Labels asociados correctamente con htmlFor
- Estados: error (rojo), normal
- Iconos: leftIcon, rightIcon soportados

**Necesidades de mejora:**
- Agregar estado ''success'' (verde)
- Agregar estado ''disabled'' visual mejorado
- Mejorar contraste en estados
- Agregar indicador visual de required en el input mismo
- Mejorar feedback de focus

## Tareas Técnicas Detalladas

### Tarea 1: Agregar Estado de Éxito

Modificar `Input.tsx` para soportar estado de éxito:

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string; // NUEVO
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// En el JSX
<input
  className={`
    input-primary
    ${leftIcon ? ''pl-12'' : ''''}
    ${rightIcon ? ''pr-12'' : ''''}
    ${error ? ''border-red-500 focus:border-red-500 focus:ring-red-500'' : ''''}
    ${success ? ''border-green-500 focus:border-green-500 focus:ring-green-500'' : ''''}
    ${className}
  `}
  {...props}
/>

{success && !error && (
  <p className="mt-2 text-lg text-green-600 flex items-center">
    <span className="mr-2"></span>
    {success}
  </p>
)}
```

### Tarea 2: Mejorar Estado Disabled

```css
/* En src/index.css, actualizar .input-primary */
.input-primary {
  @apply block w-full px-4 py-4 text-lg border border-primary-300 rounded-xl 
         focus:ring-2 focus:ring-primary-400 focus:border-primary-400 
         min-h-[60px] bg-white
         disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
         disabled:border-gray-300;
}
```

### Tarea 3: Indicador Visual de Required

```tsx
{/* Agregar asterisco dentro del input como placeholder hint */}
<input
  className={/* ... */}
  placeholder={
    props.required && !props.placeholder 
      ? ''Campo requerido *'' 
      : props.placeholder
  }
  aria-required={props.required}
  {...props}
/>
```

### Tarea 4: Mejorar Focus Ring

```css
/* Ya existe focus:ring-2 pero podemos hacerlo más visible */
.input-primary {
  @apply /* estilos actuales... */
         focus:ring-4 focus:ring-primary-400/50 /* más ancho y con opacidad */
         focus:outline-none;
}
```

### Tarea 5: Aplicar Mejoras a Select y Textarea

**Select.tsx:**
```tsx
interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, ''children''> {
  label?: string;
  error?: string;
  success?: string; // NUEVO
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

// Agregar misma lógica de success message
```

**Textarea.tsx:**
```tsx
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string; // NUEVO
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

// Agregar misma lógica de success message
```

### Tarea 6: Tests de Nuevos Estados

Crear/Actualizar `src/components/common/__tests__/Input.test.tsx`:

```typescript
import { render, screen } from ''@testing-library/react'';
import { Input, Select, Textarea } from ''../Input'';

describe(''Input Component'', () => {
  it(''renders with error state'', () => {
    render(<Input error="Campo inválido" />);
    expect(screen.getByText(''Campo inválido'')).toBeInTheDocument();
    expect(screen.getByText(''Campo inválido'')).toHaveClass(''text-red-600'');
  });

  it(''renders with success state'', () => {
    render(<Input success="¡Correcto!" />);
    expect(screen.getByText(''¡Correcto!'')).toBeInTheDocument();
    expect(screen.getByText(''¡Correcto!'')).toHaveClass(''text-green-600'');
  });

  it(''shows required indicator in label'', () => {
    render(<Input label="Nombre" required />);
    expect(screen.getByText(''*'')).toBeInTheDocument();
  });

  it(''applies disabled styles'', () => {
    render(<Input disabled />);
    const input = screen.getByRole(''textbox'');
    expect(input).toBeDisabled();
    expect(input).toHaveClass(''disabled:bg-gray-100'');
  });

  it(''associates label with input'', () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText(''Email'');
    const input = screen.getByRole(''textbox'');
    expect(label).toHaveAttribute(''for'', ''email-input'');
    expect(input).toHaveAttribute(''id'', ''email-input'');
  });
});

describe(''Select Component'', () => {
  const options = [
    { value: ''m'', label: ''Macho'' },
    { value: ''h'', label: ''Hembra'' }
  ];

  it(''renders options correctly'', () => {
    render(<Select options={options} />);
    expect(screen.getByText(''Macho'')).toBeInTheDocument();
    expect(screen.getByText(''Hembra'')).toBeInTheDocument();
  });

  it(''renders with success state'', () => {
    render(<Select options={options} success="Selección válida" />);
    expect(screen.getByText(''Selección válida'')).toBeInTheDocument();
  });
});

describe(''Textarea Component'', () => {
  it(''renders with custom rows'', () => {
    render(<Textarea rows={6} />);
    const textarea = screen.getByRole(''textbox'');
    expect(textarea).toHaveAttribute(''rows'', ''6'');
  });

  it(''renders with success state'', () => {
    render(<Textarea success="Descripción guardada" />);
    expect(screen.getByText(''Descripción guardada'')).toBeInTheDocument();
  });
});
```

### Tarea 7: Actualizar Documentación

Actualizar `src/components/common/Input.md`:

```markdown
# Input, Select, Textarea Components

## Cambios en esta versión

-  Nuevo prop `success` para feedback positivo
-  Mejoras visuales en estado disabled
-  Focus ring más visible
-  Indicador de campo requerido mejorado

## Props Actualizados

### Input
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| success | string | - | Mensaje de éxito (verde) |
| error | string | - | Mensaje de error (rojo) |
| disabled | boolean | false | Deshabilitado (fondo gris) |

### Select
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| success | string | - | Mensaje de éxito (verde) |
| error | string | - | Mensaje de error (rojo) |

### Textarea
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| success | string | - | Mensaje de éxito (verde) |
| error | string | - | Mensaje de error (rojo) |

## Estados Visuales

### Normal
- Border gris (border-primary-300)
- Fondo blanco
- Texto negro

### Focus
- Ring azul ancho (focus:ring-4)
- Border azul (focus:border-primary-400)

### Error
- Border rojo
- Mensaje rojo debajo con ícono 
- Focus ring rojo

### Success
- Border verde
- Mensaje verde debajo con ícono 
- Focus ring verde

### Disabled
- Fondo gris claro
- Texto gris
- Cursor not-allowed
- Border gris

## Ejemplos Actualizados

### Input con validación exitosa
\`\`\`tsx
<Input 
  label="Nombre del Animal"
  value="Lola"
  success="Nombre válido "
  required
/>
\`\`\`

### Input con error
\`\`\`tsx
<Input 
  label="Edad (meses)"
  value="-5"
  error="La edad debe ser un número positivo"
  required
/>
\`\`\`

### Input deshabilitado
\`\`\`tsx
<Input 
  label="ID Interno"
  value="A-2024-001"
  disabled
/>
\`\`\`

### Select con success
\`\`\`tsx
<Select
  label="Sexo"
  options={[
    { value: ''m'', label: ''Macho'' },
    { value: ''h'', label: ''Hembra'' }
  ]}
  value="h"
  success="Sexo registrado correctamente"
/>
\`\`\`
```

### Tarea 8: Tests de Contraste (Lighthouse)

Configurar prueba automatizada de accesibilidad:

```javascript
// En vitest.config.ts o similar
// Asegurar que tests incluyan verificación de contraste

// Ejemplo de test manual con axe-core
import { axe } from ''jest-axe'';

it(''has no accessibility violations'', async () => {
  const { container } = render(
    <Input label="Test" error="Error test" />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Criterios de Aceptación

### CA-1: Estado de Éxito
- [ ] Input muestra mensaje verde con success prop
- [ ] Select muestra mensaje verde con success prop
- [ ] Textarea muestra mensaje verde con success prop
- [ ] Ícono  aparece en mensaje de éxito
- [ ] Border se vuelve verde en estado success

### CA-2: Estado Disabled Mejorado
- [ ] Input deshabilitado tiene fondo gris
- [ ] Texto es gris y legible
- [ ] Cursor muestra ''not-allowed''
- [ ] No se puede interactuar con el input

### CA-3: Focus Mejorado
- [ ] Ring de focus es más visible (ring-4)
- [ ] Ring tiene opacidad 50% para suavidad
- [ ] Funciona en todos los componentes (Input, Select, Textarea)

### CA-4: Contraste WCAG AA
- [ ] Error rojo cumple contraste 4.5:1 mínimo
- [ ] Success verde cumple contraste 4.5:1 mínimo
- [ ] Disabled gris cumple contraste 4.5:1 mínimo
- [ ] Labels cumplen contraste 4.5:1 mínimo

### CA-5: Accesibilidad
- [ ] Labels están asociados con inputs (htmlFor/id)
- [ ] aria-required presente cuando required=true
- [ ] Mensajes de error/success son anunciados por lectores de pantalla
- [ ] Navegación por teclado funciona correctamente

### CA-6: Tests
- [ ] Todos los tests unitarios pasan
- [ ] Tests de accesibilidad pasan (axe-core)
- [ ] Lighthouse accessibility  90

## Plan de Validación

### Validación Manual

1. **Prueba de estados:**
   ```tsx
   // Crear página de prueba con todos los estados
   <Input label="Normal" />
   <Input label="Con Error" error="Error aquí" />
   <Input label="Con Éxito" success="¡Correcto!" />
   <Input label="Deshabilitado" disabled value="Bloqueado" />
   <Input label="Requerido" required />
   ```

2. **Prueba de contraste:**
   - Usar herramienta de contraste (WebAIM, Chrome DevTools)
   - Verificar ratios en todos los estados
   - Probar con modo alto contraste del OS

3. **Prueba con lector de pantalla:**
   - NVDA/JAWS (Windows)
   - VoiceOver (Mac/iOS)
   - Talkback (Android)

### Validación Automatizada

```bash
npm test -- Input.test.tsx
npm run lighthouse
```

## Dependencias

**Bloqueantes:** Ninguna

**Usa:**
- Tailwind CSS (configuración existente)
- index.css (actualización de .input-primary)

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Verde de success no cumple contraste | Baja | Medio | Usar green-600 o más oscuro, verificar con herramienta |
| Disabled text muy claro | Media | Bajo | Usar gray-500, no gray-400 |
| Focus ring demasiado ancho | Baja | Bajo | Ajustar a ring-3 si molesta |

## Definición de Hecho (DoD)

- [ ] Código implementado y revisado
- [ ] Todos los CA verificados
- [ ] Tests unitarios pasan (cobertura  80%)
- [ ] Tests de accesibilidad pasan (axe-core)
- [ ] Lighthouse accessibility  90
- [ ] Documentación actualizada con ejemplos
- [ ] Probado en 3 navegadores
- [ ] Probado con lector de pantalla
- [ ] Sin warnings de TypeScript/ESLint
- [ ] Commiteado con mensaje descriptivo

## Archivos Afectados

**Modificados:**
- `src/components/common/Input.tsx` (agregar success prop)
- `src/index.css` (mejorar .input-primary con disabled)
- `src/components/common/Input.md` (actualizar docs)

**Nuevos/Actualizados:**
- `src/components/common/__tests__/Input.test.tsx` (tests de success)

## Uso Anticipado

### Epic 2 (Onboarding) - Formulario Inicial
```tsx
<Input 
  label="Nombre del Rancho"
  placeholder="Ej: Rancho San José"
  required
  success={nombreGuardado ? "¡Guardado!" : undefined}
/>
```

### Epic 3 (Inventario) - Formulario de Animal
```tsx
<Input 
  label="Nombre"
  placeholder="Ej: Lola"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  error={errores.nombre}
  success={validaciones.nombre ? " Nombre válido" : undefined}
  required
/>

<Select
  label="Sexo"
  options={[
    { value: ''m'', label: ''Macho'' },
    { value: ''h'', label: ''Hembra'' }
  ]}
  value={sexo}
  onChange={(e) => setSexo(e.target.value)}
  success={sexo ? "" : undefined}
  required
/>

<Textarea
  label="Notas"
  placeholder="Observaciones adicionales..."
  rows={4}
  value={notas}
  onChange={(e) => setNotas(e.target.value)}
/>
```

## Notas Adicionales

- No rompe compatibilidad: success es opcional
- Mejoras visuales sutiles pero impactantes
- Prioriza accesibilidad sobre estética
- Mantiene consistencia con tema Rancho Natural

---

**Creado por:** Bob (Scrum Master)  
**Revisado por:** Pendiente  
**Listo para desarrollo:** 
