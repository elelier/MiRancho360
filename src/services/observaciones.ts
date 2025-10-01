import { supabase } from './supabase';
import type { Observacion, ObservacionFormData, ObservacionFilters } from '../types/observaciones';

export const observacionesService = {
  /**
   * Obtener todas las observaciones de un animal
   */
  async getObservacionesByAnimal(animalId: string, incluirArchivados = false): Promise<Observacion[]> {
    console.log('🗒️ Obteniendo observaciones del animal:', animalId);
    
    let query = supabase
      .from('observaciones')
      .select(`
        *,
        usuario:usuarios(id, nombre)
      `)
      .eq('animal_id', animalId)
      .order('fecha', { ascending: false });

    // Por defecto no mostrar archivados
    if (!incluirArchivados) {
      query = query.eq('archivado', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error al obtener observaciones:', error);
      throw error;
    }

    console.log('✅ Observaciones obtenidas:', data?.length || 0);
    return data as Observacion[];
  },

  /**
   * Obtener observaciones con filtros
   */
  async getObservaciones(filters?: ObservacionFilters): Promise<Observacion[]> {
    console.log('🗒️ Obteniendo observaciones con filtros:', filters);
    
    let query = supabase
      .from('observaciones')
      .select(`
        *,
        usuario:usuarios(id, nombre)
      `);

    if (filters?.animal_id) {
      query = query.eq('animal_id', filters.animal_id);
    }

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }

    if (filters?.usuario_id) {
      query = query.eq('usuario_id', filters.usuario_id);
    }

    if (filters?.fecha_desde) {
      query = query.gte('fecha', filters.fecha_desde);
    }

    if (filters?.fecha_hasta) {
      query = query.lte('fecha', filters.fecha_hasta);
    }

    const { data, error } = await query.order('fecha', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener observaciones:', error);
      throw error;
    }

    console.log('✅ Observaciones obtenidas:', data?.length || 0);
    return data as Observacion[];
  },

  /**
   * Crear una nueva observación
   */
  async createObservacion(
    animalId: string,
    observacionData: ObservacionFormData,
    usuarioId: string
  ): Promise<Observacion> {
    console.log('➕ Creando observación para animal:', animalId);

    const { data, error } = await supabase
      .from('observaciones')
      .insert({
        animal_id: animalId,
        usuario_id: usuarioId,
        observacion: observacionData.observacion,
        tipo: observacionData.tipo,
        fecha: observacionData.fecha || new Date().toISOString(),
      })
      .select(`
        *,
        usuario:usuarios(id, nombre)
      `)
      .single();

    if (error) {
      console.error('❌ Error al crear observación:', error);
      throw error;
    }

    console.log('✅ Observación creada exitosamente');
    return data as Observacion;
  },

  /**
   * Actualizar una observación existente
   */
  async updateObservacion(
    id: string,
    observacionData: Partial<ObservacionFormData>
  ): Promise<Observacion> {
    console.log('📝 Actualizando observación:', id);

    const { data, error } = await supabase
      .from('observaciones')
      .update({
        observacion: observacionData.observacion,
        tipo: observacionData.tipo,
        fecha: observacionData.fecha,
      })
      .eq('id', id)
      .select(`
        *,
        usuario:usuarios(id, nombre)
      `)
      .single();

    if (error) {
      console.error('❌ Error al actualizar observación:', error);
      throw error;
    }

    console.log('✅ Observación actualizada exitosamente');
    return data as Observacion;
  },

  /**
   * Archivar una observación (soft delete)
   */
  async archivarObservacion(id: string): Promise<void> {
    console.log('📦 Archivando observación:', id);

    const { error } = await supabase
      .from('observaciones')
      .update({ archivado: true })
      .eq('id', id);

    if (error) {
      console.error('❌ Error al archivar observación:', error);
      throw error;
    }

    console.log('✅ Observación archivada exitosamente');
  },

  /**
   * Eliminar una observación (deprecado - usar archivar)
   * @deprecated Usar archivarObservacion en su lugar
   */
  async deleteObservacion(id: string): Promise<void> {
    console.log('🗑️ Eliminando observación:', id);

    const { error } = await supabase
      .from('observaciones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error al eliminar observación:', error);
      throw error;
    }

    console.log('✅ Observación eliminada exitosamente');
  },

  /**
   * Obtener estadísticas de observaciones por animal
   */
  async getObservacionesStats(animalId: string) {
    console.log('📊 Obteniendo estadísticas de observaciones para animal:', animalId);

    const { data, error } = await supabase
      .from('observaciones')
      .select('tipo, created_at')
      .eq('animal_id', animalId);

    if (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      por_tipo: {
        general: data?.filter(o => o.tipo === 'general').length || 0,
        salud: data?.filter(o => o.tipo === 'salud').length || 0,
        comportamiento: data?.filter(o => o.tipo === 'comportamiento').length || 0,
        reproduccion: data?.filter(o => o.tipo === 'reproduccion').length || 0,
        nutricion: data?.filter(o => o.tipo === 'nutricion').length || 0,
      },
      ultima_observacion: data?.[0]?.created_at || null,
    };

    console.log('✅ Estadísticas obtenidas:', stats);
    return stats;
  },
};
