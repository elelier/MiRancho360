import { supabase } from './supabase';
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

export const healthService = {
  // ==================== EVENTOS DE SALUD ====================

  /**
   * Crear un nuevo evento de salud para un animal
   */
  async createHealthEvent(animalId: string, eventData: EventoSaludFormData, userId: string): Promise<EventoSalud> {
    console.log('🏥 Creando evento de salud:', { animalId, eventData, userId });

    try {
      const { data, error } = await supabase
        .from('eventos_salud')
        .insert({
          animal_id: animalId,
          tipo_evento: eventData.tipo_evento,
          producto_utilizado: eventData.producto_utilizado,
          dosis: eventData.dosis,
          unidad_dosis: eventData.unidad_dosis,
          fecha_aplicacion: eventData.fecha_aplicacion,
          veterinario: eventData.veterinario,
          notas: eventData.notas,
          costo: eventData.costo,
          proveedor: eventData.proveedor,
          lote_producto: eventData.lote_producto,
          fecha_vencimiento_producto: eventData.fecha_vencimiento_producto,
          created_by: userId
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando evento de salud:', error);
        throw error;
      }

      console.log('✅ Evento de salud creado:', data);

      // Crear recordatorio si el usuario lo solicitó
      if (eventData.crear_recordatorio && eventData.dias_para_refuerzo && eventData.dias_para_refuerzo > 0) {
        console.log('📅 Creando recordatorio manual para', eventData.dias_para_refuerzo, 'días');
        await this.createReminder(animalId, {
          evento_salud_base_id: data.id,
          tipo_evento: eventData.tipo_evento,
          titulo: `Refuerzo: ${eventData.producto_utilizado}`,
          descripcion: `Aplicar refuerzo de ${eventData.producto_utilizado} programado para ${eventData.dias_para_refuerzo} días después`,
          fecha_programada: new Date(Date.now() + (eventData.dias_para_refuerzo * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          dias_aviso_anticipado: 3, // Avisar 3 días antes
          producto_recomendado: eventData.producto_utilizado,
          dosis_recomendada: eventData.dosis,
          notas: eventData.notas_recordatorio
        }, userId);
        console.log('✅ Recordatorio creado exitosamente');
      }

      return data;

    } catch (error) {
      console.error('❌ Error en createHealthEvent:', error);
      throw error;
    }
  },

  /**
   * Obtener historial completo de salud de un animal
   */
  async getAnimalHealthHistory(animalId: string): Promise<HistorialSalud> {
    console.log('🔍 Obteniendo historial de salud para animal:', animalId);

    try {
      // Obtener eventos de salud
      const { data: eventos, error: eventosError } = await supabase
        .from('eventos_salud')
        .select('*')
        .eq('animal_id', animalId)
        .order('fecha_aplicacion', { ascending: false });

      if (eventosError) throw eventosError;

      // Obtener recordatorios pendientes
      const { data: recordatorios, error: recordatoriosError } = await supabase
        .from('recordatorios_salud')
        .select('*')
        .eq('animal_id', animalId)
        .eq('estado', 'pendiente')
        .order('fecha_programada', { ascending: true });

      if (recordatoriosError) throw recordatoriosError;

      const historial: HistorialSalud = {
        eventos: eventos || [],
        recordatorios_pendientes: recordatorios || [],
        total_eventos: eventos?.length || 0,
        ultimo_evento: eventos?.[0],
        proximo_evento: recordatorios?.[0]
      };

      console.log('✅ Historial obtenido:', historial);
      return historial;

    } catch (error) {
      console.error('❌ Error obteniendo historial de salud:', error);
      throw error;
    }
  },

  /**
   * Obtener catálogo de productos de salud
   */
  async getHealthProducts(tipo?: TipoEventoSalud): Promise<ProductoSalud[]> {
    console.log('💊 Obteniendo productos de salud, tipo:', tipo);

    try {
      let query = supabase
        .from('productos_salud')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      console.log('🔍 Query construida:', query);
      
      const { data, error } = await query;

      console.log('📊 Respuesta completa de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error obteniendo productos:', error);
        console.error('❌ Detalles del error:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('✅ Productos obtenidos:', data);
      console.log('✅ Total productos:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ Error en getHealthProducts:', error);
      console.error('❌ Stack trace:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de salud para un animal
   */
  async getAnimalHealthStats(animalId: string): Promise<EstadisticasSalud> {
    console.log('📊 Obteniendo estadísticas de salud para:', animalId);

    try {
      const { data: eventos, error } = await supabase
        .from('eventos_salud')
        .select('tipo_evento, costo, fecha_aplicacion')
        .eq('animal_id', animalId);

      if (error) throw error;

      const { data: recordatorios, error: recordatoriosError } = await supabase
        .from('recordatorios_salud')
        .select('estado')
        .eq('animal_id', animalId);

      if (recordatoriosError) throw recordatoriosError;

      // Calcular estadísticas
      const eventos_por_tipo = (eventos || []).reduce((acc, evento) => {
        acc[evento.tipo_evento] = (acc[evento.tipo_evento] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const costo_total = (eventos || []).reduce((sum, evento) => sum + (evento.costo || 0), 0);
      
      const recordatorios_pendientes = (recordatorios || []).filter(r => r.estado === 'pendiente').length;
      const recordatorios_vencidos = (recordatorios || []).filter(r => r.estado === 'vencido').length;

      const estadisticas: EstadisticasSalud = {
        total_eventos: eventos?.length || 0,
        eventos_por_tipo,
        costo_total,
        recordatorios_pendientes,
        recordatorios_vencidos
      };

      console.log('✅ Estadísticas calculadas:', estadisticas);
      return estadisticas;

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de salud:', error);
      throw error;
    }
  },

  // ==================== MÉTODOS ADICIONALES (Stubs) ====================

  async getRanchReminders(limite?: number): Promise<RecordatorioSalud[]> {
    console.log('📋 Obteniendo recordatorios del rancho, límite:', limite);
    try {
      let query = supabase
        .from('recordatorios_salud')
        .select('*')
        .eq('estado', 'pendiente')
        .order('fecha_programada');

      if (limite) {
        query = query.limit(limite);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo recordatorios del rancho:', error);
      throw error;
    }
  },

  async searchHealthEvents(animalId: string, busqueda: BusquedaSalud): Promise<EventoSalud[]> {
    console.log('🔍 Buscando eventos de salud:', { animalId, busqueda });
    try {
      const query = supabase
        .from('eventos_salud')
        .select('*')
        .eq('animal_id', animalId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error buscando eventos de salud:', error);
      throw error;
    }
  },

  async updateHealthEvent(eventoId: string, eventData: Partial<EventoSaludFormData>): Promise<EventoSalud> {
    console.log('📝 Actualizando evento de salud:', { eventoId, eventData });
    try {
      const { data, error } = await supabase
        .from('eventos_salud')
        .update(eventData)
        .eq('id', eventoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error actualizando evento de salud:', error);
      throw error;
    }
  },

  async deleteHealthEvent(eventoId: string): Promise<void> {
    console.log('🗑️ Eliminando evento de salud:', eventoId);
    try {
      const { error } = await supabase
        .from('eventos_salud')
        .delete()
        .eq('id', eventoId);

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error eliminando evento de salud:', error);
      throw error;
    }
  },

  async createReminder(animalId: string, recordatorioData: Partial<RecordatorioSalud>, userId: string): Promise<RecordatorioSalud> {
    console.log('⏰ Creando recordatorio:', { animalId, recordatorioData, userId });
    try {
      const { data, error } = await supabase
        .from('recordatorios_salud')
        .insert({
          animal_id: animalId,
          ...recordatorioData,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creando recordatorio:', error);
      throw error;
    }
  },

  async completeReminder(recordatorioId: string, eventoSaludId?: string): Promise<void> {
    console.log('✅ Completando recordatorio:', { recordatorioId, eventoSaludId });
    try {
      const { error } = await supabase
        .from('recordatorios_salud')
        .update({
          estado: 'completado',
          fecha_completado: new Date().toISOString(),
          evento_salud_base_id: eventoSaludId
        })
        .eq('id', recordatorioId);

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error completando recordatorio:', error);
      throw error;
    }
  },

  async cancelReminder(recordatorioId: string): Promise<void> {
    console.log('❌ Cancelando recordatorio:', recordatorioId);
    try {
      const { error } = await supabase
        .from('recordatorios_salud')
        .update({ estado: 'cancelado' })
        .eq('id', recordatorioId);

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error cancelando recordatorio:', error);
      throw error;
    }
  },

  async markOverdueReminders(): Promise<void> {
    console.log('⏰ Marcando recordatorios vencidos');
    try {
      const { error } = await supabase
        .from('recordatorios_salud')
        .update({ estado: 'vencido' })
        .eq('estado', 'pendiente')
        .lt('fecha_programada', new Date().toISOString().split('T')[0]);

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error marcando recordatorios vencidos:', error);
      throw error;
    }
  }
};