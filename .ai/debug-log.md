# Debug Log

- 2025-10-02T18:53Z: Created LargeButton component with accessible variants and states.
- 2025-10-02T18:54Z: Added Vitest configuration plus unit coverage for icon positions and loading.
- 2025-10-02T18:55Z: Documented LargeButton usage and updated barrel export.
- 2025-10-02T18:57Z: Ran TypeScript no-emit check and Vite build; no type errors.
- 2025-10-02T18:58Z: Executed npm run lint; existing react-refresh and hooks warnings persist outside scope.
- 2025-10-02T18:59Z: Captured Lighthouse accessibility audit (score 0.77) at .ai/lighthouse-accessibility.json; contrast and meta viewport issues noted.
- 2025-10-02T18:59Z: Cross-browser/mobile checks deferred pending device/browser access.
- 2025-10-02T19:20Z: Refactored auth hooks context/provider split and memoized useRancho loaders to satisfy react-refresh and exhaustive-deps lint rules.
- 2025-10-02T19:24Z: Tuned Tailwind primary/accent palette and meta viewport; Lighthouse accessibility now 1.00 (report refreshed).
- 2025-10-02T19:23Z: Verified npm run lint and npx tsc --noEmit now pass cleanly.
- 2025-10-02T19:35Z: Switched PIN auth to Supabase usuarios table with hash migration and updated LargeButton theme tests.
- 2025-10-02T19:45Z: Removed hard-coded credentials; login now hashes PIN with VITE_PIN_SALT and queries Supabase-only.
- 2025-10-02T19:55Z: Added LargeButton showcase route (/demo/large-button) with full variant demo and coverage ignore tweaks.
