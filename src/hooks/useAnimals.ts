import { useState, useEffect, useCallback } from 'react';
import { animalsService, razasService, movimientosService } from '../services/animals';
import type { Animal, AnimalFormData, AnimalFilters, Raza, MovimientoAnimal } from '../types';

// Hook para gestionar animales
export function useAnimals(filters?: AnimalFilters) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await animalsService.getAnimals(filters);
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar animales');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleAnimalUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ animalId: string; animal: Partial<Animal> }>;
      const detail = customEvent.detail;
      if (!detail?.animalId || !detail.animal) {
        return;
      }

      setAnimals(prev => prev.map(current => {
        if (current.id !== detail.animalId) {
          return current;
        }

        const next = { ...current } as Record<string, unknown>;

        Object.entries(detail.animal).forEach(([key, value]) => {
          if (value === undefined) {
            delete next[key];
          } else {
            next[key] = value;
          }
        });

        return next as Animal;
      }));
    };

    window.addEventListener('animal-data-updated', handleAnimalUpdated);
    return () => window.removeEventListener('animal-data-updated', handleAnimalUpdated);
  }, []);

  const emitAnimalUpdated = useCallback((animalToEmit: Animal) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('animal-data-updated', {
      detail: { animalId: animalToEmit.id, animal: animalToEmit }
    }));
  }, []);


  const createAnimal = async (animalData: AnimalFormData, usuarioId: string) => {
    try {
      const newAnimal = await animalsService.createAnimal(animalData, usuarioId);
      setAnimals(prev => [newAnimal, ...prev]);
      emitAnimalUpdated(newAnimal);
      return newAnimal;
    } catch (err) {
      console.error('Error al crear animal:', err);
      throw err;
    }
  };

  const updateAnimal = async (id: string, animalData: Partial<AnimalFormData>, usuarioId: string) => {
    try {
      const updatedAnimal = await animalsService.updateAnimal(id, animalData, usuarioId);
      let mergedAnimal: Animal | null = null;

      setAnimals(prev =>
        prev.map(animal => {
          if (animal.id !== id) {
            return animal;
          }
          mergedAnimal = { ...animal, ...updatedAnimal };
          return mergedAnimal;
        })
      );

      if (!mergedAnimal) {
        mergedAnimal = updatedAnimal;
      }

      emitAnimalUpdated(mergedAnimal);
      return mergedAnimal;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar animal');
    }
  };

  const deactivateAnimal = async (id: string, usuarioId: string) => {
    try {
      await animalsService.deactivateAnimal(id, usuarioId);
      setAnimals(prev => prev.filter(animal => animal.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al desactivar animal');
    }
  };

  return {
    animals,
    isLoading,
    error,
    createAnimal,
    updateAnimal,
    deactivateAnimal,
    reload: loadAnimals
  };
}

// Hook para obtener un animal específico
export function useAnimal(id: string | null) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnimal = useCallback(async () => {
    if (!id) {
      setAnimal(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await animalsService.getAnimalById(id);
      setAnimal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar animal');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleAnimalUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ animalId: string; animal: Partial<Animal> }>;
      const detail = customEvent.detail;
      if (!detail?.animalId || detail.animalId !== id || !detail.animal) {
        return;
      }

      setAnimal(prev => {
        const base = prev ? { ...prev } as Record<string, unknown> : {} as Record<string, unknown>;

        Object.entries(detail.animal).forEach(([key, value]) => {
          if (value === undefined) {
            delete base[key];
          } else {
            base[key] = value;
          }
        });

        return base as Animal;
      });
    };

    window.addEventListener('animal-data-updated', handleAnimalUpdated);
    return () => window.removeEventListener('animal-data-updated', handleAnimalUpdated);
  }, [id]);

  useEffect(() => {
    loadAnimal();
  }, [loadAnimal]);

  return { animal, isLoading, error, reload: loadAnimal };
}

// Hook para gestionar razas
export function useRazas() {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRazas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await razasService.getRazas();
        setRazas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar razas');
      } finally {
        setIsLoading(false);
      }
    };

    loadRazas();
  }, []);

  const createRaza = async (nombre: string, descripcion?: string) => {
    try {
      const newRaza = await razasService.createRaza(nombre, descripcion);
      setRazas(prev => [...prev, newRaza]);
      return newRaza;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear raza');
    }
  };

  return {
    razas,
    isLoading,
    error,
    createRaza
  };
}

// Hook para gestionar movimientos de animales
export function useMovimientos(animalId: string | null) {
  const [movimientos, setMovimientos] = useState<MovimientoAnimal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animalId) return;

    const loadMovimientos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await movimientosService.getMovimientosByAnimal(animalId);
        setMovimientos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar movimientos');
      } finally {
        setIsLoading(false);
      }
    };

    loadMovimientos();
  }, [animalId]);

  const createMovimiento = async (movimientoData: Omit<MovimientoAnimal, 'id' | 'fecha_registro' | 'usuario_registro'>, usuarioId: string) => {
    try {
      const newMovimiento = await movimientosService.createMovimiento(movimientoData, usuarioId);
      setMovimientos(prev => [newMovimiento, ...prev]);
      return newMovimiento;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear movimiento');
    }
  };

  return {
    movimientos,
    isLoading,
    error,
    createMovimiento
  };
}