import { useState, useEffect } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { useAuth } from '../hooks/useAuth';
import type { Animal } from '../types/animals';
import { Layout } from '../components/common/Layout';
import Icon from '../components/common/Icon';
import { AnimalRow } from '../components/animals/AnimalRow';
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
  const { usuario } = useAuth();
  const { animals, isLoading, error, reload } = useAnimals();
  
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
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    
    // TODO: Implementar filtro por estado cuando tengamos el campo en la BD
    
    return matchesSearch && matchesSitio && matchesRaza;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnimals = filteredAnimals.slice(startIndex, startIndex + itemsPerPage);

  // Handlers para modals
  const handleShowDetails = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowDetailsModal(true);
  };

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
      <Layout useSideMenu currentPage="animales">
        <div className="min-h-screen flex items-center justify-center">
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
      </Layout>
    );
  }

  return (
    <Layout useSideMenu currentPage="animales">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-800">🐄 Animales</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Icon name="search" className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Icon name="funnel" className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Contador y estadísticas */}
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            📊 Total: {animals.length} animales | Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAnimals.length)} de {filteredAnimals.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-background px-4 py-3 border-b border-gray-200">
        {/* Búsqueda */}
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="🔎 Buscar por arete, nombre, raza..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filters.sitio}
            onChange={(e) => setFilters({ ...filters, sitio: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base"
          >
            <option value="">🏠 Todos los sitios</option>
            {uniqueSitios.map(sitio => (
              <option key={sitio} value={sitio}>{sitio}</option>
            ))}
          </select>
          
          <select
            value={filters.raza}
            onChange={(e) => setFilters({ ...filters, raza: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base"
          >
            <option value="">🐄 Todas las razas</option>
            {uniqueRazas.map(raza => (
              <option key={raza} value={raza}>{raza}</option>
            ))}
          </select>
          
          {(filters.search || filters.sitio || filters.raza) && (
            <button
              onClick={() => setFilters({ search: '', sitio: '', raza: '', estado: '' })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              🔄 RESET
            </button>
          )}
        </div>
      </div>

      {/* Lista de animales */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Loading skeleton
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedAnimals.length === 0 ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center p-8">
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
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 inline-flex items-center">
                  <Icon name="plus" className="w-5 h-5 mr-2" />
                  Agregar Primer Animal
                </button>
              )}
            </div>
          </div>
        ) : (
          // Lista de animales
          <div className="p-4 space-y-2">
            {paginatedAnimals.map(animal => (
              <AnimalRow
                key={animal.id}
                animal={animal}
                onShowDetails={() => handleShowDetails(animal)}
                onShowActions={() => handleShowActions(animal)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              ◀️ ANTERIOR
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="text-gray-500">...</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-2 rounded-lg font-medium ${
                    currentPage === totalPages
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              SIGUIENTE ▶️
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante para nuevo animal */}
      <button className="fixed bottom-6 right-6 bg-accent-600 text-white p-4 rounded-full shadow-lg hover:bg-accent-700 z-50">
        <Icon name="plus" className="w-6 h-6" />
      </button>

      {/* Modals */}
      {showDetailsModal && selectedAnimal && (
        <AnimalDetailsModal
          animal={selectedAnimal}
          onClose={handleCloseModals}
          onEdit={() => {
            // TODO: Navegar a editar
            console.log('Editar animal:', selectedAnimal.id);
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
    </Layout>
  );
}