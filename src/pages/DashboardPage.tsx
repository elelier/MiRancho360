import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import Icon from '../components/common/Icon';
import { SideMenu } from '../components/common/SideMenu';
import { useMovements } from '../hooks/useMovements';
import { useRancho } from '../hooks/useRancho';
import { TIPOS_MOVIMIENTO } from '../types/movements';

export function DashboardPage() {
  const navigate = useNavigate();
  const { obtenerUltimosMovimientos } = useMovements();
  const { configuracion, clima, obtenerRecomendacionClima } = useRancho();

  // Datos de ejemplo para mostrar
  const totalAnimales = 4;
  const totalSitios = 4;
  
  const ultimosMovimientos = obtenerUltimosMovimientos(5);
  const recomendacionClima = obtenerRecomendacionClima();

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors shadow-sm"
            aria-label="Abrir menú principal"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold text-slate-900">Inicio</h1>
          <div className="flex w-12 justify-end" />
        </div>
      </header>

      {/* Menu lateral */}
      <SideMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        currentPage="dashboard"
      />

      <div className="p-6 space-y-8">
        {/* Hero Section - Bienvenida */}
        <div className="relative overflow-hidden bg-primary-600 rounded-2xl shadow-lg border border-primary-500">
          {/* Icono grande de fondo */}
          <div className="absolute top-3 right-3 text-white/15">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          
          <div className="relative p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
                Bienvenido a {configuracion?.nombre_rancho || 'su Rancho'}
              </h1>
              <p className="text-xl text-white/95 font-semibold drop-shadow-sm">
                Gestión simple y al alcance de su mano.
              </p>
            </div>
            
            {/* Información del clima */}
            {clima && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/30">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl drop-shadow-sm">{clima.icono}</span>
                    <span className="text-2xl font-black text-white drop-shadow-sm">{clima.temperatura}°C</span>
                  </div>
                  <div className="text-lg font-semibold text-white/95 drop-shadow-sm">
                    {clima.descripcion}
                  </div>
                  {clima.probabilidad_lluvia > 0 && (
                    <div className="text-lg font-semibold text-white/95 drop-shadow-sm">
                      🌧️ {clima.probabilidad_lluvia}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recomendación del clima si existe */}
            {recomendacionClima && (
              <div className="mt-4">
                <div className="bg-accent-500/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-md border border-accent-400/50">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <span className="text-lg font-semibold leading-relaxed">{recomendacionClima}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="relative overflow-hidden bg-primary-500 rounded-2xl shadow-lg border border-primary-400">
            {/* Icono grande de vaca */}
            <div className="absolute top-3 right-3 text-white/15">
              <Icon name="cow-large" className="w-20 h-20" />
            </div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-base text-white/95 mb-3 font-semibold drop-shadow-sm">Total de Animales</div>
                  <div className="text-5xl font-black text-white drop-shadow-lg">{totalAnimales}</div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/animales')}
                variant="outline"
                size="large"
                className="!text-white !border-white/70 hover:!bg-white/25 !text-lg !py-4 !px-6 backdrop-blur-sm !font-semibold !min-h-[56px]"
                fullWidth
              >
                Administrar Animales
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-accent-600 rounded-2xl shadow-lg border border-accent-500">
            {/* Icono grande de casa con árbol */}
            <div className="absolute top-3 right-3 text-white/15">
              <Icon name="farm-house" className="w-20 h-20" />
            </div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-base text-white/95 mb-3 font-semibold drop-shadow-sm">Total de Sitios</div>
                  <div className="text-5xl font-black text-white drop-shadow-lg">{totalSitios}</div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/sitios')}
                variant="outline"
                size="large"
                className="!text-white !border-white/70 hover:!bg-white/25 !text-lg !py-4 !px-6 backdrop-blur-sm !font-semibold !min-h-[56px]"
                fullWidth
              >
                Administrar Sitios
              </Button>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="relative overflow-hidden bg-primary-700 rounded-2xl shadow-lg border border-primary-600">
          {/* Icono grande de fondo */}
          <div className="absolute top-3 right-3 text-white/15">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          
          <div className="relative p-8">
            <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-sm">Acciones Rápidas</h3>
            <div className="space-y-6">
              <Button
                onClick={() => navigate('/animales/nuevo')}
                className="bg-white/90 hover:bg-white text-primary-800 border-0 !text-xl !py-6 !font-black !min-h-[72px] shadow-lg backdrop-blur-sm"
                fullWidth
                size="large"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-2xl font-black">+</span>
                  <span>Registrar Animal</span>
                </div>
              </Button>
              <Button
                onClick={() => navigate('/eventos/nuevo')}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/70 !text-xl !py-6 !font-black !min-h-[72px] backdrop-blur-sm shadow-md"
                fullWidth
                size="large"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-2xl font-black">+</span>
                  <span>Crear Evento</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Últimos Movimientos */}
        <div className="relative overflow-hidden bg-accent-500 rounded-2xl shadow-lg border border-accent-400">
          {/* Icono grande de fondo */}
          <div className="absolute top-3 right-3 text-white/15">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <div className="relative p-8 border-b border-white/20">
            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white drop-shadow-sm">Últimos Movimientos</h3>
            </div>
          </div>
          
          <div className="relative p-6 space-y-4">
            {ultimosMovimientos.map((movimiento) => {
              const config = TIPOS_MOVIMIENTO[movimiento.tipo];
              const fechaFormateada = new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              });
              
              return (
                <div key={movimiento.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-white/50 hover:bg-white/100 transition-all duration-200 overflow-hidden">
                  {/* Header con icono y tipo */}
                  <div className={`${config.colorBg} px-5 py-4`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <div className={config.color}>
                          <Icon name={config.icono} className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className={`text-lg font-bold ${config.color}`}>
                          {config.nombre}
                        </div>
                        <div className="text-base text-primary-600 font-semibold">
                          {fechaFormateada} • {movimiento.hora}
                        </div>
                      </div>
                      {/* Indicador de sitio en el header */}
                      {(movimiento.sitio_destino || movimiento.sitio_origen) && (
                        <div className="text-sm font-bold text-accent-700 bg-accent-100 px-3 py-2 rounded-full shadow-sm">
                          {movimiento.sitio_destino || movimiento.sitio_origen}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenido principal */}
                  <div className="p-5">
                    <div className="font-black text-primary-800 text-xl mb-2 drop-shadow-sm">
                      {movimiento.animal_nombre ? 
                        `${movimiento.animal_nombre}` : 
                        `Animal`
                      }
                    </div>
                    <div className="text-base text-primary-600 font-bold mb-3 bg-primary-50 px-3 py-1 rounded-lg inline-block">
                      Arete #{movimiento.animal_arete}
                    </div>
                    <div className="text-lg text-primary-700 font-medium leading-relaxed">
                      {movimiento.descripcion}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Botón Ver Todos en la parte inferior */}
          <div className="relative p-6 pt-0">
            <Button
              onClick={() => navigate('/movimientos')}
              variant="outline"
              size="large"
              className="!text-white !border-white/70 hover:!bg-white/25 !text-lg !px-6 !py-3 !font-semibold !min-h-[48px] backdrop-blur-sm"
              fullWidth
            >
              Ver Todos los Movimientos →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}