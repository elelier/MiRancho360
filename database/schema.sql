-- =================================
-- MiRancho360 Database Schema
-- =================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================
-- TABLAS PRINCIPALES
-- =================================

-- Tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'colaborador', 'familiar')),
    pin VARCHAR(64) NOT NULL, -- Hash SHA-256 del PIN
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE
);

-- Tabla de tipos de sitio
CREATE TABLE tipos_sitio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7), -- Color hex para UI
    icono VARCHAR(50), -- Nombre del icono
    activo BOOLEAN DEFAULT true
);

-- Tabla de sitios (corrales, pasturas, etc.)
CREATE TABLE sitios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    tipo_id UUID NOT NULL REFERENCES tipos_sitio(id),
    descripcion TEXT,
    capacidad_animales INTEGER,
    area_hectareas DECIMAL(10,2),
    ubicacion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_registro UUID NOT NULL REFERENCES usuarios(id),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    usuario_actualizacion UUID REFERENCES usuarios(id)
);

-- Tabla de razas
CREATE TABLE razas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Tabla de animales
CREATE TABLE animales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arete VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100),
    raza_id UUID NOT NULL REFERENCES razas(id),
    sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('Macho', 'Hembra')),
    fecha_nacimiento DATE NOT NULL,
    peso_kg DECIMAL(6,2),
    sitio_actual_id UUID NOT NULL REFERENCES sitios(id),
    padre_id UUID REFERENCES animales(id),
    madre_id UUID REFERENCES animales(id),
    observaciones TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_registro UUID NOT NULL REFERENCES usuarios(id),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    usuario_actualizacion UUID REFERENCES usuarios(id)
);

-- Tabla de movimientos de animales
CREATE TABLE movimientos_animales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id UUID NOT NULL REFERENCES animales(id),
    sitio_origen_id UUID REFERENCES sitios(id),
    sitio_destino_id UUID NOT NULL REFERENCES sitios(id),
    fecha_movimiento TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo VARCHAR(20) NOT NULL CHECK (motivo IN ('Traslado', 'Venta', 'Muerte', 'Nacimiento', 'Compra')),
    observaciones TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_registro UUID NOT NULL REFERENCES usuarios(id)
);

-- =================================
-- ÍNDICES
-- =================================

-- Índices para mejorar performance
CREATE INDEX idx_animales_arete ON animales(arete);
CREATE INDEX idx_animales_sitio_actual ON animales(sitio_actual_id);
CREATE INDEX idx_animales_raza ON animales(raza_id);
CREATE INDEX idx_animales_activo ON animales(activo);
CREATE INDEX idx_sitios_tipo ON sitios(tipo_id);
CREATE INDEX idx_sitios_activo ON sitios(activo);
CREATE INDEX idx_movimientos_animal ON movimientos_animales(animal_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_animales(fecha_movimiento);

-- =================================
-- VIEWS
-- =================================

-- Vista de sitios con conteo de animales
CREATE VIEW sitios_con_animales AS
SELECT 
    s.*,
    t.nombre as tipo_nombre,
    t.color as tipo_color,
    t.icono as tipo_icono,
    COALESCE(COUNT(a.id), 0) as total_animales,
    COALESCE(COUNT(a.id) FILTER (WHERE a.sexo = 'Macho'), 0) as animales_machos,
    COALESCE(COUNT(a.id) FILTER (WHERE a.sexo = 'Hembra'), 0) as animales_hembras
FROM sitios s
LEFT JOIN tipos_sitio t ON s.tipo_id = t.id
LEFT JOIN animales a ON s.id = a.sitio_actual_id AND a.activo = true
GROUP BY s.id, t.nombre, t.color, t.icono;

-- =================================
-- FUNCIONES
-- =================================

-- Función para obtener información del proyecto
CREATE OR REPLACE FUNCTION get_project_info()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'name', 'MiRancho360',
        'version', '1.0.0',
        'tables', json_build_object(
            'usuarios', (SELECT COUNT(*) FROM usuarios),
            'animales', (SELECT COUNT(*) FROM animales WHERE activo = true),
            'sitios', (SELECT COUNT(*) FROM sitios WHERE activo = true),
            'razas', (SELECT COUNT(*) FROM razas WHERE activo = true)
        ),
        'last_updated', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================
-- DATOS INICIALES
-- =================================

-- Insertar tipos de sitio predefinidos
INSERT INTO tipos_sitio (nombre, descripcion, color, icono) VALUES
('Corral', 'Área cerrada para contener animales', '#8B4513', 'square'),
('Pastura', 'Área de pastoreo abierta', '#228B22', 'grass'),
('Establo', 'Refugio cubierto para animales', '#654321', 'home'),
('Enfermería', 'Área para animales enfermos', '#FF6B6B', 'medical'),
('Cuarentena', 'Área de aislamiento temporal', '#FFA500', 'shield'),
('Venta', 'Área temporal para animales en venta', '#9932CC', 'tag'),
('Área de Trabajo', 'Zona para manejo y procedimientos', '#708090', 'tools');

-- Insertar razas comunes
INSERT INTO razas (nombre, descripcion) VALUES
('Holstein', 'Raza lechera de origen holandés'),
('Angus', 'Raza de carne de origen escocés'),
('Brahman', 'Raza adaptada a climas tropicales'),
('Charolais', 'Raza de carne de origen francés'),
('Limousin', 'Raza de carne de origen francés'),
('Simmental', 'Raza de doble propósito'),
('Jersey', 'Raza lechera pequeña'),
('Hereford', 'Raza de carne tradicional'),
('Criollo', 'Raza local adaptada'),
('Mestizo', 'Cruce de diferentes razas');

-- Crear usuario administrador por defecto
-- PIN: 1234 (cambiar en producción)
INSERT INTO usuarios (nombre, email, rol, pin) VALUES
('Administrador', 'admin@mirancho360.com', 'administrador', 
 '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'); -- Hash de "1234"

-- =================================
-- ROW LEVEL SECURITY (RLS)
-- =================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitios ENABLE ROW LEVEL SECURITY;
ALTER TABLE animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE razas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_sitio ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Los usuarios pueden ver todos los usuarios" ON usuarios
    FOR SELECT USING (true);

-- Políticas para sitios
CREATE POLICY "Todos pueden ver sitios activos" ON sitios
    FOR SELECT USING (activo = true);

CREATE POLICY "Solo administradores pueden modificar sitios" ON sitios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'administrador'
        )
    );

-- Políticas para animales
CREATE POLICY "Todos pueden ver animales activos" ON animales
    FOR SELECT USING (activo = true);

CREATE POLICY "Administradores y colaboradores pueden modificar animales" ON animales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol IN ('administrador', 'colaborador')
        )
    );

-- Políticas para movimientos
CREATE POLICY "Todos pueden ver movimientos" ON movimientos_animales
    FOR SELECT USING (true);

CREATE POLICY "Administradores y colaboradores pueden crear movimientos" ON movimientos_animales
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol IN ('administrador', 'colaborador')
        )
    );

-- Políticas para razas y tipos (solo lectura para todos, modificación solo admin)
CREATE POLICY "Todos pueden ver razas" ON razas FOR SELECT USING (true);
CREATE POLICY "Solo admin puede modificar razas" ON razas FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'administrador')
);

CREATE POLICY "Todos pueden ver tipos de sitio" ON tipos_sitio FOR SELECT USING (true);
CREATE POLICY "Solo admin puede modificar tipos" ON tipos_sitio FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'administrador')
);

-- =================================
-- TRIGGERS
-- =================================

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sitios_updated_at BEFORE UPDATE ON sitios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animales_updated_at BEFORE UPDATE ON animales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================
-- COMENTARIOS
-- =================================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con autenticación por PIN';
COMMENT ON TABLE sitios IS 'Corrales, pasturas y áreas del rancho';
COMMENT ON TABLE animales IS 'Registro completo de animales del rancho';
COMMENT ON TABLE movimientos_animales IS 'Historial de movimientos y cambios de sitio';
COMMENT ON TABLE razas IS 'Catálogo de razas de animales';
COMMENT ON TABLE tipos_sitio IS 'Tipos de sitios disponibles';

COMMENT ON COLUMN usuarios.pin IS 'Hash SHA-256 del PIN de 4 dígitos';
COMMENT ON COLUMN animales.arete IS 'Número de arete único del animal';
COMMENT ON COLUMN sitios.capacidad_animales IS 'Número máximo de animales que puede albergar';

-- =================================
-- FIN DEL SCHEMA
-- =================================