import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import Icon from '../components/common/Icon';
import { Layout } from '../components/common/Layout';
import { useSitiosConAnimales } from '../hooks/useSitiosConAnimales';

export function SitesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook para obtener sitios
  const { sitios, loading, error, refetch } = useSitiosConAnimales();

  // Filtrar sitios según el término de búsqueda
  const filteredSitios = sitios.filter(sitio => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      sitio.nombre.toLowerCase().includes(search) ||
      sitio.tipo?.toLowerCase().includes(search)
    );
  });

  if (error) {
    return (
      <Layout useSideMenu currentPage="sites" title="Sitios">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error al cargar sitios</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refetch}>Intentar de nuevo</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout useSideMenu currentPage="sites" title="Sitios">
      <div className="space-y-6">
        {/* Header de contenido con acciones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
                <Icon name="farm-house" className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                <span>Gestión de Sitios</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                {loading ? 'Cargando...' : `${filteredSitios.length} sitios encontrados`}
              </p>
            </div>
            <Button
              onClick={() => navigate('/sitios/nuevo')}
              className="w-full lg:w-auto bg-accent-600 hover:bg-accent-700 text-base lg:text-lg py-3 px-6"
            >
              <Icon name="plus-circle-simple" className="w-5 h-5 mr-2" />
              <span>Nuevo Sitio</span>
            </Button>
          </div>

          {/* Barra de búsqueda */}
          <div className="mt-6">
            <Input
              label="Buscar sitios"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o tipo de sitio..."
              className="text-base lg:text-lg"
            />
          </div>
        </div>

        {/* Lista de sitios */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12 lg:py-20">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-16 lg:w-16 border-b-2 border-primary-600"></div>
              <span className="ml-4 text-base lg:text-2xl text-gray-600">Cargando sitios...</span>
            </div>
          ) : filteredSitios.length === 0 ? (
            <div className="text-center py-12 lg:py-20">
              <div className="text-4xl lg:text-8xl mb-4">🏠</div>
              <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">No hay sitios</h3>
              <p className="text-gray-600 mb-6 text-base lg:text-xl max-w-2xl mx-auto">
                {searchTerm 
                  ? 'No se encontraron sitios con los criterios especificados'
                  : 'Aún no has registrado ningún sitio en tu rancho'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/sitios/nuevo')}
                  className="!text-lg !py-4 !px-6"
                >
                  Registrar mi primer sitio
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredSitios.map((sitio) => (
                <div
                  key={sitio.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/sitios/${sitio.id}`)}
                >
                  {/* Header del sitio */}
                  <div className="p-4 lg:p-6 rounded-t-xl bg-accent-500">
                    <div className="flex items-center justify-between">
                      <div className="text-white min-w-0 flex-1">
                        <h3 className="text-lg lg:text-xl font-bold truncate">
                          {sitio.nombre}
                        </h3>
                        <p className="text-white/90 text-sm lg:text-base">
                          {sitio.tipo || 'Sin especificar'}
                        </p>
                      </div>
                      <div className="text-white text-right flex-shrink-0 ml-3">
                        <Icon name="farm-house" className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1" />
                        <p className="text-xs lg:text-sm font-medium">
                          {sitio.animales_count || 0} animales
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del sitio */}
                  <div className="p-4 lg:p-6">
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl lg:text-2xl flex-shrink-0">📏</span>
                        <span className="text-sm lg:text-base font-medium text-gray-700">
                          {sitio.ubicacion || 'Ubicación no especificada'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xl lg:text-2xl flex-shrink-0">🐄</span>
                        <span className="text-sm lg:text-base text-gray-600">
                          {sitio.animales_count || 0} animales actualmente
                        </span>
                      </div>

                      {sitio.capacidad && (
                        <div className="flex items-center space-x-3">
                          <span className="text-xl lg:text-2xl flex-shrink-0">⚡</span>
                          <span className="text-sm lg:text-base text-gray-600">
                            Capacidad: {sitio.capacidad} animales
                          </span>
                        </div>
                      )}

                      {sitio.descripcion && (
                        <div className="flex items-start space-x-3">
                          <span className="text-xl lg:text-2xl flex-shrink-0 mt-1">📝</span>
                          <span className="text-sm lg:text-base text-gray-600 line-clamp-2">
                            {sitio.descripcion}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col lg:flex-row gap-3 mt-4 lg:mt-6">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sitios/${sitio.id}`);
                        }}
                        className="flex-1 text-sm lg:text-base py-2 lg:py-3"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sitios/${sitio.id}/editar`);
                        }}
                        className="flex-1 text-sm lg:text-base py-2 lg:py-3 bg-accent-600 hover:bg-accent-700"
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
    </Layout>
  );
}