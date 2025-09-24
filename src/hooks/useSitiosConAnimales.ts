import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface SitioConAnimales {
  id: number;
  nombre: string;
  tipo: string;
  capacidad?: number;
  ubicacion?: string;
  descripcion?: string;
  activo: boolean;
  animales_count?: number;
  created_at?: string;
}

export function useSitiosConAnimales() {
  const [sitios, setSitios] = useState<SitioConAnimales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSitios();
  }, []);

  const fetchSitios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener sitios con conteo de animales
      const { data, error: fetchError } = await supabase
        .from('sitios')
        .select(`
          *,
          animales_count:animales(count)
        `)
        .eq('activo', true)
        .order('nombre');

      if (fetchError) {
        throw fetchError;
      }

      // Procesar los datos para obtener el conteo correcto
      const sitiosConConteo = (data || []).map(sitio => ({
        ...sitio,
        animales_count: Array.isArray(sitio.animales_count) 
          ? sitio.animales_count.length 
          : sitio.animales_count?.count || 0
      }));

      setSitios(sitiosConConteo);
    } catch (err) {
      console.error('Error fetching sitios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getSitioById = (id: number) => {
    return sitios.find(sitio => sitio.id === id);
  };

  const getSitiosActivos = () => {
    return sitios.filter(sitio => sitio.activo);
  };

  const getSitiosPorTipo = (tipo: string) => {
    return sitios.filter(sitio => sitio.tipo === tipo && sitio.activo);
  };

  return {
    sitios,
    loading,
    error,
    getSitioById,
    getSitiosActivos,
    getSitiosPorTipo,
    refetch: fetchSitios
  };
}