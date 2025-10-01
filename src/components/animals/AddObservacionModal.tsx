import { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import Icon from '../common/Icon';
import type { ObservacionFormData } from '../../types/observaciones';

interface AddObservacionModalProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: ObservacionFormData) => Promise<void>;
}

export function AddObservacionModal({
  animalArete,
  animalNombre,
  onClose,
  onSuccess,
  onSubmit,
}: AddObservacionModalProps) {
  const [formData, setFormData] = useState<ObservacionFormData>({
    observacion: '',
    tipo: 'general',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoSectionCollapsed, setTipoSectionCollapsed] = useState(false);
  
  // Referencias para auto-focus
  const observacionInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus cuando se colapsa el tipo
  useEffect(() => {
    if (tipoSectionCollapsed && observacionInputRef.current) {
      observacionInputRef.current.focus();
    }
  }, [tipoSectionCollapsed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.observacion.trim()) {
      setError('La observación no puede estar vacía');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la observación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTipoInfo = (tipo: string) => {
    switch (tipo) {
      case 'salud':
        return { icon: 'heart', color: 'text-red-600', bgColor: 'bg-red-50', label: 'Salud' };
      case 'comportamiento':
        return { icon: 'sparkles', color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Comportamiento' };
      case 'reproduccion':
        return { icon: 'heart', color: 'text-pink-600', bgColor: 'bg-pink-50', label: 'Reproducción' };
      case 'nutricion':
        return { icon: 'beaker', color: 'text-green-600', bgColor: 'bg-green-50', label: 'Nutrición' };
      default:
        return { icon: 'notes', color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'General' };
    }
  };

  const currentTipoInfo = getTipoInfo(formData.tipo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl animate-slide-in-from-bottom sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="notes" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Nueva Observación</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                #{animalArete} {animalNombre && `- ${animalNombre}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            disabled={isSubmitting}
          >
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Tipo de Observación - Contraible */}
            <div>
              {!tipoSectionCollapsed ? (
                <>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de Observación
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {(['general', 'salud', 'comportamiento', 'reproduccion', 'nutricion'] as const).map((tipo) => {
                      const info = getTipoInfo(tipo);
                      const isSelected = formData.tipo === tipo;
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, tipo });
                            setTipoSectionCollapsed(true);
                          }}
                          className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? `${info.bgColor} border-current ${info.color} shadow-md`
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <Icon name={info.icon} className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                          <span className="text-xs sm:text-sm font-medium">{info.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setTipoSectionCollapsed(false)}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 ${currentTipoInfo.bgColor} border-current ${currentTipoInfo.color} flex items-center justify-between hover:shadow-md transition-all`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon name={currentTipoInfo.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base font-semibold">{currentTipoInfo.label}</span>
                  </div>
                  <Icon name="chevron-down" className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de la Observación
              </label>
              <input
                type="date"
                id="fecha"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Observación */}
            <div>
              <label htmlFor="observacion" className="block text-sm font-semibold text-gray-700 mb-2">
                Observación <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={observacionInputRef}
                id="observacion"
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                placeholder="Escribe tus observaciones aquí..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm sm:text-base"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.observacion.length} caracteres
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3">
                <Icon name="x-circle" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Botones - Sticky en la parte inferior */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 flex gap-3 flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="large"
              fullWidth
              disabled={isSubmitting}
              className="text-sm sm:text-base"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isSubmitting || !formData.observacion.trim()}
              className="text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Guardando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Guardar Observación</span>
                  <span className="sm:hidden">Guardar</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
