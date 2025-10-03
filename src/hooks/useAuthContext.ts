import { useContext } from 'react';
import type { AuthContextType } from '../types';
import { AuthContext } from './auth-context';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
    canRegisterAnimals,
  };
}
