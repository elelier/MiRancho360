-- PASO 3: Verificación (Ejecutar para confirmar)
-- Copia y pega este código en Supabase SQL Editor

-- Verificar que las columnas se agregaron correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'animales' 
AND column_name IN ('estado_reproductivo', 'ultima_fecha_reproductiva', 'observaciones_reproductivas');

-- Ver animales con su estado reproductivo
SELECT 
    arete,
    nombre, 
    estado_reproductivo,
    ultima_fecha_reproductiva
FROM animales 
LIMIT 5;

-- Ver eventos de monta pendientes
SELECT 
    em.fecha_monta,
    em.estado_monta,
    em.fecha_confirmacion_prenez,
    a1.arete as hembra,
    a2.arete as macho
FROM eventos_monta em
LEFT JOIN animales a1 ON em.hembra_id = a1.id
LEFT JOIN animales a2 ON em.macho_id = a2.id
WHERE em.estado_monta = 'pendiente';

-- Confirmación final
SELECT 'VERIFICACIÓN COMPLETADA: Todo está listo para usar' as status;