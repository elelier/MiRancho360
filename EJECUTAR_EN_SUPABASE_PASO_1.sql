-- PASO 1: Ejecutar primero (Estado Reproductivo en Animales)
-- Copia y pega este código en Supabase SQL Editor

-- Agregar campo de estado reproductivo a la tabla animales
ALTER TABLE animales 
ADD COLUMN IF NOT EXISTS estado_reproductivo VARCHAR(20) DEFAULT 'disponible' 
CHECK (estado_reproductivo IN (
    'disponible',          -- Disponible para reproducción
    'en_monta',           -- Recién montada, esperando confirmación
    'preñada',            -- Preñez confirmada
    'pre_parto',          -- Próxima a parir (últimas 2 semanas)
    'periodo_reposo',     -- En período de recuperación post-parto
    'no_disponible'       -- No disponible para reproducción
));

-- Agregar campo para fecha del último evento reproductivo
ALTER TABLE animales 
ADD COLUMN IF NOT EXISTS ultima_fecha_reproductiva DATE;

-- Agregar campo para observaciones reproductivas
ALTER TABLE animales 
ADD COLUMN IF NOT EXISTS observaciones_reproductivas TEXT;

-- Actualizar animales existentes con estado por defecto
UPDATE animales 
SET estado_reproductivo = 'disponible' 
WHERE estado_reproductivo IS NULL;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_animales_estado_reproductivo ON animales(estado_reproductivo);
CREATE INDEX IF NOT EXISTS idx_animales_ultima_fecha_reproductiva ON animales(ultima_fecha_reproductiva);

-- Confirmación
SELECT 'PASO 1 COMPLETADO: Estado reproductivo agregado a animales' as status;