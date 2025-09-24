// Tipos para alertas del sistema
export type TipoAlerta = 
  | 'vacunacion_pendiente'
  | 'revision_veterinaria' 
  | 'sobrepoblacion'
  | 'parto_proximo'
  | 'tratamiento_pendiente'
  | 'mantenimiento_sitio'
  | 'inventario_bajo';

export type PrioridadAlerta = 'baja' | 'media' | 'alta' | 'critica';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  prioridad: PrioridadAlerta;
  titulo: string;
  descripcion: string;
  animal_id?: string;
  sitio_id?: string;
  fecha_creacion: string;
  fecha_vencimiento?: string;
  activa: boolean;
  fecha_resolucion?: string;
  usuario_resolucion?: string;
  observaciones_resolucion?: string;
}

// Tipos para tareas
export type TipoTarea = 
  | 'vacunacion'
  | 'revision_veterinaria'
  | 'traslado'
  | 'tratamiento'
  | 'apareamiento'
  | 'mantenimiento'
  | 'limpieza';

export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
export type PrioridadTarea = 'baja' | 'media' | 'alta';

export interface Tarea {
  id: string;
  tipo: TipoTarea;
  titulo: string;
  descripcion?: string;
  animal_id?: string;
  sitio_id?: string;
  fecha_programada: string;
  fecha_vencimiento?: string;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  notas?: string;
  usuario_asignado?: string;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_completada?: string;
  usuario_completada?: string;
  movimiento_generado_id?: string;
}

// Configuración del rancho
export interface ConfiguracionRancho {
  id: string;
  nombre_rancho: string;
  propietario?: string;
  ubicacion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  logo_url?: string;
  zona_horaria: string;
  moneda: string;
  configuracion_clima: {
    habilitado: boolean;
    ubicacion: string;
    api_key: string;
  };
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// Configuraciones para iconos y colores de alertas
export interface AlertaConfig {
  icono: string;
  color: string;
  colorBg: string;
  nombre: string;
}

export const CONFIGURACION_ALERTAS: Record<TipoAlerta, AlertaConfig> = {
  vacunacion_pendiente: {
    icono: '💉',
    color: 'text-purple-600',
    colorBg: 'bg-purple-50',
    nombre: 'Vacunación Pendiente'
  },
  revision_veterinaria: {
    icono: '🔍',
    color: 'text-amber-600',
    colorBg: 'bg-amber-50',
    nombre: 'Revisión Veterinaria'
  },
  sobrepoblacion: {
    icono: '⚠️',
    color: 'text-red-600',
    colorBg: 'bg-red-50',
    nombre: 'Sobrepoblación'
  },
  parto_proximo: {
    icono: '🐣',
    color: 'text-green-600',
    colorBg: 'bg-green-50',
    nombre: 'Parto Próximo'
  },
  tratamiento_pendiente: {
    icono: '🏥',
    color: 'text-indigo-600',
    colorBg: 'bg-indigo-50',
    nombre: 'Tratamiento Pendiente'
  },
  mantenimiento_sitio: {
    icono: '🔧',
    color: 'text-orange-600',
    colorBg: 'bg-orange-50',
    nombre: 'Mantenimiento de Sitio'
  },
  inventario_bajo: {
    icono: '📦',
    color: 'text-blue-600',
    colorBg: 'bg-blue-50',
    nombre: 'Inventario Bajo'
  }
};

// Configuraciones para tareas
export interface TareaConfig {
  icono: string;
  color: string;
  colorBg: string;
  nombre: string;
}

export const CONFIGURACION_TAREAS: Record<TipoTarea, TareaConfig> = {
  vacunacion: {
    icono: '💉',
    color: 'text-purple-600',
    colorBg: 'bg-purple-50',
    nombre: 'Vacunación'
  },
  revision_veterinaria: {
    icono: '🔍',
    color: 'text-amber-600',
    colorBg: 'bg-amber-50',
    nombre: 'Revisión Veterinaria'
  },
  traslado: {
    icono: '📦',
    color: 'text-blue-600',
    colorBg: 'bg-blue-50',
    nombre: 'Traslado'
  },
  tratamiento: {
    icono: '🏥',
    color: 'text-indigo-600',
    colorBg: 'bg-indigo-50',
    nombre: 'Tratamiento'
  },
  apareamiento: {
    icono: '💕',
    color: 'text-pink-600',
    colorBg: 'bg-pink-50',
    nombre: 'Apareamiento'
  },
  mantenimiento: {
    icono: '🔧',
    color: 'text-orange-600',
    colorBg: 'bg-orange-50',
    nombre: 'Mantenimiento'
  },
  limpieza: {
    icono: '🧹',
    color: 'text-teal-600',
    colorBg: 'bg-teal-50',
    nombre: 'Limpieza'
  }
};