import { supabase } from './supabase';
import type { 
  EventoMonta,
  EventoMontaFormData,
  Preñez,
  PeriodoGestacion,
  EstadisticasReproductivas,
  BusquedaReproductiva,
  EventoCalendarioReproductivo
} from '../types/reproductive';

export const reproductiveService = {
  // ==================== EVENTOS DE MONTA ====================

  /**
   * Crear un nuevo evento de monta
   */
  async createMatingEvent(eventData: EventoMontaFormData, userId: string): Promise<EventoMonta> {
    console.log('💕 Creando evento de monta:', { eventData, userId });

    try {
      const { data, error } = await supabase
        .from('eventos_monta')
        .insert({
          hembra_id: eventData.hembra_id,
          macho_id: eventData.macho_id,
          fecha_monta: eventData.fecha_monta,
          metodo_monta: eventData.metodo_monta,
          observaciones: eventData.observaciones,
          created_by: userId
          // Las fechas de confirmación y parto se calculan automáticamente por el trigger
        })
        .select(`
          *,
          hembra:animales!eventos_monta_hembra_id_fkey(arete, nombre, raza:razas(nombre)),
          macho:animales!eventos_monta_macho_id_fkey(arete, nombre, raza:razas(nombre))
        `)
        .single();

      if (error) {
        console.error('❌ Error creando evento de monta:', error);
        throw error;
      }

      console.log('✅ Evento de monta creado:', data);
      return data;

    } catch (error) {
      console.error('❌ Error en createMatingEvent:', error);
      throw error;
    }
  },

  /**
   * Crear preñez directa (Flujo 2) - Sin evento de monta previo
   */
  async createDirectPregnancy(data: {
    hembra_id: string;
    macho_id?: string;
    tiempo_gestacion_semanas: number;
    fecha_confirmacion: string;
    observaciones?: string;
  }, userId: string): Promise<Preñez> {
    console.log('🔄 Creando preñez directa:', data);

    try {
      // Calcular fecha de parto estimada
      // Gestación bovina promedio: 40 semanas (280 días)
      const semanasRestantes = 40 - data.tiempo_gestacion_semanas;
      const fechaConfirmacion = new Date(data.fecha_confirmacion);
      const fechaPartoEstimada = new Date(
        fechaConfirmacion.getTime() + (semanasRestantes * 7 * 24 * 60 * 60 * 1000)
      );

      const { data: preñezData, error } = await supabase
        .from('preñeces')
        .insert({
          hembra_id: data.hembra_id,
          macho_id: data.macho_id,
          fecha_confirmacion: data.fecha_confirmacion,
          fecha_parto_estimada: fechaPartoEstimada.toISOString().split('T')[0],
          estado_preñez: 'confirmada',
          numero_crias: 1, // Por defecto, se puede actualizar después
          observaciones: data.observaciones,
          created_by: userId,
          tipo_registro: 'directo', // Marcar como registro directo
          // evento_monta_id queda NULL para registro directo
        })
        .select(`
          *,
          hembra:animales!preñeces_hembra_id_fkey(arete, nombre, raza:razas(nombre)),
          macho:animales!preñeces_macho_id_fkey(arete, nombre, raza:razas(nombre))
        `)
        .single();

      if (error) {
        console.error('❌ Error creando preñez directa:', error);
        throw error;
      }

      // Actualizar estado reproductivo del animal
      const { error: updateError } = await supabase
        .from('animales')
        .update({ estado_reproductivo: 'preñada' })
        .eq('id', data.hembra_id);

      if (updateError) {
        console.error('❌ Error actualizando estado del animal:', updateError);
        // No lanzamos error para no fallar toda la operación
      }

      console.log('✅ Preñez directa creada:', preñezData);
      return preñezData as Preñez;

    } catch (error) {
      console.error('❌ Error en createDirectPregnancy:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los eventos de monta con filtros
   */
  async getMatingEvents(busqueda?: BusquedaReproductiva): Promise<EventoMonta[]> {
    console.log('🔍 Obteniendo eventos de monta:', busqueda);

    try {
      let query = supabase
        .from('eventos_monta')
        .select(`
          *,
          hembra:animales!eventos_monta_hembra_id_fkey(arete, nombre, raza:razas(nombre)),
          macho:animales!eventos_monta_macho_id_fkey(arete, nombre, raza:razas(nombre))
        `)
        .order('fecha_monta', { ascending: false });

      // Aplicar filtros
      if (busqueda?.filtros) {
        const { filtros } = busqueda;

        if (filtros.estado_monta?.length) {
          query = query.in('estado_monta', filtros.estado_monta);
        }

        if (filtros.metodo_monta?.length) {
          query = query.in('metodo_monta', filtros.metodo_monta);
        }

        if (filtros.fecha_desde) {
          query = query.gte('fecha_monta', filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
          query = query.lte('fecha_monta', filtros.fecha_hasta);
        }

        if (filtros.hembra_id) {
          query = query.eq('hembra_id', filtros.hembra_id);
        }

        if (filtros.macho_id) {
          query = query.eq('macho_id', filtros.macho_id);
        }

        if (filtros.solo_gestantes) {
          query = query.in('estado_monta', ['confirmada', 'parto_exitoso']);
        }
      }

      // Aplicar límites
      if (busqueda?.limite) {
        query = query.limit(busqueda.limite);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('✅ Eventos de monta obtenidos:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ Error obteniendo eventos de monta:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de un evento de monta
   */
  async updateMatingEvent(eventoId: string, updates: Partial<EventoMonta>): Promise<EventoMonta> {
    console.log('📝 Actualizando evento de monta:', { eventoId, updates });

    try {
      const { data, error } = await supabase
        .from('eventos_monta')
        .update(updates)
        .eq('id', eventoId)
        .select(`
          *,
          hembra:animales!eventos_monta_hembra_id_fkey(arete, nombre),
          macho:animales!eventos_monta_macho_id_fkey(arete, nombre)
        `)
        .single();

      if (error) throw error;

      console.log('✅ Evento de monta actualizado:', data);
      return data;

    } catch (error) {
      console.error('❌ Error actualizando evento de monta:', error);
      throw error;
    }
  },

  /**
   * Confirmar preñez de un evento de monta
   */
  async confirmPregnancy(eventoId: string, fechaConfirmacion: string, observaciones?: string): Promise<Preñez> {
    console.log('🤱 Confirmando preñez:', { eventoId, fechaConfirmacion });

    try {
      // Primero actualizamos el evento de monta
      await this.updateMatingEvent(eventoId, {
        estado_monta: 'confirmada',
        observaciones: observaciones || undefined
      });

      // Obtener datos del evento de monta
      const { data: evento, error: eventoError } = await supabase
        .from('eventos_monta')
        .select('*')
        .eq('id', eventoId)
        .single();

      if (eventoError) throw eventoError;

      // Crear registro de preñez
      const { data, error } = await supabase
        .from('preñeces')
        .insert({
          evento_monta_id: eventoId,
          hembra_id: evento.hembra_id,
          macho_id: evento.macho_id,
          fecha_confirmacion: fechaConfirmacion,
          fecha_parto_estimada: evento.fecha_estimada_parto,
          estado_preñez: 'confirmada',
          numero_crias: 1, // Por defecto
          observaciones,
          created_by: evento.created_by
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Preñez confirmada:', data);
      return data;

    } catch (error) {
      console.error('❌ Error confirmando preñez:', error);
      throw error;
    }
  },

  /**
   * Confirmar o denegar preñez de un evento de monta
   */
  async confirmPregnancyResult(eventoId: string, isPregnant: boolean, observaciones?: string): Promise<EventoMonta | Preñez> {
    console.log('🔍 Confirmando resultado de preñez:', { eventoId, isPregnant });

    try {
      const fechaConfirmacion = new Date().toISOString().split('T')[0];

      if (isPregnant) {
        // Preñez positiva - usar función existente
        return await this.confirmPregnancy(eventoId, fechaConfirmacion, observaciones);
      } else {
        // Preñez negativa - actualizar solo el evento
        const updatedEvent = await this.updateMatingEvent(eventoId, {
          estado_monta: 'fallida',
          observaciones: observaciones || 'Preñez no confirmada'
        });

        console.log('✅ Monta marcada como fallida:', updatedEvent);
        return updatedEvent;
      }

    } catch (error) {
      console.error('❌ Error confirmando resultado de preñez:', error);
      throw error;
    }
  },

  // ==================== PREÑECES ====================

  /**
   * Obtener todas las preñeces activas
   */
  async getActivePregnancies(): Promise<Preñez[]> {
    console.log('🤰 Obteniendo preñeces activas');

    try {
      const { data, error } = await supabase
        .from('preñeces')
        .select(`
          *,
          hembra:animales!preñeces_hembra_id_fkey(arete, nombre, raza:razas(nombre)),
          macho:animales!preñeces_macho_id_fkey(arete, nombre, raza:razas(nombre))
        `)
        .eq('estado_preñez', 'confirmada')
        .order('fecha_parto_estimada');

      if (error) throw error;

      console.log('✅ Preñeces activas obtenidas:', data?.length || 0);
      return (data as unknown as Preñez[]) || [];

    } catch (error) {
      console.error('❌ Error obteniendo preñeces activas:', error);
      throw error;
    }
  },

  /**
   * Registrar parto exitoso
   */
  async recordSuccessfulBirth(
    preñezId: string,
    fechaParto: string,
    numeroCrias: number,
    observaciones?: string
  ): Promise<Preñez> {
    console.log('👶 Registrando parto exitoso:', { preñezId, fechaParto, numeroCrias });

    try {
      const { data, error } = await supabase
        .from('preñeces')
        .update({
          fecha_parto_real: fechaParto,
          numero_crias: numeroCrias,
          estado_preñez: 'parto_exitoso',
          observaciones
        })
        .eq('id', preñezId)
        .select()
        .single();

      if (error) throw error;

      // También actualizar el evento de monta
      if (data.evento_monta_id) {
        await this.updateMatingEvent(data.evento_monta_id, {
          estado_monta: 'parto_exitoso'
        });
      }

      console.log('✅ Parto registrado exitosamente:', data);
      return data;

    } catch (error) {
      console.error('❌ Error registrando parto:', error);
      throw error;
    }
  },

  // ==================== PERÍODOS DE GESTACIÓN ====================

  /**
   * Obtener períodos de gestación configurados
   */
  async getGestationPeriods(): Promise<PeriodoGestacion[]> {
    console.log('📅 Obteniendo períodos de gestación');

    try {
      const { data, error } = await supabase
        .from('periodos_gestacion')
        .select('*')
        .eq('activo', true)
        .order('especie');

      if (error) throw error;

      console.log('✅ Períodos de gestación obtenidos:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ Error obteniendo períodos de gestación:', error);
      throw error;
    }
  },

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas reproductivas del rancho
   */
  async getReproductiveStats(): Promise<EstadisticasReproductivas> {
    console.log('📊 Calculando estadísticas reproductivas');

    try {
      // Obtener eventos de monta
      const { data: eventosData, error: eventosError } = await supabase
        .from('eventos_monta')
        .select('estado_monta, fecha_monta, fecha_estimada_parto');

      if (eventosError) throw eventosError;
      const eventos = (eventosData as unknown as EventoMonta[]) || [];

      // Obtener preñeces
      const { data: preñecesData, error: preñecesError } = await supabase
        .from('preñeces')
        .select('estado_preñez, fecha_parto_estimada, fecha_parto_real');

      if (preñecesError) throw preñecesError;
      const preñeces = (preñecesData as unknown as Preñez[]) || [];

      // Calcular estadísticas
      const totalMontas = eventos.length || 0;
      const montasPendientes = eventos.filter(e => e.estado_monta === 'pendiente').length || 0;
      const montasConfirmadas = eventos.filter(e => e.estado_monta === 'confirmada').length || 0;
      const partosExitosos = eventos.filter(e => e.estado_monta === 'parto_exitoso').length || 0;

      // Partos esperados este mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const finMes = new Date(inicioMes);
      finMes.setMonth(finMes.getMonth() + 1);
      finMes.setDate(0);

      const partosEsperados = eventos.filter(e => {
        if (!e.fecha_estimada_parto) return false;
        const fechaParto = new Date(e.fecha_estimada_parto);
        return fechaParto >= inicioMes && fechaParto <= finMes;
      }).length || 0;

      const partosEsteMes = preñeces.filter(p => {
        if (!p.fecha_parto_real) return false;
        const fechaParto = new Date(p.fecha_parto_real);
        return fechaParto >= inicioMes && fechaParto <= finMes;
      }).length || 0;

      const confirmacionesPendientes = eventos.filter(e => {
        if (e.estado_monta !== 'pendiente') return false;
        // Verificar si ya pasó la fecha de confirmación
        const hoy = new Date();
        const fechaConfirmacion = new Date(e.fecha_monta);
        fechaConfirmacion.setDate(fechaConfirmacion.getDate() + 45); // +45 días
        return hoy >= fechaConfirmacion;
      }).length || 0;

      const tasaExito = totalMontas > 0 ? Math.round((partosExitosos / totalMontas) * 100) : 0;
      const animalesGestantes = preñeces.filter(p => p.estado_preñez === 'confirmada').length || 0;

      const estadisticas: EstadisticasReproductivas = {
        total_montas: totalMontas,
        montas_pendientes: montasPendientes,
        montas_confirmadas: montasConfirmadas,
        partos_esperados: partosEsperados,
        partos_este_mes: partosEsteMes,
        confirmaciones_pendientes: confirmacionesPendientes,
        tasa_exito: tasaExito,
        animales_gestantes: animalesGestantes
      };

      console.log('✅ Estadísticas calculadas:', estadisticas);
      return estadisticas;

    } catch (error) {
      console.error('❌ Error calculando estadísticas reproductivas:', error);
      throw error;
    }
  },

  // ==================== CALENDARIO ====================

  /**
   * Obtener eventos para el calendario reproductivo
   */
  async getCalendarEvents(fechaInicio: string, fechaFin: string): Promise<EventoCalendarioReproductivo[]> {
    console.log('📅 Obteniendo eventos de calendario:', { fechaInicio, fechaFin });

    try {
      const eventos: EventoCalendarioReproductivo[] = [];

      // Obtener eventos de monta en el rango
      const { data: montas, error: montasError } = await supabase
        .from('eventos_monta')
        .select(`
          *,
          hembra:animales!eventos_monta_hembra_id_fkey(arete, nombre)
        `)
        .gte('fecha_monta', fechaInicio)
        .lte('fecha_monta', fechaFin);

      if (montasError) throw montasError;

      // Agregar eventos de monta
      montas?.forEach(monta => {
        eventos.push({
          id: `monta_${monta.id}`,
          tipo: 'monta',
          fecha: monta.fecha_monta,
          titulo: `Monta - ${monta.hembra?.arete}`,
          descripcion: `Monta ${monta.metodo_monta} de ${monta.hembra?.arete}${monta.hembra?.nombre ? ` (${monta.hembra.nombre})` : ''}`,
          animal_principal: {
            id: monta.hembra_id,
            arete: monta.hembra?.arete || '',
            nombre: monta.hembra?.nombre
          },
          estado: monta.estado_monta,
          prioridad: 'media'
        });

        // Agregar fecha de confirmación si está en el rango
        if (monta.fecha_confirmacion_prenez && 
            monta.fecha_confirmacion_prenez >= fechaInicio && 
            monta.fecha_confirmacion_prenez <= fechaFin) {
          eventos.push({
            id: `confirmacion_${monta.id}`,
            tipo: 'confirmacion',
            fecha: monta.fecha_confirmacion_prenez,
            titulo: `Confirmar Preñez - ${monta.hembra?.arete}`,
            descripcion: `Confirmar preñez de ${monta.hembra?.arete}${monta.hembra?.nombre ? ` (${monta.hembra.nombre})` : ''}`,
            animal_principal: {
              id: monta.hembra_id,
              arete: monta.hembra?.arete || '',
              nombre: monta.hembra?.nombre
            },
            estado: monta.estado_monta,
            prioridad: monta.estado_monta === 'pendiente' ? 'alta' : 'media'
          });
        }

        // Agregar fecha de parto estimada si está en el rango
        if (monta.fecha_estimada_parto && 
            monta.fecha_estimada_parto >= fechaInicio && 
            monta.fecha_estimada_parto <= fechaFin) {
          eventos.push({
            id: `parto_${monta.id}`,
            tipo: 'parto_esperado',
            fecha: monta.fecha_estimada_parto,
            titulo: `Parto Estimado - ${monta.hembra?.arete}`,
            descripcion: `Parto estimado de ${monta.hembra?.arete}${monta.hembra?.nombre ? ` (${monta.hembra.nombre})` : ''}`,
            animal_principal: {
              id: monta.hembra_id,
              arete: monta.hembra?.arete || '',
              nombre: monta.hembra?.nombre
            },
            estado: monta.estado_monta,
            prioridad: 'alta'
          });
        }
      });

      console.log('✅ Eventos de calendario obtenidos:', eventos.length);
      return eventos.sort((a, b) => a.fecha.localeCompare(b.fecha));

    } catch (error) {
      console.error('❌ Error obteniendo eventos de calendario:', error);
      throw error;
    }
  }
};