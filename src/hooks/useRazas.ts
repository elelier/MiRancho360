import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface Raza {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
}

export function useRazas() {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRazas();
  }, []);

  const fetchRazas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('razas')
        .select('*')
        .order('nombre');

      if (fetchError) {
        throw fetchError;
      }

      setRazas(data || []);
    } catch (err) {
      console.error('Error fetching razas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createRaza = async (raza: Omit<Raza, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('razas')
        .insert([raza])
        .select()
        .single();

      if (error) throw error;

      setRazas(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      return data;
    } catch (err) {
      console.error('Error creating raza:', err);
      throw err;
    }
  };

  const updateRaza = async (id: number, updates: Partial<Omit<Raza, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('razas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRazas(prev => 
        prev.map(raza => raza.id === id ? data : raza)
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
      return data;
    } catch (err) {
      console.error('Error updating raza:', err);
      throw err;
    }
  };

  const deleteRaza = async (id: number) => {
    try {
      const { error } = await supabase
        .from('razas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRazas(prev => prev.filter(raza => raza.id !== id));
    } catch (err) {
      console.error('Error deleting raza:', err);
      throw err;
    }
  };

  return {
    razas,
    loading,
    error,
    createRaza,
    updateRaza,
    deleteRaza,
    refetch: fetchRazas
  };
}