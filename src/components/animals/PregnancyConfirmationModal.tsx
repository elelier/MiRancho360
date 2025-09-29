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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Icon name="cow" className="w-8 h-8 text-primary-600" />
            Confirmar Preñez
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Detalles del Evento</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Fecha de Monta:</strong> {formatDate(evento.fecha_monta)}</p>
            <p><strong>Método:</strong> {evento.metodo_monta === 'natural' ? 'Monta Natural' : 'Inseminación Artificial'}</p>
            <p><strong>Confirmación esperada:</strong> {formatDate(evento.fecha_confirmacion_prenez || '')}</p>
            {evento.observaciones && (
              <p><strong>Observaciones:</strong> {evento.observaciones}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿El animal está preñado?
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
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
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
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
          </div>

          {/* Mensaje de éxito para preñez confirmada */}
          {showSuccessMessage && isPregnant && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-2 text-green-800 mb-2">
                <Icon name="check-circle" className="w-5 h-5" />
                <span className="font-medium">¡Preñez confirmada exitosamente!</span>
              </div>
              <p className="text-sm text-green-700">
                La hembra ha sido marcada como preñada. Puedes registrar la cría cuando nazca desde la página de Animales.
              </p>
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles del examen, método de confirmación, etc."
              rows={3}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPregnant === null || isSubmitting}
              fullWidth
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Confirmando...
                </div>
              ) : (
                'Confirmar Resultado'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}