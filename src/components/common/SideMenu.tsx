import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from './Icon';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    path: '/dashboard',
    ariaLabel: 'Ir a inicio',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'animals',
    label: 'Animales',
    path: '/animales',
    ariaLabel: 'Gestionar animales',
    icon: <Icon name="cow-large" className="w-7 h-7 text-white" />
  },
  {
    id: 'sites',
    label: 'Sitios',
    path: '/sitios',
    ariaLabel: 'Gestionar sitios',
    icon: <Icon name="farm-house" className="w-7 h-7 text-white" />
  },
  {
    id: 'reports',
    label: 'Reportes',
    path: '/reportes',
    ariaLabel: 'Ver reportes',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

export function SideMenu({ isOpen, onClose, currentPage }: SideMenuProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50" onClick={onClose}>
      <div 
        className="fixed left-0 top-0 w-96 h-full bg-gradient-to-b from-primary-600 to-primary-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del menu con logo */}
        <div className="flex items-center justify-between p-8 border-b border-primary-500/50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="cow-large" className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-white drop-shadow-sm">MiRancho360</span>
              <div className="text-sm text-white/80 font-medium">Gestión Ganadera</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm min-w-[56px] min-h-[56px] flex items-center justify-center"
            aria-label="Cerrar menú"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu items */}
        <div className="py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id || 
              (item.path === '/dashboard' && (currentPage === 'dashboard' || currentPage === undefined));
            
            return (
              <button 
                key={item.id}
                onClick={() => handleNavigate(item.path)} 
                className={`w-full flex items-center space-x-5 px-8 py-5 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm ${
                  isActive ? 'bg-white/15 border-r-4 border-white/50' : ''
                }`}
                aria-label={item.ariaLabel}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  {item.icon}
                </div>
                <span className={`text-xl font-bold text-white drop-shadow-sm ${
                  isActive ? 'text-white' : ''
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Separador */}
          <div className="mx-8 my-6 border-t border-white/30"></div>

          {/* Botón de cerrar sesión */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-5 px-8 py-5 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm"
            aria-label="Cerrar sesión"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-red-400/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white drop-shadow-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}