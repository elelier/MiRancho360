import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { AuthContextType, Usuario } from '../types';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      setUsuario(session.usuario);
    }
    setIsLoading(false);
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const session = await authService.login(pin);
      if (session) {
        setUsuario(session.usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('useAuth login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const updateUsuario = (usuarioActualizado: Partial<Usuario>) => {
    if (!usuario) return;

    const nuevoUsuario = { ...usuario, ...usuarioActualizado };
    setUsuario(nuevoUsuario);

    const session = authService.getCurrentSession();
    if (session) {
      const nuevaSession = { ...session, usuario: nuevoUsuario };
      localStorage.setItem('mirancho_session', JSON.stringify(nuevaSession));
    }
  };

  const value: AuthContextType = {
    usuario,
    isLoading,
    login,
    logout,
    updateUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
