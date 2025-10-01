import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnimal } from '../hooks/useAnimals';
import { useAnimalObservaciones } from '../hooks/useObservaciones';
import { useReminders } from '../hooks/useReminders';
import { useCrias } from '../hooks/useCrias';
import { useAuth } from '../hooks/useAuth';
import { observacionesService } from '../services/observaciones';
import Icon from '../components/common/Icon';
import { Button } from '../components/common/Button';
import { MoveAnimalModal } from '../components/animals/MoveAnimalModal';
import { PhotoGalleryModal } from '../components/animals/PhotoGalleryModal';
import { AddObservacionModal } from '../components/animals/AddObservacionModal';
import type { ObservacionFormData } from '../types/observaciones';

type TabType = 'resumen' | 'salud' | 'reproduccion';

export function AnimalProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { animal, isLoading, error } = useAnimal(id || null);
  const { observaciones, reload: reloadObservaciones } = useAnimalObservaciones(id || null);
  const { recordatorios, markAsCompleted, deleteReminder } = useReminders();
  const { crias, stats, isLoading: criasLoading } = useCrias(id || null);

  // Filtrar recordatorios del animal actual (solo pendientes)
  const animalReminders = recordatorios.filter(
    r => r.animal_id === id && r.estado === 'pendiente'
  );

  // Estados para pestañas
  const [activeTab, setActiveTab] = useState<TabType>('resumen');

  // Estados para modales
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showAddObservacion, setShowAddObservacion] = useState(false);

  // Estados para secciones colapsibles
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [genealogiaExpanded, setGenealogiaExpanded] = useState(true);
  const [criasExpanded, setCriasExpanded] = useState(true);
  const [recordatoriosExpanded, setRecordatoriosExpanded] = useState(true);
  const [observacionesExpanded, setObservacionesExpanded] = useState(true);

  // Función para cerrar y volver
  const handleGoBack = () => {
    navigate('/animales');
  };

  // Función para editar
  const handleEdit = () => {
    navigate(`/animales/${id}/editar`);
  };

  // Función para navegar a padre/madre
  const handleNavigateToParent = (parentId: string) => {
    navigate(`/animales/${parentId}`);
  };

  // Handler para crear observación
  const handleCreateObservacion = async (data: ObservacionFormData) => {
    if (!id || !usuario) throw new Error('No se puede crear la observación');
    await observacionesService.createObservacion(id, data, usuario.id);
    reloadObservaciones();
  };

  // Calcular edad
  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0 && months > 0) {
      return `${years} a, ${months} m`;
    } else if (years > 0) {
      return `${years} a`;
    } else {
      return `${months} m`;
    }
  };

  // Obtener info del tipo de observación
  const getTipoObservacionInfo = (tipo: string) => {
    switch (tipo) {
      case 'salud':
        return { icon: 'heart', color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'comportamiento':
        return { icon: 'sparkles', color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'reproduccion':
        return { icon: 'heart', color: 'text-pink-600', bgColor: 'bg-pink-50' };
      case 'nutricion':
        return { icon: 'beaker', color: 'text-green-600', bgColor: 'bg-green-50' };
      default:
        return { icon: 'notes', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  // Obtener símbolo y color de sexo
  const getSexInfo = (sexo: string) => {
    if (sexo === 'Macho') {
      return { icon: 'male', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    } else {
      return { icon: 'female', color: 'text-pink-600', bgColor: 'bg-pink-100' };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !animal) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="alert-circle" className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error || 'Animal no encontrado'}</p>
          <Button onClick={handleGoBack} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const sexInfo = getSexInfo(animal.sexo);
  const age = calculateAge(animal.fecha_nacimiento);

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-in-from-right overflow-y-auto">
      {/* Header fijo con botones de acción */}
      <header className="sticky top-0 bg-white shadow-md z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleGoBack}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Volver a la lista"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-xl font-bold text-gray-900 truncate max-w-[60%]">
            {animal.arete} - {animal.nombre || 'Sin nombre'}
          </h1>
          
          <button
            onClick={handleEdit}
            className="p-3 rounded-xl hover:bg-primary-100 transition-colors"
            aria-label="Editar animal"
          >
            <Icon name="pencil" className="w-6 h-6 text-primary-600" />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="pb-24">
        {/* Hero Image Section */}
        <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 h-64">
          {animal.foto_url ? (
            <img
              src={animal.foto_url}
              alt={animal.nombre || animal.arete}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="cow-large" className="w-32 h-32 text-gray-400" />
            </div>
          )}
          
          {/* Botón de galería flotante */}
          <button
            onClick={() => setShowPhotoGallery(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Ver galería de fotos"
          >
            <Icon name="camera" className="w-6 h-6 text-primary-600" />
          </button>
        </div>

        {/* Información Principal */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {animal.nombre || 'Sin nombre'}
              </h2>
              <div className="flex items-center space-x-2 text-primary-600 font-semibold">
                <span className="text-lg">#{animal.arete}</span>
              </div>
            </div>
            
            {/* Badge de sexo */}
            <div className={`${sexInfo.bgColor} ${sexInfo.color} px-4 py-2 rounded-full flex items-center space-x-2`}>
              <Icon name={`gender-${animal.sexo === 'Macho' ? 'male' : 'female'}`} className="w-5 h-5" />
              <span className="font-semibold">{animal.sexo}</span>
            </div>
          </div>

          {/* Barra de Estado */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="flex flex-col items-center">
              <Icon name="home" className="w-6 h-6 text-primary-600 mb-1" />
              <span className="text-xs text-gray-600 text-center">Ubicación</span>
              <span className="text-sm font-semibold text-gray-900 text-center">
                {animal.sitio_actual?.nombre || 'N/A'}
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <Icon name="heart" className="w-6 h-6 text-red-500 mb-1" />
              <span className="text-xs text-gray-600 text-center">Estado</span>
              <span className="text-sm font-semibold text-green-600">Activo</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Icon name="calendar" className="w-6 h-6 text-accent-600 mb-1" />
              <span className="text-xs text-gray-600 text-center">Edad</span>
              <span className="text-sm font-semibold text-gray-900 text-center">{age}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Icon name="scale" className="w-6 h-6 text-primary-600 mb-1" />
              <span className="text-xs text-gray-600 text-center">Peso</span>
              <span className="text-sm font-semibold text-gray-900">{animal.peso_kg || '--'} kg</span>
            </div>
          </div>

          {/* Botones de Acción Principales */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowPhotoGallery(true)}
              variant="outline"
              size="large"
              className="!min-h-[56px] !text-base"
              fullWidth
            >
              <Icon name="camera" className="w-5 h-5 mr-2" />
              Ver Fotos
            </Button>
            
            <Button
              onClick={() => setShowMoveModal(true)}
              variant="primary"
              size="large"
              className="!min-h-[56px] !text-base"
              fullWidth
            >
              <Icon name="move" className="w-5 h-5 mr-2" />
              Mover de Lugar
            </Button>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('resumen')}
              className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
                activeTab === 'resumen'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('salud')}
              className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
                activeTab === 'salud'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Salud
            </button>
            <button
              onClick={() => setActiveTab('reproduccion')}
              className={`flex-1 py-4 text-base font-semibold border-b-2 transition-colors ${
                activeTab === 'reproduccion'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reproducción
            </button>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="bg-white">
          {/* Pestaña Resumen */}
          {activeTab === 'resumen' && (
            <div className="p-6 space-y-6">
              {/* Información del Animal */}
              <div>
                <button
                  onClick={() => setInfoExpanded(!infoExpanded)}
                  className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
                >
                  <div className="flex items-center">
                    <Icon name="cow-large" className="w-5 h-5 mr-2 text-primary-600" />
                    Información del Animal
                  </div>
                  <Icon 
                    name={infoExpanded ? "chevron-up" : "chevron-down"} 
                    className="w-5 h-5 text-gray-400" 
                  />
                </button>
                {infoExpanded && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="circle-dot" className="w-4 h-4 mr-2 text-primary-600" />
                        Arete
                      </span>
                      <span className="font-bold text-primary-600 text-lg">#{animal.arete}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="cow-large" className="w-4 h-4 mr-2 text-gray-600" />
                        Raza
                      </span>
                      <span className="font-semibold text-gray-900">{animal.raza?.nombre || 'No especificada'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name={`gender-${animal.sexo === 'Macho' ? 'male' : 'female'}`} className="w-4 h-4 mr-2 text-gray-600" />
                        Sexo
                      </span>
                      <span className="font-semibold text-gray-900">{animal.sexo}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="calendar" className="w-4 h-4 mr-2 text-gray-600" />
                        Fecha de Nacimiento
                      </span>
                      <span className="font-semibold text-gray-900">
                        {new Date(animal.fecha_nacimiento).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="clock" className="w-4 h-4 mr-2 text-gray-600" />
                        Edad
                      </span>
                      <span className="font-semibold text-gray-900">{age}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Genealogía */}
              <div>
                <button
                  onClick={() => setGenealogiaExpanded(!genealogiaExpanded)}
                  className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Genealogía
                  </div>
                  <Icon 
                    name={genealogiaExpanded ? "chevron-up" : "chevron-down"} 
                    className="w-5 h-5 text-gray-400" 
                  />
                </button>
                {genealogiaExpanded && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Padre */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="gender-male" className="w-4 h-4 mr-2 text-blue-600" />
                        Padre
                      </span>
                      {animal.padre && animal.padre_id ? (
                        <button
                          onClick={() => handleNavigateToParent(animal.padre_id!)}
                          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-2 transition-colors"
                        >
                          #{animal.padre.arete}{animal.padre.nombre && ` - ${animal.padre.nombre}`}
                          <Icon name="chevron-right" className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400">No especificado</span>
                      )}
                    </div>
                    {/* Madre */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <Icon name="gender-female" className="w-4 h-4 mr-2 text-pink-600" />
                        Madre
                      </span>
                      {animal.madre && animal.madre_id ? (
                        <button
                          onClick={() => handleNavigateToParent(animal.madre_id!)}
                          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-2 transition-colors"
                        >
                          #{animal.madre.arete}{animal.madre.nombre && ` - ${animal.madre.nombre}`}
                          <Icon name="chevron-right" className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400">No especificada</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Crías */}
              {!criasLoading && crias && crias.length > 0 && (
                <div>
                  <button
                    onClick={() => setCriasExpanded(!criasExpanded)}
                    className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Crías</span>
                      {stats && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({stats.total} {stats.total === 1 ? 'cría' : 'crías'} - {stats.machos} ♂ / {stats.hembras} ♀)
                        </span>
                      )}
                    </div>
                    <Icon 
                      name={criasExpanded ? "chevron-up" : "chevron-down"} 
                      className="w-5 h-5 text-gray-400" 
                    />
                  </button>
                  {criasExpanded && (
                    <div className="space-y-2 animate-fade-in">
                      {crias.map((cria) => (
                        <button
                          key={cria.id}
                          onClick={() => navigate(`/animales/${cria.id}`)}
                          className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md hover:border-green-300 transition-all text-left"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              cria.sexo === 'Macho' ? 'bg-blue-100' : 'bg-pink-100'
                            }`}>
                              <Icon
                                name={cria.sexo === 'Macho' ? 'gender-male' : 'gender-female'}
                                className={`w-5 h-5 ${cria.sexo === 'Macho' ? 'text-blue-600' : 'text-pink-600'}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                #{cria.arete}{cria.nombre && ` - ${cria.nombre}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {cria.edad_meses} {cria.edad_meses === 1 ? 'mes' : 'meses'} • {cria.estado}
                              </p>
                            </div>
                          </div>
                          <Icon name="chevron-right" className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recordatorios Pendientes */}
              {animalReminders.length > 0 && (
                <div>
                  <button
                    onClick={() => setRecordatoriosExpanded(!recordatoriosExpanded)}
                    className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon name="bell" className="w-5 h-5 mr-2 text-accent-600" />
                      <span>Recordatorios Pendientes</span>
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {animalReminders.length}
                      </span>
                    </div>
                    <Icon 
                      name={recordatoriosExpanded ? "chevron-up" : "chevron-down"} 
                      className="w-5 h-5 text-gray-400" 
                    />
                  </button>
                  {recordatoriosExpanded && (
                    <div className="space-y-3 animate-fade-in">
                      {animalReminders.map((recordatorio) => (
                        <div 
                          key={recordatorio.id}
                          className="flex items-start gap-3 p-4 bg-accent-50 border border-accent-200 rounded-xl"
                        >
                          <Icon name="clock" className="w-5 h-5 text-accent-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{recordatorio.titulo}</p>
                            {recordatorio.descripcion && (
                              <p className="text-sm text-gray-600 mt-1">{recordatorio.descripcion}</p>
                            )}
                            <p className="text-xs text-accent-700 mt-2 flex items-center gap-1">
                              <Icon name="calendar" className="w-3 h-3" />
                              {new Date(recordatorio.fecha_programada).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          {/* Botones de acción */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                              onClick={() => markAsCompleted(recordatorio.id)}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                              title="Marcar como completado"
                            >
                              <Icon name="check" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('¿Eliminar este recordatorio?')) {
                                  deleteReminder(recordatorio.id);
                                }
                              }}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Eliminar recordatorio"
                            >
                              <Icon name="trash" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {/* Link a ver todos */}
                      <button
                        onClick={() => navigate(`/recordatorios?animal_id=${id}`)}
                        className="w-full p-3 text-center text-primary-600 hover:text-primary-700 font-medium text-sm hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        Ver todos los recordatorios →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Historial de Observaciones */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setObservacionesExpanded(!observacionesExpanded)}
                    className="flex-1 flex items-center justify-between text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon name="notes" className="w-5 h-5 mr-2 text-primary-600" />
                      <span>Observaciones</span>
                      {observaciones.length > 0 && (
                        <span className="ml-2 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                          {observaciones.length}
                        </span>
                      )}
                    </div>
                    <Icon 
                      name={observacionesExpanded ? "chevron-up" : "chevron-down"} 
                      className="w-5 h-5 text-gray-400 mr-2" 
                    />
                  </button>
                  <button
                    onClick={() => setShowAddObservacion(true)}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm flex-shrink-0"
                  >
                    <Icon name="plus" className="w-4 h-4" />
                    Agregar
                  </button>
                </div>

                {observacionesExpanded && (
                  observaciones.length > 0 ? (
                    <div className="space-y-3 animate-fade-in">
                      {observaciones.map((obs) => {
                        const tipoInfo = getTipoObservacionInfo(obs.tipo);
                        const isAdmin = usuario?.rol === 'administrador';
                        return (
                          <div 
                            key={obs.id}
                            className={`p-4 rounded-xl border ${tipoInfo.bgColor} relative`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon name={tipoInfo.icon} className={`w-5 h-5 ${tipoInfo.color}`} />
                                <span className={`text-xs font-bold uppercase ${tipoInfo.color}`}>
                                  {obs.tipo}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(obs.fecha).toLocaleDateString('es-MX', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                                {/* Botón de archivar (solo admin) */}
                                {isAdmin && (
                                  <button
                                    onClick={async () => {
                                      if (window.confirm('¿Archivar esta observación?')) {
                                        try {
                                          await observacionesService.archivarObservacion(obs.id);
                                          await reloadObservaciones();
                                        } catch (error) {
                                          console.error('Error al archivar:', error);
                                          alert('No se pudo archivar la observación');
                                        }
                                      }
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    title="Archivar observación"
                                  >
                                    <Icon name="trash" className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {obs.observacion}
                            </p>
                            {obs.usuario && (
                              <p className="text-xs text-gray-500 mt-2">
                                Por: {obs.usuario.nombre}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl animate-fade-in">
                      <Icon name="notes" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No hay observaciones registradas</p>
                      <button
                        onClick={() => setShowAddObservacion(true)}
                        className="mt-3 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        Agregar primera observación
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Pestaña Salud */}
          {activeTab === 'salud' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Icon name="heart" className="w-5 h-5 mr-2 text-red-500" />
                  Historial de Salud
                </h3>
              </div>

              <div className="text-center py-12">
                <Icon name="shield-check" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Próximamente disponible</p>
                <p className="text-sm text-gray-400 mt-2">Sistema de salud en desarrollo</p>
              </div>
            </div>
          )}

          {/* Pestaña Reproducción */}
          {activeTab === 'reproduccion' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Historial Reproductivo
                </h3>
              </div>

              {/* Estado Reproductivo Actual */}
              {animal.estado_reproductivo && (
                <div className="bg-primary-50 border border-primary-200 p-4 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Estado Actual:</span>
                    <span className="font-bold text-primary-700 capitalize">
                      {animal.estado_reproductivo.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-center py-12">
                <Icon name="heart" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Próximamente disponible</p>
                <p className="text-sm text-gray-400 mt-2">Sistema reproductivo en desarrollo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showMoveModal && animal && (
        <MoveAnimalModal
          animal={animal}
          onClose={() => setShowMoveModal(false)}
          onSuccess={() => {
            setShowMoveModal(false);
            // Podríamos recargar el animal aquí si es necesario
          }}
        />
      )}

      {showPhotoGallery && animal && (
        <PhotoGalleryModal
          animalId={animal.id}
          animalArete={animal.arete}
          animalNombre={animal.nombre}
          onClose={() => setShowPhotoGallery(false)}
        />
      )}

      {showAddObservacion && animal && (
        <AddObservacionModal
          animalId={animal.id}
          animalArete={animal.arete}
          animalNombre={animal.nombre}
          onClose={() => setShowAddObservacion(false)}
          onSuccess={() => {
            setShowAddObservacion(false);
            reloadObservaciones();
          }}
          onSubmit={handleCreateObservacion}
        />
      )}
    </div>
  );
}
