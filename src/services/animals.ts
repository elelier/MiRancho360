import { supabase } from './supabase';
import { uploadAnimalPhoto, updateAnimalPhoto, deleteAnimalPhoto } from './imageUpload';
import type { Animal, AnimalFormData, AnimalFilters, MovimientoAnimal, Raza } from '../types';

// ========== ANIMALES ==========

export const animalsService = {
  // Obtener todos los animales con filtros
  async getAnimals(filters?: AnimalFilters) {
    let query = supabase
      .from('animales')
      .select(`
        *,
        raza:razas(*),
        sitio_actual:sitios(*)
      `)
      .order('fecha_registro', { ascending: false });

    // Filtrar por estado (prioridad sobre activo)
    if (filters?.estado) {
      query = query.eq('estado', filters.estado);
    } else if (filters?.activo !== undefined) {
      // Mantener compatibilidad con filtro legacy 'activo'
      query = query.eq('activo', filters.activo);
    } else {
      // Por defecto mostrar solo animales activos
      query = query.eq('estado', 'Activo');
    }

    if (filters?.raza) {
      query = query.eq('raza_id', filters.raza);
    }

    if (filters?.sexo) {
      query = query.eq('sexo', filters.sexo);
    }

    if (filters?.sitio_id) {
      query = query.eq('sitio_actual_id', filters.sitio_id);
    }

    if (filters?.busqueda) {
      query = query.or(`arete.ilike.%${filters.busqueda}%,nombre.ilike.%${filters.busqueda}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Animal[];
  },

  // Obtener un animal por ID
  async getAnimalById(id: string) {
    const { data, error } = await supabase
      .from('animales')
      .select(`
        *,
        raza:razas(*),
        sitio_actual:sitios(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Si tiene padre_id o madre_id, cargarlos por separado
    if (data && (data.padre_id || data.madre_id)) {
      const parentIds = [data.padre_id, data.madre_id].filter(Boolean);
      const { data: parents } = await supabase
        .from('animales')
        .select('id, arete, nombre')
        .in('id', parentIds);
      
      if (parents) {
        data.padre = parents.find(p => p.id === data.padre_id) || null;
        data.madre = parents.find(p => p.id === data.madre_id) || null;
      }
    }
    
    return data as Animal;
  },

  // Crear un nuevo animal
  async createAnimal(animalData: AnimalFormData, usuarioId: string) {
    // Mantener activo=true para animales Activo, false para Vendido/Muerto (compatibilidad)
    const activo = animalData.estado === 'Activo';
    
    // Subir foto si existe
    let fotoUrl = null;
    if (animalData.foto && animalData.foto instanceof File) {
      const uploadResult = await uploadAnimalPhoto(animalData.foto, animalData.arete);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir la foto');
      }
      fotoUrl = uploadResult.url;
    }
    
    const { data, error } = await supabase
      .from('animales')
      .insert({
        arete: animalData.arete,
        nombre: animalData.nombre,
        raza_id: animalData.raza_id,
        sexo: animalData.sexo,
        fecha_nacimiento: animalData.fecha_nacimiento,
        peso_kg: animalData.peso_kg,
        sitio_actual_id: animalData.sitio_inicial_id,
        padre_id: animalData.padre_id || null,
        madre_id: animalData.madre_id || null,
        observaciones: animalData.observaciones,
        estado: animalData.estado,
        usuario_registro: usuarioId,
        activo: activo,
        foto_url: fotoUrl
      })
      .select()
      .single();

    if (error) {
      // Si falla la creación del animal pero se subió la foto, eliminarla
      if (fotoUrl) {
        await deleteAnimalPhoto(fotoUrl);
      }
      
      console.error('❌ Error de Supabase al crear animal:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    // Si se subió una foto, registrarla también en la tabla animal_fotos como principal
    if (fotoUrl && data) {
      try {
        console.log('📷 Registrando foto en animal_fotos para animal:', data.id);
        
        await supabase
          .from('animal_fotos')
          .insert({
            animal_id: data.id,
            foto_url: fotoUrl,
            descripcion: 'Foto inicial del animal',
            es_principal: true,
            orden: 0,
            usuario_subida: usuarioId
          });
        
        console.log('✅ Foto registrada correctamente en animal_fotos');
      } catch (fotoError) {
        // No fallar la creación del animal si falla el registro de la foto
        console.error('⚠️ Error registrando foto en animal_fotos:', fotoError);
        // La foto ya está en foto_url del animal, así que no es crítico
      }
    }


    
    // Registrar movimiento inicial basado en el estado
    let motivo: 'Nacimiento' | 'Compra' | 'Venta' | 'Muerte' = 'Nacimiento';
    let observaciones = 'Registro inicial del animal';

    if (animalData.estado === 'Vendido') {
      motivo = 'Venta';
      observaciones = 'Animal registrado como vendido';
    } else if (animalData.estado === 'Muerto') {
      motivo = 'Muerte';
      observaciones = 'Animal registrado como fallecido';
    }

    try {
      await movimientosService.createMovimiento({
        animal_id: data.id,
        sitio_destino_id: animalData.sitio_inicial_id,
        fecha_movimiento: new Date().toISOString(),
        motivo: motivo,
        observaciones: observaciones
      }, usuarioId);
    } catch (movError) {
      // Si falla el movimiento, no fallar toda la operación
      console.warn('No se pudo registrar el movimiento inicial:', movError);
    }

    return data as Animal;
  },

  // Actualizar un animal
  async updateAnimal(id: string, animalData: Partial<AnimalFormData>, usuarioId: string) {
    // Obtener datos actuales del animal para manejar la foto
    const { data: currentAnimal } = await supabase
      .from('animales')
      .select('arete, foto_url')
      .eq('id', id)
      .single();

    // Manejar actualización de foto
    let fotoUrl = currentAnimal?.foto_url;
    if (animalData.foto !== undefined) {
      if (animalData.foto instanceof File) {
        // Subir nueva foto
        const uploadResult = await updateAnimalPhoto(
          animalData.foto, 
          currentAnimal?.arete || 'unknown',
          currentAnimal?.foto_url
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Error al subir la foto');
        }
        fotoUrl = uploadResult.url;
      } else if (animalData.foto === null && currentAnimal?.foto_url) {
        // Eliminar foto existente
        await deleteAnimalPhoto(currentAnimal.foto_url);
        fotoUrl = null;
      }
    }

    // Si se está cambiando el estado, actualizar también el campo activo
    const updateData: Partial<AnimalFormData> & {
      usuario_actualizacion: string;
      fecha_actualizacion: string;
      activo?: boolean;
      foto_url?: string | null;
    } = {
      ...animalData,
      usuario_actualizacion: usuarioId,
      fecha_actualizacion: new Date().toISOString()
    };

    // No incluir el campo foto en la actualización de BD
    delete updateData.foto;
    
    // Agregar la URL de la foto si cambió
    if (animalData.foto !== undefined) {
      updateData.foto_url = fotoUrl;
    }

    if (animalData.estado) {
      updateData.activo = animalData.estado === 'Activo';
    }

    const { data, error } = await supabase
      .from('animales')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Si se cambió la foto, sincronizar con animal_fotos
    if (animalData.foto !== undefined && data) {
      try {
        if (fotoUrl && animalData.foto instanceof File) {
          console.log('📷 Actualizando foto en animal_fotos para animal:', id);
          
          // Verificar si ya existe una foto principal
          const { data: existingPhoto } = await supabase
            .from('animal_fotos')
            .select('id')
            .eq('animal_id', id)
            .eq('es_principal', true)
            .single();

          if (existingPhoto) {
            // Actualizar foto existente
            await supabase
              .from('animal_fotos')
              .update({
                foto_url: fotoUrl,
                usuario_subida: usuarioId,
                fecha_subida: new Date().toISOString()
              })
              .eq('id', existingPhoto.id);
          } else {
            // Crear nueva entrada en animal_fotos
            await supabase
              .from('animal_fotos')
              .insert({
                animal_id: id,
                foto_url: fotoUrl,
                descripcion: 'Foto actualizada del animal',
                es_principal: true,
                orden: 0,
                usuario_subida: usuarioId
              });
          }
          
          console.log('✅ Foto sincronizada correctamente en animal_fotos');
        }
      } catch (fotoError) {
        console.error('⚠️ Error sincronizando foto en animal_fotos:', fotoError);
      }
    }

    // Si se cambió el estado a Vendido o Muerto, registrar movimiento
    if (animalData.estado && animalData.estado !== 'Activo') {
      const motivo = animalData.estado === 'Vendido' ? 'Venta' : 'Muerte';
      await movimientosService.createMovimiento({
        animal_id: id,
        sitio_destino_id: data.sitio_actual_id, // Mantener el sitio actual
        fecha_movimiento: new Date().toISOString(),
        motivo: motivo,
        observaciones: `Animal marcado como ${animalData.estado.toLowerCase()}`
      }, usuarioId);
    }

    return data as Animal;
  },

  // Marcar animal como inactivo (no eliminar)
  async deactivateAnimal(id: string, usuarioId: string) {
    const { data, error } = await supabase
      .from('animales')
      .update({
        activo: false,
        usuario_actualizacion: usuarioId,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Animal;
  },

  // Verificar si el arete ya existe
  async checkAreteExists(arete: string, excludeId?: string) {
    let query = supabase
      .from('animales')
      .select('id')
      .eq('arete', arete)
      .eq('activo', true);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.length > 0;
  }
};

// ========== RAZAS ==========

export const razasService = {
  // Obtener todas las razas activas
  async getRazas() {
    const { data, error } = await supabase
      .from('razas')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data as Raza[];
  },

  // Crear nueva raza
  async createRaza(nombre: string, descripcion?: string) {
    const { data, error } = await supabase
      .from('razas')
      .insert({
        nombre,
        descripcion,
        activo: true
      })
      .select()
      .single();

    if (error) throw error;
    return data as Raza;
  }
};

// ========== MOVIMIENTOS ==========

export const movimientosService = {
  // Obtener historial de movimientos de un animal
  async getMovimientosByAnimal(animalId: string) {
    const { data, error } = await supabase
      .from('movimientos_animales')
      .select(`
        *,
        sitio_origen:sitios!movimientos_animales_sitio_origen_id_fkey(*),
        sitio_destino:sitios!movimientos_animales_sitio_destino_id_fkey(*),
        usuario:usuarios(nombre)
      `)
      .eq('animal_id', animalId)
      .order('fecha_movimiento', { ascending: false });

    if (error) throw error;
    return data as MovimientoAnimal[];
  },

  // Crear un nuevo movimiento
  async createMovimiento(movimientoData: Omit<MovimientoAnimal, 'id' | 'fecha_registro' | 'usuario_registro'>, usuarioId: string) {
    const { data, error } = await supabase
      .from('movimientos_animales')
      .insert({
        ...movimientoData,
        usuario_registro: usuarioId
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar sitio actual del animal
    if (movimientoData.motivo !== 'Muerte' && movimientoData.motivo !== 'Venta') {
      await supabase
        .from('animales')
        .update({ sitio_actual_id: movimientoData.sitio_destino_id })
        .eq('id', movimientoData.animal_id);
    }

    return data as MovimientoAnimal;
  }
};