import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { Usuario, AuthContextType } from '../types';

// Context de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar la app
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      setUsuario(session.usuario);
    }
    setIsLoading(false);
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    console.log('🪝 Hook useAuth - login llamado con PIN:', pin);
    setIsLoading(true);
    try {
      const session = await authService.login(pin);
      console.log('🪝 Hook useAuth - sesión recibida:', session);
      if (session) {
        setUsuario(session.usuario);
        console.log('🪝 Hook useAuth - usuario establecido:', session.usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('🪝 Hook useAuth - Error en login:', error);
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
    if (usuario) {
      const nuevoUsuario = { ...usuario, ...usuarioActualizado };
      setUsuario(nuevoUsuario);
      
      // Actualizar también en localStorage
      const session = authService.getCurrentSession();
      if (session) {
        const nuevaSession = { ...session, usuario: nuevoUsuario };
        localStorage.setItem('mirancho_session', JSON.stringify(nuevaSession));
      }
    }
  };

  const value: AuthContextType = {
    usuario,
    isLoading,
    login,
    logout,
    updateUsuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Hook para verificar si el usuario tiene permisos
export function usePermissions() {
  const { usuario } = useAuth();

  const canManageUsers = usuario?.rol === 'administrador';
  const canEditAnimals = usuario?.rol === 'administrador' || usuario?.rol === 'colaborador';
  const canEditSites = usuario?.rol === 'administrador';
  const canViewReports = usuario?.rol === 'administrador' || usuario?.rol === 'familiar';
  const canRegisterAnimals = usuario?.rol === 'administrador' || usuario?.rol === 'colaborador';

  return {
    canManageUsers,
    canEditAnimals,
    canEditSites,
    canViewReports,
    canRegisterAnimals
  };
}