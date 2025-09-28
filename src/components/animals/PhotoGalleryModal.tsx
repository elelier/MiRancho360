import { useEffect, useState, useCallback } from 'react';
import { albumService } from '../../services/album';
import { PhotoUpload } from '../common/PhotoUpload';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../common/Icon';
import type { AnimalFoto, AlbumFotos } from '../../types/animals';

interface PhotoGalleryModalProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
  onClose: () => void;
}

export function PhotoGalleryModal({ animalId, animalArete, animalNombre, onClose }: PhotoGalleryModalProps) {
  const { usuario } = useAuth();
  const [album, setAlbum] = useState<AlbumFotos>({
    fotos: [],
    total: 0,
    foto_principal: undefined
  });
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AnimalFoto | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const loadAlbum = useCallback(async () => {
    try {
      setLoading(true);
      const albumData = await albumService.getAnimalPhotos(animalId);
      setAlbum(albumData);
    } catch (error) {
      console.error('Error cargando álbum:', error);
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);



  const handleAddPhoto = async (file: File | null) => {
    if (!file) return;
    
    try {
      setUploadingPhoto(true);
      
      const fotoData = {
        archivo: file,
        descripcion: undefined,
        es_principal: false
      };
      
      // Usar el arete del animal y usuario de la sesión
      if (!usuario?.id) {
        throw new Error('Usuario no autenticado');
      }
      await albumService.addPhotoToAlbum(animalId, animalArete, fotoData, usuario.id);
      
      // Mostrar mensaje de éxito
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      
      // Recargar álbum y ocultar área de subida
      await loadAlbum();
      setShowUploadArea(false);
    } catch (error) {
      console.error('Error agregando foto:', error);
      alert('Error al agregar la foto. Intenta nuevamente.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetPrincipal = async (fotoId: string) => {
    try {
      await albumService.setAsPrincipal(fotoId);
      await loadAlbum();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error marcando como principal:', error);
      alert('Error al marcar como principal. Intenta nuevamente.');
    }
  };

  const handleDeletePhoto = async (fotoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      return;
    }

    try {
      await albumService.deletePhoto(fotoId);
      await loadAlbum();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error eliminando foto:', error);
      alert('Error al eliminar la foto. Intenta nuevamente.');
    }
  };

  const handleUpdateDescription = async (fotoId: string) => {
    try {
      await albumService.updatePhotoDescription(fotoId, newDescription);
      await loadAlbum();
      setEditingDescription(null);
      
      // Actualizar foto seleccionada
      if (selectedPhoto && selectedPhoto.id === fotoId) {
        setSelectedPhoto({ ...selectedPhoto, descripcion: newDescription });
      }
    } catch (error) {
      console.error('Error actualizando descripción:', error);
      alert('Error al actualizar la descripción. Intenta nuevamente.');
    }
  };

  const startEditDescription = (foto: AnimalFoto) => {
    setEditingDescription(foto.id);
    setNewDescription(foto.descripcion || '');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600">Cargando álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📸</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Álbum de Fotos - {animalArete}
              </h2>
              <p className="text-sm text-gray-600">
                {animalNombre && `${animalNombre} • `}
                {album.total === 0 ? 'No hay fotos aún' : `${album.total} de 10 fotos`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-2 hover:bg-white rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        {/* Contenido principal del modal */}
        <div className="p-6">
          {/* Mensaje de éxito */}
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <span className="text-green-600 text-2xl">✅</span>
              <div>
                <p className="text-green-700 font-semibold">¡Foto agregada correctamente!</p>
                <p className="text-green-600 text-sm">La imagen se ha añadido al álbum del animal</p>
              </div>
            </div>
          )}

          {/* Grid de fotos del álbum */}
          {album.fotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {album.fotos.map((foto, index) => (
                <div 
                  key={foto.id} 
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedPhoto(foto)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300 group-hover:border-primary-500 transition-colors">
                    <img
                      src={foto.foto_url}
                      alt={foto.descripcion || `Foto ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {foto.es_principal && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        ⭐ Principal
                      </span>
                    )}
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}
                    </span>
                  </div>

                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium">
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estado vacío clickeable */}
          {album.fotos.length === 0 && (
            <div 
              className="text-center py-16 bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl mb-8 border-2 border-dashed border-primary-200 cursor-pointer hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-200"
              onClick={() => setShowUploadArea(true)}
            >
              <span className="text-8xl mb-6 block animate-pulse">📸</span>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Álbum Vacío</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Este animal aún no tiene fotos. 
              </p>
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold shadow-lg hover:bg-primary-600 transition-colors">
                <span className="text-xl">📷</span>
                <span>Toca aquí para agregar la primera foto</span>
              </div>
            </div>
          )}

          {/* Área para agregar nueva foto - Solo si hay menos de 10 */}
          {album.total < 10 && album.fotos.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              {!showUploadArea ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowUploadArea(true)}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <Icon name="cow-large" className="w-6 h-6" />
                    <span>Agregar Otra Foto</span>
                    <span className="text-sm opacity-75">({album.total}/10)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header con botón cerrar */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                      <span className="text-2xl">📸</span>
                      <span>Nueva Foto</span>
                    </h4>
                    <button
                      onClick={() => setShowUploadArea(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Componente de subida */}
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-2 border-dashed border-primary-200">
                    <PhotoUpload
                      label={uploadingPhoto ? "Subiendo foto..." : "Seleccionar foto o usar cámara"}
                      value={null}
                      onChange={handleAddPhoto}
                    />
                    {uploadingPhoto && (
                      <div className="mt-4 flex items-center justify-center space-x-3 p-4 bg-white rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="text-gray-700 font-medium">Procesando y subiendo imagen...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mensaje si alcanzó el límite */}
          {album.total >= 10 && (
            <div className="text-center py-8 bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl border-2 border-accent-200 mt-6">
              <span className="text-5xl mb-3 block">🏆</span>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Álbum Completo</h3>
              <p className="text-gray-600 font-medium">
                Este animal ya tiene el máximo de 10 fotos permitidas
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Puedes eliminar fotos existentes para agregar nuevas
              </p>
            </div>
          )}
        </div>

        {/* Modal de foto detallada */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-lg font-bold">
                  Foto {album.fotos.findIndex(f => f.id === selectedPhoto.id) + 1} de {album.total}
                </h4>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Imagen */}
              <div className="p-4">
                <img
                  src={selectedPhoto.foto_url}
                  alt={selectedPhoto.descripcion || 'Foto del animal'}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>

              {/* Información y acciones */}
              <div className="p-4 border-t space-y-4">
                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la foto:
                  </label>
                  {editingDescription === selectedPhoto.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: Animal en pastoreo, Revisión veterinaria..."
                      />
                      <button
                        onClick={() => handleUpdateDescription(selectedPhoto.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingDescription(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditDescription(selectedPhoto)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {selectedPhoto.descripcion || (
                        <span className="text-gray-500 italic">
                          Clic aquí para agregar descripción...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex space-x-3">
                  {!selectedPhoto.es_principal && (
                    <button
                      onClick={() => handleSetPrincipal(selectedPhoto.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      ⭐ Marcar como Principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePhoto(selectedPhoto.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🗑️ Eliminar Foto
                  </button>
                </div>

                {/* Información de la foto */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p>Subida: {new Date(selectedPhoto.fecha_subida).toLocaleString('es-ES')}</p>
                  {selectedPhoto.es_principal && (
                    <p className="text-yellow-600 font-medium">⭐ Esta es la foto principal del animal</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}