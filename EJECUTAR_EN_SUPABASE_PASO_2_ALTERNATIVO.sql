-- PASO 2 ALTERNATIVO: Ejecutar si el PASO 2 normal da error
-- Copia y pega este código en Supabase SQL Editor

-- Verificar qué triggers existen que puedan causar conflicto
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement 
FROM information_schema.triggers 
WHERE event_object_table IN ('animales', 'eventos_monta');

-- Eliminar todos los triggers problemáticos de la tabla animales
DROP TRIGGER IF EXISTS update_animales_updated_at ON animales;
DROP TRIGGER IF EXISTS update_updated_at_column ON animales;

-- Crear función específica sin conflictos
CREATE OR REPLACE FUNCTION fn_actualizar_estado_reproductivo()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo manejar eventos de monta
    IF TG_TABLE_NAME = 'eventos_monta' THEN
        IF TG_OP = 'INSERT' THEN
            -- Nueva monta: cambiar estado a "en_monta"
            UPDATE animales 
            SET 
                estado_reproductivo = 'en_monta',
                ultima_fecha_reproductiva = NEW.fecha_monta
            WHERE id = NEW.hembra_id;
            
        ELSIF TG_OP = 'UPDATE' THEN
            -- Cambio en evento de monta
            IF NEW.estado_monta != OLD.estado_monta THEN
                CASE NEW.estado_monta
                    WHEN 'confirmada' THEN
                        UPDATE animales 
                        SET 
                            estado_reproductivo = 'preñada',
                            ultima_fecha_reproductiva = CURRENT_DATE
                        WHERE id = NEW.hembra_id;
                        
                    WHEN 'fallida' THEN
                        UPDATE animales 
                        SET 
                            estado_reproductivo = 'disponible',
                            ultima_fecha_reproductiva = CURRENT_DATE
                        WHERE id = NEW.hembra_id;
                        
                    WHEN 'parto_exitoso' THEN
                        UPDATE animales 
                        SET 
                            estado_reproductivo = 'periodo_reposo',
                            ultima_fecha_reproductiva = CURRENT_DATE
                        WHERE id = NEW.hembra_id;
                    ELSE
                        -- No hacer nada para otros estados
                END CASE;
            END IF;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Crear trigger específico
DROP TRIGGER IF EXISTS trg_estado_reproductivo ON eventos_monta;
CREATE TRIGGER trg_estado_reproductivo
    AFTER INSERT OR UPDATE ON eventos_monta
    FOR EACH ROW
    EXECUTE FUNCTION fn_actualizar_estado_reproductivo();

-- Actualizar animales existentes con eventos pendientes
UPDATE animales 
SET 
    estado_reproductivo = 'en_monta',
    ultima_fecha_reproductiva = CURRENT_DATE
WHERE id IN (
    SELECT DISTINCT hembra_id 
    FROM eventos_monta 
    WHERE estado_monta = 'pendiente'
);

-- Función de mantenimiento (ejecutar manualmente cuando sea necesario)
CREATE OR REPLACE FUNCTION mantener_estados_reproductivos()
RETURNS text AS $$
DECLARE
    actualizados int := 0;
BEGIN
    -- Animales próximas a parir (14 días antes)
    UPDATE animales 
    SET estado_reproductivo = 'pre_parto'
    WHERE id IN (
        SELECT DISTINCT em.hembra_id
        FROM eventos_monta em
        WHERE em.estado_monta = 'confirmada'
        AND em.fecha_estimada_parto <= CURRENT_DATE + INTERVAL '14 days'
        AND em.fecha_estimada_parto > CURRENT_DATE
    ) AND estado_reproductivo = 'preñada';
    
    GET DIAGNOSTICS actualizados = ROW_COUNT;
    
    -- Animales listas después del reposo (60 días post-parto)
    UPDATE animales 
    SET estado_reproductivo = 'disponible'
    WHERE estado_reproductivo = 'periodo_reposo'
    AND ultima_fecha_reproductiva <= CURRENT_DATE - INTERVAL '60 days';
    
    RETURN 'Estados actualizados: ' || actualizados || ' animales';
END;
$$ LANGUAGE plpgsql;

-- Confirmación
SELECT 'PASO 2 ALTERNATIVO COMPLETADO: Sistema de estados configurado' as status;