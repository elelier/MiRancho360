// Tipos para el sistema de observaciones

export interface Observacion {
  id: string;
  animal_id: string;
  usuario_id: string;
  fecha: string; // ISO date string
  observacion: string;
  tipo: 'general' | 'salud' | 'comportamiento' | 'reproduccion' | 'nutricion';
  archivado: boolean; // Soft delete
  created_at: string;
  updated_at?: string;
  // Relaciones opcionales
  usuario?: {
    id: string;
    nombre: string;
  };
}

export interface ObservacionFormData {
  observacion: string;
  tipo: 'general' | 'salud' | 'comportamiento' | 'reproduccion' | 'nutricion';
  fecha?: string; // Si no se proporciona, usa NOW()
}

export interface ObservacionFilters {
  animal_id?: string;
  tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  usuario_id?: string;
  incluir_archivados?: boolean; // Por defecto false
}
