# MiRancho360

MiRancho360 es una webapp mobile-first para la administracion integral de ranchos familiares. El objetivo es entregar una experiencia simple para usuarios adultos mayores, manteniendo datos sincronizados en Supabase.

## Caracteristicas clave
- Autenticacion con PIN de 4 digitos respaldada por Supabase Auth.
- Gestion completa de animales: registro, perfil modal-route, historial de salud y reproduccion.
- Gestion de sitios y movimientos con trazabilidad.
- Sistema de observaciones y recordatorios de salud conectados a la base de datos real.
- UI mobile-first con Tailwind y componentes accesibles.

## Estado actual
- Supabase en produccion: schema migrado, datos iniciales cargados y llamadas en tiempo real habilitadas.
- Modulo de salud consumiendo datos reales (faltan ajustes visuales menores).
- Rutas anidadas para preservar estado en listas.
- Scripts de inicializacion listos (`scripts/setup-database.js`).

## Stack tecnico
- Frontend: React 19, TypeScript, Vite, TailwindCSS.
- Backend: Supabase (PostgreSQL, Auth, Storage).
- Infraestructura: Netlify/Vercel para deploy, GitHub Actions para CI.

## Desarrollo local
1. Requisitos: Node.js 18+, cuenta Supabase con proyecto configurado.
2. Clonar y preparar:
   ```bash
   npm install
   cp .env.example .env
   ```
3. Actualizar `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de tu proyecto (ya usamos credenciales reales en los ambientes activos).
4. Ejecutar migraciones iniciales si es necesario:
   ```bash
   node scripts/setup-database.js
   ```
5. Correr en desarrollo:
   ```bash
   npm run dev
   ```

## Testing manual recomendado
- Revisar checklist en `TESTING_CHECKLIST.md` y guias especificas por feature.
- Ejecutar `npm run build` para validar que la configuracion de TypeScript y Vite se mantiene estable.

## Documentacion adicional
- `ROADMAP.md`: prioridades, sprints activos y backlog.
- `PRODUCT_DEFINITION.md`: alcance funcional por modulo.
- `MODAL_ROUTE_IMPLEMENTATION.md`: detalles del patron modal-route.
- `OBSERVACIONES_SYSTEM.md`: arquitectura del sistema de observaciones.

## Licencia
MIT.
