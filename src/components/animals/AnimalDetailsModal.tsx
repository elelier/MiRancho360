import type { Animal } from '../../types/animals';
import Icon from '../common/Icon';
import { PrincipalPhotoDisplay } from './PrincipalPhotoDisplay';
import { HealthHistory } from './HealthHistory';


interface AnimalDetailsModalProps {
  animal: Animal;
  onClose: () => void;
  onEdit: () => void;
  onMove: () => void;
}

export function AnimalDetailsModal({ animal, onClose, onEdit, onMove }: AnimalDetailsModalProps) {

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Icon name="eye" className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-800">VER DETALLES - #{animal.arete} {animal.nombre}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Álbum de Fotos */}
          <div>
            <PrincipalPhotoDisplay
              animalId={animal.id}
              animalArete={animal.arete}
              animalNombre={animal.nombre}
            />
          </div>

          {/* Información General */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="cow-large" className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">INFORMACIÓN GENERAL</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600">Arete:</span>
                    <span className="font-bold">#{animal.arete}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600">Nombre:</span>
                    <span>{animal.nombre || 'Sin nombre'}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600">Raza:</span>
                    <span>{animal.raza.nombre}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600">Sexo:</span>
                    <span className="flex items-center space-x-1">
                      <Icon 
                        name={animal.sexo === 'Macho' ? 'male' : 'female'} 
                        className={`w-4 h-4 ${animal.sexo === 'Macho' ? 'text-blue-600' : 'text-pink-600'}`} 
                      />
                      <span>{animal.sexo}</span>
                    </span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600">Nacimiento:</span>
                    <span>{new Date(animal.fecha_nacimiento).toLocaleDateString()}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center space-x-2">
                    <Icon name="scale" className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-600">Peso:</span>
                    <span>{animal.peso_kg ? `${animal.peso_kg} kg` : 'No registrado'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación Actual */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="location" className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">UBICACIÓN ACTUAL</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name="home" className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-600">Sitio:</span>
                <span className="font-semibold">{animal.sitio_actual?.nombre || 'Sin ubicación'}</span>
              </div>
              <p><strong>Desde:</strong> Fecha del último movimiento</p>
              <p><strong>Movido por:</strong> Usuario</p>
              <div className="mt-4">
                <button
                  onClick={onMove}
                  className="bg-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-700 flex items-center space-x-2"
                >
                  <Icon name="home" className="w-4 h-4" />
                  <span>MOVER DE LUGAR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estado de Salud */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="shield-check" className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">ESTADO DE SALUD</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="flex items-center space-x-2">
                <Icon name="check" className="w-4 h-4 text-green-500" />
                <span>Saludable - Sin observaciones</span>
              </p>
              <p><strong>Última revisión:</strong> Hace 15 días</p>
              <p><strong>Estado general:</strong> Saludable</p>
            </div>
          </div>

          {/* Genealogía */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="heart" className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">GENEALOGÍA</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="flex items-center space-x-2">
                <Icon name="male" className="w-4 h-4 text-blue-600" />
                <strong>Padre:</strong> {animal.padre ? `${animal.padre.arete} - ${animal.padre.nombre}` : 'No registrado'}
              </p>
              <p className="flex items-center space-x-2">
                <Icon name="female" className="w-4 h-4 text-pink-600" />
                <strong>Madre:</strong> {animal.madre ? `${animal.madre.arete} - ${animal.madre.nombre}` : 'No registrado'}
              </p>
              <p><strong>Hijos:</strong> Ninguno registrado</p>
            </div>
          </div>

          {/* Observaciones */}
          {animal.observaciones && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="notes" className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">OBSERVACIONES</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p>{animal.observaciones}</p>
              </div>
            </div>
          )}

          {/* Historial de Salud */}
          <div>
            <HealthHistory
              animalId={animal.id}
              animalArete={animal.arete}
              animalNombre={animal.nombre}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={onEdit}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 mx-auto"
          >
            <Icon name="pencil" className="w-4 h-4" />
            <span>EDITAR INFORMACIÓN</span>
          </button>
        </div>
      </div>
    </div>
  );
}