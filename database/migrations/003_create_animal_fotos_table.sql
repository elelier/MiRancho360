-- Migración: Crear tabla para álbum de fotos de animales
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla animal_fotos
CREATE TABLE animal_fotos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    foto_url TEXT NOT NULL,
    descripcion TEXT,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INTEGER DEFAULT 0,
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_subida UUID NOT NULL REFERENCES usuarios(id),
    
    -- Constraints
    CONSTRAINT valid_url CHECK (foto_url <> ''),
    CONSTRAINT valid_orden CHECK (orden >= 0)
);

-- 2. Índices para optimizar consultas
CREATE INDEX idx_animal_fotos_animal_id ON animal_fotos(animal_id);
CREATE INDEX idx_animal_fotos_principal ON animal_fotos(animal_id, es_principal) WHERE es_principal = TRUE;
CREATE INDEX idx_animal_fotos_orden ON animal_fotos(animal_id, orden);

-- 3. Trigger para asegurar solo UNA foto principal por animal
CREATE OR REPLACE FUNCTION ensure_single_principal_photo()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se marca como principal, quitar principal de las demás
    IF NEW.es_principal = TRUE THEN
        UPDATE animal_fotos 
        SET es_principal = FALSE 
        WHERE animal_id = NEW.animal_id AND id != NEW.id;
    END IF;
    
    -- Si se elimina la foto principal, marcar la primera como principal
    IF TG_OP = 'DELETE' AND OLD.es_principal = TRUE THEN
        UPDATE animal_fotos 
        SET es_principal = TRUE 
        WHERE id = (
            SELECT id 
            FROM animal_fotos 
            WHERE animal_id = OLD.animal_id 
            ORDER BY orden ASC, fecha_subida ASC 
            LIMIT 1
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_principal
    AFTER INSERT OR UPDATE OR DELETE ON animal_fotos
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_principal_photo();

-- 4. RLS Policies
ALTER TABLE animal_fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver fotos de animales" ON animal_fotos
    FOR SELECT USING (TRUE);

CREATE POLICY "Los usuarios pueden insertar fotos de animales" ON animal_fotos  
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Los usuarios pueden actualizar fotos de animales" ON animal_fotos
    FOR UPDATE USING (TRUE);

CREATE POLICY "Los usuarios pueden eliminar fotos de animales" ON animal_fotos
    FOR DELETE USING (TRUE);

-- 5. Migrar foto actual de animales (si existe)
INSERT INTO animal_fotos (animal_id, foto_url, descripcion, es_principal, orden, usuario_subida)
SELECT 
    id as animal_id,
    foto_url,
    'Foto migrada automáticamente' as descripcion,
    TRUE as es_principal,
    0 as orden,
    usuario_registro as usuario_subida
FROM animales 
WHERE foto_url IS NOT NULL AND foto_url != '';

-- 6. Comentarios para documentación
COMMENT ON TABLE animal_fotos IS 'Álbum de fotos para cada animal del rancho';
COMMENT ON COLUMN animal_fotos.es_principal IS 'Foto principal que se muestra en listas y vistas previas';
COMMENT ON COLUMN animal_fotos.orden IS 'Orden de las fotos en el álbum (0 = primera)';
COMMENT ON COLUMN animal_fotos.descripcion IS 'Descripción opcional de la foto';

-- 7. Verificar que todo se creó correctamente
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'animal_fotos'
ORDER BY ordinal_position;