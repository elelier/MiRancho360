import { useState } from 'react';
import { Button } from '../common/Button';
import Icon from '../common/Icon';
import type { EventoMonta } from '../../types/reproductive';

interface PregnancyConfirmationModalProps {
  evento: EventoMonta;
  onClose: () => void;
  onConfirm: (eventoId: string, isPregnant: boolean, observaciones?: string) => Promise<void>;
}

export function PregnancyConfirmationModal({ 
  evento, 
  onClose, 
  onConfirm 
}: PregnancyConfirmationModalProps) {
  const [isPregnant, setIsPregnant] = useState<boolean | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPregnant === null) return;

    try {
      setIsSubmitting(true);
      await onConfirm(evento.id, isPregnant, observaciones || undefined);
      
      if (isPregnant) {
        setShowSuccessMessage(true);
        // Esperar 2 segundos antes de cerrar para mostrar mensaje de éxito
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error al confirmar preñez:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00.000Z').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Icon name="cow" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Confirmar preñez</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Evento #{evento.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Detalles del evento</h3>
              <p className="text-sm text-gray-600"><strong>Fecha de monta:</strong> {formatDate(evento.fecha_monta)}</p>
              <p className="text-sm text-gray-600"><strong>Método:</strong> {evento.metodo_monta === 'natural' ? 'Monta Natural' : 'Inseminación Artificial'}</p>
              <p className="text-sm text-gray-600"><strong>Confirmación esperada:</strong> {formatDate(evento.fecha_confirmacion_prenez || '')}</p>
              {evento.observaciones && (
                <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {evento.observaciones}</p>
              )}
            </section>

            <section className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">¿El animal está preñado?</label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-2xl border-2 transition-colors cursor-pointer ${isPregnant === true ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <input
                    type="radio"
                    value="true"
                    checked={isPregnant === true}
                    onChange={(e) => setIsPregnant(e.target.value === 'true')}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-3 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Sí, está preñada</span>
                  </span>
                </label>

                <label className={`flex items-center p-4 rounded-2xl border-2 transition-colors cursor-pointer ${isPregnant === false ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
                  <input
                    type="radio"
                    value="false"
                    checked={isPregnant === false}
                    onChange={(e) => setIsPregnant(e.target.value === 'true')}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-3 flex items-center gap-2">
                    <Icon name="x-circle" className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">No, no está preñada</span>
                  </span>
                </label>
              </div>
            </section>

            {showSuccessMessage && isPregnant && (
              <div className="border border-green-200 rounded-2xl p-4 bg-green-50 space-y-2">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <Icon name="check-circle" className="w-5 h-5" />
                  ¡Preñez confirmada exitosamente!
                </div>
                <p className="text-xs text-green-700">
                  La hembra ha sido marcada como preñada. Podrás registrar la cría cuando nazca desde la página de animales.
                </p>
              </div>
            )}

            <section className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Observaciones (opcional)</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Detalles del examen, método de confirmación, etc."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </section>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPregnant === null || isSubmitting}
              className="w-full sm:w-auto sm:flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Confirmando...
                </div>
              ) : (
                'Confirmar resultado'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
