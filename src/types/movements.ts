export type TipoMovimiento = 
  | 'nacimiento'
  | 'muerte' 
  | 'traslado'
  | 'vacunacion'
  | 'apareamiento'
  | 'revision'
  | 'venta'
  | 'compra'
  | 'tratamiento';

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  animal_arete: string;
  animal_nombre?: string;
  fecha: string;
  hora: string;
  descripcion: string;
  sitio_origen?: string;
  sitio_destino?: string;
  observaciones?: string;
  usuario_id: string;
  created_at: string;
}

export interface MovimientoConfig {
  icono: string;
  color: string;
  colorBg: string;
  nombre: string;
}

export const TIPOS_MOVIMIENTO: Record<TipoMovimiento, MovimientoConfig> = {
  nacimiento: {
    icono: 'star',
    color: 'text-green-600',
    colorBg: 'bg-green-50',
    nombre: 'Nacimiento'
  },
  muerte: {
    icono: 'x-circle',
    color: 'text-red-600', 
    colorBg: 'bg-red-50',
    nombre: 'Muerte'
  },
  traslado: {
    icono: 'switch-horizontal',
    color: 'text-blue-600',
    colorBg: 'bg-blue-50', 
    nombre: 'Traslado'
  },
  vacunacion: {
    icono: 'shield-check',
    color: 'text-purple-600',
    colorBg: 'bg-purple-50',
    nombre: 'Vacunación'
  },
  apareamiento: {
    icono: 'heart',
    color: 'text-pink-600',
    colorBg: 'bg-pink-50',
    nombre: 'Apareamiento'
  },
  revision: {
    icono: 'search',
    color: 'text-amber-600',
    colorBg: 'bg-amber-50',
    nombre: 'Revisión'
  },
  venta: {
    icono: 'currency-dollar',
    color: 'text-accent-600',
    colorBg: 'bg-accent-50',
    nombre: 'Venta'
  },
  compra: {
    icono: 'shopping-bag',
    color: 'text-primary-600',
    colorBg: 'bg-primary-50',
    nombre: 'Compra'
  },
  tratamiento: {
    icono: 'beaker',
    color: 'text-indigo-600',
    colorBg: 'bg-indigo-50',
    nombre: 'Tratamiento'
  }
};