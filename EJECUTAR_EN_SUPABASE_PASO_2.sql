-- PASO 2: Ejecutar después del Paso 1 (Triggers Automáticos)
-- Copia y pega este código en Supabase SQL Editor

-- Primero, eliminar trigger conflictivo si existe
DROP TRIGGER IF EXISTS update_animales_updated_at ON animales;

-- Función para actualizar estado reproductivo del animal automáticamente
CREATE OR REPLACE FUNCTION actualizar_estado_reproductivo_animal()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estado de la hembra según el evento
    IF TG_OP = 'INSERT' THEN
        -- Al crear evento de monta
        UPDATE animales 
        SET 
            estado_reproductivo = 'en_monta',
            ultima_fecha_reproductiva = NEW.fecha_monta
        WHERE id = NEW.hembra_id;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Al cambiar estado del evento de monta
        IF NEW.estado_monta = 'confirmada' AND OLD.estado_monta != 'confirmada' THEN
            -- Preñez confirmada
            UPDATE animales 
            SET 
                estado_reproductivo = 'preñada',
                ultima_fecha_reproductiva = CURRENT_DATE
            WHERE id = NEW.hembra_id;
            
        ELSIF NEW.estado_monta = 'fallida' AND OLD.estado_monta != 'fallida' THEN
            -- Monta fallida
            UPDATE animales 
            SET 
                estado_reproductivo = 'disponible',
                ultima_fecha_reproductiva = CURRENT_DATE
            WHERE id = NEW.hembra_id;
            
        ELSIF NEW.estado_monta = 'parto_exitoso' AND OLD.estado_monta != 'parto_exitoso' THEN
            -- Parto exitoso - período de reposo
            UPDATE animales 
            SET 
                estado_reproductivo = 'periodo_reposo',
                ultima_fecha_reproductiva = CURRENT_DATE
            WHERE id = NEW.hembra_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado reproductivo automáticamente
DROP TRIGGER IF EXISTS trigger_actualizar_estado_reproductivo_animal ON eventos_monta;
CREATE TRIGGER trigger_actualizar_estado_reproductivo_animal
    AFTER INSERT OR UPDATE ON eventos_monta
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estado_reproductivo_animal();

-- Función para verificar estados próximos a parto automáticamente
CREATE OR REPLACE FUNCTION verificar_animales_pre_parto()
RETURNS void AS $$
BEGIN
    -- Actualizar animales que están próximas a parir (14 días antes)
    UPDATE animales 
    SET estado_reproductivo = 'pre_parto'
    WHERE id IN (
        SELECT DISTINCT em.hembra_id
        FROM eventos_monta em
        WHERE em.estado_monta = 'confirmada'
        AND em.fecha_estimada_parto <= CURRENT_DATE + INTERVAL '14 days'
        AND em.fecha_estimada_parto > CURRENT_DATE
    ) AND estado_reproductivo = 'preñada';
    
    -- Actualizar animales que ya deberían estar disponibles después del reposo (60 días post-parto)
    UPDATE animales 
    SET estado_reproductivo = 'disponible'
    WHERE estado_reproductivo = 'periodo_reposo'
    AND ultima_fecha_reproductiva <= CURRENT_DATE - INTERVAL '60 days';
    
END;
$$ LANGUAGE plpgsql;

-- Actualizar estado del animal que ya tiene evento de monta
UPDATE animales 
SET 
    estado_reproductivo = 'en_monta',
    ultima_fecha_reproductiva = CURRENT_DATE
WHERE id IN (
    SELECT DISTINCT hembra_id 
    FROM eventos_monta 
    WHERE estado_monta = 'pendiente'
);

-- Confirmación
SELECT 'PASO 2 COMPLETADO: Triggers automáticos configurados' as status;