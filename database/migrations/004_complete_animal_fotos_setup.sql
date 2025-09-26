-- Migración completa: Tabla animal_fotos con políticas RLS
-- Ejecutar TODO este script en Supabase SQL Editor

-- 1. Eliminar tabla si existe (para re-crear limpia)
DROP TABLE IF EXISTS animal_fotos CASCADE;

-- 2. Crear tabla animal_fotos
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

-- 3. Índices para optimizar consultas
CREATE INDEX idx_animal_fotos_animal_id ON animal_fotos(animal_id);
CREATE INDEX idx_animal_fotos_principal ON animal_fotos(animal_id, es_principal) WHERE es_principal = TRUE;
CREATE INDEX idx_animal_fotos_orden ON animal_fotos(animal_id, orden);

-- 4. Trigger para asegurar solo UNA foto principal por animal
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

-- 5. Aplicar triggers
CREATE TRIGGER trigger_ensure_single_principal_photo
    BEFORE INSERT OR UPDATE ON animal_fotos
    FOR EACH ROW EXECUTE FUNCTION ensure_single_principal_photo();

CREATE TRIGGER trigger_ensure_principal_on_delete
    AFTER DELETE ON animal_fotos
    FOR EACH ROW EXECUTE FUNCTION ensure_single_principal_photo();

-- 6. Habilitar RLS
ALTER TABLE animal_fotos ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS (permisivas para desarrollo)
CREATE POLICY "allow_all_animal_fotos" ON animal_fotos
    FOR ALL USING (true) WITH CHECK (true);

-- 8. Verificar creación exitosa
SELECT 'Tabla animal_fotos creada exitosamente' as resultado;

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'animal_fotos'
AND table_schema = 'public'
ORDER BY ordinal_position;