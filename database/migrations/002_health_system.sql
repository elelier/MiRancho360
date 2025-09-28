-- Migración: Sistema de Salud y Tratamientos
-- User Story 1.2: Seguimiento de Salud y Tratamientos

-- Tabla para eventos de salud
CREATE TABLE IF NOT EXISTS eventos_salud (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(50) NOT NULL CHECK (tipo_evento IN (
        'vacuna',
        'desparasitacion', 
        'tratamiento_antibiotico',
        'tratamiento_hormonal',
        'cirugia',
        'revision_veterinaria',
        'analisis_laboratorio',
        'otros'
    )),
    producto_utilizado VARCHAR(255) NOT NULL,
    dosis VARCHAR(100),
    unidad_dosis VARCHAR(20), -- ml, mg, cc, gramos, etc.
    fecha_aplicacion DATE NOT NULL,
    veterinario VARCHAR(255),
    notas TEXT,
    costo DECIMAL(10,2),
    proveedor VARCHAR(255),
    lote_producto VARCHAR(100),
    fecha_vencimiento_producto DATE,
    created_by UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para recordatorios de salud
CREATE TABLE IF NOT EXISTS recordatorios_salud (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL REFERENCES animales(id) ON DELETE CASCADE,
    evento_salud_base_id UUID REFERENCES eventos_salud(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL CHECK (tipo_evento IN (
        'vacuna',
        'desparasitacion', 
        'tratamiento_antibiotico',
        'tratamiento_hormonal',
        'cirugia',
        'revision_veterinaria',
        'analisis_laboratorio',
        'otros'
    )),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_programada DATE NOT NULL,
    fecha_completado TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',
        'completado',
        'vencido',
        'cancelado'
    )),
    dias_aviso_anticipado INTEGER DEFAULT 7,
    producto_recomendado VARCHAR(255),
    dosis_recomendada VARCHAR(100),
    notas TEXT,
    created_by UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos de salud predefinidos (catálogo)
CREATE TABLE IF NOT EXISTS productos_salud (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'vacuna',
        'desparasitacion', 
        'tratamiento_antibiotico',
        'tratamiento_hormonal',
        'cirugia',
        'revision_veterinaria',
        'analisis_laboratorio',
        'otros'
    )),
    dosis_recomendada VARCHAR(100),
    unidad_dosis VARCHAR(20),
    dias_refuerzo INTEGER, -- Días para próximo refuerzo/aplicación
    observaciones TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_eventos_salud_animal_id ON eventos_salud(animal_id);
CREATE INDEX IF NOT EXISTS idx_eventos_salud_fecha ON eventos_salud(fecha_aplicacion);
CREATE INDEX IF NOT EXISTS idx_eventos_salud_tipo ON eventos_salud(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_recordatorios_salud_animal_id ON recordatorios_salud(animal_id);
CREATE INDEX IF NOT EXISTS idx_recordatorios_salud_fecha ON recordatorios_salud(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_recordatorios_salud_estado ON recordatorios_salud(estado);
CREATE INDEX IF NOT EXISTS idx_productos_salud_tipo ON productos_salud(tipo);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_eventos_salud_updated_at BEFORE UPDATE ON eventos_salud 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordatorios_salud_updated_at BEFORE UPDATE ON recordatorios_salud 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_salud_updated_at BEFORE UPDATE ON productos_salud 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para marcar recordatorios vencidos automáticamente
CREATE OR REPLACE FUNCTION marcar_recordatorios_vencidos()
RETURNS void AS $$
BEGIN
    UPDATE recordatorios_salud 
    SET estado = 'vencido', updated_at = CURRENT_TIMESTAMP
    WHERE estado = 'pendiente' 
    AND fecha_programada < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Políticas RLS (Row Level Security)
ALTER TABLE eventos_salud ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordatorios_salud ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos_salud ENABLE ROW LEVEL SECURITY;

-- Política para eventos_salud: usuarios pueden ver/editar eventos de animales (sistema single-rancho)
CREATE POLICY "Usuarios pueden gestionar eventos de salud"
    ON eventos_salud
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM animales 
            WHERE animales.id = eventos_salud.animal_id
        )
    );

-- Política para recordatorios_salud: usuarios pueden ver/editar recordatorios de animales (sistema single-rancho)
CREATE POLICY "Usuarios pueden gestionar recordatorios de salud"
    ON recordatorios_salud
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM animales 
            WHERE animales.id = recordatorios_salud.animal_id
        )
    );

-- Política para productos_salud: todos los usuarios autenticados pueden leer
CREATE POLICY "Usuarios pueden leer productos de salud"
    ON productos_salud
    FOR SELECT
    TO authenticated
    USING (true);

-- Solo admins pueden modificar productos_salud
CREATE POLICY "Solo admins pueden modificar productos de salud"
    ON productos_salud
    FOR INSERT, UPDATE, DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() 
            AND rol = 'administrador'
        )
    );

-- Datos iniciales de productos comunes de salud
INSERT INTO productos_salud (nombre, tipo, dosis_recomendada, unidad_dosis, dias_refuerzo, observaciones) VALUES
-- Vacunas
('Vacuna Triple Bovina (IBR-PI3-BRSV)', 'vacuna', '5', 'ml', 365, 'Aplicar anualmente. Refuerzo a los 21 días en animales jóvenes.'),
('Vacuna Antiaftosa', 'vacuna', '5', 'ml', 180, 'Aplicar cada 6 meses según calendario sanitario.'),
('Vacuna Clostridiosis', 'vacuna', '5', 'ml', 365, 'Aplicar anualmente. Primera vez con refuerzo a los 21 días.'),
('Vacuna Brucelosis (Cepa 19)', 'vacuna', '2', 'ml', 0, 'Solo para hembras de 3-8 meses. Dosis única.'),

-- Desparasitaciones
('Ivermectina 1%', 'desparasitacion', '1', 'ml/50kg', 90, 'Aplicar cada 3 meses o según análisis coprológico.'),
('Albendazol 10%', 'desparasitacion', '1', 'ml/20kg', 60, 'Especialmente efectivo contra lombrices.'),
('Levamisol 7.5%', 'desparasitacion', '1', 'ml/35kg', 90, 'Amplio espectro. No usar en animales gestantes.'),

-- Tratamientos antibióticos
('Penicilina G Procaínica', 'tratamiento_antibiotico', '20000', 'UI/kg', 0, 'Tratamiento por 3-5 días según criterio veterinario.'),
('Oxitetraciclina LA', 'tratamiento_antibiotico', '20', 'mg/kg', 0, 'Larga acción. Evaluar según patología.'),
('Florfenicol', 'tratamiento_antibiotico', '20', 'mg/kg', 0, 'Para infecciones respiratorias y mastitis.'),

-- Tratamientos hormonales
('Sincronización IATF - GnRH', 'tratamiento_hormonal', '2.5', 'ml', 0, 'Protocolo de sincronización para inseminación artificial.'),
('Prostaglandina F2α', 'tratamiento_hormonal', '2', 'ml', 0, 'Para sincronización de celos.'),

-- Otros
('Complejo Vitamínico ADE', 'otros', '5', 'ml', 30, 'Suplementación vitamínica mensual.'),
('Selenio + Vitamina E', 'otros', '5', 'ml', 90, 'Prevención de deficiencias. Especialmente en épocas de estrés.');

-- Función para crear recordatorio automático después de un evento
CREATE OR REPLACE FUNCTION crear_recordatorio_automatico()
RETURNS TRIGGER AS $$
DECLARE
    producto_info RECORD;
    nuevo_recordatorio_fecha DATE;
    titulo_recordatorio TEXT;
BEGIN
    -- Buscar información del producto para determinar si necesita refuerzo
    SELECT dias_refuerzo, nombre 
    INTO producto_info
    FROM productos_salud 
    WHERE nombre = NEW.producto_utilizado 
    AND tipo = NEW.tipo_evento
    AND dias_refuerzo IS NOT NULL
    AND dias_refuerzo > 0;
    
    -- Si encontramos el producto y tiene días de refuerzo configurados
    IF FOUND THEN
        nuevo_recordatorio_fecha := NEW.fecha_aplicacion + producto_info.dias_refuerzo;
        titulo_recordatorio := 'Refuerzo: ' || producto_info.nombre;
        
        -- Crear el recordatorio automático
        INSERT INTO recordatorios_salud (
            animal_id,
            evento_salud_base_id,
            tipo_evento,
            titulo,
            descripcion,
            fecha_programada,
            estado,
            dias_aviso_anticipado,
            producto_recomendado,
            created_by
        ) VALUES (
            NEW.animal_id,
            NEW.id,
            NEW.tipo_evento,
            titulo_recordatorio,
            'Recordatorio automático generado por el sistema para aplicación de refuerzo.',
            nuevo_recordatorio_fecha,
            'pendiente',
            7, -- 7 días de aviso anticipado
            NEW.producto_utilizado,
            NEW.created_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear recordatorios automáticos
CREATE TRIGGER trigger_crear_recordatorio_automatico
    AFTER INSERT ON eventos_salud
    FOR EACH ROW
    EXECUTE FUNCTION crear_recordatorio_automatico();