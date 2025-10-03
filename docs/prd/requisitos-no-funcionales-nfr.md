# Requisitos no funcionales (NFR)

- NFR-SEC-1 Seguridad: No exponer PII en exportaciones por defecto. Revisar campos exportables; solicitar confirmación del usuario antes de exportar datos personales.
- NFR-PERF-1 Rendimiento: API para Dashboard debe responder < 200ms para los endpoints críticos bajo condiciones normales (p50).
- NFR-REL-1 Disponibilidad: aplicación móvil debe manejar fallos de red — modo offline básico para inventario con reintento automático.
- NFR-MNT-1 Mantenibilidad: código TypeScript con tests unitarios (objetivo mínimo: cobertura 60% en lógica nueva); servicios documentados.
- NFR-ACC-1 Accesibilidad: Contraste WCAG AA para texto principal y controles táctiles ≥ 44x44 px.
