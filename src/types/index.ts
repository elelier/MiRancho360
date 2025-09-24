// Re-export de todos los tipos
export * from './animals';
export * from './sites';
export * from './auth';
export * from './movements';
export * from './alerts';

// Tipos comunes de la aplicación
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipos para formularios generales
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos para reportes
export interface ReporteBasico {
  titulo: string;
  fecha_generacion: string;
  usuario: string;
  datos: Record<string, unknown>[];
}

// Configuración de la aplicación
export interface AppConfig {
  supabase_url: string;
  supabase_anon_key: string;
  app_version: string;
  environment: 'development' | 'production';
}