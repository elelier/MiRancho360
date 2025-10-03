# LargeButton

`LargeButton` is an accessible call-to-action component tailored for older adults. It builds on the project design system by offering generous touch targets, strong visual contrast, and optional icon or loading states.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Visible label for the button. Keep it short and action oriented. |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Visual treatment that maps to the Rancho Natural palette. |
| `size` | `'large' \| 'xl'` | `'large'` | `large` meets the 48x48px touch target, `xl` increases to 60x60px for mission critical flows. |
| `icon` | `ReactNode` | `undefined` | Optional decorative icon. Hidden automatically while loading. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Where to place the icon relative to the label. |
| `isLoading` | `boolean` | `false` | Shows a spinner, disables the button, and announces busy state to assistive tech. |
| `fullWidth` | `boolean` | `false` | Stretches the button to fill its container. |
| `...buttonProps` | Native `button` props | — | Any other valid `button` attribute such as `type`, `onClick`, or ARIA props. |

## Usage

```tsx
import { LargeButton } from './LargeButton';
import { ArrowRight } from 'lucide-react';

export function PrimaryAction() {
  return (
    <LargeButton variant="primary" size="xl" icon={<ArrowRight aria-hidden="true" />}>
      Empezar visita
    </LargeButton>
  );
}
```

### With Loading State

```tsx
<LargeButton isLoading>
  Guardando cambios
</LargeButton>
```

## Accessibility Notes

- Minimum touch target: `large` provides 48x48px, `xl` widens to 60x60px.
- Keyboard support: focus styles rely on `focus-visible` and include a 4px ring with sufficient contrast.
- Loading state exposes `aria-busy="true"` and renders a polite screen reader message.
- Disabled state mirrors `aria-disabled` and `disabled` to keep semantics consistent across screen readers.
- Icon slots are flagged as `aria-hidden` so screen readers announce only the text label.

## Design Tokens

- Primary action color: `bg-primary-600` with a `hover` shift to `primary-700`.
- Secondary action color: `bg-accent-500` aligned with the Rancho Natural accent.
- Success and danger variants rely on Tailwind core greens and reds for guaranteed contrast.
- Typography uses the large type ramp (`text-xl` or `text-2xl`) defined in `tailwind.config.js`.

## Testing Checklist

- Verify hover, focus, active, disabled, and loading states in Storybook or a demo page.
- Use browser DevTools to confirm the rendered size meets the required touch area.
- Run `npm test -- LargeButton` to execute the unit tests; coverage must stay above 80% lines/functions for this component.
