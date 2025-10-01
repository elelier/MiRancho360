import { useState, useEffect, useCallback } from 'react';
import { observacionesService } from '../services/observaciones';
import type { Observacion, ObservacionFormData, ObservacionFilters } from '../types/observaciones';

export function useObservaciones(filters?: ObservacionFilters) {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadObservaciones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await observacionesService.getObservaciones(filters);
      setObservaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar observaciones');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadObservaciones();
  }, [loadObservaciones]);

  const createObservacion = async (
    animalId: string,
    observacionData: ObservacionFormData,
    usuarioId: string
  ) => {
    try {
      const newObservacion = await observacionesService.createObservacion(
        animalId,
        observacionData,
        usuarioId
      );
      setObservaciones(prev => [newObservacion, ...prev]);
      return newObservacion;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear observación');
    }
  };

  const updateObservacion = async (id: string, observacionData: Partial<ObservacionFormData>) => {
    try {
      const updatedObservacion = await observacionesService.updateObservacion(id, observacionData);
      setObservaciones(prev =>
        prev.map(obs => (obs.id === id ? updatedObservacion : obs))
      );
      return updatedObservacion;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar observación');
    }
  };

  const deleteObservacion = async (id: string) => {
    try {
      await observacionesService.deleteObservacion(id);
      setObservaciones(prev => prev.filter(obs => obs.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar observación');
    }
  };

  const archivarObservacion = async (id: string) => {
    try {
      await observacionesService.archivarObservacion(id);
      setObservaciones(prev => prev.filter(obs => obs.id !== id)); // Remover de la lista
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al archivar observación');
    }
  };

  return {
    observaciones,
    isLoading,
    error,
    createObservacion,
    updateObservacion,
    deleteObservacion,
    archivarObservacion,
    reload: loadObservaciones,
  };
}

// Hook específico para observaciones de un animal
export function useAnimalObservaciones(animalId: string | null) {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadObservaciones = useCallback(async () => {
    if (!animalId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await observacionesService.getObservacionesByAnimal(animalId);
      setObservaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar observaciones');
    } finally {
      setIsLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    loadObservaciones();
  }, [loadObservaciones]);

  return {
    observaciones,
    isLoading,
    error,
    reload: loadObservaciones,
  };
}
