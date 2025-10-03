import { supabase } from './supabase';
import type { Usuario, UsuarioFormData, SesionAuth } from '../types';

const pinSalt = import.meta.env.VITE_PIN_SALT;

if (!pinSalt) {
  console.warn('VITE_PIN_SALT no está definido; la autenticación por PIN fallará.');
}

export const authService = {
  async login(pin: string): Promise<SesionAuth | null> {
    if (!pinSalt) {
      return null;
    }

    try {
      const hashedPin = await hashPin(pin);

      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
        .eq('pin', hashedPin)
        .eq('activo', true)
        .single();

      if (error || !data) {
        console.warn('PIN incorrecto o usuario inactivo');
        return null;
      }

      const ultimoAcceso = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ ultimo_acceso: ultimoAcceso })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error actualizando último acceso:', updateError.message);
      }

      const session: SesionAuth = {
        usuario: {
          ...(data as Usuario),
          pin: hashedPin,
          ultimo_acceso: ultimoAcceso,
        },
        token: generateSessionToken(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      localStorage.setItem('mirancho_session', JSON.stringify(session));
      return session;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  },

  async loginWithSupabase(pin: string): Promise<SesionAuth | null> {
    return this.login(pin);
  },

  async logout() {
    localStorage.removeItem('mirancho_session');
  },

  async forceCleanSession() {
    console.log('Limpiando sesión y forzando nuevo login...');
    localStorage.removeItem('mirancho_session');
    window.location.reload();
  },

  getCurrentSession(): SesionAuth | null {
    try {
      const sessionRaw = localStorage.getItem('mirancho_session');
      if (!sessionRaw) {
        return null;
      }

      const session = JSON.parse(sessionRaw) as SesionAuth;
      if (new Date(session.expires_at).getTime() < Date.now()) {
        localStorage.removeItem('mirancho_session');
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error leyendo sesión local:', error);
      localStorage.removeItem('mirancho_session');
      return null;
    }
  },

  async createUsuario(usuarioData: UsuarioFormData) {
    if (usuarioData.pin !== usuarioData.confirmar_pin) {
      throw new Error('Los PINs no coinciden');
    }

    if (!pinSalt) {
      throw new Error('VITE_PIN_SALT no configurado');
    }

    const hashedPin = await hashPin(usuarioData.pin);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol,
        pin: hashedPin,
        activo: true,
      })
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .single();

    if (error) throw error;
    return data;
  },

  async updateUsuario(id: string, usuarioData: Partial<Omit<UsuarioFormData, 'pin' | 'confirmar_pin'>>) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuarioData)
      .eq('id', id)
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .single();

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>;
  },

  async deactivateUsuario(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ activo: false })
      .eq('id', id)
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .single();

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>;
  },

  async changePin(usuarioId: string, pinActual: string, pinNuevo: string): Promise<boolean> {
    if (!pinSalt) {
      throw new Error('VITE_PIN_SALT no configurado');
    }

    try {
      const hashedPinActual = await hashPin(pinActual);
      const hashedPinNuevo = await hashPin(pinNuevo);

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('pin')
        .eq('id', usuarioId)
        .single();

      if (error || usuario?.pin !== hashedPinActual) {
        throw new Error('PIN actual incorrecto');
      }

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ pin: hashedPinNuevo })
        .eq('id', usuarioId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error al cambiar PIN:', error);
      return false;
    }
  },
};

export const usuariosService = {
  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .order('nombre');

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>[];
  },

  async getUsuarioById(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>;
  },
};

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${pinSalt ?? ''}${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
