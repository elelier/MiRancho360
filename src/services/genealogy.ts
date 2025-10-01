import { supabase } from './supabase';
import type { Cria, CriasStats } from '../types/genealogy';

export const genealogyService = {
  /**
   * Obtener todas las crías de un animal
   */
  async getCrias(animalId: string): Promise<Cria[]> {
    console.log('👶 Obteniendo crías del animal:', animalId);

    const { data, error } = await supabase.rpc('get_crias', {
      animal_id_param: animalId,
    });

    if (error) {
      console.error('❌ Error al obtener crías:', error);
      throw error;
    }

    console.log('✅ Crías obtenidas:', data?.length || 0);
    return (data || []) as Cria[];
  },

  /**
   * Obtener estadísticas de crías de un animal
   */
  async getCriasStats(animalId: string): Promise<CriasStats> {
    console.log('📊 Obteniendo estadísticas de crías para animal:', animalId);

    const { data, error } = await supabase.rpc('get_crias_stats', {
      animal_id_param: animalId,
    });

    if (error) {
      console.error('❌ Error al obtener estadísticas de crías:', error);
      throw error;
    }

    console.log('✅ Estadísticas de crías obtenidas');
    return data as CriasStats;
  },
};
