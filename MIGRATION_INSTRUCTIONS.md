# 🗄️ Instrucciones para Ejecutar la Migración en Supabase

## **Pasos para## **✅ Checklist Post-Migración**
- [x] Ejecutar la migración SQL en Supabase ✅ **COMPLETADO**
- [x] Verificar que la estructura esté correcta ✅ **COMPLETADO**
  - Campo `estado` creado: `character varying`, no nulo, default 'Activo'
  - 5 animales migrados correctamente con estado 'Activo'
- [ ] Probar la aplicación React para confirmar que funciona
- [ ] Verificar que se puedan crear y editar animales con el nuevo campo

### **📊 Resultados de la Migración:**
- ✅ Campo `estado` creado correctamente
- ✅ 5 animales existentes migrados con estado 'Activo'
- ✅ Datos consistentes entre campos `estado` y `activo`
- ✅ Servidor de desarrollo ejecutándose en http://localhost:5173/gar el Campo 'Estado' a la Tabla Animales**

### **1. Abrir la Consola SQL de Supabase**
1. Ve a tu proyecto Supabase: https://supabase.com/dashboard/project/oirfbtelgohkuqbsnleo
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Crea una nueva consulta haciendo clic en **"New Query"**

### **2. Ejecutar la Migración**
Copia y pega el siguiente código SQL en el editor:

```sql
-- =====================================================
-- Migration: Agregar campo 'estado' a la tabla animales
-- Fecha: 25 de septiembre de 2025
-- Descripción: Implementa US-1.1 - Campo de estado para animales
-- =====================================================

-- 1. Agregar la columna 'estado' a la tabla animales
ALTER TABLE animales 
ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'Activo' 
CHECK (estado IN ('Activo', 'Vendido', 'Muerto'));

-- 2. Actualizar animales existentes basándose en el campo 'activo'
-- Los animales inactivos se marcan como 'Vendido' por defecto
UPDATE animales 
SET estado = CASE 
    WHEN activo = true THEN 'Activo'
    ELSE 'Vendido'
END;

-- 3. Crear índice para mejorar las consultas por estado
CREATE INDEX idx_animales_estado ON animales(estado);

-- 4. Agregar comentarios para documentación
COMMENT ON COLUMN animales.estado IS 'Estado actual del animal: Activo (en el rancho), Vendido (ya no está), Muerto (fallecido)';
```

### **3. Verificar la Migración**
Después de ejecutar la migración, verifica que todo esté correcto con estas consultas:

```sql
-- Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'animales' AND column_name = 'estado';

-- Verificar los datos migrados
SELECT estado, COUNT(*) as cantidad
FROM animales 
GROUP BY estado;

-- Ver algunos registros de ejemplo
SELECT id, arete, nombre, sexo, estado, activo
FROM animales
LIMIT 5;
```

### **4. Resultado Esperado**
Después de la migración deberías ver:
- ✅ Nueva columna `estado` en la tabla `animales`
- ✅ Todos los animales existentes con estado 'Activo' o 'Vendido'
- ✅ Índice creado para optimizar consultas por estado
- ✅ Check constraint para validar solo valores permitidos

### **5. Rollback (En caso de problemas)**
Si algo sale mal, puedes revertir la migración:

```sql
-- SOLO EJECUTAR SI HAY PROBLEMAS
DROP INDEX IF EXISTS idx_animales_estado;
ALTER TABLE animales DROP COLUMN IF EXISTS estado;
```

---

## **✅ Checklist Post-Migración**
- [x] Ejecutar la migración SQL en Supabase
- [x] Verificar que la estructura esté correcta
- [ ] Probar la aplicación React para confirmar que funciona
- [ ] Verificar que se puedan crear y editar animales con el nuevo campo

---

**¡Una vez ejecutado, el formulario de animales ya tendrá funcionalidad completa para el campo Estado!** 🐄