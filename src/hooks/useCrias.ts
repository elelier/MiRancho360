import { useState, useEffect, useCallback } from 'react';
import { genealogyService } from '../services/genealogy';
import type { Cria, CriasStats } from '../types/genealogy';

export function useCrias(animalId: string | null) {
  const [crias, setCrias] = useState<Cria[]>([]);
  const [stats, setStats] = useState<CriasStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCrias = useCallback(async () => {
    if (!animalId) {
      setCrias([]);
      setStats(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cargar crías y estadísticas en paralelo
      const [criasData, statsData] = await Promise.all([
        genealogyService.getCrias(animalId),
        genealogyService.getCriasStats(animalId),
      ]);

      setCrias(criasData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar crías');
    } finally {
      setIsLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    loadCrias();
  }, [loadCrias]);

  return {
    crias,
    stats,
    isLoading,
    error,
    reload: loadCrias,
  };
}
