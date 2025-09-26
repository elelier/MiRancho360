import React, { useState, useEffect, useCallback } from 'react';
import { albumService } from '../../services/album';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import type { AnimalFoto } from '../../types';

interface PrincipalPhotoDisplayProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
}

export const PrincipalPhotoDisplay: React.FC<PrincipalPhotoDisplayProps> = ({
  animalId,
  animalArete,
  animalNombre
}) => {
  const [fotoPrincipal, setFotoPrincipal] = useState<AnimalFoto | null>(null);
  const [totalFotos, setTotalFotos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAlbumModal, setShowAlbumModal] = useState(false);

  const loadPrincipalPhoto = useCallback(async () => {
    try {
      setLoading(true);
      const [principal, stats] = await Promise.all([
        albumService.getPrincipalPhoto(animalId),
        albumService.getAlbumStats(animalId)
      ]);
      
      setFotoPrincipal(principal);
      setTotalFotos(stats.total);
    } catch (error) {
      console.error('Error cargando foto principal:', error);
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    loadPrincipalPhoto();
  }, [loadPrincipalPhoto]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center animate-pulse">
          <div className="text-gray-400">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded"></div>
            <p className="text-sm">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {fotoPrincipal ? (
        <div className="relative inline-block group">
          <img
            src={fotoPrincipal.foto_url}
            alt={`Foto principal de ${animalArete}${animalNombre ? ` - ${animalNombre}` : ''}`}
            className="w-64 h-64 mx-auto object-cover rounded-xl border-4 border-primary-200 shadow-lg transition-transform hover:scale-105"
          />
          
          {/* Overlay con información */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
            <button
              onClick={() => setShowAlbumModal(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-primary-800 px-4 py-2 rounded-lg font-semibold shadow-lg"
            >
              📸 Ver Álbum ({totalFotos} {totalFotos === 1 ? 'foto' : 'fotos'})
            </button>
          </div>

          {/* Badge de foto principal */}
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            ⭐ Principal
          </div>

          {/* Contador de fotos */}
          {totalFotos > 1 && (
            <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
              {totalFotos} fotos
            </div>
          )}

          {/* Descripción si existe */}
          {fotoPrincipal.descripcion && (
            <div className="absolute bottom-3 left-3 right-3 bg-black bg-opacity-70 text-white text-xs p-2 rounded-lg">
              {fotoPrincipal.descripcion}
            </div>
          )}
        </div>
      ) : (
        /* Sin foto principal */
        <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center group hover:bg-gray-50 transition-colors cursor-pointer"
             onClick={() => setShowAlbumModal(true)}>
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-lg font-medium">Sin fotos</p>
            <p className="text-sm mb-3">Este animal no tiene fotos aún</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                ➕ Agregar primera foto
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botón para abrir álbum completo */}
      <div className="mt-4">
        <button
          onClick={() => setShowAlbumModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <span>🖼️</span>
          <span>
            {totalFotos === 0 ? 'Agregar fotos' : `Gestionar álbum (${totalFotos})`}
          </span>
        </button>
      </div>
      
      {/* Modal del álbum */}
      {showAlbumModal && (
        <PhotoGalleryModal
          animalId={animalId}
          animalArete={animalArete}
          animalNombre={animalNombre}
          onClose={() => {
            setShowAlbumModal(false);
            // Recargar foto principal al cerrar en caso de cambios
            loadPrincipalPhoto();
          }}
        />
      )}
    </div>
  );
};