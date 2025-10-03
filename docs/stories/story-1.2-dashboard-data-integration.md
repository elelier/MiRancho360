# Story 1.2: Integración de Datos Reales en Dashboard

**Epic:** Epic 1 - Dashboard MVP  
**Story ID:** 1.2  
**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Alta  
**Estimación:** 2-3 días

## Objetivo

Conectar el Dashboard con los servicios de Supabase para mostrar datos reales del rancho. Implementar lógica de cálculo para alertas de salud, partos próximos y acciones pendientes.

## Valor para el Usuario

Dashboard funcional que muestra información actualizada y precisa del rancho, no solo datos de ejemplo.

## Referencias

**PRD:**
- FR-1.1: Dashboard con datos reales del rancho
- CA-1.2: Datos actualizados en tiempo real
- NFR-PERF-2: Caché inteligente para reducir llamadas

**Servicios existentes:**
- `src/services/health.ts` (alertas de salud)
- `src/services/reproductive.ts` (gestaciones, partos)
- `src/services/animals.ts` (inventario general)
- `src/hooks/useHealth.ts`, `useReproductive.ts`

## Tareas

1. **Implementar cálculo de alertas de salud:**
   - Obtener animales con tratamientos activos
   - Obtener animales con recordatorios vencidos
   - Sumar total de alertas

2. **Implementar cálculo de partos próximos:**
   - Obtener gestaciones activas
   - Filtrar las que tienen fecha estimada en próximos 7 días
   - Contar cantidad

3. **Implementar cálculo de pendientes:**
   - Obtener recordatorios sin completar
   - Obtener tratamientos por finalizar
   - Sumar total de acciones

4. **Manejo de estados:**
   - Loading mientras carga cada métrica
   - Error si falla alguna llamada
   - Retry automático (1 vez)

5. **Optimización:**
   - Caché de 5 minutos para reducir llamadas
   - Queries paralelas (Promise.all)
   - Evitar re-renders innecesarios

## Criterios de Aceptación

1. **Alertas de Salud:**
   - [ ] Muestra # correcto de animales con alertas
   - [ ] Incluye tratamientos activos
   - [ ] Incluye recordatorios vencidos
   - [ ] Actualiza al navegar de vuelta al dashboard

2. **Partos Próximos:**
   - [ ] Muestra # correcto de partos en próximos 7 días
   - [ ] Fecha estimada se calcula correctamente
   - [ ] Solo cuenta gestaciones activas (no abortadas)

3. **Pendientes:**
   - [ ] Suma recordatorios pendientes + tratamientos activos
   - [ ] Número es correcto y verificable

4. **Performance:**
   - [ ] Carga completa < 2 segundos
   - [ ] Queries se ejecutan en paralelo
   - [ ] Caché funciona (no re-fetch en cada render)

5. **Manejo de errores:**
   - [ ] Muestra mensaje claro si falla
   - [ ] Permite retry manual
   - [ ] No rompe la UI si un dato falla

## Lógica de Cálculo

### Alertas de Salud
```typescript
// Pseudocódigo
const alertas = await Promise.all([
  getTratamientosActivos(), // health.ts
  getRecordatoriosVencidos() // reminders service
]);
const total = alertas[0].length + alertas[1].length;
```

### Partos Próximos
```typescript
// Pseudocódigo
const gestaciones = await getGestacionesActivas();
const proximos = gestaciones.filter(g => {
  const dias = daysBetween(hoy, g.fecha_estimada);
  return dias >= 0 && dias <= 7;
});
const total = proximos.length;
```

### Pendientes
```typescript
// Pseudocódigo
const pendientes = await Promise.all([
  getRecordatoriosPendientes(),
  getTratamientosActivos()
]);
const total = pendientes[0].length + pendientes[1].length;
```

## Validación

**Manual:**
1. Crear datos de prueba en Supabase:
   - 2 animales con tratamientos activos
   - 1 gestación con fecha en 3 días
   - 3 recordatorios sin completar
2. Verificar que Dashboard muestra: Salud=2, Partos=1, Pendientes=4
3. Completar un recordatorio, refrescar, verificar actualización

**Automatizada:**
```bash
npm test -- DashboardPage.test.tsx
# Mockear servicios para verificar lógica
```

## Dependencias

**Bloqueantes:**
- Story 1.1: Dashboard refinado 

**Servicios:**
- health.ts (existe)
- reproductive.ts (existe)
- Posible: reminders.ts (crear si no existe)

## Archivos Afectados

**Modificados:**
- `src/pages/DashboardPage.tsx` (agregar lógica de cálculo)
- `src/hooks/useHealth.ts` (posibles ajustes)
- `src/hooks/useReproductive.ts` (posibles ajustes)

**Posiblemente nuevos:**
- `src/hooks/useDashboardMetrics.ts` (hook custom para métricas)

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Queries lentas | Índices en BD, caché, paralelize |
| Datos faltantes | Valores default (0), mensajes claros |
| Lógica de cálculo incorrecta | Tests unitarios, validación manual |

## Notas

- Priorizar correctitud sobre velocidad extrema
- Si un servicio falla, mostrar "?" en lugar de romper todo
- Documentar lógica de cálculo para futuras referencias

---

**Creado por:** Bob (Scrum Master)  
**Listo para desarrollo:** 
