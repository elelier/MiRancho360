-- Script para verificar si la tabla animal_fotos existe
-- Ejecutar en Supabase SQL Editor para verificar el estado

-- Verificar si la tabla existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'animal_fotos'
) as tabla_existe;

-- Si existe, mostrar estructura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'animal_fotos'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'animal_fotos';

-- Verificar si hay políticas configuradas
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'animal_fotos';