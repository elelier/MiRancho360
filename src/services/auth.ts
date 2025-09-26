import { supabase } from './supabase';
import type { Usuario, UsuarioFormData, SesionAuth } from '../types';

// ========== AUTENTICACIÓN TEMPORAL (SIN SUPABASE) ==========

// Usuario real de producción de Supabase
const TEMP_USER: Usuario = {
  id: 'b0eb53d4-2754-4762-8642-4c63236dd211', // ID real de la BD
  nombre: 'Administrador',
  email: 'admin@rancho.com',
  rol: 'administrador',
  pin: '1234',
  activo: true,
  fecha_registro: '2025-09-24T01:04:48.804196Z',
  ultimo_acceso: new Date().toISOString()
};

export const authService = {
  // Login con PIN de 4 dígitos (TEMPORAL - sin Supabase)
  async login(pin: string): Promise<SesionAuth | null> {
    try {
      console.log('🔐 Intentando login con PIN:', pin);
      
      // Verificar PIN temporal
      if (pin === '1234') {
        console.log('✅ PIN correcto, creando sesión...');
        
        // Crear sesión local
        const session: SesionAuth = {
          usuario: TEMP_USER,
          token: generateSessionToken(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };

        // Guardar en localStorage
        localStorage.setItem('mirancho_session', JSON.stringify(session));
        console.log('💾 Sesión guardada en localStorage');

        return session;
      } else {
        console.log('❌ PIN incorrecto');
        return null;
      }
    } catch (error) {
      console.error('💥 Error en login:', error);
      return null;
    }
  },

  // Login con PIN de 4 dígitos (PRODUCCIÓN - con Supabase)
  async loginWithSupabase(pin: string): Promise<SesionAuth | null> {
    try {
      // Hashear el PIN para comparar con la base de datos
      const hashedPin = await hashPin(pin);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('pin', hashedPin)
        .eq('activo', true)
        .single();

      if (error || !data) {
        throw new Error('PIN incorrecto');
      }

      // Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', data.id);

      // Crear sesión local (sin usar Supabase Auth ya que usamos PIN)
      const session: SesionAuth = {
        usuario: data as Usuario,
        token: generateSessionToken(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      // Guardar en localStorage
      localStorage.setItem('mirancho_session', JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem('mirancho_session');
  },

  // Forzar limpieza de sesión y nuevo login (para desarrollo)
  async forceCleanSession() {
    console.log('🧹 Limpiando sesión y forzando nuevo login...');
    localStorage.removeItem('mirancho_session');
    // Recargar la página para forzar nuevo login
    window.location.reload();
  },

  // Obtener sesión actual
  getCurrentSession(): SesionAuth | null {
    try {
      const sessionData = localStorage.getItem('mirancho_session');
      if (!sessionData) return null;

      const session: SesionAuth = JSON.parse(sessionData);
      
      // Verificar si la sesión ha expirado
      if (new Date(session.expires_at) < new Date()) {
        localStorage.removeItem('mirancho_session');
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      localStorage.removeItem('mirancho_session');
      return null;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  },

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    const session = this.getCurrentSession();
    return session?.usuario || null;
  },

  // Cambiar PIN
  async changePin(usuarioId: string, pinActual: string, pinNuevo: string): Promise<boolean> {
    try {
      const hashedPinActual = await hashPin(pinActual);
      const hashedPinNuevo = await hashPin(pinNuevo);

      // Verificar PIN actual
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('pin')
        .eq('id', usuarioId)
        .single();

      if (error || usuario.pin !== hashedPinActual) {
        throw new Error('PIN actual incorrecto');
      }

      // Actualizar PIN
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
  }
};

// ========== USUARIOS ==========

export const usuariosService = {
  // Obtener todos los usuarios
  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .order('nombre');

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>[];
  },

  // Obtener usuario por ID
  async getUsuarioById(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>;
  },

  // Crear nuevo usuario
  async createUsuario(usuarioData: UsuarioFormData) {
    if (usuarioData.pin !== usuarioData.confirmar_pin) {
      throw new Error('Los PINs no coinciden');
    }

    const hashedPin = await hashPin(usuarioData.pin);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol,
        pin: hashedPin,
        activo: true
      })
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar usuario
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

  // Desactivar usuario
  async deactivateUsuario(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ activo: false })
      .eq('id', id)
      .select('id, nombre, email, rol, activo, fecha_registro, ultimo_acceso')
      .single();

    if (error) throw error;
    return data as Omit<Usuario, 'pin'>;
  }
};

// ========== UTILIDADES ==========

// Función simple para hashear PIN (en producción usar bcrypt o similar)
async function hashPin(pin: string): Promise<string> {
  // Por simplicidad, usamos una función básica
  // En producción, implementar un hash más seguro
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'MIRANCHO_SALT_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generar token de sesión
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}