import { useState, useEffect } from 'react';
import type { Movimiento } from '../types';

// Datos de ejemplo para mostrar
const movimientosEjemplo: Movimiento[] = [
  {
    id: '1',
    tipo: 'nacimiento',
    animal_arete: '126',
    animal_nombre: 'Becerro de Bella',
    fecha: '2025-09-22',
    hora: '14:30',
    descripcion: 'Nacimiento exitoso de becerro macho',
    sitio_destino: 'Corral Maternidad',
    observaciones: 'Parto sin complicaciones',
    usuario_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    tipo: 'vacunacion',
    animal_arete: '123',
    animal_nombre: 'Bella',
    fecha: '2025-09-22',
    hora: '10:15',
    descripcion: 'Vacuna antiaftosa aplicada',
    observaciones: 'Dosis completa, animal en buen estado',
    usuario_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    tipo: 'traslado', 
    animal_arete: '124',
    animal_nombre: 'Thor',
    fecha: '2025-09-21',
    hora: '16:45',
    descripcion: 'Traslado por rotación de pastoreo',
    sitio_origen: 'Pastura Norte',
    sitio_destino: 'Pastura Sur',
    usuario_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    tipo: 'apareamiento',
    animal_arete: '125',
    animal_nombre: 'Luna',
    fecha: '2025-09-21',
    hora: '08:20',
    descripcion: 'Intento de apareamiento con semental Thor',
    observaciones: 'Comportamiento positivo de ambos animales',
    usuario_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    tipo: 'revision',
    animal_arete: '122',
    animal_nombre: 'Negra',
    fecha: '2025-09-20',
    hora: '11:30',
    descripcion: 'Revisión de rutina veterinaria',
    observaciones: 'Estado general excelente, peso adecuado',
    usuario_id: '1',
    created_at: new Date().toISOString()
  }
];

// Hook para gestionar movimientos
export function useMovements() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar movimientos
  const cargarMovimientos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Por ahora usar datos de ejemplo
      // TODO: Conectar con Supabase
      setMovimientos(movimientosEjemplo);
    } catch (err) {
      setError('Error al cargar movimientos');
      console.error('Error cargando movimientos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener últimos N movimientos
  const obtenerUltimosMovimientos = (limite: number = 5): Movimiento[] => {
    return movimientos
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limite);
  };

  // Crear nuevo movimiento
  const crearMovimiento = async (movimiento: Omit<Movimiento, 'id' | 'created_at'>) => {
    try {
      // TODO: Conectar con Supabase
      const nuevoMovimiento: Movimiento = {
        ...movimiento,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
      return nuevoMovimiento;
    } catch (err) {
      setError('Error al crear movimiento');
      throw err;
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Por ahora usar datos de ejemplo
        // TODO: Conectar con Supabase
        setMovimientos(movimientosEjemplo);
      } catch (err) {
        setError('Error al cargar movimientos');
        console.error('Error cargando movimientos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return {
    movimientos,
    isLoading,
    error,
    obtenerUltimosMovimientos,
    crearMovimiento,
    recargar: cargarMovimientos
  };
}