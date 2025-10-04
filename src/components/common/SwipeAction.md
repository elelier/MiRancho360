# SwipeAction

`SwipeAction` ofrece interacciones de deslizamiento accesibles para listas móviles y un fallback con menú de acciones para dispositivos de escritorio.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Contenido principal del elemento (fila de lista, tarjeta compacta, etc.). |
| `leftActions` | `SwipeActionItem[]` | `[]` | Acciones que aparecen al deslizar hacia la derecha. |
| `rightActions` | `SwipeActionItem[]` | `[]` | Acciones que aparecen al deslizar hacia la izquierda. |
| `className` | `string` | `''` | Clases adicionales para personalizar el contenedor. |
| `actionWidth` | `number` | `88` | Ancho individual (en px) de cada botón de acción revelado por el gesto. |
| `onOpenChange` | `(side: 'left' \| 'right' \| null) => void` | `undefined` | Callback que notifica el estado abierto del componente. |
| `moreButtonLabel` | `string` | `'Acciones'` | Etiqueta accesible para el botón de fallback que abre el menú contextual. |

### SwipeActionItem

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `id` | `string` | - | Identificador estable para la acción. |
| `label` | `string` | - | Texto mostrado y anunciado por lectores de pantalla. |
| `onPress` | `() => void` | - | Callback ejecutado al activar la acción. |
| `icon` | `ReactNode` | `undefined` | Icono opcional mostrado antes del texto. |
| `ariaLabel` | `string` | `label` | Etiqueta accesible alternativa si el texto visual necesita contexto extra. |
| `intent` | `'default' \| 'edit' \| 'delete'` | `'default'` | Define el color temático del botón (verde, azul, rojo). |
| `className` | `string` | `undefined` | Permite extender estilos Tailwind para acciones puntuales. |

## Uso Básico

```tsx
import { SwipeAction } from '@/components/common';
import { PencilSimple, Trash } from '@phosphor-icons/react';

<SwipeAction
  leftActions={[{
    id: 'edit',
    label: 'Editar',
    intent: 'edit',
    icon: <PencilSimple weight="bold" />,
    onPress: () => navigate(`/animals/${animal.id}/edit`)
  }]}
  rightActions={[{
    id: 'delete',
    label: 'Eliminar',
    intent: 'delete',
    icon: <Trash weight="bold" />,
    onPress: () => deleteAnimal(animal.id)
  }]}
>
  <article className="flex items-center justify-between px-4 py-5">
    <div>
      <p className="text-xl font-semibold text-primary-900">{animal.name}</p>
      <p className="text-base text-primary-600">#{animal.tag}</p>
    </div>
    <span className="text-base font-medium text-primary-700">{animal.weight} kg</span>
  </article>
</SwipeAction>
```

## Accesibilidad

- El contenido principal es enfocable (`tabIndex=0`) y soporta **ArrowLeft/ArrowRight** para mostrar acciones y **Escape** para cerrarlas.
- El botón flotante "Acciones" queda oculto visualmente hasta hover/focus, pero siempre es alcanzable por teclado y anuncia un menú con todas las opciones disponibles.
- Cada acción renderiza un botón nativo con mínimo táctil de 44px y contraste adaptado al intent seleccionado.
- El componente cierra el estado abierto al hacer tap/click fuera, al activar una acción o al presionar **Escape**.
