# Requisitos funcionales (FR)

FR-1 Dashboard resumido
- FR-1.1 Mostrar tarjetas: Salud (alertas), Partos próximos/recientes, Pendientes/Acciones.
- FR-1.2 Cada tarjeta permite acción rápida (CTA) y navegación a detalle.

FR-2 Onboarding guiado
- FR-2.1 Detectar primer inicio y ofrecer tour de 3–5 pasos.
- FR-2.2 Pasos sugeridos: registrar primer animal, ver alertas, abrir inventario.

FR-3 Inventario básico
- FR-3.1 CRUD para items: tipo (paca/alimento/medicina), cantidad, unidad, fecha, notas.
- FR-3.2 Registrar consumo y ajustar saldo automáticamente.
- FR-3.3 Sincronizar con Supabase y manejar conflictos simples (last-write-wins con auditoría).

FR-4 Reportes exportables
- FR-4.1 Permitirá exportar historial de salud y movimientos por rango de fechas a PDF y Excel.
- FR-4.2 Exportación configurable: campos a incluir y rango de fechas.

FR-5 Accesibilidad y UX
- FR-5.1 Botones grandes, tipografía legible, contrastes altos.
- FR-5.2 Soporte básico para navegación por teclado/tamaño de fuente ajustable.

FR-6 Integración y seguridad
- FR-6.1 Autenticación por PIN (ya existente). Reusar mecanismo de `src/services/auth.ts`.
- FR-6.2 Permisos: solo Admin puede modificar inventario; colaboradores registro limitado.
