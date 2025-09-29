import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import Icon from '../components/common/Icon';
import { SideMenu } from '../components/common/SideMenu';
import { useAnimals, useRazas } from '../hooks/useAnimals';
import { useSitiosConAnimales } from '../hooks/useSitiosConAnimales';
import type { AnimalFilters } from '../types';

export function AnimalsPage() {
  const navigate = useNavigate();
  
  // Estados para filtros y UI
  const [filters, setFilters] = useState<AnimalFilters>({
    activo: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Hooks para datos
  const { animals, isLoading, error, reload } = useAnimals(filters);
  const { razas } = useRazas();
  const { sitios } = useSitiosConAnimales();

  // Aplicar filtro de búsqueda en el cliente
  const filteredAnimals = animals.filter(animal => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      animal.arete.toLowerCase().includes(search) ||
      animal.nombre?.toLowerCase().includes(search) ||
      animal.raza?.nombre?.toLowerCase().includes(search)
    );
  });

  const handleFilterChange = (key: keyof AnimalFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({ activo: true });
    setSearchTerm('');
  };

  const getAnimalAge = (fechaNacimiento: string) => {
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                        today.getMonth() - birth.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`;
    }
  };



  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-red-600">!</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error al cargar animales</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={reload}>Intentar de nuevo</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-4 rounded-xl hover:bg-primary-50 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
            aria-label="Abrir menú principal"
          >
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary-800">Animales</h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </header>

      {/* Menu lateral */}
      <SideMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        currentPage="animals"
      />

      <div className="p-6 space-y-6">
        {/* Header de contenido con acciones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
                <Icon name="cow-large" className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                <span>Gestión de Animales</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                {isLoading ? 'Cargando...' : `${filteredAnimals.length} animales encontrados`}
              </p>
            </div>
            <Button
              onClick={() => navigate('/animales/nuevo')}
              className="w-full lg:w-auto bg-primary-600 hover:bg-primary-700 text-base lg:text-lg py-3 px-6"
            >
              <Icon name="plus-circle-simple" className="w-5 h-5 mr-2" />
              <span>Nuevo Animal</span>
            </Button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col space-y-4 mt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar animales</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por arete, nombre o raza..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base lg:text-lg"
                  />
                </div>
                <Button
                  variant={showFilters ? 'primary' : 'outline'}
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full lg:w-auto lg:min-w-[120px]"
                >
                  <Icon name="funnel" className="w-5 h-5 mr-2" />
                  <span>Filtros</span>
                </Button>
              </div>

              {/* Panel de filtros expandible */}
              {showFilters && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                        Raza
                      </label>
                      <select
                        value={filters.raza || ''}
                        onChange={(e) => handleFilterChange('raza', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-base lg:text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Todas las razas</option>
                        {razas.map(raza => (
                          <option key={raza.id} value={raza.id}>
                            {raza.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                        Sexo
                      </label>
                      <select
                        value={filters.sexo || ''}
                        onChange={(e) => handleFilterChange('sexo', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-base lg:text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Todos</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 xl:col-span-1">
                      <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                        Sitio Actual
                      </label>
                      <select
                        value={filters.sitio_id || ''}
                        onChange={(e) => handleFilterChange('sitio_id', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-base lg:text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Todos los sitios</option>
                        {sitios.map(sitio => (
                          <option key={sitio.id} value={sitio.id}>
                            {sitio.nombre} ({sitio.animales_count || 0} animales)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full lg:w-auto"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Lista de animales */}
        <div className="p-4 lg:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 lg:py-20">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-16 lg:w-16 border-b-2 border-primary-600"></div>
              <span className="ml-4 text-base lg:text-2xl text-gray-600">Cargando animales...</span>
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-12 lg:py-20">
              <div className="mb-4 flex justify-center">
                <Icon name="cow-large" className="w-16 h-16 lg:w-32 lg:h-32 text-primary-400" />
              </div>
              <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">No hay animales</h3>
              <p className="text-gray-600 mb-6 text-base lg:text-xl max-w-2xl mx-auto">
                {searchTerm || Object.keys(filters).length > 1 
                  ? 'No se encontraron animales con los criterios especificados'
                  : 'Aún no has registrado ningún animal en tu rancho'
                }
              </p>
              {!searchTerm && Object.keys(filters).length <= 1 && (
                <Button
                  onClick={() => navigate('/animales/nuevo')}
                  className="!text-lg !py-4 !px-6"
                >
                  Registrar mi primer animal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/animales/${animal.id}`)}
                >
                  {/* Header del animal */}
                  <div className={`p-4 lg:p-6 rounded-t-xl ${
                    animal.sexo === 'Macho' ? 'bg-blue-500' : 'bg-pink-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-white min-w-0 flex-1">
                        <h3 className="text-lg lg:text-xl font-bold truncate">
                          {animal.nombre || `Animal ${animal.arete}`}
                        </h3>
                        <p className="text-white/90 text-sm lg:text-base">
                          Arete #{animal.arete}
                        </p>
                      </div>
                      <div className="text-white text-right flex-shrink-0 ml-3">
                        <Icon name="cow-large" className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1" />
                        <p className="text-xs lg:text-sm font-medium">{animal.sexo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del animal */}
                  <div className="p-4 lg:p-6">
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl lg:text-2xl flex-shrink-0">🧬</span>
                        <span className="text-sm lg:text-base font-medium text-gray-700 truncate">
                          {animal.raza?.nombre || 'Raza no especificada'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xl lg:text-2xl flex-shrink-0">📅</span>
                        <span className="text-sm lg:text-base text-gray-600">
                          {getAnimalAge(animal.fecha_nacimiento)}
                        </span>
                      </div>

                      {animal.peso_kg && (
                        <div className="flex items-center space-x-3">
                          <span className="text-xl lg:text-2xl flex-shrink-0">⚖️</span>
                          <span className="text-sm lg:text-base text-gray-600">
                            {animal.peso_kg} kg
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <span className="text-xl lg:text-2xl flex-shrink-0">🏠</span>
                        <span className="text-sm lg:text-base text-gray-600 truncate">
                          {animal.sitio_actual?.nombre || 'Sitio no especificado'}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col lg:flex-row gap-3 mt-4 lg:mt-6">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/animales/${animal.id}`);
                        }}
                        className="flex-1 text-sm lg:text-base py-2 lg:py-3"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/animales/${animal.id}/editar`);
                        }}
                        className="flex-1 text-sm lg:text-base py-2 lg:py-3"
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}