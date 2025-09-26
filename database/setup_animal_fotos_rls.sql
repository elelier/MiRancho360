-- Configurar políticas RLS para tabla animal_fotos
-- Ejecutar en Supabase SQL Editor DESPUÉS de crear la tabla

-- 1. Habilitar RLS en la tabla
ALTER TABLE animal_fotos ENABLE ROW LEVEL SECURITY;

-- 2. Política para SELECT: permitir leer fotos de animales
CREATE POLICY "allow_read_animal_fotos" ON animal_fotos
    FOR SELECT USING (true);

-- 3. Política para INSERT: permitir insertar fotos (usuarios autenticados)
CREATE POLICY "allow_insert_animal_fotos" ON animal_fotos
    FOR INSERT WITH CHECK (true);

-- 4. Política para UPDATE: permitir actualizar fotos
CREATE POLICY "allow_update_animal_fotos" ON animal_fotos
    FOR UPDATE USING (true);

-- 5. Política para DELETE: permitir eliminar fotos
CREATE POLICY "allow_delete_animal_fotos" ON animal_fotos
    FOR DELETE USING (true);

-- 6. Verificar que las políticas se crearon correctamente
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'animal_fotos';