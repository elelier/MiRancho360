import { useState, useCallback, useEffect, useMemo } from 'react';
import type { RecordatorioSalud } from '../types/health';
import { healthService } from '../services/health';

export interface ReminderStats {
  total_pendientes: number;
  vencidos: number;
  hoy: number;
  proximos_7_dias: number;
  por_tipo: Record<string, number>;
}

export interface UseRemindersReturn {
  // Estado
  recordatorios: RecordatorioSalud[];
  stats: ReminderStats;
  loading: boolean;
  error: string | null;

  // Acciones
  loadReminders: () => Promise<void>;
  markAsCompleted: (recordatorioId: string) => Promise<void>;
  deleteReminder: (recordatorioId: string) => Promise<void>;
  refreshStats: () => Promise<void>;

  // Filtros
  filtros: {
    estado: 'todos' | 'pendiente' | 'completado' | 'vencido';
    tipoEvento: string;
    animalId: string;
    fechaDesde: string;
    fechaHasta: string;
  };
  updateFiltros: (filtros: Partial<UseRemindersReturn['filtros']>) => void;
  recordatoriosFiltrados: RecordatorioSalud[];
}

const hoy = new Date().toISOString().split('T')[0];
const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const useReminders = (): UseRemindersReturn => {
  // ==================== ESTADO ====================
  
  const [recordatorios, setRecordatorios] = useState<RecordatorioSalud[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<UseRemindersReturn['filtros']>({
    estado: 'todos',
    tipoEvento: '',
    animalId: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // ==================== ESTADÍSTICAS ====================

  const [stats, setStats] = useState<ReminderStats>({
    total_pendientes: 0,
    vencidos: 0,
    hoy: 0,
    proximos_7_dias: 0,
    por_tipo: {}
  });

  // Recalcular stats cuando cambien los recordatorios
  useEffect(() => {
    const calcularStats = (recordatorios: RecordatorioSalud[]): ReminderStats => {
      const pendientes = recordatorios.filter(r => r.estado === 'pendiente');
      
      return {
        total_pendientes: pendientes.length,
        vencidos: pendientes.filter(r => r.fecha_programada < hoy).length,
        hoy: pendientes.filter(r => r.fecha_programada === hoy).length,
        proximos_7_dias: pendientes.filter(r => 
          r.fecha_programada > hoy && r.fecha_programada <= en7Dias
        ).length,
        por_tipo: pendientes.reduce((acc, r) => {
          acc[r.tipo_evento] = (acc[r.tipo_evento] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    };

    const newStats = calcularStats(recordatorios);
    setStats(newStats);
  }, [recordatorios]);

  // ==================== FILTROS ====================

  const recordatoriosFiltrados = useMemo(() => {
    return recordatorios.filter(recordatorio => {
      // Filtro por estado
      if (filtros.estado !== 'todos') {
        if (filtros.estado === 'vencido') {
          if (recordatorio.estado !== 'pendiente' || recordatorio.fecha_programada >= hoy) {
            return false;
          }
        } else if (recordatorio.estado !== filtros.estado) {
          return false;
        }
      }

      // Filtro por tipo de evento
      if (filtros.tipoEvento && recordatorio.tipo_evento !== filtros.tipoEvento) {
        return false;
      }

      // Filtro por animal
      if (filtros.animalId && recordatorio.animal_id !== filtros.animalId) {
        return false;
      }

      // Filtro por rango de fechas
      if (filtros.fechaDesde && recordatorio.fecha_programada < filtros.fechaDesde) {
        return false;
      }
      if (filtros.fechaHasta && recordatorio.fecha_programada > filtros.fechaHasta) {
        return false;
      }

      return true;
    });
  }, [recordatorios, filtros]);

  // ==================== ACCIONES ====================

  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const todosLosRecordatorios = await healthService.getRanchReminders();
      setRecordatorios(todosLosRecordatorios);
    } catch (error) {
      console.error('Error cargando recordatorios:', error);
      setError('Error al cargar los recordatorios');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsCompleted = useCallback(async (recordatorioId: string) => {
    try {
      await healthService.completeReminder(recordatorioId);
      
      // Actualizar estado local
      setRecordatorios(prev => prev.map(r => 
        r.id === recordatorioId 
          ? { ...r, estado: 'completado' as const, fecha_completado: new Date().toISOString() }
          : r
      ));
    } catch (error) {
      console.error('Error marcando recordatorio como completado:', error);
      throw error;
    }
  }, []);

  const deleteReminder = useCallback(async (recordatorioId: string) => {
    try {
      await healthService.cancelReminder(recordatorioId);
      
      // Actualizar estado local
      setRecordatorios(prev => prev.filter(r => r.id !== recordatorioId));
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
      throw error;
    }
  }, []);

  const refreshStats = useCallback(async () => {
    // Los stats se recalculan automáticamente con el useEffect
    await loadReminders();
  }, [loadReminders]);

  const updateFiltros = useCallback((nuevosFiltros: Partial<UseRemindersReturn['filtros']>) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  // ==================== CARGAR DATOS INICIALES ====================
  
  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // ==================== RETURN ====================

  return {
    // Estado
    recordatorios,
    stats,
    loading,
    error,

    // Acciones
    loadReminders,
    markAsCompleted,
    deleteReminder,
    refreshStats,

    // Filtros
    filtros,
    updateFiltros,
    recordatoriosFiltrados
  };
};