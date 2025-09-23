import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Datos de ejemplo para mostrar
  const totalAnimales = 4;
  const totalSitios = 4;
  
  const ultimosAnimales = [
    { arete: '123', raza: 'Angus', sexo: 'Hembra', sitio: 'Corral 1' },
    { arete: '124', raza: 'Hereford', sexo: 'Macho', sitio: 'Pastura Norte' },
    { arete: '125', raza: 'Brangus', sexo: 'Hembra', sitio: 'Corral 1' },
  ];

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-primary-800">Inicio</h1>
          <div className="w-12"></div> {/* Spacer */}
        </div>
      </header>

      {/* Menu lateral */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="fixed left-0 top-0 w-80 h-full bg-white shadow-xl">
            {/* Header del menu con logo */}
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🐄</span>
                </div>
                <span className="text-lg font-bold text-primary-800">MiRancho360</span>
              </div>
              <button 
                onClick={() => setShowMenu(false)} 
                className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Menu items */}
            <div className="py-4">
              <button 
                onClick={() => { navigate('/dashboard'); setShowMenu(false); }} 
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-primary-50 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-primary-700">Inicio</span>
              </button>

              <button 
                onClick={() => { navigate('/animales'); setShowMenu(false); }} 
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-primary-50 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">🐄</span>
                </div>
                <span className="text-lg font-medium text-primary-700">Animales</span>
              </button>

              <button 
                onClick={() => { navigate('/sitios'); setShowMenu(false); }} 
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-primary-50 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-primary-700">Sitios</span>
              </button>

              <button 
                onClick={() => { navigate('/reportes'); setShowMenu(false); }} 
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-primary-50 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-primary-700">Reportes</span>
              </button>

              {/* Separador */}
              <div className="mx-6 my-4 border-t border-primary-100"></div>

              <button 
                onClick={() => { logout(); navigate('/login'); setShowMenu(false); }} 
                className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-red-50 transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-red-600">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Hero Section con imagen de fondo */}
        <div 
          className="relative h-52 rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundImage: `linear-gradient(rgba(151,185,130,0.3), rgba(151,185,130,0.3)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%2397B982"/><stop offset="100%" style="stop-color:%23F0F4EF"/></linearGradient></defs><rect width="800" height="400" fill="url(%23sky)"/><path d="M0 300 Q200 250 400 280 T800 290 L800 400 L0 400 Z" fill="%2397B982"/><circle cx="150" cy="100" r="40" fill="%23C5A34A"/><path d="M50 250 Q100 230 150 240 T250 235" stroke="%2397B982" stroke-width="4" fill="none"/><rect x="350" y="220" width="60" height="40" fill="%23C5A34A"/><rect x="360" y="200" width="40" height="20" fill="%23B8953F"/></svg>')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-3xl font-bold mb-3 drop-shadow-lg">Bienvenido a su Rancho</h1>
            <p className="text-lg opacity-95 drop-shadow-md">Gestión simple y al alcance de su mano.</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-primary-600 mb-2 font-medium">Total de Animales</div>
                <div className="text-3xl font-bold text-primary-800">{totalAnimales}</div>
              </div>
              <div className="text-accent-400 text-4xl">
                🐄
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-primary-600 mb-2 font-medium">Total de Sitios</div>
                <div className="text-3xl font-bold text-primary-800">{totalSitios}</div>
              </div>
              <div className="text-accent-400 text-4xl">
                📍
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-primary-100">
          <h3 className="text-lg font-bold text-primary-800 mb-6">Acciones Rápidas</h3>
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/animales/nuevo')}
              className="bg-primary-400 hover:bg-primary-500 text-white border-0 !text-lg !py-4"
              fullWidth
              size="large"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">+</span>
                <span>Registrar Animal</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/sitios/nuevo')}
              className="bg-white text-primary-700 border-2 border-primary-300 hover:bg-primary-50 !text-lg !py-4"
              fullWidth
              size="large"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">+</span>
                <span>Crear Sitio</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Últimos Animales Registrados */}
        <div className="bg-white rounded-2xl shadow-md border border-primary-100">
          <div className="p-6 border-b border-primary-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-800">Últimos Animales Registrados</h3>
              <Button
                onClick={() => navigate('/animales')}
                variant="outline"
                size="small"
                className="!text-accent-500 !border-accent-400 hover:!bg-accent-50 !text-base !px-4 !py-2"
              >
                Ver Todos →
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {ultimosAnimales.map((animal) => (
              <div key={animal.arete} className="flex items-center justify-between p-4 bg-background rounded-xl border border-primary-100">
                <div>
                  <div className="font-bold text-primary-800 text-lg">Arete: {animal.arete}</div>
                  <div className="text-primary-600">{animal.raza} - {animal.sexo}</div>
                </div>
                <div className="text-right">
                  <div className="text-accent-600 font-medium">{animal.sitio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}