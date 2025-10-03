# Input, Select y Textarea

## Cambios destacados
- Prop `success` disponible en los tres componentes para feedback positivo.
- Mejora del estado `disabled` con colores y cursor consistentes.
- Focus ring más visible con opacidad suave.
- Indicador directo de campo requerido cuando no se define placeholder.

## Props nuevas o actualizadas

### Input
| Prop     | Tipo     | Default | Descripcion                                   |
|----------|----------|---------|-----------------------------------------------|
| success  | string   | -       | Mensaje verde que confirma un ingreso valido. |
| error    | string   | -       | Mensaje rojo que describe un problema.        |
| disabled | boolean  | false   | Deshabilita el campo y aplica estilo gris.    |

### Select
| Prop     | Tipo     | Default | Descripcion                                  |
|----------|----------|---------|----------------------------------------------|
| success  | string   | -       | Mensaje verde que confirma la seleccion.     |
| error    | string   | -       | Mensaje rojo que describe un problema.       |

### Textarea
| Prop     | Tipo     | Default | Descripcion                                  |
|----------|----------|---------|----------------------------------------------|
| success  | string   | -       | Mensaje verde que confirma el contenido.     |
| error    | string   | -       | Mensaje rojo que describe un problema.       |

## Estados visuales
- **Normal:** borde gris (`border-primary-300`), fondo blanco, texto oscuro.
- **Focus:** ring azul amplio (`focus:ring-4`) con opacidad 50% y borde primario.
- **Error:** borde y ring rojos, mensaje rojo con rol `alert`.
- **Success:** borde y ring verdes, mensaje verde con icono check.
- **Disabled:** fondo gris claro, texto gris y cursor `not-allowed`.

## Ejemplos

```tsx
<Input
  label="Nombre del Animal"
  value="Lola"
  success="Nombre valido"
  required
/>

<Input
  label="Edad (meses)"
  value="-5"
  error="La edad debe ser un numero positivo"
  required
/>

<Input
  label="ID Interno"
  value="A-2024-001"
  disabled
/>

<Select
  label="Sexo"
  options={[
    { value: 'm', label: 'Macho' },
    { value: 'h', label: 'Hembra' },
  ]}
  value="h"
  success="Sexo registrado correctamente"
/>
```

```tsx
<Textarea
  label="Notas"
  placeholder="Observaciones adicionales..."
  rows={4}
  required
  success="Notas guardadas"
/>
```
