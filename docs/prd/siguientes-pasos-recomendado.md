# Siguientes pasos (recomendado)

1. Hacer un spike de 1 día para validar visuales y accesibilidad en la `DashboardPage` existente: generar snapshots/visual check y ajustar tamaños/contrastes.
2. Crear PR de refinamiento del Dashboard (1–2 días) que adapte el layout actual a CA-1 y reuses `useMovements` / `useRancho`.
3. Implementar `useOnboarding` y `OnboardingPage.tsx` (Spike 2 días).
4. Añadir migración `inventory` y `src/services/inventory.ts` + `useInventory` (Spike 2–3 días).
5. Investigar y decidir enfoque para export (cliente vs serverless) e implementar `src/services/export.ts` (Spike 1 día para decisión, 2–3 días para implementación básica).
6. Ejecutar pruebas de usabilidad con 3 usuarios objetivo y priorizar ajustes.

---