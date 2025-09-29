import { useState, useEffect, useCallback } from 'react';
import { reproductiveService } from '../services/reproductive';
import { useAuth } from './useAuth';
import type { 
  EventoMonta,
  EventoMontaFormData,
  Preñez,
  EstadisticasReproductivas,
  BusquedaReproductiva,
  EventoCalendarioReproductivo,
  PeriodoGestacion
} from '../types/reproductive';

export function useReproductive() {
  const { usuario } = useAuth();
  
  // Estados principales
  const [eventos, setEventos] = useState<EventoMonta[]>([]);
  const [preñeces, setPreñeces] = useState<Preñez[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasReproductivas | null>(null);
  const [eventosCalendario, setEventosCalendario] = useState<EventoCalendarioReproductivo[]>([]);
  const [periodosGestacion, setPeriodosGestacion] = useState<PeriodoGestacion[]>([]);
  
  // Estados de carga
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [loadingPreñeces, setLoadingPreñeces] = useState(false);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);
  const [loadingCalendario, setLoadingCalendario] = useState(false);
  
  // Estados de operaciones
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [confirmingPregnancy, setConfirmingPregnancy] = useState(false);
  const [recordingBirth, setRecordingBirth] = useState(false);

  // ==================== CARGAR EVENTOS DE MONTA ====================

  const loadMatingEvents = useCallback(async (busqueda?: BusquedaReproductiva) => {
    setLoadingEventos(true);
    try {
      const eventosData = await reproductiveService.getMatingEvents(busqueda);
      setEventos(eventosData);
    } catch (error) {
      console.error('Error cargando eventos de monta:', error);
      throw error;
    } finally {
      setLoadingEventos(false);
    }
  }, []);

  // ==================== CARGAR PREÑECES ACTIVAS ====================

  const loadActivePregnancies = useCallback(async () => {
    setLoadingPreñeces(true);
    try {
      const preñecesData = await reproductiveService.getActivePregnancies();
      setPreñeces(preñecesData);
    } catch (error) {
      console.error('Error cargando preñeces activas:', error);
      throw error;
    } finally {
      setLoadingPreñeces(false);
    }
  }, []);

  // ==================== CARGAR ESTADÍSTICAS ====================

  const loadStatistics = useCallback(async () => {
    setLoadingEstadisticas(true);
    try {
      const statsData = await reproductiveService.getReproductiveStats();
      setEstadisticas(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas reproductivas:', error);
      throw error;
    } finally {
      setLoadingEstadisticas(false);
    }
  }, []);

  // ==================== CARGAR EVENTOS DE CALENDARIO ====================

  const loadCalendarEvents = useCallback(async (fechaInicio: string, fechaFin: string) => {
    setLoadingCalendario(true);
    try {
      const eventosData = await reproductiveService.getCalendarEvents(fechaInicio, fechaFin);
      setEventosCalendario(eventosData);
    } catch (error) {
      console.error('Error cargando eventos de calendario:', error);
      throw error;
    } finally {
      setLoadingCalendario(false);
    }
  }, []);

  // ==================== CREAR EVENTO DE MONTA ====================

  const createMatingEvent = useCallback(async (eventData: EventoMontaFormData) => {
    if (!usuario?.id) {
      throw new Error('Usuario no autenticado');
    }
    
    setCreatingEvent(true);
    try {
      const nuevoEvento = await reproductiveService.createMatingEvent(eventData, usuario.id);
      
      // Actualizar estado local
      setEventos(prev => [nuevoEvento, ...prev]);
      
      // Recargar estadísticas
      await loadStatistics();
      
      return nuevoEvento;
    } catch (error) {
      console.error('Error creando evento de monta:', error);
      throw error;
    } finally {
      setCreatingEvent(false);
    }
  }, [usuario?.id, loadStatistics]);

  // ==================== CONFIRMAR PREÑEZ ====================

  const confirmPregnancy = useCallback(async (
    eventoId: string, 
    fechaConfirmacion: string, 
    observaciones?: string
  ) => {
    setConfirmingPregnancy(true);
    try {
      const nuevaPreñez = await reproductiveService.confirmPregnancy(
        eventoId, 
        fechaConfirmacion, 
        observaciones
      );
      
      // Actualizar estado local
      setPreñeces(prev => [nuevaPreñez, ...prev]);
      
      // Actualizar evento en la lista
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId 
          ? { ...evento, estado_monta: 'confirmada' }
          : evento
      ));
      
      // Recargar estadísticas
      await loadStatistics();
      
      return nuevaPreñez;
    } catch (error) {
      console.error('Error confirmando preñez:', error);
      throw error;
    } finally {
      setConfirmingPregnancy(false);
    }
  }, [loadStatistics]);

  // ==================== CONFIRMAR RESULTADO DE PREÑEZ ====================

  const confirmPregnancyResult = useCallback(async (
    eventoId: string,
    isPregnant: boolean,
    observaciones?: string
  ) => {
    setConfirmingPregnancy(true);
    try {
      const resultado = await reproductiveService.confirmPregnancyResult(
        eventoId,
        isPregnant,
        observaciones
      );

      if (isPregnant) {
        // Preñez confirmada - agregar a la lista de preñeces
        setPreñeces(prev => [resultado as Preñez, ...prev]);
        // Actualizar evento
        setEventos(prev => prev.map(evento => 
          evento.id === eventoId 
            ? { ...evento, estado_monta: 'confirmada' }
            : evento
        ));
      } else {
        // Preñez fallida - actualizar solo el evento
        setEventos(prev => prev.map(evento => 
          evento.id === eventoId 
            ? { ...evento, estado_monta: 'fallida' }
            : evento
        ));
      }

      // Recargar estadísticas
      await loadStatistics();
      
      return resultado;
    } catch (error) {
      console.error('Error confirmando resultado de preñez:', error);
      throw error;
    } finally {
      setConfirmingPregnancy(false);
    }
  }, [loadStatistics]);

  // ==================== REGISTRAR PREÑEZ DIRECTA (FLUJO 2) ====================

  const createDirectPregnancy = useCallback(async (data: {
    hembra_id: string;
    macho_id?: string;
    tiempo_gestacion_semanas: number;
    fecha_confirmacion: string;
    observaciones?: string;
  }) => {
    if (!usuario?.id) {
      throw new Error('Usuario no autenticado');
    }

    setCreatingEvent(true);
    try {
      const nuevaPreñez = await reproductiveService.createDirectPregnancy(data, usuario.id);
      
      // Actualizar estado local
      setPreñeces(prev => [nuevaPreñez, ...prev]);
      
      // Recargar estadísticas
      await loadStatistics();
      
      return nuevaPreñez;
    } catch (error) {
      console.error('Error creando preñez directa:', error);
      throw error;
    } finally {
      setCreatingEvent(false);
    }
  }, [usuario?.id, loadStatistics]);

  // ==================== REGISTRAR PARTO ====================

  const recordBirth = useCallback(async (
    preñezId: string,
    fechaParto: string,
    numeroCrias: number,
    observaciones?: string
  ) => {
    setRecordingBirth(true);
    try {
      const partoActualizado = await reproductiveService.recordSuccessfulBirth(
        preñezId,
        fechaParto,
        numeroCrias,
        observaciones
      );
      
      // Actualizar estado local
      setPreñeces(prev => prev.map(preñez =>
        preñez.id === preñezId ? partoActualizado : preñez
      ));
      
      // Actualizar evento relacionado
      if (partoActualizado.evento_monta_id) {
        setEventos(prev => prev.map(evento =>
          evento.id === partoActualizado.evento_monta_id
            ? { ...evento, estado_monta: 'parto_exitoso' }
            : evento
        ));
      }
      
      // Recargar estadísticas
      await loadStatistics();
      
      return partoActualizado;
    } catch (error) {
      console.error('Error registrando parto:', error);
      throw error;
    } finally {
      setRecordingBirth(false);
    }
  }, [loadStatistics]);

  // ==================== CARGAR PERÍODOS DE GESTACIÓN ====================

  const loadGestationPeriods = useCallback(async () => {
    try {
      const periodosData = await reproductiveService.getGestationPeriods();
      setPeriodosGestacion(periodosData);
    } catch (error) {
      console.error('Error cargando períodos de gestación:', error);
      throw error;
    }
  }, []);

  // ==================== EFECTOS ====================

  // Cargar datos iniciales
  useEffect(() => {
    loadMatingEvents();
    loadActivePregnancies();
    loadStatistics();
    loadGestationPeriods();
  }, [loadMatingEvents, loadActivePregnancies, loadStatistics, loadGestationPeriods]);

  // ==================== UTILIDADES ====================

  // Obtener eventos próximos (próximos 7 días)
  const getUpcomingEvents = useCallback((dias: number = 7) => {
    const hoy = new Date();
    const fechaLimite = new Date(hoy);
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    return eventosCalendario.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento >= hoy && fechaEvento <= fechaLimite;
    });
  }, [eventosCalendario]);

  // Obtener eventos vencidos
  const getOverdueEvents = useCallback(() => {
    const hoy = new Date();
    
    return eventosCalendario.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento < hoy && evento.prioridad === 'alta';
    });
  }, [eventosCalendario]);

  // Obtener confirmaciones pendientes
  const getPendingConfirmations = useCallback(() => {
    const hoy = new Date();
    
    return eventos.filter(evento => {
      if (evento.estado_monta !== 'pendiente') return false;
      if (!evento.fecha_confirmacion_prenez) return false;
      
      const fechaConfirmacion = new Date(evento.fecha_confirmacion_prenez);
      return fechaConfirmacion <= hoy;
    });
  }, [eventos]);

  // Obtener partos próximos (próximos 30 días)
  const getUpcomingBirths = useCallback((dias: number = 30) => {
    const hoy = new Date();
    const fechaLimite = new Date(hoy);
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    return preñeces.filter(preñez => {
      if (preñez.estado_preñez !== 'confirmada') return false;
      if (!preñez.fecha_parto_estimada) return false;
      
      const fechaParto = new Date(preñez.fecha_parto_estimada);
      return fechaParto >= hoy && fechaParto <= fechaLimite;
    });
  }, [preñeces]);

  return {
    // Estados
    eventos,
    preñeces,
    estadisticas,
    eventosCalendario,
    periodosGestacion,
    
    // Estados de carga
    loadingEventos,
    loadingPreñeces,
    loadingEstadisticas,
    loadingCalendario,
    creatingEvent,
    confirmingPregnancy,
    recordingBirth,
    
    // Métodos principales
    loadMatingEvents,
    loadActivePregnancies,
    loadStatistics,
    loadCalendarEvents,
    loadGestationPeriods,
    
    // Operaciones CRUD
    createMatingEvent,
    createDirectPregnancy,
    confirmPregnancy,
    confirmPregnancyResult,
    recordBirth,
    
    // Utilidades
    getUpcomingEvents,
    getOverdueEvents,
    getPendingConfirmations,
    getUpcomingBirths
  };
}