-- Migración: Agregar campo foto_url a la tabla animales
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna foto_url
ALTER TABLE animales 
ADD COLUMN foto_url TEXT;

-- 2. Agregar comentario
COMMENT ON COLUMN animales.foto_url IS 'URL de la foto del animal almacenada en Supabase Storage';

-- 3. Crear índice para optimizar consultas
CREATE INDEX idx_animales_foto_url ON animales(foto_url) WHERE foto_url IS NOT NULL;

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'animales' AND column_name = 'foto_url';