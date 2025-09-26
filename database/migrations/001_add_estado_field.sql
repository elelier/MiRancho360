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

-- =====================================================
-- Validación: Verificar que la migración funcionó
-- =====================================================

-- Consulta para verificar la estructura actualizada
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'animales' AND column_name = 'estado';

-- Consulta para verificar los datos migrados
-- SELECT estado, COUNT(*) as cantidad
-- FROM animales 
-- GROUP BY estado;