// Utilidades para cálculos reproductivos

import type { FechasReproductivas } from '../types/reproductive';

/**
 * Calcula las fechas clave del ciclo reproductivo
 */
export function calcularFechasReproductivas(
  fechaMonta: string,
  diasGestacion: number = 283,
  diasConfirmacion: number = 45
): FechasReproductivas {
  const fechaMontaDate = new Date(fechaMonta + 'T00:00:00.000Z');
  
  const fechaConfirmacionDate = new Date(fechaMontaDate);
  fechaConfirmacionDate.setDate(fechaConfirmacionDate.getDate() + diasConfirmacion);
  
  const fechaPartoDate = new Date(fechaMontaDate);
  fechaPartoDate.setDate(fechaPartoDate.getDate() + diasGestacion);
  
  return {
    fechaMonta: fechaMonta,
    fechaConfirmacionPreñez: fechaConfirmacionDate.toISOString().split('T')[0],
    fechaEstimadaParto: fechaPartoDate.toISOString().split('T')[0],
    diasGestacion,
    diasConfirmacion
  };
}

/**
 * Obtiene el período de gestación para una especie específica
 */
export function obtenerPeriodoGestacion(especie: string = 'bovino'): { dias_gestacion: number; dias_confirmacion: number } {
  const periodos: Record<string, { dias_gestacion: number; dias_confirmacion: number }> = {
    bovino: { dias_gestacion: 283, dias_confirmacion: 45 },
    equino: { dias_gestacion: 340, dias_confirmacion: 60 },
    porcino: { dias_gestacion: 114, dias_confirmacion: 21 },
    caprino: { dias_gestacion: 150, dias_confirmacion: 30 },
    ovino: { dias_gestacion: 147, dias_confirmacion: 28 }
  };
  
  return periodos[especie] || periodos.bovino;
}

/**
 * Calcula los días restantes hasta una fecha
 */
export function calcularDiasRestantes(fecha: string): number {
  const hoy = new Date();
  const fechaObjetivo = new Date(fecha + 'T00:00:00.000Z');
  
  const diferencia = fechaObjetivo.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

/**
 * Determina si una fecha está próxima (dentro de los próximos N días)
 */
export function esFechaProxima(fecha: string, diasLimite: number = 7): boolean {
  const diasRestantes = calcularDiasRestantes(fecha);
  return diasRestantes >= 0 && diasRestantes <= diasLimite;
}

/**
 * Determina si una fecha ya venció
 */
export function esFechaVencida(fecha: string): boolean {
  const diasRestantes = calcularDiasRestantes(fecha);
  return diasRestantes < 0;
}

/**
 * Calcula la edad gestacional en semanas y días
 */
export function calcularEdadGestacional(fechaMonta: string): { semanas: number; dias: number; totalDias: number } {
  const hoy = new Date();
  const fechaMontaDate = new Date(fechaMonta + 'T00:00:00.000Z');
  
  const diferencia = hoy.getTime() - fechaMontaDate.getTime();
  const totalDias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  const semanas = Math.floor(totalDias / 7);
  const dias = totalDias % 7;
  
  return {
    semanas,
    dias,
    totalDias
  };
}

/**
 * Determina la fase del ciclo reproductivo actual
 */
export function determinarFaseReproductiva(
  _fechaMonta: string, // Reservado para futuras funcionalidades
  fechaConfirmacion: string,
  fechaEstimadaParto: string,
  fechaActual?: string
): 'pre_confirmacion' | 'confirmacion_pendiente' | 'gestacion' | 'pre_parto' | 'vencido_confirmacion' | 'vencido_parto' {
  const hoy = fechaActual ? new Date(fechaActual) : new Date();
  const fechaConfirmacionDate = new Date(fechaConfirmacion + 'T00:00:00.000Z');
  const fechaPartoDate = new Date(fechaEstimadaParto + 'T00:00:00.000Z');
  
  // 7 días antes del parto
  const fechaPreParto = new Date(fechaPartoDate);
  fechaPreParto.setDate(fechaPreParto.getDate() - 7);
  
  if (hoy < fechaConfirmacionDate) {
    return 'pre_confirmacion';
  } else if (hoy.toDateString() === fechaConfirmacionDate.toDateString()) {
    return 'confirmacion_pendiente';
  } else if (hoy > fechaConfirmacionDate && hoy < fechaPreParto) {
    return 'gestacion';
  } else if (hoy >= fechaPreParto && hoy <= fechaPartoDate) {
    return 'pre_parto';
  } else if (hoy > fechaPartoDate) {
    return 'vencido_parto';
  } else {
    return 'vencido_confirmacion';
  }
}

/**
 * Formatea una fecha para mostrar de forma amigable
 */
export function formatearFechaReproductiva(fecha: string): string {
  const fechaDate = new Date(fecha + 'T00:00:00.000Z');
  
  return fechaDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calcula estadísticas de éxito reproductivo
 */
export function calcularTasaExito(montasExitosas: number, totalMontas: number): number {
  if (totalMontas === 0) return 0;
  return Math.round((montasExitosas / totalMontas) * 100);
}

/**
 * Genera un resumen textual del estado reproductivo
 */
export function generarResumenReproductivo(
  fechaMonta: string,
  fechaConfirmacion: string,
  fechaEstimadaParto: string,
  estado: string
): string {
  const fase = determinarFaseReproductiva(fechaMonta, fechaConfirmacion, fechaEstimadaParto);
  const diasRestantesConfirmacion = calcularDiasRestantes(fechaConfirmacion);
  const diasRestantesParto = calcularDiasRestantes(fechaEstimadaParto);
  
  switch (fase) {
    case 'pre_confirmacion':
      return `Faltan ${diasRestantesConfirmacion} días para confirmar preñez`;
    case 'confirmacion_pendiente':
      return `¡HOY es el día de confirmar preñez!`;
    case 'gestacion':
      return `Preñez en curso, faltan ${diasRestantesParto} días para el parto`;
    case 'pre_parto':
      return `¡PRÓXIMO PARTO! Faltan ${diasRestantesParto} días`;
    case 'vencido_parto':
      return `⚠️ Parto vencido hace ${Math.abs(diasRestantesParto)} días`;
    case 'vencido_confirmacion':
      return `⚠️ Confirmación vencida hace ${Math.abs(diasRestantesConfirmacion)} días`;
    default:
      return `Estado: ${estado}`;
  }
}