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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Icon name="eye" className="w-7 h-7 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Ficha del animal</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">#{animal.arete} {animal.nombre || 'Sin nombre'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 space-y-8">
            <div>
              <PrincipalPhotoDisplay
                animalId={animal.id}
                animalArete={animal.arete}
                animalNombre={animal.nombre}
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="cow-large" className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Información general</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Arete</p>
                    <p className="text-base font-semibold text-gray-900">#{animal.arete}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Nombre</p>
                    <p className="text-base text-gray-700">{animal.nombre || 'Sin nombre'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Raza</p>
                    <p className="text-base text-gray-700">{animal.raza.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Sexo</p>
                    <div className="flex items-center gap-2 text-base text-gray-700">
                      <Icon
                        name={animal.sexo === 'Macho' ? 'male' : 'female'}
                        className={`w-5 h-5 ${animal.sexo === 'Macho' ? 'text-blue-600' : 'text-pink-600'}`}
                      />
                      <span>{animal.sexo}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Fecha de nacimiento</p>
                    <p className="text-base text-gray-700">{new Date(animal.fecha_nacimiento).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Peso</p>
                    <div className="flex items-center gap-2 text-base text-gray-700">
                      <Icon name="scale" className="w-5 h-5 text-gray-400" />
                      <span>{animal.peso_kg ? `${animal.peso_kg} kg` : 'No registrado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="location" className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Ubicación actual</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-3 text-sm sm:text-base text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon name="home" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Sitio</p>
                      <p className="text-base font-semibold text-gray-900">{animal.sitio_actual?.nombre || 'Sin ubicación'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Desde: Fecha del último movimiento</p>
                  <p className="text-sm text-gray-500">Movido por: Usuario</p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={onMove}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-accent-600 text-white text-sm sm:text-base font-semibold hover:bg-accent-700 transition-colors"
                  >
                    <Icon name="home" className="w-5 h-5" />
                    <span>Mover de lugar</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="shield-check" className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Estado de salud</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-3 text-sm sm:text-base text-gray-700">
                <p className="flex items-center gap-2 text-green-600 font-medium">
                  <Icon name="check" className="w-5 h-5" /> Saludable - Sin observaciones
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-700">Última revisión:</span> Hace 15 días
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-700">Estado general:</span> Saludable
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="heart" className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Genealogía</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-3 text-sm sm:text-base text-gray-700">
                <p className="flex items-center gap-3">
                  <Icon name="male" className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">Padre:</span>
                  <span>{animal.padre ? `${animal.padre.arete} - ${animal.padre.nombre}` : 'No registrado'}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Icon name="female" className="w-5 h-5 text-pink-600" />
                  <span className="font-semibold text-gray-700">Madre:</span>
                  <span>{animal.madre ? `${animal.madre.arete} - ${animal.madre.nombre}` : 'No registrado'}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-700">Hijos:</span> Ninguno registrado
                </p>
              </div>
            </div>

            {animal.observaciones && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="notes" className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Observaciones</h3>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 text-sm sm:text-base text-gray-700">
                  <p>{animal.observaciones}</p>
                </div>
              </div>
            )}

            <div>
              <HealthHistory
                animalId={animal.id}
                animalArete={animal.arete}
                animalNombre={animal.nombre}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-gray-300 text-sm sm:text-base font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm sm:text-base font-semibold hover:bg-primary-700 transition-colors"
          >
            <Icon name="pencil" className="w-5 h-5" />
            <span>Editar información</span>
          </button>
        </div>
      </div>
    </div>
  );
}
