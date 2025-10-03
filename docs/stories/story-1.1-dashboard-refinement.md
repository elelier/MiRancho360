# Story 1.1: Refinar Dashboard MVP

**Epic:** Epic 1 - Dashboard MVP  
**Story ID:** 1.1  
**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Crítica  
**Estimación:** 2-3 días

## Objetivo

Refinar `DashboardPage.tsx` para cumplir con CA-1: mostrar claramente las tres áreas clave (Salud, Partos, Pendientes) usando los nuevos componentes accesibles de Epic 5.1.

## Valor para el Usuario

Dashboard limpio y funcional que muestra información crítica del rancho de un vistazo:
- **Salud:** Cuántos animales tienen alertas
- **Partos:** Próximos partos (7 días)
- **Pendientes:** Acciones que requieren atención

## Referencias

**PRD:**
- FR-1.1: Dashboard con tres áreas clave
- CA-1: Las tres áreas visibles sin scroll en móvil
- NFR-PERF-1: Carga < 2 segundos

**Código base:**
- `src/pages/DashboardPage.tsx` (281 líneas, ya existe)
- `src/hooks/useMovements.ts` (obtiene datos de movimientos)
- `src/hooks/useRancho.ts` (estadísticas del rancho)

## Tareas

1. **Reemplazar estructura HTML con componentes:**
   - Usar `<Card>` para las tres áreas principales
   - Usar `<LargeButton>` para acciones principales
   - Mantener hero section (bienvenida)

2. **Integrar datos reales:**
   - Conectar con hooks existentes
   - Calcular alertas de salud (from health service)
   - Calcular partos próximos (from reproductive service)
   - Calcular pendientes (from movements/reminders)

3. **Layout responsive:**
   - Mobile: stack vertical de cards
   - Desktop: grid de 3 columnas
   - Hero siempre arriba

4. **Navegación:**
   - Cards clickables que naveguen a secciones relevantes
   - Botones de acción con iconos claros

5. **Loading y error states:**
   - Skeleton mientras carga
   - Mensaje de error si falla

## Criterios de Aceptación

1. **Tres áreas visibles:**
   - [ ] Card de Salud muestra # de alertas
   - [ ] Card de Partos muestra # próximos (7 días)
   - [ ] Card de Pendientes muestra # de acciones
   - [ ] Las tres caben en viewport móvil sin scroll

2. **Interactividad:**
   - [ ] Click en card de Salud  navega a /health
   - [ ] Click en card de Partos  navega a /reproductive
   - [ ] Click en card de Pendientes  navega a /reminders

3. **Performance:**
   - [ ] Carga inicial < 2 segundos
   - [ ] Sin re-renders innecesarios

4. **Accesibilidad:**
   - [ ] Lighthouse accessibility  90
   - [ ] Navegación por teclado funciona
   - [ ] Cards son navegables (role="button")

## Diseño Visual

```

   Bienvenido, [Usuario]          
  Rancho San José                   



   Salud                          
                                    
       3                            
  Animales con alertas              



   Partos Próximos                
                                    
       2                            
  En los próximos 7 días            



   Pendientes                     
                                    
       5                            
  Acciones por realizar             

```

## Validación

**Manual:**
- Verificar en móvil 375px
- Verificar en desktop 1024px+
- Click en cada card
- Verificar datos reales

**Automatizada:**
```bash
npm run dev
npm run lighthouse
npm test -- DashboardPage.test.tsx
```

## Dependencias

**Bloqueantes:**
- Story 5.1.A: LargeButton 
- Story 5.1.B: Card 

## Archivos Afectados

**Modificados:**
- `src/pages/DashboardPage.tsx` (refactor completo)

**Posiblemente nuevos:**
- `src/pages/__tests__/DashboardPage.test.tsx`

## Notas

- Mantener simplicidad: solo info crítica
- No agregar features no solicitadas
- Si un dato no existe, mostrar "0" o placeholder claro

---

**Creado por:** Bob (Scrum Master)  
**Listo para desarrollo:** 
