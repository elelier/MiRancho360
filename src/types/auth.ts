export interface Usuario {
  id: string;
  nombre: string;
  email?: string;
  rol: RolUsuario;
  pin: string; // Hash del PIN de 4 dígitos
  activo: boolean;
  fecha_registro: string;
  ultimo_acceso?: string;
}

export type RolUsuario = 'administrador' | 'colaborador' | 'familiar';

export interface SesionAuth {
  usuario: Usuario;
  token: string;
  expires_at: string;
}

// Para el formulario de login
export interface LoginFormData {
  pin: string;
}

// Para el formulario de registro de usuario
export interface UsuarioFormData {
  nombre: string;
  email?: string;
  rol: RolUsuario;
  pin: string;
  confirmar_pin: string;
}

// Context de autenticación
export interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  updateUsuario: (usuario: Partial<Usuario>) => void;
}