import type { Animal } from '../../types/animals';
import Icon from '../common/Icon';

interface AnimalActionsModalProps {
  animal: Animal;
  onClose: () => void;
  onMove: () => void;
  onVaccination: () => void;
  onObservation: () => void;
  onMedical: () => void;
  onHistory: () => void;
  onWeighing: () => void;
  onPhoto: () => void;
}

export function AnimalActionsModal({
  animal,
  onClose,
  onMove,
  onVaccination,
  onObservation,
  onMedical,
  onHistory,
  onWeighing,
  onPhoto
}: AnimalActionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
              <Icon name="lightning-bolt" className="w-6 h-6 text-accent-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Acciones rápidas</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">#{animal.arete} {animal.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="cow-large" className="w-6 h-6 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Animal seleccionado</h3>
                  <p className="text-sm text-gray-600 truncate">
                    #{animal.arete} {animal.nombre} · {animal.raza.nombre} · {animal.sexo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="location" className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{animal.sitio_actual?.nombre || 'Sin ubicación registrada'}</span>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                  <Icon name="sparkles" className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 uppercase tracking-wide">Acciones disponibles</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={onMove}
                  className="w-full rounded-2xl border-2 border-accent-200 bg-accent-50 hover:bg-accent-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-accent-200">
                      <Icon name="home" className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Mover de lugar</p>
                      <p className="text-sm text-gray-600">Cambiar el animal a otro sitio del rancho</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onObservation}
                  className="w-full rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-green-200">
                      <Icon name="notes" className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Registrar observación</p>
                      <p className="text-sm text-gray-600">Agregar nota sobre comportamiento o estado</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onWeighing}
                  className="w-full rounded-2xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-purple-200">
                      <Icon name="scale" className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Registrar peso</p>
                      <p className="text-sm text-gray-600">Actualizar peso actual del animal</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onHistory}
                  className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-blue-200">
                      <Icon name="chart" className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Ver historial</p>
                      <p className="text-sm text-gray-600">Consultar historial completo de movimientos y salud</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onVaccination}
                  className="w-full rounded-2xl border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-primary-200">
                      <Icon name="syringe" className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Registrar vacuna</p>
                      <p className="text-sm text-gray-600">Aplicar vacuna y actualizar historial</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onPhoto}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-200">
                      <Icon name="camera" className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Tomar foto</p>
                      <p className="text-sm text-gray-600">Actualizar fotografía del animal</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onMedical}
                  className="w-full rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center border border-red-200">
                      <Icon name="hospital" className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Atención médica</p>
                      <p className="text-sm text-gray-600">Registrar consulta o tratamiento veterinario</p>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}