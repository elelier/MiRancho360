import { useState } from 'react';
import type { Animal } from '../../types/animals';

interface MoveAnimalModalProps {
  animal: Animal;
  onClose: () => void;
  onSuccess: () => void;
}

export function MoveAnimalModal({ animal, onClose, onSuccess }: MoveAnimalModalProps) {
  const [selectedSitio, setSelectedSitio] = useState('');
  const [motivo, setMotivo] = useState('Rutina de pastoreo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sitios disponibles (simulados por ahora)
  const sitiosDisponibles = [
    { id: '1', nombre: 'Corral-2', capacidad: 25, ocupado: 18 },
    { id: '2', nombre: 'Pastura-A', capacidad: 50, ocupado: 32 },
    { id: '3', nombre: 'Establo-1', capacidad: 15, ocupado: 8 },
    { id: '4', nombre: 'Corral-3', capacidad: 20, ocupado: 20, lleno: true }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSitio) {
      alert('Por favor selecciona un sitio de destino');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implementar llamada real al servicio de movimientos
      console.log('Moviendo animal:', {
        animalId: animal.id,
        sitioDestino: selectedSitio,
        motivo
      });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Animal movido exitosamente');
      onSuccess();
    } catch (error) {
      alert('Error al mover animal: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">🏠 MOVER ANIMAL</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Animal Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">🐄 ANIMAL A MOVER</h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="font-medium">#{animal.arete} {animal.nombre} | {animal.raza.nombre} | {animal.sexo}</p>
              <p className="text-sm text-gray-600">📍 Ubicación actual: {animal.sitio_actual?.nombre || 'Sin ubicación'}</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Destino */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🎯 SELECCIONAR DESTINO</h3>
              <div className="space-y-2">
                {sitiosDisponibles.map(sitio => (
                  <label 
                    key={sitio.id} 
                    className={`block p-3 border rounded-lg cursor-pointer ${
                      sitio.lleno 
                        ? 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed'
                        : selectedSitio === sitio.id
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sitio"
                      value={sitio.id}
                      checked={selectedSitio === sitio.id}
                      onChange={(e) => setSelectedSitio(e.target.value)}
                      disabled={sitio.lleno}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {sitio.lleno ? '❌' : '✅'} {sitio.nombre}
                      </span>
                      <span className="text-sm">
                        {sitio.lleno 
                          ? `Lleno (${sitio.ocupado}/${sitio.capacidad})`
                          : `Disponible: ${sitio.capacidad - sitio.ocupado} espacios`
                        }
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 MOTIVO DEL MOVIMIENTO (Opcional)
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Rutina de pastoreo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Fecha y Hora */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📅 FECHA Y HORA</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} ⚪ Ahora
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              disabled={isSubmitting}
            >
              🔄 CANCELAR
            </button>
            <button
              type="submit"
              disabled={!selectedSitio || isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                !selectedSitio || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent-600 text-white hover:bg-accent-700'
              }`}
            >
              {isSubmitting ? '⏳ MOVIENDO...' : '✅ CONFIRMAR MOVIMIENTO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}