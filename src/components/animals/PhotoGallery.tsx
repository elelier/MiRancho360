import React, { useState, useEffect } from 'react';
import { albumService } from '../../services/album';
import { PhotoUpload } from '../common/PhotoUpload';
import type { AnimalFoto, AlbumFotos, AnimalFotoFormData } from '../../types';

interface PhotoGalleryProps {
  animalId: string;
  animalArete: string;
  usuarioId: string;
  onPhotosChange?: (album: AlbumFotos) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  animalId,
  animalArete,
  usuarioId,
  onPhotosChange
}) => {
  const [album, setAlbum] = useState<AlbumFotos>({ total: 0, fotos: [] });
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AnimalFoto | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState('');

  // Cargar álbum
  const loadAlbum = React.useCallback(async () => {
    try {
      setLoading(true);
      const albumData = await albumService.getAnimalPhotos(animalId);
      setAlbum(albumData);
      onPhotosChange?.(albumData);
    } catch (error) {
      console.error('Error cargando álbum:', error);
    } finally {
      setLoading(false);
    }
  }, [animalId, onPhotosChange]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  const handleAddPhoto = async (file: File | null) => {
    if (!file) return;

    try {
      setUploadingPhoto(true);
      
      const fotoData: AnimalFotoFormData = {
        archivo: file,
        descripcion: '',
        es_principal: album.total === 0 // Primera foto es principal
      };

      await albumService.addPhotoToAlbum(animalId, animalArete, fotoData, usuarioId);
      await loadAlbum(); // Recargar álbum
      
    } catch (error) {
      console.error('Error agregando foto:', error);
      alert(`Error al agregar foto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetPrincipal = async (fotoId: string) => {
    try {
      await albumService.setAsPrincipal(fotoId);
      await loadAlbum();
    } catch (error) {
      console.error('Error marcando como principal:', error);
    }
  };

  const handleUpdateDescription = async (fotoId: string) => {
    try {
      await albumService.updatePhotoDescription(fotoId, newDescription);
      setEditingDescription(null);
      setNewDescription('');
      await loadAlbum();
    } catch (error) {
      console.error('Error actualizando descripción:', error);
    }
  };

  const handleDeletePhoto = async (fotoId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta foto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await albumService.deletePhoto(fotoId);
      await loadAlbum();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error eliminando foto:', error);
      alert('Error al eliminar la foto');
    }
  };

  const startEditDescription = (foto: AnimalFoto) => {
    setEditingDescription(foto.id);
    setNewDescription(foto.descripcion || '');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg">Cargando álbum...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del álbum */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <span className="text-2xl">📸</span>
            <span>Álbum de Fotos</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {album.total === 0 ? 'No hay fotos aún' : `${album.total} de 10 fotos máximo`}
          </p>
        </div>
      </div>

      {/* Agregar nueva foto */}
      {album.total < 10 && (
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
          <PhotoUpload
            label={uploadingPhoto ? "Subiendo foto..." : "Agregar Nueva Foto"}
            value={null}
            onChange={handleAddPhoto}
          />
          {uploadingPhoto && (
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span className="text-sm text-gray-600">Procesando imagen...</span>
            </div>
          )}
        </div>
      )}

      {/* Galería de fotos */}
      {album.total > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      ) : !uploadingPhoto && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg font-medium">No hay fotos en el álbum</p>
          <p className="text-sm">Agrega la primera foto de este animal</p>
        </div>
      )}

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
  );
};