import { supabase } from './supabase';
import { uploadAnimalPhoto, deleteAnimalPhoto } from './imageUpload';
import type { AnimalFoto, AnimalFotoFormData, AlbumFotos } from '../types';

export const albumService = {
  
  // Obtener todas las fotos de un animal
  async getAnimalPhotos(animalId: string): Promise<AlbumFotos> {
    const { data, error } = await supabase
      .from('animal_fotos')
      .select('*')
      .eq('animal_id', animalId)
      .order('orden', { ascending: true });

    if (error) throw error;

    const fotos = data as AnimalFoto[];
    const fotoPrincipal = fotos.find(f => f.es_principal);

    return {
      total: fotos.length,
      fotos,
      foto_principal: fotoPrincipal
    };
  },

  // Agregar nueva foto al álbum
  async addPhotoToAlbum(
    animalId: string, 
    animalArete: string, 
    fotoData: AnimalFotoFormData, 
    usuarioId: string
  ): Promise<AnimalFoto> {
    
    // Obtener álbum actual para determinar orden
    const albumActual = await this.getAnimalPhotos(animalId);
    
    // Límite de 10 fotos por animal
    if (albumActual.total >= 10) {
      throw new Error('Máximo 10 fotos por animal permitidas');
    }

    // Subir archivo a Supabase Storage
    const uploadResult = await uploadAnimalPhoto(fotoData.archivo, animalArete);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Error al subir la foto');
    }

    // Si es la primera foto o se marca como principal
    const esPrincipal = fotoData.es_principal || albumActual.total === 0;
    const nuevoOrden = albumActual.total;

    try {
      const insertData = {
        animal_id: animalId,
        foto_url: uploadResult.url!,
        descripcion: fotoData.descripcion || null,
        es_principal: esPrincipal,
        orden: nuevoOrden,
        usuario_subida: usuarioId
      };
      
      console.log('🗃️ Datos para insertar en animal_fotos:', insertData);

      const { data, error } = await supabase
        .from('animal_fotos')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        // Si falla la inserción, eliminar la foto subida
        await deleteAnimalPhoto(uploadResult.url!);
        throw error;
      }

      return data as AnimalFoto;
      
    } catch (error) {
      // Rollback: eliminar foto del storage si falla la BD
      await deleteAnimalPhoto(uploadResult.url!);
      throw error;
    }
  },

  // Actualizar descripción de una foto
  async updatePhotoDescription(fotoId: string, descripcion: string): Promise<AnimalFoto> {
    const { data, error } = await supabase
      .from('animal_fotos')
      .update({ descripcion })
      .eq('id', fotoId)
      .select()
      .single();

    if (error) throw error;
    return data as AnimalFoto;
  },

  // Marcar foto como principal
  async setAsPrincipal(fotoId: string): Promise<AnimalFoto> {
    const { data, error } = await supabase
      .from('animal_fotos')
      .update({ es_principal: true })
      .eq('id', fotoId)
      .select()
      .single();

    if (error) throw error;
    return data as AnimalFoto;
  },

  // Reordenar fotos en el álbum
  async reorderPhotos(animalId: string, fotosOrdenadas: { id: string; orden: number }[]): Promise<void> {
    const promises = fotosOrdenadas.map(({ id, orden }) =>
      supabase
        .from('animal_fotos')
        .update({ orden })
        .eq('id', id)
        .eq('animal_id', animalId) // Seguridad extra
    );

    const results = await Promise.all(promises);
    
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  // Eliminar foto del álbum
  async deletePhoto(fotoId: string): Promise<void> {
    // Primero obtener la URL para eliminar del storage
    const { data: foto, error: selectError } = await supabase
      .from('animal_fotos')
      .select('foto_url, animal_id, es_principal')
      .eq('id', fotoId)
      .single();

    if (selectError) throw selectError;

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from('animal_fotos')
      .delete()
      .eq('id', fotoId);

    if (deleteError) throw deleteError;

    // Eliminar del storage
    await deleteAnimalPhoto(foto.foto_url);

    // Si era la principal, el trigger de BD se encargará de marcar otra como principal
  },

  // Obtener solo la foto principal de un animal (para listas)
  async getPrincipalPhoto(animalId: string): Promise<AnimalFoto | null> {
    console.log('🔍 Buscando foto principal para animal:', animalId);
    
    const { data, error } = await supabase
      .from('animal_fotos')
      .select('*')
      .eq('animal_id', animalId)
      .eq('es_principal', true)
      .maybeSingle();

    if (error) {
      console.error('❌ Error obteniendo foto principal:', error);
      throw error;
    }
    
    console.log('✅ Foto principal encontrada:', data);
    return data as AnimalFoto | null;
  },

  // Obtener estadísticas del álbum
  async getAlbumStats(animalId: string): Promise<{ total: number; con_descripcion: number }> {
    const { data, error } = await supabase
      .from('animal_fotos')
      .select('descripcion')
      .eq('animal_id', animalId);

    if (error) throw error;

    return {
      total: data.length,
      con_descripcion: data.filter(f => f.descripcion && f.descripcion.trim()).length
    };
  },

  // Eliminar todas las fotos de un animal (para cuando se elimina el animal)
  async deleteAllAnimalPhotos(animalId: string): Promise<void> {
    // Obtener todas las URLs para eliminar del storage
    const { data: fotos, error: selectError } = await supabase
      .from('animal_fotos')
      .select('foto_url')
      .eq('animal_id', animalId);

    if (selectError) throw selectError;

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from('animal_fotos')
      .delete()
      .eq('animal_id', animalId);

    if (deleteError) throw deleteError;

    // Eliminar todas las fotos del storage
    const deletePromises = fotos.map(f => deleteAnimalPhoto(f.foto_url));
    await Promise.allSettled(deletePromises); // No fallar si alguna foto no se puede eliminar
  }
};