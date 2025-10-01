# 📝 Sistema de Observaciones - Documentación

## 🎯 Descripción General

Sistema completo para registrar y visualizar el historial de observaciones de los animales. Permite a los usuarios documentar notas categorizadas por tipo (salud, comportamiento, reproducción, nutrición, general) con fecha y seguimiento completo.

---

## 📦 Componentes del Sistema

### 1. **Base de Datos**
**Archivo**: `database/migrations/006_observaciones_system.sql`

**Tabla**: `observaciones`
```sql
Campos:
- id: UUID (Primary Key)
- animal_id: UUID (Foreign Key a animales)
- usuario_id: UUID (Foreign Key a usuarios)  
- fecha: TIMESTAMPTZ (Fecha de la observación)
- observacion: TEXT (Contenido de la observación)
- tipo: VARCHAR(50) (general, salud, comportamiento, reproduccion, nutricion)
- created_at: TIMESTAMPTZ (Fecha de registro)
- updated_at: TIMESTAMPTZ (Última actualización)
```

**Políticas RLS (Row Level Security)**:
- ✅ SELECT: Todos los usuarios pueden ver todas las observaciones
- ✅ INSERT: Todos los usuarios pueden crear observaciones
- ✅ UPDATE: Los usuarios pueden actualizar solo sus propias observaciones
- ✅ DELETE: Solo administradores pueden eliminar observaciones

**Triggers**:
- `update_observaciones_updated_at`: Actualiza automáticamente el campo `updated_at`

**Índices**:
- `idx_observaciones_animal_id`: Búsqueda por animal
- `idx_observaciones_fecha`: Ordenamiento por fecha
- `idx_observaciones_tipo`: Filtrado por tipo
- `idx_observaciones_usuario`: Búsqueda por usuario

---

### 2. **Tipos TypeScript**
**Archivo**: `src/types/observaciones.ts`

```typescript
interface Observacion {
  id: string;
  animal_id: string;
  usuario_id: string;
  fecha: string;
  observacion: string;
  tipo: 'general' | 'salud' | 'comportamiento' | 'reproduccion' | 'nutricion';
  created_at: string;
  updated_at?: string;
  usuario?: { id: string; nombre: string };
}

interface ObservacionFormData {
  observacion: string;
  tipo: 'general' | 'salud' | 'comportamiento' | 'reproduccion' | 'nutricion';
  fecha?: string;
}
```

---

### 3. **Servicio API**
**Archivo**: `src/services/observaciones.ts`

**Métodos disponibles**:
- `getObservacionesByAnimal(animalId)`: Obtener todas las observaciones de un animal
- `getObservaciones(filters?)`: Obtener observaciones con filtros opcionales
- `createObservacion(animalId, data, usuarioId)`: Crear nueva observación
- `updateObservacion(id, data)`: Actualizar observación existente
- `deleteObservacion(id)`: Eliminar observación (solo admin)
- `getObservacionesStats(animalId)`: Obtener estadísticas por animal

---

### 4. **Hooks Personalizados**
**Archivo**: `src/hooks/useObservaciones.ts`

**Hook 1**: `useObservaciones(filters?)`
- Manejo completo de observaciones con filtros
- Métodos: createObservacion, updateObservacion, deleteObservacion, reload

**Hook 2**: `useAnimalObservaciones(animalId)`
- Específico para observaciones de un animal
- Carga automática al cambiar el ID del animal

---

### 5. **Componente Modal**
**Archivo**: `src/components/animals/AddObservacionModal.tsx`

**Características**:
- Selección visual de tipo de observación (5 tipos con iconos y colores)
- Campo de fecha (por defecto: hoy)
- Textarea para observación
- Validación en tiempo real
- Estados de loading y error
- Diseño mobile-first con animaciones

---

### 6. **Integración en Perfil**
**Archivo**: `src/pages/AnimalProfilePage.tsx`

**Nuevas funcionalidades**:
1. **Genealogía Clickeable**: Enlaces a perfiles de padre/madre
2. **Recordatorios Pendientes**: Muestra recordatorios del animal actual
3. **Historial de Observaciones**: Timeline completo con tipos y colores
4. **Botón "Agregar Observación"**: Abre modal para nueva observación
5. **Badge de contador**: Muestra cantidad de observaciones

---

## 🚀 Instrucciones de Instalación

### PASO 1: Ejecutar Migración en Supabase

1. Ir a Supabase Dashboard
2. Seleccionar tu proyecto
3. Ir a **SQL Editor**
4. Copiar y pegar el contenido de `database/migrations/006_observaciones_system.sql`
5. Ejecutar (Run)
6. Verificar que aparezca: **"✅ Tabla observaciones creada exitosamente"**

### PASO 2: Verificar Instalación

Ejecutar en SQL Editor:
```sql
SELECT 
    COUNT(*) as total_observaciones,
    COUNT(DISTINCT animal_id) as animales_con_observaciones,
    COUNT(DISTINCT tipo) as tipos_diferentes
FROM observaciones;
```

### PASO 3: Build del Proyecto

```bash
npm run build
```

---

## 📱 Uso del Sistema

### Para Usuarios:

1. **Ver Observaciones**:
   - Ir al perfil de un animal
   - Tab "Resumen"
   - Scroll hasta "Historial de Observaciones"

2. **Agregar Observación**:
   - Click en "Agregar" o "Agregar primera observación"
   - Seleccionar tipo (General, Salud, Comportamiento, etc.)
   - Elegir fecha
   - Escribir observación
   - Click en "Guardar Observación"

3. **Navegar Genealogía**:
   - En la sección "Genealogía"
   - Click en el nombre del padre o madre
   - Navega al perfil de ese animal

4. **Ver Recordatorios**:
   - Automáticamente visible si hay recordatorios pendientes
   - Muestra fecha y descripción

---

## 🎨 Tipos de Observación y Colores

| Tipo | Color | Icono | Uso |
|------|-------|-------|-----|
| **General** | Gris | 📝 notes | Notas generales, observaciones diarias |
| **Salud** | Rojo | ❤️ heart | Vacunas, tratamientos, síntomas |
| **Comportamiento** | Morado | ✨ sparkles | Actitud, temperamento, socialización |
| **Reproducción** | Rosa | 💗 heart | Montas, preñez, partos |
| **Nutrición** | Verde | 🧪 beaker | Alimentación, suplementos, peso |

---

## 🔒 Seguridad (RLS Policies)

| Acción | Quién puede hacerlo | Restricción |
|--------|---------------------|-------------|
| **Ver** | Todos los usuarios | Sin restricciones |
| **Crear** | Todos los usuarios | Sin restricciones |
| **Editar** | Todos los usuarios | Solo sus propias observaciones |
| **Eliminar** | Solo administradores | Requiere rol='administrador' |

---

## 📊 Estadísticas y Reportes

El servicio incluye `getObservacionesStats()` que retorna:
- Total de observaciones
- Observaciones por tipo
- Fecha de última observación

Ejemplo de uso:
```typescript
const stats = await observacionesService.getObservacionesStats(animalId);
console.log(`Total: ${stats.total}`);
console.log(`Salud: ${stats.por_tipo.salud}`);
```

---

## 🐛 Troubleshooting

### Error: "No se puede crear la observación"
- **Causa**: Usuario no autenticado o animalId inválido
- **Solución**: Verificar que `useAuth()` retorna un usuario válido

### Error: "Error al obtener observaciones"
- **Causa**: Políticas RLS no configuradas correctamente
- **Solución**: Reejecutar el script SQL de migración

### Observaciones no aparecen
- **Causa**: Filtro de animal_id incorrecto
- **Solución**: Verificar que el ID del animal es válido

---

## 📝 Próximas Mejoras

- [ ] Editar observaciones existentes
- [ ] Filtrar observaciones por tipo
- [ ] Exportar historial a PDF
- [ ] Adjuntar fotos a observaciones
- [ ] Notificaciones de nuevas observaciones
- [ ] Búsqueda en observaciones

---

## 👥 Créditos

Sistema desarrollado para MiRancho360  
Versión: 1.0.0  
Fecha: Septiembre 2025
