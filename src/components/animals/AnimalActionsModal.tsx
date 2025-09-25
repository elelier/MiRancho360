import type { Animal } from '../../types/animals';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">⚡ ACCIONES - #{animal.arete} {animal.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Animal Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">🐄 ANIMAL SELECCIONADO</h3>
          <p className="text-sm text-gray-600">
            #{animal.arete} {animal.nombre} | {animal.raza.nombre} | {animal.sexo} | Edad: {new Date(animal.fecha_nacimiento).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            📍 {animal.sitio_actual?.nombre || 'Sin ubicación'} | Estado: Saludable
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 mb-3">⚡ ACCIONES DISPONIBLES</h3>
          
          {/* Mover de Lugar */}
          <button
            onClick={onMove}
            className="w-full bg-accent-600 text-white p-4 rounded-lg hover:bg-accent-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏠</span>
              <div>
                <div className="font-medium">MOVER DE LUGAR</div>
                <div className="text-sm opacity-90">Cambiar el animal a otro sitio del rancho</div>
              </div>
            </div>
          </button>

          {/* Registrar Vacuna */}
          <button
            onClick={onVaccination}
            className="w-full bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">💉</span>
              <div>
                <div className="font-medium">REGISTRAR VACUNA</div>
                <div className="text-sm opacity-90">Aplicar vacuna y actualizar historial</div>
              </div>
            </div>
          </button>

          {/* Registrar Observación */}
          <button
            onClick={onObservation}
            className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">📝</span>
              <div>
                <div className="font-medium">REGISTRAR OBSERVACIÓN</div>
                <div className="text-sm opacity-90">Agregar nota sobre comportamiento o estado</div>
              </div>
            </div>
          </button>

          {/* Atención Médica */}
          <button
            onClick={onMedical}
            className="w-full bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏥</span>
              <div>
                <div className="font-medium">ATENCIÓN MÉDICA</div>
                <div className="text-sm opacity-90">Registrar consulta o tratamiento veterinario</div>
              </div>
            </div>
          </button>

          {/* Ver Historial */}
          <button
            onClick={onHistory}
            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <div className="font-medium">VER HISTORIAL</div>
                <div className="text-sm opacity-90">Consultar historial completo de movimientos y salud</div>
              </div>
            </div>
          </button>

          {/* Registrar Peso */}
          <button
            onClick={onWeighing}
            className="w-full bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚖️</span>
              <div>
                <div className="font-medium">REGISTRAR PESO</div>
                <div className="text-sm opacity-90">Actualizar peso actual del animal</div>
              </div>
            </div>
          </button>

          {/* Tomar Foto */}
          <button
            onClick={onPhoto}
            className="w-full bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 text-left"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">📷</span>
              <div>
                <div className="font-medium">TOMAR FOTO</div>
                <div className="text-sm opacity-90">Actualizar fotografía del animal</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}