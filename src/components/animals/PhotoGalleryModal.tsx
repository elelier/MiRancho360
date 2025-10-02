import { useEffect, useState, useCallback } from 'react';
import { albumService } from '../../services/album';
import { PhotoUpload } from '../common/PhotoUpload';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../common/Icon';
import type { Animal, AnimalFoto, AlbumFotos } from '../../types/animals';

interface PhotoGalleryModalProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
  onClose: () => void;
  onAlbumUpdated?: (album: AlbumFotos) => void | Promise<void>;
}

export function PhotoGalleryModal({ animalId, animalArete, animalNombre, onClose, onAlbumUpdated }: PhotoGalleryModalProps) {
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
      return albumData;
    } catch (error) {
      console.error('Error cargando álbum:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  const dispatchAlbumUpdates = useCallback((albumData: AlbumFotos | null) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('animal-album-updated', {
      detail: { animalId }
    }));

    if (albumData) {
      const principal = albumData.foto_principal || null;
      const updates: Partial<Animal> = {};

      if (principal) {
        updates.foto_url = principal.foto_url;
        updates.foto_principal = principal;
      } else if (albumData.total === 0) {
        updates.foto_url = null;
        updates.foto_principal = undefined;
      }

      if (Object.keys(updates).length > 0) {
        window.dispatchEvent(new CustomEvent('animal-data-updated', {
          detail: { animalId, animal: updates }
        }));
      }
    }
  }, [animalId]);

  const notifyAlbumUpdated = useCallback(async (albumData: AlbumFotos | null) => {
    if (albumData && onAlbumUpdated) {
      await onAlbumUpdated(albumData);
    }
    dispatchAlbumUpdates(albumData);
  }, [dispatchAlbumUpdates, onAlbumUpdated]);

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
      const updatedAlbum = await loadAlbum();
      setShowUploadArea(false);
      await notifyAlbumUpdated(updatedAlbum || null);
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
      const updatedAlbum = await loadAlbum();
      setSelectedPhoto(null);
      await notifyAlbumUpdated(updatedAlbum || null);
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
      const updatedAlbum = await loadAlbum();
      setSelectedPhoto(null);
      await notifyAlbumUpdated(updatedAlbum || null);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-6 animate-fade-in">
        <div className="w-full h-full sm:h-auto sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Icon name="camera" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Cargando galería...</h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">#{animalArete}{animalNombre ? ` · ${animalNombre}` : ''}</p>
              </div>
            </div>
            <button onClick={onClose} type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-sm">Consultando álbum...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Icon name="camera" className="w-7 h-7 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Galería de fotos</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">#{animalArete}{animalNombre ? ` · ${animalNombre}` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 space-y-6">
            {uploadSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700 flex items-center gap-3">
                <Icon name="check" className="w-5 h-5" />
                Foto subida correctamente
              </div>
            )}

            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Colección ({album.total}/10)</h3>
                  <p className="text-sm text-gray-500">Gestiona las fotos del animal y selecciona una foto principal.</p>
                </div>
                {album.total < 10 && (
                  <button
                    onClick={() => setShowUploadArea(!showUploadArea)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm sm:text-base font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Icon name="plus" className="w-5 h-5" />
                    {showUploadArea ? 'Cerrar carga' : 'Agregar foto'}
                  </button>
                )}
              </div>

              {showUploadArea && album.total < 10 && (
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-primary-700">Nueva fotografía</h4>
                    <span className="text-xs text-primary-600">{album.total}/10 disponibles</span>
                  </div>
                  <PhotoUpload
                    label={uploadingPhoto ? 'Subiendo foto...' : 'Selecciona una foto o usa la cámara'}
                    value={null}
                    onChange={handleAddPhoto}
                  />
                  {uploadingPhoto && (
                    <div className="flex items-center justify-center gap-3 text-primary-700 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      Procesando y subiendo imagen...
                    </div>
                  )}
                </div>
              )}

              {!loading && album.fotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {album.fotos.map((foto, index) => (
                    <button
                      key={foto.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(foto);
                        setNewDescription(foto.descripcion || '');
                      }}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    >
                      <img
                        src={foto.foto_url}
                        alt={foto.descripcion || `Foto ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-2">
                        {foto.es_principal && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/90 text-white text-xs font-semibold">
                            <Icon name="star" className="w-4 h-4" /> Principal
                          </span>
                        )}
                        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">#{index + 1}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver detalle
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && album.fotos.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowUploadArea(true)}
                  className="w-full text-center py-16 rounded-3xl border-2 border-dashed border-primary-200 bg-gradient-to-br from-gray-50 to-primary-50 hover:border-primary-300 hover:from-primary-50 hover:to-accent-50 transition-all"
                >
                  <span className="text-6xl mb-4 block">📸</span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Álbum vacío</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                    Este animal aún no tiene fotografías. Agrega la primera para documentar su historial visual.
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 text-white text-sm font-semibold">
                    <Icon name="plus" className="w-4 h-4" /> Subir foto
                  </span>
                </button>
              )}

              {album.total >= 10 && (
                <div className="text-center py-8 bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl border border-primary-200">
                  <span className="text-4xl block mb-2">🏆</span>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Álbum completo</h3>
                  <p className="text-sm text-gray-600">Has alcanzado el máximo de 10 fotografías. Elimina alguna para subir nuevas.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Foto {album.fotos.findIndex(f => f.id === selectedPhoto.id) + 1} de {album.total}</h4>
                  {selectedPhoto.es_principal && (
                    <p className="text-xs text-yellow-600 font-medium">Foto principal del animal</p>
                  )}
                </div>
                <button onClick={() => setSelectedPhoto(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Icon name="x-mark" className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 bg-gray-50">
                <img
                  src={selectedPhoto.foto_url}
                  alt={selectedPhoto.descripcion || 'Foto del animal'}
                  className="w-full max-h-[460px] object-contain rounded-2xl bg-white"
                />
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  {editingDescription === selectedPhoto.id ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: En pastoreo, revisión veterinaria..."
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateDescription(selectedPhoto.id)}
                          className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDescription(null)}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditDescription(selectedPhoto)}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-600 hover:border-primary-300 hover:text-gray-800"
                    >
                      {selectedPhoto.descripcion || 'Haz clic para agregar una descripción'}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {!selectedPhoto.es_principal && (
                    <button
                      type="button"
                      onClick={() => handleSetPrincipal(selectedPhoto.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      <Icon name="star" className="w-5 h-5" /> Marcar como principal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(selectedPhoto.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Icon name="trash" className="w-5 h-5" /> Eliminar foto
                  </button>
                </div>

                <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
                  <p>Subida: {new Date(selectedPhoto.fecha_subida).toLocaleString('es-ES')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
