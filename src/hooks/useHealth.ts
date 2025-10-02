import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/health';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import type { 
  EventoSalud, 
  RecordatorioSalud, 
  EventoSaludFormData, 
  HistorialSalud,
  ProductoSalud,
  EstadisticasSalud,
  BusquedaSalud,
  TipoEventoSalud
} from '../types/health';

export function useHealth(animalId?: string) {
  const { usuario } = useAuth();
  
  // Estados principales
  const [historial, setHistorial] = useState<HistorialSalud | null>(null);
  const [eventos, setEventos] = useState<EventoSalud[]>([]);
  const [recordatorios, setRecordatorios] = useState<RecordatorioSalud[]>([]);
  const [productos, setProductos] = useState<ProductoSalud[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasSalud | null>(null);
  
  // Estados de carga
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);
  
  // Estados de operaciones
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [creatingReminder, setCreatingReminder] = useState(false);
  const [updatingEvent, setUpdatingEvent] = useState(false);

  // ==================== CARGAR HISTORIAL COMPLETO ====================

  const loadHistorial = useCallback(async () => {
    if (!animalId) return;
    
    setLoadingHistorial(true);
    try {
      const historialData = await healthService.getAnimalHealthHistory(animalId);
      setHistorial(historialData);
      setEventos(historialData.eventos);
      setRecordatorios(historialData.recordatorios_pendientes);
    } catch (error) {
      console.error('Error cargando historial de salud:', error);
      throw error;
    } finally {
      setLoadingHistorial(false);
    }
  }, [animalId]);

  // ==================== CARGAR ESTADÍSTICAS ====================

  const loadEstadisticas = useCallback(async () => {
    if (!animalId) return;
    
    setLoadingEstadisticas(true);
    try {
      const stats = await healthService.getAnimalHealthStats(animalId);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas de salud:', error);
      throw error;
    } finally {
      setLoadingEstadisticas(false);
    }
  }, [animalId]);

  // ==================== CARGAR PRODUCTOS ====================

  const loadProductos = useCallback(async (tipo?: TipoEventoSalud) => {
    setLoadingProductos(true);
    try {
      // DEBUG: Verificar autenticación
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 Session actual:', session?.user?.id || 'Sin sesión');
      console.log('🔐 User metadata:', session?.user?.user_metadata || 'Sin metadata');
      
      const productosData = await healthService.getHealthProducts(tipo);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando productos de salud:', error);
      throw error;
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  // ==================== CARGAR RECORDATORIOS DEL RANCHO ====================

  const loadRanchReminders = useCallback(async (limite?: number) => {
    setLoadingRecordatorios(true);
    try {
      const recordatoriosData = await healthService.getRanchReminders(limite);
      setRecordatorios(recordatoriosData);
    } catch (error) {
      console.error('Error cargando recordatorios del rancho:', error);
      throw error;
    } finally {
      setLoadingRecordatorios(false);
    }
  }, []);

  // ==================== BUSCAR EVENTOS ====================

  const searchEvents = useCallback(async (busqueda: BusquedaSalud) => {
    if (!animalId) return [];
    
    setLoadingEventos(true);
    try {
      const eventosData = await healthService.searchHealthEvents(animalId, busqueda);
      setEventos(eventosData);
      return eventosData;
    } catch (error) {
      console.error('Error buscando eventos de salud:', error);
      throw error;
    } finally {
      setLoadingEventos(false);
    }
  }, [animalId]);

  // ==================== CREAR EVENTO ====================

  const createEvent = useCallback(async (eventData: EventoSaludFormData) => {
    if (!animalId || !usuario?.id) {
      throw new Error('Animal ID o usuario no disponible');
    }
    
    setCreatingEvent(true);
    try {
      const nuevoEvento = await healthService.createHealthEvent(animalId, eventData, usuario.id);
      
      // Actualizar estado local
      setEventos(prev => [nuevoEvento, ...prev]);
      
      // Recargar historial y estadísticas
      await Promise.all([
        loadHistorial(),
        loadEstadisticas()
      ]);
      
      return nuevoEvento;
    } catch (error) {
      console.error('Error creando evento de salud:', error);
      throw error;
    } finally {
      setCreatingEvent(false);
    }
  }, [animalId, usuario?.id, loadHistorial, loadEstadisticas]);

  // ==================== ACTUALIZAR EVENTO ====================

  const updateEvent = useCallback(async (eventoId: string, eventData: Partial<EventoSaludFormData>) => {
    setUpdatingEvent(true);
    try {
      const eventoActualizado = await healthService.updateHealthEvent(eventoId, eventData);
      
      // Actualizar estado local
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId ? eventoActualizado : evento
      ));
      
      return eventoActualizado;
    } catch (error) {
      console.error('Error actualizando evento de salud:', error);
      throw error;
    } finally {
      setUpdatingEvent(false);
    }
  }, []);

  // ==================== ELIMINAR EVENTO ====================

  const deleteEvent = useCallback(async (eventoId: string) => {
    try {
      await healthService.deleteHealthEvent(eventoId);
      
      // Actualizar estado local
      setEventos(prev => prev.filter(evento => evento.id !== eventoId));
      
      // Recargar estadísticas
      await loadEstadisticas();
    } catch (error) {
      console.error('Error eliminando evento de salud:', error);
      throw error;
    }
  }, [loadEstadisticas]);

  // ==================== CREAR RECORDATORIO ====================

  const createReminder = useCallback(async (recordatorioData: Omit<RecordatorioSalud, 'id' | 'animal_id' | 'created_by' | 'created_at' | 'updated_at' | 'estado' | 'fecha_completado'>) => {
    if (!animalId || !usuario?.id) {
      throw new Error('Animal ID o usuario no disponible');
    }
    
    setCreatingReminder(true);
    try {
      const nuevoRecordatorio = await healthService.createReminder(animalId, recordatorioData, usuario.id);
      
      // Actualizar estado local
      setRecordatorios(prev => [...prev, nuevoRecordatorio]);
      
      return nuevoRecordatorio;
    } catch (error) {
      console.error('Error creando recordatorio:', error);
      throw error;
    } finally {
      setCreatingReminder(false);
    }
  }, [animalId, usuario?.id]);

  // ==================== COMPLETAR RECORDATORIO ====================

  const completeReminder = useCallback(async (recordatorioId: string, eventoSaludId?: string) => {
    try {
      await healthService.completeReminder(recordatorioId, eventoSaludId);
      
      // Actualizar estado local
      setRecordatorios(prev => prev.filter(recordatorio => recordatorio.id !== recordatorioId));
      
      // Recargar historial si es necesario
      if (animalId) {
        await loadHistorial();
      }
    } catch (error) {
      console.error('Error completando recordatorio:', error);
      throw error;
    }
  }, [animalId, loadHistorial]);

  // ==================== CANCELAR RECORDATORIO ====================

  const cancelReminder = useCallback(async (recordatorioId: string) => {
    try {
      await healthService.cancelReminder(recordatorioId);
      
      // Actualizar estado local
      setRecordatorios(prev => prev.filter(recordatorio => recordatorio.id !== recordatorioId));
    } catch (error) {
      console.error('Error cancelando recordatorio:', error);
      throw error;
    }
  }, []);

  // ==================== MARCAR RECORDATORIOS VENCIDOS ====================

  const markOverdueReminders = useCallback(async () => {
    try {
      await healthService.markOverdueReminders();
      
      // Recargar recordatorios
      if (animalId) {
        await loadHistorial();
      } else {
        await loadRanchReminders();
      }
    } catch (error) {
      console.error('Error marcando recordatorios vencidos:', error);
      throw error;
    }
  }, [animalId, loadHistorial, loadRanchReminders]);

  // ==================== EFECTOS ====================

  // Cargar historial automáticamente cuando cambia el animalId
  useEffect(() => {
    if (animalId) {
      loadHistorial();
      loadEstadisticas();
    }
  }, [animalId, loadHistorial, loadEstadisticas]);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  // ==================== UTILIDADES ====================

  // Obtener próximos recordatorios (los más cercanos)
  const getUpcomingReminders = useCallback((dias: number = 7) => {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];
    
    return recordatorios
      .filter(recordatorio => {
        if (recordatorio.estado !== 'pendiente') {
          return false;
        }

        return recordatorio.fecha_programada >= hoy && recordatorio.fecha_programada <= fechaLimiteStr;
      })
      .sort((a, b) => a.fecha_programada.localeCompare(b.fecha_programada));
  }, [recordatorios]);

  // Obtener recordatorios vencidos
  const getOverdueReminders = useCallback(() => {
    const hoy = new Date().toISOString().split('T')[0];
    
    return recordatorios.filter(recordatorio => 
      recordatorio.estado === 'pendiente' && 
      recordatorio.fecha_programada < hoy
    ).sort((a, b) => a.fecha_programada.localeCompare(b.fecha_programada));
  }, [recordatorios]);

  // Verificar si el animal está al día con vacunas (ejemplo)
  const isUpToDateWithVaccines = useCallback(() => {
    if (!historial) return null;
    
    const vacunas = historial.eventos.filter(evento => evento.tipo_evento === 'vacuna');
    const ultimaVacuna = vacunas[0]; // Los eventos están ordenados por fecha desc
    
    if (!ultimaVacuna) return false;
    
    const fechaUltimaVacuna = new Date(ultimaVacuna.fecha_aplicacion);
    const hoy = new Date();
    const diasTranscurridos = Math.floor((hoy.getTime() - fechaUltimaVacuna.getTime()) / (1000 * 60 * 60 * 24));
    
    return diasTranscurridos <= 365; // Considera al día si la última vacuna fue hace menos de un año
  }, [historial]);

  return {
    // Estados
    historial,
    eventos,
    recordatorios,
    productos,
    estadisticas,
    
    // Estados de carga
    loadingHistorial,
    loadingEventos,
    loadingRecordatorios,
    loadingProductos,
    loadingEstadisticas,
    creatingEvent,
    creatingReminder,
    updatingEvent,
    
    // Métodos principales
    loadHistorial,
    loadEstadisticas,
    loadProductos,
    loadRanchReminders,
    searchEvents,
    
    // CRUD Eventos
    createEvent,
    updateEvent,
    deleteEvent,
    
    // CRUD Recordatorios
    createReminder,
    completeReminder,
    cancelReminder,
    markOverdueReminders,
    
    // Utilidades
    getUpcomingReminders,
    getOverdueReminders,
    isUpToDateWithVaccines
  };
}