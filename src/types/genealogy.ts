// Tipos para el sistema de genealogía y crías

export interface Cria {
  id: string;
  arete: string;
  nombre?: string;
  sexo: 'Macho' | 'Hembra';
  fecha_nacimiento: string;
  edad_meses: number;
  relacion: 'hijo/a';
  activo: boolean;
  estado: string;
}

export interface CriasStats {
  total: number;
  machos: number;
  hembras: number;
  activos: number;
  promedio_edad_meses: number;
}
