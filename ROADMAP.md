# MiRancho360 - Roadmap de Desarrollo

## Estado actual (Oct 2025)
- Supabase en produccion con schema migrado, datos sembrados y monitoreo activo (ver captura adjunta en Supabase Dashboard).
- Modulo de animales operativo con modal-route, hooks y servicios conectados; pestana de salud consumiendo datos reales.
- Dashboard principal y autenticacion por PIN desplegados en ambiente productivo.

## Frente de trabajo inmediato
1. Pestana Salud del perfil: ajustes de UI, refresco optimista tras crear eventos y timeline mejorado.
2. Pestana Reproduccion: conectar hooks reales y finalizar interacciones.
3. Modulo Sitios: implementar vistas y formularios apoyados en los servicios existentes.
4. Auditoria de RLS en Supabase: revisar tablas marcadas como publicas sin politicas y corregirlas.

## Entregables completados
- Infraestructura React + Vite + Tailwind + TypeScript.
- Hooks y servicios CRUD para animales, observaciones, recordatorios, reproductivo y salud.
- Sistema de diseno mobile-first con componentes base reutilizables.
- Scripts de bootstrap de base de datos (`scripts/setup-database.js` y migraciones en `database/migrations`).
- Documentacion funcional por modulo (`MODAL_ROUTE_IMPLEMENTATION.md`, `OBSERVACIONES_SYSTEM.md`, `GUIA_TESTING_PERFIL_ANIMAL.md`).

## Proximos hitos
- Cerrar UI de salud (timeline, costos, acciones rapidas) e instrumentar pruebas manuales guiadas.
- Habilitar reportes basicos (exportaciones) una vez que salud y reproduccion esten estables.
- Construir vistas de Sitios con conteos en vivo y flujo para mover animales.
- Preparar Sprint Finanzas: definir modelo de datos y endpoints necesarios.

## Seguimiento y testing
- Ejecutar `npm run build` antes de cada release para asegurar tipados y bundler.
- Validar escenarios descritos en `TESTING_CHECKLIST.md` y casos especificos en `GUIA_TESTING_PERFIL_ANIMAL.md`.
- Revisar panel de Supabase (seguridad y rendimiento) para mantener politicas RLS activas.

## Comunicacion
- Cambios mayores: documentar en el repo (carpeta docs) y actualizar diariamente el estado de cada frente.
- Deploys: notificar en el canal interno incluyendo hash de commit y resultado de build.

