import { supabase } from './supabase';
import type { Sitio, SitioFormData, SitioFilters, SitioConAnimales, TipoSitio } from '../types';

// ========== SITIOS ==========

export const sitiosService = {
  // Obtener todos los sitios con filtros
  async getSitios(filters?: SitioFilters) {
    let query = supabase
      .from('sitios')
      .select(`
        *,
        tipo:tipos_sitio(*)
      `)
      .eq('activo', filters?.activo ?? true)
      .order('nombre');

    if (filters?.tipo) {
      query = query.eq('tipo_id', filters.tipo);
    }

    if (filters?.busqueda) {
      query = query.ilike('nombre', `%${filters.busqueda}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Sitio[];
  },

  // Obtener sitios con conteo de animales
  async getSitiosConAnimales(filters?: SitioFilters) {
    let query = supabase
      .from('sitios_con_animales')
      .select('*');

    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo);
    }

    if (filters?.tipo) {
      query = query.eq('tipo_id', filters.tipo);
    }

    if (filters?.busqueda) {
      query = query.ilike('nombre', `%${filters.busqueda}%`);
    }

    const { data, error } = await query.order('nombre');

    if (error) throw error;
    return data as SitioConAnimales[];
  },

  // Obtener un sitio por ID
  async getSitioById(id: string) {
    const { data, error } = await supabase
      .from('sitios')
      .select(`
        *,
        tipo:tipos_sitio(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Sitio;
  },

  // Crear un nuevo sitio
  async createSitio(sitioData: SitioFormData, usuarioId: string) {
    const { data, error } = await supabase
      .from('sitios')
      .insert({
        ...sitioData,
        usuario_registro: usuarioId,
        activo: true
      })
      .select()
      .single();

    if (error) throw error;
    return data as Sitio;
  },

  // Actualizar un sitio
  async updateSitio(id: string, sitioData: Partial<SitioFormData>, usuarioId: string) {
    const { data, error } = await supabase
      .from('sitios')
      .update({
        ...sitioData,
        usuario_actualizacion: usuarioId,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sitio;
  },

  // Marcar sitio como inactivo (no eliminar)
  async deactivateSitio(id: string, usuarioId: string) {
    // Verificar que no tenga animales activos
    const { data: animales, error: errorAnimales } = await supabase
      .from('animales')
      .select('id')
      .eq('sitio_actual_id', id)
      .eq('activo', true);

    if (errorAnimales) throw errorAnimales;

    if (animales && animales.length > 0) {
      throw new Error(`No se puede desactivar el sitio porque tiene ${animales.length} animales activos`);
    }

    const { data, error } = await supabase
      .from('sitios')
      .update({
        activo: false,
        usuario_actualizacion: usuarioId,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sitio;
  },

  // Verificar si el nombre ya existe
  async checkNombreExists(nombre: string, excludeId?: string) {
    let query = supabase
      .from('sitios')
      .select('id')
      .eq('nombre', nombre)
      .eq('activo', true);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.length > 0;
  },

  // Obtener animales en un sitio específico
  async getAnimalesEnSitio(sitioId: string) {
    const { data, error } = await supabase
      .from('animales')
      .select(`
        *,
        raza:razas(nombre)
      `)
      .eq('sitio_actual_id', sitioId)
      .eq('activo', true)
      .order('arete');

    if (error) throw error;
    return data;
  }
};

// ========== TIPOS DE SITIO ==========

export const tiposSitioService = {
  // Obtener todos los tipos de sitio activos
  async getTiposSitio() {
    const { data, error } = await supabase
      .from('tipos_sitio')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data as TipoSitio[];
  },

  // Crear nuevo tipo de sitio
  async createTipoSitio(nombre: string, descripcion?: string, color?: string, icono?: string) {
    const { data, error } = await supabase
      .from('tipos_sitio')
      .insert({
        nombre,
        descripcion,
        color,
        icono,
        activo: true
      })
      .select()
      .single();

    if (error) throw error;
    return data as TipoSitio;
  }
};