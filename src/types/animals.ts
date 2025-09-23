export interface Animal {
  id: string;
  arete: string; // Número de arete único
  nombre?: string; // Nombre opcional del animal
  raza: Raza;
  sexo: 'Macho' | 'Hembra';
  fecha_nacimiento: string; // ISO date string
  peso_kg?: number;
  sitio_actual_id: string;
  padre_id?: string;
  madre_id?: string;
  observaciones?: string;
  activo: boolean;
  fecha_registro: string;
  usuario_registro: string;
  fecha_actualizacion?: string;
  usuario_actualizacion?: string;
}

export interface Raza {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface MovimientoAnimal {
  id: string;
  animal_id: string;
  sitio_origen_id?: string;
  sitio_destino_id: string;
  fecha_movimiento: string;
  motivo: 'Traslado' | 'Venta' | 'Muerte' | 'Nacimiento' | 'Compra';
  observaciones?: string;
  usuario_registro: string;
  fecha_registro: string;
}

// Tipos para formularios
export interface AnimalFormData {
  arete: string;
  nombre?: string;
  raza_id: string;
  sexo: 'Macho' | 'Hembra';
  fecha_nacimiento: string;
  peso_kg?: number;
  sitio_inicial_id: string;
  padre_id?: string;
  madre_id?: string;
  observaciones?: string;
}

export interface AnimalFilters {
  raza?: string;
  sexo?: 'Macho' | 'Hembra';
  sitio_id?: string;
  activo?: boolean;
  busqueda?: string; // Para buscar por arete o nombre
}