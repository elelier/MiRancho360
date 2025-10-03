# Epic 3: Inventario Básico

**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Alta (MVP - Fase 2)

## Objetivo de la Épica

Implementar un sistema completo de gestión de inventario para el rancho que permita registrar, consumir y rastrear items como pacas, alimento y medicinas. El sistema debe sincronizarse con Supabase y manejar operaciones offline básicas con reintentos automáticos.

## Contexto del Negocio

**Problema que resuelve:**  
Actualmente no existe funcionalidad para rastrear el inventario del rancho, lo que dificulta la planificación de compras y el control de consumos. Los administradores necesitan saber cuánto tienen de cada recurso y cuándo reabastecerse.

**Valor para el usuario:**
- Control preciso de recursos (pacas, alimento, medicinas)
- Alertas de bajo inventario
- Historial de consumos para tomar decisiones de compra
- Reducción de desperdicios y mejor planificación
- Una sola fuente de verdad sincronizada

## Contexto Técnico

**Nuevos componentes a crear:**
- `database/migrations/00xx_add_inventory_table.sql` (migración DB)
- `src/services/inventory.ts` (servicio CRUD)
- `src/hooks/useInventory.ts` (hook para gestión de estado)
- `src/types/inventory.ts` (tipos TypeScript)
- `src/pages/InventoryPage.tsx` (UI principal)
- `src/components/inventory/` (componentes específicos)

**Stack técnico:**
- Supabase (Postgres) para almacenamiento
- Manejo offline con cola local + reintentos
- Considerar: IndexedDB (idb-keyval) o TanStack Query persist

## Requisitos Funcionales (del PRD)

**FR-3: Inventario básico**
- FR-3.1: CRUD para items: tipo (paca/alimento/medicina), cantidad, unidad, fecha, notas
- FR-3.2: Registrar consumo y ajustar saldo automáticamente
- FR-3.3: Sincronizar con Supabase y manejar conflictos simples (last-write-wins con auditoría)

**FR-6: Integración y seguridad** (aplicable)
- FR-6.2: Permisos: solo Admin puede modificar inventario; colaboradores registro limitado

## Criterios de Aceptación

**CA-3 (FR-3):**
- Crear item de inventario exitosamente
- Verificar saldo actualizado tras 3 operaciones consecutivas:
  1. Creación (ej: 100 pacas)
  2. Consumo (ej: -20 pacas, saldo = 80)
  3. Ajuste (ej: +10 pacas, saldo = 90)
- Operaciones persisten en Supabase
- Conflictos se resuelven con last-write-wins y auditoría

**CA-6 (FR-6):**
- Usuarios sin rol Admin no pueden crear/editar items
- Respuesta 403 de API o UI deshabilitada

## Requisitos No Funcionales

- **NFR-REL-1:** Modo offline básico con reintento automático
- **NFR-MNT-1:** Tests unitarios con cobertura  60%
- **NFR-SEC-1:** No exponer datos sensibles en logs

## Modelo de Datos

### Tabla `inventory`

```sql
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN (''paca'', ''alimento'', ''medicina'', ''otro'')),
  name text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity >= 0),
  unit text NOT NULL, -- ''unidad'', ''kg'', ''litro'', etc.
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_inventory_type ON inventory(type);
CREATE INDEX idx_inventory_created_at ON inventory(created_at);
CREATE INDEX idx_inventory_created_by ON inventory(created_by);

-- RLS Policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Admin puede todo
CREATE POLICY inventory_admin_all ON inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = ''admin''
    )
  );

-- Colaboradores solo lectura
CREATE POLICY inventory_read_all ON inventory
  FOR SELECT USING (true);
```

### Tabla `inventory_history` (auditoría)

```sql
CREATE TABLE inventory_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES inventory(id) ON DELETE CASCADE,
  operation text NOT NULL, -- ''create'', ''update'', ''consume'', ''adjust''
  quantity_before numeric,
  quantity_after numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_inventory_history_inventory_id ON inventory_history(inventory_id);
CREATE INDEX idx_inventory_history_created_at ON inventory_history(created_at);
```

## Historias de Usuario

### Story 3.1: Añadir migración DB + tipos
**Como** desarrollador  
**Quiero** tener las tablas de inventario creadas en Supabase  
**Para** poder implementar la lógica de negocio

**Tareas técnicas:**
- [ ] Crear `database/migrations/00xx_add_inventory_table.sql`
- [ ] Incluir tabla `inventory` con columnas especificadas
- [ ] Incluir tabla `inventory_history` para auditoría
- [ ] Crear índices para optimización
- [ ] Configurar RLS policies (Admin: all, otros: read-only)
- [ ] Crear `src/types/inventory.ts`:
  ```typescript
  export type InventoryItem = {
    id: string;
    type: ''paca'' | ''alimento'' | ''medicina'' | ''otro'';
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
  };

  export type InventoryOperation = {
    id: string;
    inventory_id: string;
    operation: ''create'' | ''update'' | ''consume'' | ''adjust'';
    quantity_before?: number;
    quantity_after: number;
    notes?: string;
    created_at: string;
    created_by: string;
  };
  ```
- [ ] Ejecutar migración en staging/dev
- [ ] Verificar políticas RLS funcionan correctamente

**Verificación:**
- Migración ejecuta sin errores
- Políticas RLS bloquean correctamente según rol
- Tipos TypeScript compilan sin errores

### Story 3.2: Implementar servicio y hook + UI CRUD
**Como** administrador del rancho  
**Quiero** registrar, editar y eliminar items del inventario  
**Para** mantener un control actualizado de mis recursos

**Tareas técnicas:**
- [ ] Crear `src/services/inventory.ts`:
  - `listInventory(): Promise<InventoryItem[]>`
  - `getInventoryItem(id): Promise<InventoryItem>`
  - `createInventoryItem(item): Promise<InventoryItem>`
  - `updateInventoryItem(id, updates): Promise<InventoryItem>`
  - `deleteInventoryItem(id): Promise<void>`
  - `consumeInventory(id, quantity, notes?): Promise<InventoryItem>`
  - `adjustInventory(id, quantity, notes?): Promise<InventoryItem>`
  - Registrar operaciones en `inventory_history`
- [ ] Crear `src/hooks/useInventory.ts`:
  ```typescript
  export function useInventory() {
    return {
      items: InventoryItem[],
      isLoading: boolean,
      error: Error | null,
      refresh: () => void,
      createItem: (item) => Promise<void>,
      updateItem: (id, updates) => Promise<void>,
      deleteItem: (id) => Promise<void>,
      consume: (id, quantity, notes?) => Promise<void>,
      adjust: (id, quantity, notes?) => Promise<void>
    };
  }
  ```
- [ ] Crear `src/pages/InventoryPage.tsx`:
  - Lista de items (tabla/cards)
  - Botón "+ Nuevo Item" (solo Admin)
  - Filtros por tipo
  - Búsqueda por nombre
- [ ] Crear componentes:
  - `src/components/inventory/InventoryForm.tsx` (crear/editar)
  - `src/components/inventory/InventoryCard.tsx` (vista item)
  - `src/components/inventory/ConsumeModal.tsx` (registrar consumo)
- [ ] Implementar validaciones:
  - Cantidad > 0
  - Nombre requerido
  - Tipo válido
- [ ] Tests unitarios de servicio y hook

**Validación CA-3:**
- Crear item con 100 pacas  saldo = 100
- Consumir 20 pacas  saldo = 80
- Ajustar +10 pacas  saldo = 90
- Verificar en Supabase que datos persisten

### Story 3.3: Sync offline y manejo de conflictos
**Como** usuario de la aplicación  
**Quiero** que mis cambios se guarden incluso sin conexión  
**Para** no perder información en el campo

**Tareas técnicas:**
- [ ] Implementar cola de operaciones pendientes (localStorage o IndexedDB)
- [ ] Detectar estado offline/online (navigator.onLine + eventos)
- [ ] Al recuperar conexión, procesar cola:
  - Enviar operaciones a Supabase
  - Marcar como sincronizadas
  - Eliminar de cola
- [ ] Manejo de conflictos (last-write-wins):
  - Si falla sincronización, registrar en audit log
  - Notificar al usuario si hay conflictos
  - Opción de reintento manual
- [ ] Indicador visual de estado sync:
  -  Sincronizado
  -  Sincronizando
  -  Pendiente de sync
  -  Error de sync
- [ ] Tests de escenarios offline:
  - Crear item offline  sync automático online
  - Múltiples operaciones offline  sync en orden
  - Conflicto de actualización  resolución automática

**Consideraciones:**
- Usar optimistic updates para mejor UX
- Queue simple con timestamps para orden
- Límite de reintentos (3-5 intentos)
- Mostrar operaciones pendientes en UI

## Dependencias

**Precedentes:**
- Sistema de autenticación y roles debe estar funcional
- `src/services/auth.ts` debe proveer información de rol del usuario

**Bloqueantes:**
- Acceso a Supabase configurado

**Relacionadas:**
- Epic 2 (Onboarding): paso opcional de inventario en tour
- Epic 4 (Reportes): inventario podría incluirse en reportes futuros

## Estimación y Esfuerzo

- **Story 3.1:** 2-3 días (migración, tipos, tests)
- **Story 3.2:** 4-5 días (servicio, hook, UI, CRUD completo)
- **Story 3.3:** 3-4 días (offline, sync, manejo de conflictos)
- **Total estimado:** 9-12 días de desarrollo

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Conflictos de sincronización complejos | Media | Alto | Last-write-wins simple, auditoría completa, documentar casos edge |
| Performance con inventario grande (1000+ items) | Media | Medio | Paginación, búsqueda optimizada, índices DB |
| Pérdida de datos en cola offline | Baja | Alto | Persistir cola en IndexedDB (no localStorage), backups |
| Usuarios no Admin intentan modificar | Baja | Medio | Validación en backend (RLS), UI deshabilitada claramente |

## Definición de Hecho (DoD)

- [ ] Todas las historias completadas y revisadas
- [ ] CA-3 verificado (3 operaciones consecutivas)
- [ ] CA-6 verificado (permisos por rol)
- [ ] Migración ejecutada en staging y producción
- [ ] Tests unitarios con cobertura  60%
- [ ] Tests de integración con Supabase (mock o staging)
- [ ] Manejo offline funciona correctamente
- [ ] Documentación actualizada (API, uso)
- [ ] Sin regresiones en funcionalidad existente

## UI/UX Consideraciones

**InventoryPage layout:**
```

 [ Volver]  Inventario    [+ Nuevo]   Solo Admin ve botón

 Filtros: [Todos ] [Buscar...]      

  
   Pacas de Alfalfa              
  Cantidad: 85 unidades            
  [Consumir] [Ajustar] [Editar]      Permisos aplicados
  
  
   Alimento para Ganado (Bajo)   
  Cantidad: 15 kg                  
  [Consumir] [Ajustar] [Editar]    
  


[Estado sync:  Sincronizado]
```

**Accesibilidad:**
- Botones  44x44 px
- Contraste alto para alertas de bajo inventario
- Navegación por teclado completa
- Screen reader friendly

## Referencias

- **PRD:** `docs/prd/PRD.md`
- **Requisitos Funcionales:** `docs/prd/requisitos-funcionales-fr.md`
- **Criterios de Aceptación:** `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md`
- **Data Model:** `docs/prd/data-model-migracin.md`
- **Arquitectura:** `docs/architecture/architecture.md`
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`

## Notas Adicionales

- Priorizar funcionalidad sobre complejidad en MVP
- Considerar alertas de bajo inventario (threshold configurable) en fase posterior
- Integración con sistema de compras puede ser fase futura
- Reportes de inventario se cubrirán en Epic 4
