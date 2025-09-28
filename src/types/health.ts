// Tipos para el sistema de salud y tratamientos

export type TipoEventoSalud = 
  | 'vacuna'
  | 'desparasitacion'
  | 'tratamiento_antibiotico'
  | 'tratamiento_hormonal'
  | 'cirugia'
  | 'revision_veterinaria'
  | 'analisis_laboratorio'
  | 'otros';

export type EstadoRecordatorio = 
  | 'pendiente'
  | 'completado'
  | 'vencido'
  | 'cancelado';

export interface EventoSalud {
  id: string;
  animal_id: string;
  tipo_evento: TipoEventoSalud;
  producto_utilizado: string;
  dosis?: string;
  unidad_dosis?: string; // ml, mg, cc, etc.
  fecha_aplicacion: string; // ISO date
  veterinario?: string;
  notas?: string;
  costo?: number;
  proveedor?: string;
  lote_producto?: string;
  fecha_vencimiento_producto?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RecordatorioSalud {
  id: string;
  animal_id: string;
  evento_salud_base_id?: string; // Referencia al evento original si es una dosis de refuerzo
  tipo_evento: TipoEventoSalud;
  titulo: string;
  descripcion?: string;
  fecha_programada: string; // ISO date
  fecha_completado?: string;
  estado: EstadoRecordatorio;
  dias_aviso_anticipado: number; // Días antes para mostrar alerta
  producto_recomendado?: string;
  dosis_recomendada?: string;
  notas?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Interfaces para la UI
export interface EventoSaludFormData {
  tipo_evento: TipoEventoSalud;
  producto_utilizado: string;
  dosis?: string;
  unidad_dosis?: string;
  fecha_aplicacion: string;
  veterinario?: string;
  notas?: string;
  costo?: number;
  proveedor?: string;
  lote_producto?: string;
  fecha_vencimiento_producto?: string;
  // Datos para recordatorio automático
  crear_recordatorio: boolean;
  dias_para_refuerzo?: number;
  notas_recordatorio?: string;
}

export interface HistorialSalud {
  eventos: EventoSalud[];
  recordatorios_pendientes: RecordatorioSalud[];
  proximo_evento?: RecordatorioSalud;
  total_eventos: number;
  ultimo_evento?: EventoSalud;
}

// Opciones predefinidas para productos comunes
export interface ProductoSalud {
  id: string;
  nombre: string;
  tipo: TipoEventoSalud;
  dosis_recomendada?: string;
  unidad_dosis?: string;
  dias_refuerzo?: number;
  observaciones?: string;
}

// Estadísticas de salud
export interface EstadisticasSalud {
  total_eventos: number;
  eventos_por_tipo: Record<TipoEventoSalud, number>;
  costo_total: number;
  recordatorios_pendientes: number;
  recordatorios_vencidos: number;
  ultimo_evento_fecha?: string;
  proximo_recordatorio_fecha?: string;
}

// Para búsqueda y filtros
export interface FiltrosSalud {
  tipo_evento?: TipoEventoSalud[];
  fecha_desde?: string;
  fecha_hasta?: string;
  veterinario?: string;
  producto?: string;
  estado_recordatorio?: EstadoRecordatorio[];
}

export interface BusquedaSalud {
  query?: string;
  filtros?: FiltrosSalud;
  ordenar_por?: 'fecha_aplicacion' | 'tipo_evento' | 'costo';
  orden?: 'asc' | 'desc';
  limite?: number;
  offset?: number;
}