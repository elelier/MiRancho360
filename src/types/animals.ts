import type { Sitio } from './sites';

export interface Animal {
  id: string;
  arete: string; // Número de arete único - ID único obligatorio
  nombre?: string; // Nombre opcional del animal
  raza: Raza;
  raza_id?: string; // ID de la raza
  sexo: 'Macho' | 'Hembra';
  fecha_nacimiento: string; // ISO date string - Campo obligatorio
  peso_kg?: number; // Campo opcional - Peso al nacer
  sitio_actual_id: string;
  sitio_actual?: Sitio; // Información completa del sitio cuando se incluye en queries
  padre_id?: string; // Campo opcional - Para árbol genealógico
  madre_id?: string; // Campo opcional - Para árbol genealógico  
  padre?: { arete: string; nombre?: string }; // Información del padre cuando se incluye
  madre?: { arete: string; nombre?: string }; // Información de la madre cuando se incluye
  observaciones?: string; // Campo opcional - Notas
  estado: 'Activo' | 'Vendido' | 'Muerto'; // Estado del animal - Campo obligatorio
  activo: boolean; // Para compatibilidad con DB actual
  estado_reproductivo?: string; // Estado reproductivo: 'disponible', 'preñada', 'en_celo', etc.
  ultima_fecha_reproductiva?: string; // Última fecha de evento reproductivo
  observaciones_reproductivas?: string; // Observaciones del estado reproductivo
  foto_url?: string; // URL de la foto principal (legacy - usar fotos[])
  fotos?: AnimalFoto[]; // Álbum de fotos del animal
  foto_principal?: AnimalFoto; // Foto principal para vista rápida
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
  arete: string; // Campo obligatorio - ID único
  nombre?: string; // Campo opcional
  raza_id: string; // Campo obligatorio
  sexo: 'Macho' | 'Hembra'; // Campo obligatorio
  fecha_nacimiento: string; // Campo obligatorio
  peso_kg?: number; // Campo opcional - Peso al nacer
  sitio_inicial_id: string; // Campo obligatorio 
  padre_id?: string; // Campo opcional - Para genealogía
  madre_id?: string; // Campo opcional - Para genealogía
  observaciones?: string; // Campo opcional - Notas
  estado: 'Activo' | 'Vendido' | 'Muerto'; // Campo obligatorio - Estado del animal
  foto?: File | string | null; // Campo opcional - Foto del animal
}

export interface AnimalFilters {
  raza?: string;
  sexo?: 'Macho' | 'Hembra';
  sitio_id?: string;
  activo?: boolean; // Filtro legacy por campo activo
  estado?: 'Activo' | 'Vendido' | 'Muerto'; // Nuevo filtro por estado
  busqueda?: string; // Para buscar por arete o nombre
}

// Nuevos tipos para el álbum de fotos
export interface AnimalFoto {
  id: string;
  animal_id: string;
  foto_url: string;
  descripcion?: string;
  es_principal: boolean;
  orden: number;
  fecha_subida: string;
  usuario_subida: string;
}

export interface AnimalFotoFormData {
  archivo: File;
  descripcion?: string;
  es_principal?: boolean;
}

export interface AlbumFotos {
  total: number;
  fotos: AnimalFoto[];
  foto_principal?: AnimalFoto;
}