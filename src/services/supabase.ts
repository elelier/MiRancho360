import { createClient } from '@supabase/supabase-js';

// Variables de entorno - IMPORTANTE: Cambiar estos valores por los reales
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Función para verificar la conexión
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('usuarios').select('count').limit(1);
    if (error) throw error;
    return { success: true, connected: true };
  } catch (error) {
    console.error('Error de conexión con Supabase:', error);
    return { success: false, connected: false, error };
  }
};

// Función para obtener información del proyecto
export const getProjectInfo = async () => {
  try {
    // Esta query básica nos ayuda a verificar si las tablas existen
    const { data, error } = await supabase.rpc('get_project_info');
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.warn('Información del proyecto no disponible:', error);
    return { success: false, error };
  }
};