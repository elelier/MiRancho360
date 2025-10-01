-- =====================================================
-- CORRECCIÓN: Función get_crias con tipos correctos
-- =====================================================
-- Este script corrige el error de tipos en la función get_crias
-- Error anterior: "Returned type text does not match expected type character varying"
-- =====================================================

-- Eliminar función anterior
DROP FUNCTION IF EXISTS get_crias(UUID);

-- Crear función corregida con tipos TEXT
CREATE OR REPLACE FUNCTION get_crias(animal_id_param UUID)
RETURNS TABLE (
    id UUID,
    arete VARCHAR,
    nombre VARCHAR,
    sexo TEXT,
    fecha_nacimiento DATE,
    edad_meses INTEGER,
    relacion TEXT,
    activo BOOLEAN,
    estado TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.arete,
        c.nombre,
        c.sexo::TEXT,
        c.fecha_nacimiento,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.fecha_nacimiento))::INTEGER * 12 + 
        EXTRACT(MONTH FROM AGE(CURRENT_DATE, c.fecha_nacimiento))::INTEGER as edad_meses,
        CASE 
            WHEN c.padre_id = animal_id_param THEN 'hijo/a'::TEXT
            WHEN c.madre_id = animal_id_param THEN 'hijo/a'::TEXT
        END as relacion,
        c.activo,
        c.estado::TEXT
    FROM animales c
    WHERE (c.padre_id = animal_id_param OR c.madre_id = animal_id_param)
        AND c.activo = TRUE
    ORDER BY c.fecha_nacimiento DESC;
END;
$$ LANGUAGE plpgsql;

-- Comentario
COMMENT ON FUNCTION get_crias IS 'Retorna todas las crías de un animal específico con información detallada (CORREGIDO)';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Probar la función (reemplaza el UUID con un animal real de tu DB)
-- SELECT * FROM get_crias('bf759455-33fe-4f08-876d-958c17349b4e');

SELECT '✅ Función get_crias corregida y lista para usar' as status;
