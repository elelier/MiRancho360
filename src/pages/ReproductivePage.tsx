import { useState } from 'react';
import { useReproductive } from '../hooks/useReproductive';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Layout } from '../components/common/Layout';
import Icon from '../components/common/Icon';
import { MatingEventModal } from '../components/animals/MatingEventModal';
import { PregnancyConfirmationModal } from '../components/animals/PregnancyConfirmationModal';
import { DirectPregnancyModal } from '../components/animals/DirectPregnancyModal';
import type { DirectPregnancyData } from '../components/animals/DirectPregnancyModal';
import { 
  calcularDiasRestantes,
  esFechaProxima,
  esFechaVencida
} from '../utils/pregnancyCalculator';
import type { EventoMonta } from '../types/reproductive';

const ESTADO_MONTA_LABELS = {
  'pendiente': 'Pendiente',
  'confirmada': 'Confirmada',
  'fallida': 'Fallida',
  'parto_exitoso': 'Parto Exitoso',
  'cancelada': 'Cancelada'
};

const ESTADO_MONTA_COLORS = {
  'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'confirmada': 'bg-green-100 text-green-800 border-green-200',
  'fallida': 'bg-red-100 text-red-800 border-red-200',
  'parto_exitoso': 'bg-blue-100 text-blue-800 border-blue-200',
  'cancelada': 'bg-gray-100 text-gray-800 border-gray-200'
};

export function ReproductivePage() {
  const {
    eventos,
    preñeces,
    estadisticas,
    loadingEventos,
    loadingPreñeces,
    loadingEstadisticas,
    loadMatingEvents,
    loadStatistics,
    confirmPregnancyResult,
    createDirectPregnancy,
    recordBirth,
    confirmingPregnancy,
    recordingBirth,
    getPendingConfirmations,
    getUpcomingBirths
  } = useReproductive();

  const [showMatingModal, setShowMatingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDirectPregnancyModal, setShowDirectPregnancyModal] = useState(false);
  const [selectedEventForConfirmation, setSelectedEventForConfirmation] = useState<EventoMonta | null>(null);
  const [selectedTab, setSelectedTab] = useState<'montas' | 'preñeces' | 'calendario'>('montas');

  // Estados para filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');


  const confirmacionesPendientes = getPendingConfirmations();
  const partosProximos = getUpcomingBirths();

  // Debug: Verificar datos
  console.log('🔍 DEBUG Reproducción:');
  console.log('- Eventos cargados:', eventos.length);
  console.log('- Confirmaciones pendientes:', confirmacionesPendientes.length);
  console.log('- Eventos completos:', eventos);
  console.log('- Confirmaciones detectadas:', confirmacionesPendientes);

  const formatFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00.000Z').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAnimalInfo = (animal?: { arete: string; nombre?: string }) => {
    if (!animal) return 'N/A';
    return animal.nombre ? `${animal.arete} - ${animal.nombre}` : animal.arete;
  };

  // Funciones de filtrado
  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = !searchQuery || 
      evento.hembra?.arete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.hembra?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.macho?.arete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.macho?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.hembra?.raza?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.macho?.raza?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEstado = !filtroEstado || evento.estado_monta === filtroEstado;
    
    const matchesFecha = !filtroFecha || (() => {
      const eventoDate = new Date(evento.fecha_monta);
      const today = new Date();
      
      switch (filtroFecha) {
        case 'hoy':
          return eventoDate.toDateString() === today.toDateString();
        case 'semana': {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return eventoDate >= weekAgo;
        }
        case 'mes': {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return eventoDate >= monthAgo;
        }
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesEstado && matchesFecha;
  });

  const filteredPreñeces = preñeces.filter(preñez => {
    const matchesSearch = !searchQuery ||
      preñez.hembra?.arete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preñez.hembra?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preñez.macho?.arete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preñez.macho?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preñez.hembra?.raza?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preñez.macho?.raza?.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFecha = !filtroFecha || (() => {
      const partoDate = new Date(preñez.fecha_parto_estimada);
      const today = new Date();
      
      switch (filtroFecha) {
        case 'proximos_7': {
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return partoDate >= today && partoDate <= nextWeek;
        }
        case 'proximos_30': {
          const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          return partoDate >= today && partoDate <= nextMonth;
        }
        case 'vencidos':
          return partoDate < today;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesFecha;
  });

  const handlePregnancyConfirmation = async (eventoId: string, isPregnant: boolean, observaciones?: string) => {
    await confirmPregnancyResult(eventoId, isPregnant, observaciones);
    setShowConfirmationModal(false);
    setSelectedEventForConfirmation(null);
  };

  const handleDirectPregnancy = async (data: DirectPregnancyData) => {
    await createDirectPregnancy(data);
    setShowDirectPregnancyModal(false);
  };

  const handleConfirmPregnancy = (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (evento) {
      setSelectedEventForConfirmation(evento);
      setShowConfirmationModal(true);
    }
  };

  const handleRecordBirth = async (preñezId: string) => {
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    if (confirm('¿Registrar parto exitoso?')) {
      try {
        await recordBirth(preñezId, fechaHoy, 1, 'Parto registrado por el usuario');
      } catch (error) {
        console.error('Error registrando parto:', error);
        alert('Error al registrar parto');
      }
    }
  };

  const getStatusBadge = (evento: EventoMonta) => {
    let className = ESTADO_MONTA_COLORS[evento.estado_monta];
    let texto = ESTADO_MONTA_LABELS[evento.estado_monta];
    
    // Agregar información contextual basada en fechas
    if (evento.estado_monta === 'pendiente') {
      if (evento.fecha_confirmacion_prenez) {
        const diasConfirmacion = calcularDiasRestantes(evento.fecha_confirmacion_prenez);
        if (diasConfirmacion < 0) {
          texto = `Confirmar (vencido ${Math.abs(diasConfirmacion)}d)`;
          className = 'bg-red-100 text-red-800 border-red-200';
        } else if (diasConfirmacion <= 3) {
          texto = `Confirmar (${diasConfirmacion}d)`;
          className = 'bg-orange-100 text-orange-800 border-orange-200';
        }
      }
    }
    
    return { className, texto };
  };

  if (loadingEventos || loadingPreñeces || loadingEstadisticas) {
    return (
      <Layout title="🐂 Reproducción">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="🐂 Reproducción"
      useSideMenu={true}
      currentPage="reproductive"
    >
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Icon name="heart" className="w-8 h-8 text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Dashboard Reproductivo
                </h2>
                <p className="text-gray-600">
                  Control del ciclo reproductivo del rancho
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowMatingModal(true)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <Icon name="plus" className="w-5 h-5" />
                <span>Registrar Monta</span>
              </Button>
              <Button
                onClick={() => setShowDirectPregnancyModal(true)}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Icon name="star" className="w-5 h-5" />
                <span>Preñez Directa</span>
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Montas</p>
                    <p className="text-2xl font-bold text-gray-800">{estadisticas.total_montas}</p>
                  </div>
                  <Icon name="heart" className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">{estadisticas.montas_pendientes}</p>
                  </div>
                  <Icon name="clock" className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Gestantes</p>
                    <p className="text-2xl font-bold text-green-800">{estadisticas.animales_gestantes}</p>
                  </div>
                  <Icon name="star" className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Tasa Éxito</p>
                    <p className="text-2xl font-bold text-blue-800">{estadisticas.tasa_exito}%</p>
                  </div>
                  <Icon name="chart" className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alertas importantes */}
        {(confirmacionesPendientes.length > 0 || partosProximos.length > 0) && (
          <div className="space-y-4">
            {/* Confirmaciones pendientes */}
            {confirmacionesPendientes.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="bell" className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Confirmaciones Pendientes ({confirmacionesPendientes.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {confirmacionesPendientes.slice(0, 3).map(evento => (
                    <div key={evento.id} className="flex items-center justify-between bg-white rounded p-3">
                      <div>
                        <p className="font-medium text-yellow-800">
                          {formatAnimalInfo(evento.hembra)}
                        </p>
                        <p className="text-sm text-yellow-600">
                          Monta: {formatFecha(evento.fecha_monta)} • 
                          Confirmar: {formatFecha(evento.fecha_confirmacion_prenez || '')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleConfirmPregnancy(evento.id)}
                        variant="primary"
                        className="text-sm"
                        isLoading={confirmingPregnancy}
                        disabled={confirmingPregnancy}
                      >
                        Confirmar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partos próximos */}
            {partosProximos.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="star" className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Partos Próximos ({partosProximos.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {partosProximos.slice(0, 3).map(preñez => (
                    <div key={preñez.id} className="flex items-center justify-between bg-white rounded p-3">
                      <div>
                        <p className="font-medium text-green-800">
                          {formatAnimalInfo(preñez.hembra)}
                        </p>
                        <p className="text-sm text-green-600">
                          Parto estimado: {formatFecha(preñez.fecha_parto_estimada)}
                          ({calcularDiasRestantes(preñez.fecha_parto_estimada)} días)
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRecordBirth(preñez.id)}
                        variant="primary"
                        className="text-sm"
                        isLoading={recordingBirth}
                        disabled={recordingBirth}
                      >
                        Registrar Parto
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs para diferentes vistas */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('montas')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                selectedTab === 'montas'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="heart" className="w-4 h-4" />
                <span>Eventos de Monta ({eventos.length})</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('preñeces')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                selectedTab === 'preñeces'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="star" className="w-4 h-4" />
                <span>Preñeces Activas ({preñeces.length})</span>
              </div>
            </button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Campo de búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder={`Buscar por arete, nombre o raza...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro por estado */}
              <div>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {selectedTab === 'montas' ? (
                    <>
                      <option value="">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="fallida">Fallida</option>
                      <option value="parto_exitoso">Parto Exitoso</option>
                      <option value="cancelada">Cancelada</option>
                    </>
                  ) : (
                    <>
                      <option value="">Todas las preñeces</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="parto_exitoso">Parto Exitoso</option>
                      <option value="aborto">Aborto</option>
                      <option value="parto_complicado">Parto Complicado</option>
                    </>
                  )}
                </select>
              </div>

              {/* Filtro por fecha */}
              <div>
                <select
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {selectedTab === 'montas' ? (
                    <>
                      <option value="">Todas las fechas</option>
                      <option value="hoy">Hoy</option>
                      <option value="semana">Última semana</option>
                      <option value="mes">Último mes</option>
                    </>
                  ) : (
                    <>
                      <option value="">Todas las fechas</option>
                      <option value="proximos_7">Próximos 7 días</option>
                      <option value="proximos_30">Próximos 30 días</option>
                      <option value="vencidos">Partos vencidos</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-3 text-sm text-gray-600">
              {selectedTab === 'montas' 
                ? `Mostrando ${filteredEventos.length} de ${eventos.length} eventos`
                : `Mostrando ${filteredPreñeces.length} de ${preñeces.length} preñeces`
              }
            </div>
          </div>

          <div className="p-6">
            {selectedTab === 'montas' && (
              <div className="space-y-4">
                {filteredEventos.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="heart" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      {eventos.length === 0 ? 'Sin eventos de monta' : 'Sin resultados'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {eventos.length === 0 
                        ? 'Aún no has registrado eventos de monta'
                        : 'Ajusta los filtros para ver más resultados'
                      }
                    </p>
                    <div className="flex space-x-3 justify-center">
                      <Button
                        onClick={() => setShowMatingModal(true)}
                        variant="primary"
                      >
                        Registrar Primera Monta
                      </Button>
                      <Button
                        onClick={() => setShowDirectPregnancyModal(true)}
                        variant="secondary"
                      >
                        Registrar Preñez Directa
                      </Button>
                    </div>
                  </div>
                ) : (
                  filteredEventos.map(evento => {
                    const status = getStatusBadge(evento);
                    
                    return (
                      <div 
                        key={evento.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-800">
                                {formatAnimalInfo(evento.hembra)}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                                {status.texto}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-2">
                                <Icon name="male" className="w-4 h-4" />
                                <span>Macho: {formatAnimalInfo(evento.macho)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Icon name="calendar" className="w-4 h-4" />
                                <span>Monta: {formatFecha(evento.fecha_monta)}</span>
                              </div>
                              
                              {evento.fecha_estimada_parto && (
                                <div className="flex items-center space-x-2">
                                  <Icon name="star" className="w-4 h-4" />
                                  <span>Parto est.: {formatFecha(evento.fecha_estimada_parto)}</span>
                                </div>
                              )}
                            </div>
                            
                            {evento.observaciones && (
                              <p className="text-gray-600 text-sm">
                                {evento.observaciones}
                              </p>
                            )}
                          </div>
                          
                          {evento.estado_monta === 'pendiente' && evento.fecha_confirmacion_prenez && (
                            esFechaVencida(evento.fecha_confirmacion_prenez) || 
                            esFechaProxima(evento.fecha_confirmacion_prenez, 3)
                          ) && (
                            <Button
                              onClick={() => handleConfirmPregnancy(evento.id)}
                              variant="primary"
                              className="text-sm ml-4"
                            >
                              Confirmar Preñez
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {selectedTab === 'preñeces' && (
              <div className="space-y-4">
                {filteredPreñeces.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="star" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      {preñeces.length === 0 ? 'Sin preñeces confirmadas' : 'Sin resultados'}
                    </h3>
                    <p className="text-gray-500">
                      {preñeces.length === 0 
                        ? 'Las preñeces aparecerán aquí cuando confirmes eventos de monta'
                        : 'Ajusta los filtros para ver más resultados'
                      }
                    </p>
                  </div>
                ) : (
                  filteredPreñeces.map(preñez => (
                    <div 
                      key={preñez.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {formatAnimalInfo(preñez.hembra)}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon name="male" className="w-4 h-4" />
                              <span>Padre: {formatAnimalInfo(preñez.macho)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Icon name="calendar" className="w-4 h-4" />
                              <span>Confirmado: {formatFecha(preñez.fecha_confirmacion || '')}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Icon name="star" className="w-4 h-4" />
                              <span>
                                Parto est.: {formatFecha(preñez.fecha_parto_estimada)}
                                ({calcularDiasRestantes(preñez.fecha_parto_estimada)} días)
                              </span>
                            </div>
                          </div>
                          
                          {preñez.observaciones && (
                            <p className="text-gray-600 text-sm">
                              {preñez.observaciones}
                            </p>
                          )}
                        </div>
                        
                        {preñez.estado_preñez === 'confirmada' && (
                          esFechaVencida(preñez.fecha_parto_estimada) || 
                          esFechaProxima(preñez.fecha_parto_estimada, 7)
                        ) && (
                          <Button
                            onClick={() => handleRecordBirth(preñez.id)}
                            variant="primary"
                            className="text-sm ml-4"
                          >
                            Registrar Parto
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para registrar evento de monta */}
      {showMatingModal && (
        <MatingEventModal
          onClose={() => setShowMatingModal(false)}
          onEventCreated={() => {
            setShowMatingModal(false);
            loadMatingEvents();
            loadStatistics();
          }}
        />
      )}

      {showConfirmationModal && selectedEventForConfirmation && (
        <PregnancyConfirmationModal
          evento={selectedEventForConfirmation}
          onClose={() => {
            setShowConfirmationModal(false);
            setSelectedEventForConfirmation(null);
          }}
          onConfirm={handlePregnancyConfirmation}
        />
      )}

      {showDirectPregnancyModal && (
        <DirectPregnancyModal
          onClose={() => setShowDirectPregnancyModal(false)}
          onConfirm={handleDirectPregnancy}
        />
      )}
    </Layout>
  );
}