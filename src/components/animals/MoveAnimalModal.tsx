import { useState } from 'react';
import type { Animal } from '../../types/animals';
import Icon from '../common/Icon';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
              <Icon name="home" className="w-6 h-6 text-accent-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Mover animal</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">#{animal.arete} {animal.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <span className="sr-only">Cerrar</span>
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Animal Info */}
            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Animal a mover</h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-700">
                <p className="font-semibold text-gray-900">#{animal.arete} {animal.nombre} · {animal.raza.nombre} · {animal.sexo}</p>
                <p className="flex items-center gap-2 text-gray-500">
                  <Icon name="location" className="w-4 h-4 text-primary-500" aria-hidden />
                  {animal.sitio_actual?.nombre || 'Sin ubicación'}
                </p>
              </div>
            </section>

            {/* Destino */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="flag" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Seleccionar destino</h3>
              </div>
              <div className="space-y-3">
                {sitiosDisponibles.map((sitio) => {
                  const isSelected = selectedSitio === sitio.id;
                  const isDisabled = Boolean(sitio.lleno);

                  return (
                    <label
                      key={sitio.id}
                      className={`block rounded-2xl border-2 transition-colors p-4 cursor-pointer ${
                        isDisabled
                          ? 'border-red-200 bg-red-50 text-red-600 cursor-not-allowed'
                          : isSelected
                          ? 'border-primary-400 bg-primary-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sitio"
                        value={sitio.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedSitio(e.target.value)}
                        disabled={isDisabled}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                        <div className="flex items-center gap-3 font-semibold">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              isDisabled
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'bg-white border-gray-200 text-primary-600'
                            }`}
                          >
                            <Icon
                              name={isDisabled ? 'x-circle' : 'check'}
                              className={`w-5 h-5 ${isDisabled ? 'text-red-500' : 'text-primary-600'}`}
                            />
                          </div>
                          <span>{sitio.nombre}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {isDisabled
                            ? `Lleno (${sitio.ocupado}/${sitio.capacidad})`
                            : `Disponible: ${sitio.capacidad - sitio.ocupado} espacios`}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Motivo */}
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="motivo">
                Motivo del movimiento (opcional)
              </label>
              <input
                id="motivo"
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Rutina de pastoreo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
              />
            </section>

            {/* Fecha y Hora */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="calendar" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Fecha y hora</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm sm:text-base text-gray-600">
                {new Date().toLocaleDateString()} · {new Date().toLocaleTimeString()} (ahora)
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm sm:text-base font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedSitio || isSubmitting}
              className={`w-full sm:w-auto sm:flex-1 px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors ${
                !selectedSitio || isSubmitting
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-accent-600 text-white hover:bg-accent-700'
              }`}
            >
              {isSubmitting ? 'Moviendo...' : 'Confirmar movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}