# Standards de Código — MiRancho360

Fecha: 2025-10-02

Este documento recoge las normas y convenciones para el código del proyecto: TypeScript, React, estructura, linting y pruebas. Su objetivo es mantener calidad, legibilidad y facilidad de mantenimiento.

## Principios generales

- Legibilidad antes que cleverness: favorece código claro y explícito.
- Componentes pequeños y reutilizables.
- Encapsular efectos secundarios y llamadas a red en `src/services` y `src/hooks`.
- Tipado estricto en TypeScript para minimizar errores en tiempo de ejecución.

## TypeScript

- Habilitar "strict" en `tsconfig.json`.
- Preferir tipos explícitos en interfaces públicas (`src/types/`).
- Evitar `any`; cuando sea necesario, documentar la razón.

Ejemplo de tipo:

```ts
export type InventoryItem = {
  id: string;
  type: 'paca' | 'alimento' | 'medicina';
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  created_at: string; // ISO
};
```

## React + Componentes

- Nombres PascalCase para componentes y páginas (`AnimalProfilePage`).
- Props con interfaces claramente definidas.
- Mantener componentes presentacionales sin acceso directo a Supabase; usar hooks para datos.
- Accesibilidad: todos los controles deben ser alcanzables por teclado y tener labels apropiados.

## Estilos

- Usar Tailwind CSS para estilos. Evitar estilos inline complejos.
- Clases utilitarias preferidas; si un conjunto de utilidades se repite, crear un componente reutilizable.

## Servicios y hooks

- `src/services/*` deben exportar funciones puras que envuelvan llamadas a Supabase y conviertan respuestas en tipos del dominio.
- `src/hooks/*` deben usar servicios y exponer una API: `{ data, isLoading, error, refresh }`.

Ejemplo simple de servicio:

```ts
// src/services/inventory.ts
import supabase from './supabase';
import type { InventoryItem } from '../types/inventory';

export async function listInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw error;
  return data as InventoryItem[];
}
```

## Pruebas

- Unit: Vitest/Jest para lógica (services, utils, hooks). Mantener tests rápidos.
- E2E: Playwright/Cypress para flujos usuario (registro animal, onboarding, export).
- Objetivo mínimo de cobertura para código nuevo: 60%.

## Linting y formateo

- ESLint + Prettier; reglas en `eslint.config.js` y configuración de Prettier si aplica.
- Recomendado: hooks pre-commit con Husky para ejecutar `npm run lint` y `npm test`.

## Git / Commits

- Commits atómicos y con mensajes claros (prefijo tipo: feat/, fix/, chore/).
- Pull requests: incluir checklist mínimo (tests, lint, descripción de cambios y screenshots si aplica).

## Manejo de secretos

- Nunca commitear claves. Variables en `.env` y configurar en host (Netlify/Vercel).

## Ejemplos de anti-patrones a evitar

- Lógica de negocio en componentes de presentación.
- Acceso directo al cliente de Supabase fuera de `src/services`.

## Revisión y actualización

- Este documento es vivo; actualizar cuando cambie la arquitectura o las herramientas.
