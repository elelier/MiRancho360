// Tipos para el sistema reproductivo y genealógico

export type EstadoMonta = 
  | 'pendiente'
  | 'confirmada'
  | 'fallida'
  | 'parto_exitoso'
  | 'cancelada';

export type MetodoMonta = 
  | 'natural'
  | 'inseminacion'
  | 'transferencia';

export type EstadoPreñez = 
  | 'confirmada'
  | 'aborto'
  | 'parto_exitoso'
  | 'parto_complicado'
  | 'muerte_madre'
  | 'muerte_cria';

export interface EventoMonta {
  id: string;
  hembra_id: string;
  macho_id: string;
  fecha_monta: string; // ISO date
  fecha_confirmacion_prenez?: string; // Calculado automáticamente
  fecha_estimada_parto?: string; // Calculado automáticamente
  estado_monta: EstadoMonta;
  observaciones?: string;
  metodo_monta: MetodoMonta;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Información relacionada (cuando se incluye en queries)
  hembra?: {
    arete: string;
    nombre?: string;
    raza?: string;
  };
  macho?: {
    arete: string;
    nombre?: string;
    raza?: string;
  };
}

export interface PeriodoGestacion {
  id: string;
  raza_id?: string;
  especie: string;
  dias_gestacion: number;
  dias_confirmacion: number;
  observaciones?: string;
  activo: boolean;
  created_at: string;
}

export interface Preñez {
  id: string;
  evento_monta_id: string;
  hembra_id: string;
  macho_id: string;
  fecha_confirmacion?: string;
  fecha_parto_estimada: string;
  fecha_parto_real?: string;
  estado_preñez: EstadoPreñez;
  numero_crias: number;
  observaciones?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Información relacionada
  evento_monta?: EventoMonta;
  hembra?: {
    arete: string;
    nombre?: string;
    raza?: {
      nombre: string;
    };
  };
  macho?: {
    arete: string;
    nombre?: string;
    raza?: {
      nombre: string;
    };
  };
}

// Interfaces para formularios
export interface EventoMontaFormData {
  hembra_id: string;
  macho_id: string;
  fecha_monta: string;
  metodo_monta: MetodoMonta;
  observaciones?: string;
}

export interface PreñezFormData {
  evento_monta_id: string;
  fecha_confirmacion: string;
  numero_crias?: number;
  observaciones?: string;
}

// Para cálculos y estadísticas
export interface FechasReproductivas {
  fechaMonta: string;
  fechaConfirmacionPreñez: string;
  fechaEstimadaParto: string;
  diasGestacion: number;
  diasConfirmacion: number;
}

export interface EstadisticasReproductivas {
  total_montas: number;
  montas_pendientes: number;
  montas_confirmadas: number;
  partos_esperados: number;
  partos_este_mes: number;
  confirmaciones_pendientes: number;
  tasa_exito: number; // Porcentaje de montas exitosas
  animales_gestantes: number;
}

// Para el árbol genealógico
export interface NodoGenealogico {
  animal: {
    id: string;
    arete: string;
    nombre?: string;
    sexo: 'Macho' | 'Hembra';
    fecha_nacimiento: string;
    raza?: string;
  };
  padre?: NodoGenealogico;
  madre?: NodoGenealogico;
  hijos?: NodoGenealogico[];
  nivel: number; // Para determinar la posición en el árbol
}

// Para búsqueda y filtros
export interface FiltrosReproductivos {
  estado_monta?: EstadoMonta[];
  metodo_monta?: MetodoMonta[];
  fecha_desde?: string;
  fecha_hasta?: string;
  hembra_id?: string;
  macho_id?: string;
  solo_gestantes?: boolean;
}

export interface FiltrosPreñeces {
  estado_preñez?: EstadoPreñez[];
  buscar_texto?: string; // Para buscar por arete, nombre, raza
  fecha_confirmacion_desde?: string;
  fecha_confirmacion_hasta?: string;
  fecha_parto_desde?: string;
  fecha_parto_hasta?: string;
  proximos_partos_dias?: number; // Para filtrar partos en los próximos N días
}

export interface BusquedaReproductiva {
  query?: string;
  filtros?: FiltrosReproductivos;
  ordenar_por?: 'fecha_monta' | 'fecha_estimada_parto' | 'estado_monta';
  orden?: 'asc' | 'desc';
  limite?: number;
  offset?: number;
}

// Para calendario reproductivo
export interface EventoCalendarioReproductivo {
  id: string;
  tipo: 'monta' | 'confirmacion' | 'parto_esperado' | 'parto_real';
  fecha: string;
  titulo: string;
  descripcion: string;
  animal_principal: {
    id: string;
    arete: string;
    nombre?: string;
  };
  estado: EstadoMonta | EstadoPreñez;
  prioridad: 'baja' | 'media' | 'alta';
}