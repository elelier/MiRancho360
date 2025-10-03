# Card

`Card` is an accessible container for grouping dashboard or detail information while keeping visual consistency with the Rancho Natural design language.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Optional heading displayed in the card header. |
| `subtitle` | `string` | `undefined` | Supporting text that appears under the title. |
| `variant` | `'default' \| 'primary' \| 'warning' \| 'danger' \| 'success'` | `'default'` | Semantic background treatment that maps to dashboard use cases. |
| `children` | `ReactNode` | - | Main body content of the card. |
| `footer` | `ReactNode` | `undefined` | Optional footer area for actions or secondary details. |
| `icon` | `ReactNode` | `undefined` | Decorative icon placed to the left of the title. |
| `clickable` | `boolean` | `false` | Adds button semantics so the entire card can be activated. |
| `onCardClick` | `() => void` | `undefined` | Handler executed when the card is activated via click or keyboard. |
| `...divProps` | Native `div` props | - | Any other valid attributes (`aria-*`, `data-*`, event handlers). |

## Variants

- **default:** Neutral surface for general content.
- **primary:** Soft green tint used for positive or health-related indicators.
- **warning:** Warm yellow cue for upcoming events or pending tasks.
- **danger:** Light red background for critical alerts.
- **success:** Muted green to confirm completed items.

## Usage

```tsx
import { Card } from '@/components/common';

<Card title="Animales" subtitle="Total: 24">
  <p className="text-3xl font-bold">24</p>
  <p className="text-slate-600">Registrados en el rancho</p>
</Card>
```

### Clickable Card

```tsx
<Card
  title="Salud"
  variant="primary"
  clickable
  onCardClick={() => navigate('/health')}
>
  <p className="text-3xl font-bold">3</p>
  <p className="text-slate-600">Animales con alertas</p>
</Card>
```

### Card with Footer Action

```tsx
import { LargeButton } from '@/components/common';

<Card
  title="Recordatorios"
  footer={<LargeButton variant="secondary">Ver todos</LargeButton>}
>
  <ul className="space-y-2">
    <li>Revisar vacunas de otono</li>
    <li>Actualizar peso de crias</li>
  </ul>
</Card>
```

## Accessibility Notes

- When `clickable` is enabled the card exposes `role="button"`, `tabIndex=0`, and keyboard activation with **Enter** or **Space**.
- Titles automatically wire to `aria-labelledby` so screen readers announce the heading when focusing a clickable card.
- Focus-visible styles create a 4px ring with sufficient contrast against all variants.
- Icons in the header are wrapped in an `aria-hidden` container to avoid duplicate announcements; provide textual cues through `title` or `subtitle` when needed.
