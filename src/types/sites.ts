export interface Sitio {
  id: string;
  nombre: string;
  tipo: TipoSitio;
  descripcion?: string;
  capacidad_animales?: number;
  area_hectareas?: number;
  ubicacion?: string;
  activo: boolean;
  fecha_registro: string;
  usuario_registro: string;
  fecha_actualizacion?: string;
  usuario_actualizacion?: string;
}

export interface TipoSitio {
  id: string;
  nombre: string;
  descripcion?: string;
  color?: string; // Para identificación visual
  icono?: string; // Nombre del icono
  activo: boolean;
}

// Tipos predefinidos de sitios
export type TipoSitioNombre = 
  | 'Corral'
  | 'Pastura'
  | 'Establo'
  | 'Enfermería'
  | 'Cuarentena'
  | 'Venta'
  | 'Área de Trabajo';

// Tipos para formularios
export interface SitioFormData {
  nombre: string;
  tipo_id: string;
  descripcion?: string;
  capacidad_animales?: number;
  area_hectareas?: number;
  ubicacion?: string;
}

export interface SitioFilters {
  tipo?: string;
  activo?: boolean;
  busqueda?: string; // Para buscar por nombre
}

// Interface para el resumen de un sitio (con conteo de animales)
export interface SitioConAnimales extends Sitio {
  total_animales: number;
  animales_machos: number;
  animales_hembras: number;
}