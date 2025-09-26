import { supabase } from './supabase';
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
        sitio_actual:sitios(*),
        padre:animales!animales_padre_id_fkey(arete, nombre),
        madre:animales!animales_madre_id_fkey(arete, nombre)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Animal;
  },

  // Crear un nuevo animal
  async createAnimal(animalData: AnimalFormData, usuarioId: string) {
    // Mantener activo=true para animales Activo, false para Vendido/Muerto (compatibilidad)
    const activo = animalData.estado === 'Activo';
    
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
        activo: activo
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase al crear animal:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
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
    // Si se está cambiando el estado, actualizar también el campo activo
    const updateData: Partial<AnimalFormData> & {
      usuario_actualizacion: string;
      fecha_actualizacion: string;
      activo?: boolean;
    } = {
      ...animalData,
      usuario_actualizacion: usuarioId,
      fecha_actualizacion: new Date().toISOString()
    };

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