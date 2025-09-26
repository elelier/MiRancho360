-- Script para verificar y configurar el bucket de Storage
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si el bucket existe
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE name = 'animales-fotos';

-- Si no existe, crear el bucket (ejecutar solo si la consulta anterior no devuelve resultados)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('animales-fotos', 'animales-fotos', true);

-- 2. Configurar políticas de Storage para el bucket animales-fotos

-- Política para SELECT (ver archivos)
CREATE POLICY "allow_read_animales_fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'animales-fotos');

-- Política para INSERT (subir archivos)
CREATE POLICY "allow_insert_animales_fotos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'animales-fotos');

-- Política para UPDATE (actualizar archivos)
CREATE POLICY "allow_update_animales_fotos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'animales-fotos');

-- Política para DELETE (eliminar archivos)
CREATE POLICY "allow_delete_animales_fotos" ON storage.objects
    FOR DELETE USING (bucket_id = 'animales-fotos');

-- 3. Verificar que las políticas se crearon correctamente
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%animales_fotos%';