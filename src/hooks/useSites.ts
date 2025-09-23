import { useState, useEffect, useCallback } from 'react';
import { sitiosService, tiposSitioService } from '../services/sites';
import type { Sitio, SitioFormData, SitioFilters, SitioConAnimales, TipoSitio } from '../types';

// Hook para gestionar sitios
export function useSitios(filters?: SitioFilters) {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSitios = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await sitiosService.getSitios(filters);
      setSitios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sitios');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSitios();
  }, [loadSitios]);

  const createSitio = async (sitioData: SitioFormData, usuarioId: string) => {
    try {
      const newSitio = await sitiosService.createSitio(sitioData, usuarioId);
      setSitios(prev => [newSitio, ...prev]);
      return newSitio;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear sitio');
    }
  };

  const updateSitio = async (id: string, sitioData: Partial<SitioFormData>, usuarioId: string) => {
    try {
      const updatedSitio = await sitiosService.updateSitio(id, sitioData, usuarioId);
      setSitios(prev => prev.map(sitio => sitio.id === id ? updatedSitio : sitio));
      return updatedSitio;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar sitio');
    }
  };

  const deactivateSitio = async (id: string, usuarioId: string) => {
    try {
      await sitiosService.deactivateSitio(id, usuarioId);
      setSitios(prev => prev.filter(sitio => sitio.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al desactivar sitio');
    }
  };

  return {
    sitios,
    isLoading,
    error,
    createSitio,
    updateSitio,
    deactivateSitio,
    reload: loadSitios
  };
}

// Hook para sitios con conteo de animales
export function useSitiosConAnimales(filters?: SitioFilters) {
  const [sitios, setSitios] = useState<SitioConAnimales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSitios = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await sitiosService.getSitiosConAnimales(filters);
      setSitios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sitios');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSitios();
  }, [loadSitios]);

  return {
    sitios,
    isLoading,
    error,
    reload: loadSitios
  };
}

// Hook para obtener un sitio específico
export function useSitio(id: string | null) {
  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadSitio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await sitiosService.getSitioById(id);
        setSitio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar sitio');
      } finally {
        setIsLoading(false);
      }
    };

    loadSitio();
  }, [id]);

  return { sitio, isLoading, error };
}

// Hook para gestionar tipos de sitio
export function useTiposSitio() {
  const [tipos, setTipos] = useState<TipoSitio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTipos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tiposSitioService.getTiposSitio();
        setTipos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar tipos de sitio');
      } finally {
        setIsLoading(false);
      }
    };

    loadTipos();
  }, []);

  const createTipoSitio = async (nombre: string, descripcion?: string, color?: string, icono?: string) => {
    try {
      const newTipo = await tiposSitioService.createTipoSitio(nombre, descripcion, color, icono);
      setTipos(prev => [...prev, newTipo]);
      return newTipo;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear tipo de sitio');
    }
  };

  return {
    tipos,
    isLoading,
    error,
    createTipoSitio
  };
}

// Hook para obtener animales en un sitio específico
export function useAnimalesEnSitio(sitioId: string | null) {
  const [animales, setAnimales] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sitioId) return;

    const loadAnimales = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await sitiosService.getAnimalesEnSitio(sitioId);
        setAnimales(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar animales del sitio');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimales();
  }, [sitioId]);

  return { animales, isLoading, error };
}