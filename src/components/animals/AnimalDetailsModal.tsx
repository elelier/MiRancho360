import type { Animal } from '../../types/animals';

interface AnimalDetailsModalProps {
  animal: Animal;
  onClose: () => void;
  onEdit: () => void;
  onMove: () => void;
}

export function AnimalDetailsModal({ animal, onClose, onEdit, onMove }: AnimalDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">👁️ VER DETALLES - #{animal.arete} {animal.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Información General */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🐄 INFORMACIÓN GENERAL</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>📸 [FOTO DEL ANIMAL]</div>
                <div className="space-y-1">
                  <p><strong>🏷️ Arete:</strong> #{animal.arete}</p>
                  <p><strong>🐄 Nombre:</strong> {animal.nombre || 'Sin nombre'}</p>
                  <p><strong>🐂 Raza:</strong> {animal.raza.nombre}</p>
                  <p><strong>⚥ Sexo:</strong> {animal.sexo}</p>
                  <p><strong>📅 Edad:</strong> {new Date(animal.fecha_nacimiento).toLocaleDateString()}</p>
                  <p><strong>⚖️ Peso:</strong> {animal.peso_kg ? `${animal.peso_kg} kg` : 'No registrado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación Actual */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📍 UBICACIÓN ACTUAL</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><strong>🏠 Sitio:</strong> {animal.sitio_actual?.nombre || 'Sin ubicación'}</p>
              <p><strong>📅 Desde:</strong> Fecha del último movimiento</p>
              <p><strong>👤 Movido por:</strong> Usuario</p>
              <div className="mt-3">
                <button
                  onClick={onMove}
                  className="bg-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-700"
                >
                  🏠 MOVER DE LUGAR
                </button>
              </div>
            </div>
          </div>

          {/* Estado de Salud */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💉 ESTADO DE SALUD</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>✅ Saludable - Sin observaciones</p>
              <p><strong>📅 Última revisión:</strong> Hace 15 días</p>
              <p><strong>🏥 Estado general:</strong> Saludable</p>
            </div>
          </div>

          {/* Genealogía */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">👨‍👩‍👧‍👦 GENEALOGÍA</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><strong>👨 Padre:</strong> {animal.padre ? `${animal.padre.arete} - ${animal.padre.nombre}` : 'No registrado'}</p>
              <p><strong>👩 Madre:</strong> {animal.madre ? `${animal.madre.arete} - ${animal.madre.nombre}` : 'No registrado'}</p>
              <p><strong>👶 Hijos:</strong> Ninguno registrado</p>
            </div>
          </div>

          {/* Observaciones */}
          {animal.observaciones && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 OBSERVACIONES</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p>{animal.observaciones}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={onEdit}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            ✏️ EDITAR INFORMACIÓN
          </button>
        </div>
      </div>
    </div>
  );
}