import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAnimals } from '../hooks/useAnimals';
import { useAuth } from '../hooks/useAuth';
import { useReminders } from '../hooks/useReminders';
import type { Animal } from '../types/animals';
import Icon from '../components/common/Icon';
import { SideMenu } from '../components/common/SideMenu';
import { AnimalDetailsModal } from '../components/animals/AnimalDetailsModal';
import { AnimalActionsModal } from '../components/animals/AnimalActionsModal';
import { MoveAnimalModal } from '../components/animals/MoveAnimalModal';

interface FilterState {
  search: string;
  sitio: string;
  raza: string;
  estado: string;
}

export function AnimalsListPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { animals, isLoading, error, reload } = useAnimals();
  const { recordatorios } = useReminders();

  // Mapa de recordatorios pendientes por animal
  const remindersByAnimal = useMemo(() => {
    const map = new Map<string, number>();
    recordatorios.forEach(recordatorio => {
      if (recordatorio.estado === 'pendiente') {
        const current = map.get(recordatorio.animal_id) || 0;
        map.set(recordatorio.animal_id, current + 1);
      }
    });
    return map;
  }, [recordatorios]);
  
  // Estados para modals
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sitio: '',
    raza: '',
    estado: ''
  });
  
  // Estado para ordenamiento
  const [sortBy, setSortBy] = useState<string>('arete');
  
  // Referencia para el input de búsqueda
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Auto-mostrar búsqueda si hay texto
  useEffect(() => {
    if (filters.search && !showSearchInput) {
      setShowSearchInput(true);
    }
  }, [filters.search, showSearchInput]);

  // Effect para hacer focus al input cuando se abra la búsqueda
  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      // Pequeño delay para asegurar que el input esté visible
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearchInput]);

  // Auto-expandir filtros si hay filtros de raza o estado activos
  useEffect(() => {
    if ((filters.raza || filters.estado) && !showAllFilters) {
      setShowAllFilters(true);
    }
  }, [filters.raza, filters.estado, showAllFilters]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('visualViewport' in window)) {
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    const handleViewportChange = () => {
      const heightDifference = window.innerHeight - viewport.height;
      setIsKeyboardVisible(heightDifference > 150);
    };

    viewport.addEventListener('resize', handleViewportChange);
    viewport.addEventListener('scroll', handleViewportChange);

    handleViewportChange();

    return () => {
      viewport.removeEventListener('resize', handleViewportChange);
      viewport.removeEventListener('scroll', handleViewportChange);
    };
  }, []);
  


  useEffect(() => {
    if (usuario) {
      reload();
    }
  }, [usuario, reload]);

  // Filtrar animales
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = !filters.search || 
      animal.arete.toLowerCase().includes(filters.search.toLowerCase()) ||
      animal.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
      animal.raza?.nombre.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesSitio = !filters.sitio || animal.sitio_actual?.nombre === filters.sitio;
    const matchesRaza = !filters.raza || animal.raza?.nombre === filters.raza;
    
    // Filtro por estado de salud usando datos reales
    const matchesEstado = !filters.estado || (() => {
      const getHealthStatus = (animal: Animal) => {
        if (!animal.activo || animal.estado !== 'Activo') {
          if (animal.estado === 'Vendido') return 'Vendido';
          if (animal.estado === 'Muerto') return 'Fallecido';
        }
        
        if (animal.estado_reproductivo) {
          switch (animal.estado_reproductivo.toLowerCase()) {
            case 'preñada':
              return 'Preñada';
            case 'en_monta':
              return 'En Monta';
            case 'disponible':
              return 'Disponible';
            case 'periodo_reposo':
              return 'En Reposo';
            default:
              return animal.estado_reproductivo;
          }
        }
        
        return 'Saludable';
      };
      
      return getHealthStatus(animal) === filters.estado;
    })();
    
    return matchesSearch && matchesSitio && matchesRaza && matchesEstado;
  });

  // Función para calcular la edad en días
  const calculateAge = (fechaNacimiento: string | undefined): number => {
    if (!fechaNacimiento) return 0;
    const birthDate = new Date(fechaNacimiento);
    const now = new Date();
    return Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Ordenar animales
  const sortedAndFilteredAnimals = [...filteredAnimals].sort((a, b) => {
    switch (sortBy) {
      case 'arete':
        return a.arete.localeCompare(b.arete, undefined, { numeric: true });
      case 'nombre':
        return (a.nombre || '').localeCompare(b.nombre || '');
      case 'edad':
        return calculateAge(b.fecha_nacimiento) - calculateAge(a.fecha_nacimiento); // Más viejo primero
      case 'peso':
        return (b.peso_kg || 0) - (a.peso_kg || 0); // Más pesado primero
      case 'raza':
        return (a.raza?.nombre || '').localeCompare(b.raza?.nombre || '');
      case 'sitio':
        return (a.sitio_actual?.nombre || '').localeCompare(b.sitio_actual?.nombre || '');
      default:
        return 0;
    }
  });

  // Por ahora mostramos todos los animales sin paginación
  const paginatedAnimals = sortedAndFilteredAnimals;

  // Handlers para modals
  const handleShowActions = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowActionsModal(true);
  };

  const handleMoveAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowMoveModal(true);
    setShowDetailsModal(false);
    setShowActionsModal(false);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowActionsModal(false);
    setShowMoveModal(false);
    setSelectedAnimal(null);
  };

  // Obtener listas únicas para filtros
  const uniqueSitios = Array.from(new Set(animals.map(a => a.sitio_actual?.nombre).filter(Boolean)));
  const uniqueRazas = Array.from(new Set(animals.map(a => a.raza?.nombre).filter(Boolean)));

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar animales</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => reload()} 
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header moderno - Fijo en la parte superior */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 pb-2 bg-white shadow-sm border-b border-gray-200">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors shadow-sm"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-slate-900">Animales</h1>
        <div className="flex w-24 justify-end gap-2">
          <button 
            onClick={() => setShowSearchInput(!showSearchInput)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              showSearchInput 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-slate-900 hover:bg-gray-100'
            }`}
          >
            <Icon name="search" className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowAllFilters(!showAllFilters)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors relative ${
              showAllFilters || (filters.sitio || filters.raza || filters.estado)
                ? 'bg-accent-100 text-accent-700' 
                : 'text-slate-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {(filters.sitio || filters.raza || filters.estado) && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {[filters.sitio, filters.raza, filters.estado].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Barra de búsqueda - Solo visible cuando se activa - También fija */}
      {showSearchInput && (
        <div className="fixed top-16 left-0 right-0 z-30 p-4 bg-white border-b border-gray-100">
          <div className="relative flex w-full items-center">
            <Icon name="search" className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              ref={searchInputRef}
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-12 pr-10 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white focus:border-primary-300"
              placeholder="Buscar por arete, nombre, raza..."
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onFocus={() => setIsKeyboardVisible(true)}
              onBlur={() => setIsKeyboardVisible(false)}
            />
            <button
              onClick={() => {
                setFilters({ ...filters, search: '' });
                setShowSearchInput(false);
              }}
              className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
            >
              <Icon name="x-mark" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal con padding para header fijo */}
      <div className={`${showSearchInput ? 'pt-40' : 'pt-20'}`}>
        {/* Filtros desplegables modernos */}
        {!isKeyboardVisible && (
          <div className="px-4 pb-4 relative z-10">
            {/* Filtros organizados verticalmente */}
            <div className="space-y-3 mb-3">
              {/* Filtro de Sitios/Lugares - Ancho completo, siempre visible */}
              <div className="flex items-center gap-3">
                <Icon name="home" className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <select
                  value={filters.sitio}
                  onChange={(e) => setFilters({ ...filters, sitio: e.target.value })}
                  className={`flex-1 rounded-xl px-4 py-3 text-base font-medium border-2 transition-colors ${
                    filters.sitio
                      ? 'bg-primary-100 text-primary-800 border-primary-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <option value="">Todas las Parcelas/Sitios</option>
                  {uniqueSitios.map(sitio => (
                    <option key={sitio} value={sitio}>{sitio}</option>
                  ))}
                </select>
              </div>

              {/* Filtros adicionales - Raza y Estado lado a lado cuando se activan */}
              {showAllFilters && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top duration-200">
                  {/* Filtro de Razas - Media anchura */}
                  <div className="flex items-center gap-2">
                    <Icon name="cow-large" className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <select
                      value={filters.raza}
                      onChange={(e) => setFilters({ ...filters, raza: e.target.value })}
                      className={`flex-1 rounded-xl px-3 py-3 text-base font-medium border-2 transition-colors ${
                        filters.raza
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <option value="">Todas las Razas</option>
                      {uniqueRazas.map(raza => (
                        <option key={raza} value={raza}>{raza}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro de Estado - Media anchura */}
                  <div className="flex items-center gap-2">
                    <Icon name="heart" className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <select
                      value={filters.estado}
                      onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                      className={`flex-1 rounded-xl px-3 py-3 text-base font-medium border-2 transition-colors ${
                        filters.estado
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="Disponible">Disponible</option>
                      <option value="En Monta">En Monta</option>
                      <option value="Preñada">Preñada</option>
                      <option value="En Reposo">En Reposo</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Fallecido">Fallecido</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Botón limpiar filtros */}
            {(filters.search || filters.sitio || filters.raza || filters.estado) && (
              <button
                onClick={() => {
                  setFilters({ search: '', sitio: '', raza: '', estado: '' });
                  setShowAllFilters(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 px-4 py-3 text-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar Todos los Filtros</span>
              </button>
            )}
          </div>
        )}

      {/* Contador de resultados y ordenamiento */}
      {!isKeyboardVisible && (
        <div className="px-4 pb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {sortedAndFilteredAnimals.length !== animals.length ? (
              <>Mostrando {sortedAndFilteredAnimals.length} de {animals.length} animales</>
            ) : (
              <>Total: {animals.length} animales</>
            )}
          </p>

          {/* Dropdown de ordenamiento */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="arete">Arete</option>
              <option value="nombre">Nombre</option>
              <option value="edad">Edad</option>
              <option value="peso">Peso</option>
              <option value="raza">Raza</option>
              <option value="sitio">Sitio</option>
            </select>
          </div>
        </div>
      )}

      {/* Lista de animales estilo cards */}
      <div className="space-y-3 px-4 flex-1 pb-24">
        {isLoading ? (
          // Loading skeleton
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm animate-pulse">
                <div className="h-20 w-20 rounded-lg bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </>
        ) : paginatedAnimals.length === 0 ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center p-8 min-h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🐄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filters.search || filters.sitio || filters.raza 
                  ? 'No se encontraron animales' 
                  : 'No hay animales registrados'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.sitio || filters.raza 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Comienza agregando tu primer animal'
                }
              </p>
              {(!filters.search && !filters.sitio && !filters.raza) && (
                <button 
                  onClick={() => navigate('/animales/nuevo')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 inline-flex items-center"
                >
                  <Icon name="plus" className="w-5 h-5 mr-2" />
                  Agregar Primer Animal
                </button>
              )}
            </div>
          </div>
        ) : (
          // Cards de animales modernas
          <>
            {paginatedAnimals.map(animal => {
              const getAnimalAge = (fechaNacimiento: string) => {
                const birth = new Date(fechaNacimiento);
                const today = new Date();
                const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                                    today.getMonth() - birth.getMonth();
                
                if (ageInMonths < 12) {
                  return `${ageInMonths} meses`;
                } else {
                  const years = Math.floor(ageInMonths / 12);
                  return `${years} año${years > 1 ? 's' : ''}`;
                }
              };

              const getHealthStatus = (animal: Animal) => {
                // Si el animal está inactivo o no está activo
                if (!animal.activo || animal.estado !== 'Activo') {
                  if (animal.estado === 'Vendido') return { text: 'Vendido', color: 'blue' };
                  if (animal.estado === 'Muerto') return { text: 'Fallecido', color: 'gray' };
                }
                
                // Usar estado reproductivo real de la BD si existe
                if (animal.estado_reproductivo) {
                  switch (animal.estado_reproductivo.toLowerCase()) {
                    case 'preñada':
                      return { text: 'Preñada', color: 'yellow' };
                    case 'en_monta':
                      return { text: 'En Monta', color: 'blue' };
                    case 'disponible':
                      return { text: 'Disponible', color: 'green' };
                    case 'periodo_reposo':
                      return { text: 'En Reposo', color: 'orange' };
                    default:
                      // Si hay un estado reproductivo personalizado, mostrarlo
                      return { text: animal.estado_reproductivo, color: 'gray' };
                  }
                }
                
                // Estado por defecto para animales activos
                return { text: 'Saludable', color: 'green' };
              };

              const healthStatus = getHealthStatus(animal);
              
              return (
                <div 
                  key={animal.id}
                  className="flex cursor-pointer items-center gap-4 rounded-xl bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/animales/${animal.id}`)}
                >
                  {/* Imagen del animal con badge de recordatorios */}
                  <div className="relative h-20 w-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                    {animal.foto_url || animal.foto_principal?.foto_url ? (
                      <img 
                        src={animal.foto_principal?.foto_url || animal.foto_url} 
                        alt={animal.nombre || `Animal ${animal.arete}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Si la imagen falla, mostrar el icono por defecto
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Icon 
                      name="cow-large" 
                      className={`w-10 h-10 text-primary-600 ${
                        animal.foto_url || animal.foto_principal?.foto_url ? 'hidden' : ''
                      }`} 
                    />
                    
                    {/* Badge de recordatorios pendientes */}
                    {remindersByAnimal.get(animal.id) && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {remindersByAnimal.get(animal.id)}
                      </div>
                    )}
                  </div>
                  
                  {/* Información del animal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">
                              ID: {animal.arete} "{animal.nombre || 'Sin nombre'}" 
                              <span className={`ml-2 ${animal.sexo === 'Hembra' ? 'text-pink-500' : 'text-blue-500'}`}>
                                <Icon name={animal.sexo === 'Hembra' ? 'gender-female' : 'gender-male'} className="w-4 h-4 inline" />
                              </span>
                            </p>
                            <p className="text-sm text-slate-600">
                              {animal.sitio_actual?.nombre || 'Sin sitio asignado'}
                            </p>
                          </div>
                          {/* Edad en la esquina superior derecha */}
                          <div className="flex flex-col items-end ml-2">
                            <span className="text-xs text-slate-500 font-medium">
                              {getAnimalAge(animal.fecha_nacimiento)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowActions(animal);
                        }}
                        className="text-slate-500 hover:text-slate-700 p-1 ml-2"
                      >
                        <Icon name="dots-vertical" className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {animal.peso_kg && (
                          <span className="text-slate-500 font-medium">
                            ⚖️ {animal.peso_kg} kg
                          </span>
                        )}
                        {animal.raza?.nombre && (
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Icon name="cow-large" className="w-4 h-4" />
                            {animal.raza.nombre}
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${
                        healthStatus.color === 'green' 
                          ? 'bg-green-100 text-green-800' 
                          : healthStatus.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : healthStatus.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : healthStatus.color === 'purple'
                          ? 'bg-purple-100 text-purple-800'
                          : healthStatus.color === 'orange'
                          ? 'bg-orange-100 text-orange-800'
                          : healthStatus.color === 'gray'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {healthStatus.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      </div>

      {/* Botón flotante para nuevo animal */}
      <button 
        onClick={() => navigate('/animales/nuevo')}
        className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 z-50"
      >
        <Icon name="plus" className="w-8 h-8" />
      </button>

      {/* Modals */}
      {showDetailsModal && selectedAnimal && (
        <AnimalDetailsModal
          animal={selectedAnimal}
          onClose={handleCloseModals}
          onEdit={() => {
            handleCloseModals();
            navigate(`/animales/${selectedAnimal.id}/editar`);
          }}
          onMove={() => handleMoveAnimal(selectedAnimal)}
        />
      )}

      {showActionsModal && selectedAnimal && (
        <AnimalActionsModal
          animal={selectedAnimal}
          onClose={handleCloseModals}
          onMove={() => handleMoveAnimal(selectedAnimal)}
          onVaccination={() => {
            // TODO: Implementar vacunación
            console.log('Vacunar animal:', selectedAnimal.id);
          }}
          onObservation={() => {
            // TODO: Implementar observación
            console.log('Observar animal:', selectedAnimal.id);
          }}
          onMedical={() => {
            // TODO: Implementar atención médica
            console.log('Atención médica:', selectedAnimal.id);
          }}
          onHistory={() => {
            // TODO: Implementar historial
            console.log('Ver historial:', selectedAnimal.id);
          }}
          onWeighing={() => {
            // TODO: Implementar pesaje
            console.log('Registrar peso:', selectedAnimal.id);
          }}
          onPhoto={() => {
            // TODO: Implementar foto
            console.log('Tomar foto:', selectedAnimal.id);
          }}
        />
      )}

      {showMoveModal && selectedAnimal && (
        <MoveAnimalModal
          animal={selectedAnimal}
          onClose={handleCloseModals}
          onSuccess={() => {
            handleCloseModals();
            reload(); // Recargar lista
          }}
        />
      )}

      {/* Menu lateral */}
      <SideMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        currentPage="animales"
      />

      {/* Outlet para rutas anidadas (AnimalProfilePage) */}
      <Outlet />
    </div>
  );
}
