import { useCallback, useEffect, useState } from 'react';
import type { ConfiguracionRancho } from '../types';

// Datos de ejemplo para la configuracion
const configuracionEjemplo: ConfiguracionRancho = {
  id: '1',
  nombre_rancho: 'Rancho San Jose',
  propietario: 'Familia Gonzalez',
  ubicacion: 'Jalisco, Mexico',
  telefono: '+52 33 1234 5678',
  email: 'contacto@ranchosanjose.com',
  descripcion:
    'Rancho familiar dedicado a la ganaderia bovina con mas de 30 anos de experiencia',
  zona_horaria: 'America/Mexico_City',
  moneda: 'MXN',
  configuracion_clima: {
    habilitado: true,
    ubicacion: 'Guadalajara, Jalisco',
    api_key: '',
  },
  fecha_creacion: '2025-01-01T00:00:00Z',
  fecha_actualizacion: new Date().toISOString(),
};

// Interfaz para informacion del clima
export interface InformacionClima {
  temperatura: number;
  sensacion_termica: number;
  humedad: number;
  descripcion: string;
  icono: string;
  viento_velocidad: number;
  probabilidad_lluvia: number;
  fecha_actualizacion: string;
}

// Datos de ejemplo del clima
const climaEjemplo: InformacionClima = {
  temperatura: 26,
  sensacion_termica: 28,
  humedad: 65,
  descripcion: 'Parcialmente nublado',
  icono: 'nublado',
  viento_velocidad: 12,
  probabilidad_lluvia: 30,
  fecha_actualizacion: new Date().toISOString(),
};

export function useRancho() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionRancho | null>(null);
  const [clima, setClima] = useState<InformacionClima | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarConfiguracion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Conectar con Supabase
      setConfiguracion(configuracionEjemplo);
    } catch (err) {
      setError('Error al cargar la configuracion del rancho');
      console.error('Error cargando configuracion del rancho:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarClima = useCallback(async () => {
    try {
      if (!configuracion?.configuracion_clima.habilitado) {
        return;
      }

      // TODO: Integrar con API de clima real (OpenWeatherMap, etc.)
      setClima(climaEjemplo);
    } catch (err) {
      console.error('Error cargando informacion del clima:', err);
      // No establecer error para el clima, es informacion secundaria
    }
  }, [configuracion?.configuracion_clima.habilitado]);

  const actualizarConfiguracion = async (
    nuevaConfiguracion: Partial<ConfiguracionRancho>,
  ) => {
    try {
      // TODO: Conectar con Supabase
      if (configuracion) {
        const configActualizada = {
          ...configuracion,
          ...nuevaConfiguracion,
          fecha_actualizacion: new Date().toISOString(),
        };
        setConfiguracion(configActualizada);
      }
    } catch (err) {
      setError('Error al actualizar la configuracion del rancho');
      throw err;
    }
  };

  const obtenerRecomendacionClima = (): string | null => {
    if (!clima) return null;

    if (clima.probabilidad_lluvia > 70) {
      return 'Alta probabilidad de lluvia. Considere mover el ganado a refugio.';
    }

    if (clima.temperatura > 35) {
      return 'Temperatura alta. Asegure sombra y agua fresca para los animales.';
    }

    if (clima.temperatura < 5) {
      return 'Temperatura baja. Verifique que los animales tengan refugio.';
    }

    if (clima.viento_velocidad > 40) {
      return 'Vientos fuertes. Revise estructuras y refugios.';
    }

    return null;
  };

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);

  useEffect(() => {
    if (configuracion) {
      cargarClima();
    }
  }, [configuracion, cargarClima]);

  return {
    configuracion,
    clima,
    isLoading,
    error,
    actualizarConfiguracion,
    recargarConfiguracion: cargarConfiguracion,
    recargarClima: cargarClima,
    obtenerRecomendacionClima,
  };
}
