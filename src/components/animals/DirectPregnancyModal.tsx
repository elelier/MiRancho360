import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import Icon from '../common/Icon';
import { Input } from '../common/Input';
import { useAnimals } from '../../hooks/useAnimals';


interface DirectPregnancyModalProps {
  onClose: () => void;
  onConfirm: (data: DirectPregnancyData) => Promise<void>;
}

export interface DirectPregnancyData {
  hembra_id: string;
  macho_id?: string; // Opcional en Flujo 2
  tiempo_gestacion_semanas: number;
  fecha_confirmacion: string;
  observaciones?: string;
}

export function DirectPregnancyModal({ 
  onClose, 
  onConfirm 
}: DirectPregnancyModalProps) {
  const { animals } = useAnimals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados del formulario
  const [hembraId, setHembraId] = useState('');
  const [machoId, setMachoId] = useState('');
  const [tiempoGestacion, setTiempoGestacion] = useState<number | ''>('');
  const [unidadTiempo, setUnidadTiempo] = useState<'semanas' | 'meses'>('meses');
  const [fechaConfirmacion, setFechaConfirmacion] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [observaciones, setObservaciones] = useState('');
  
  // Estados calculados
  const [fechaPartoEstimada, setFechaPartoEstimada] = useState('');

  // Filtrar animales
  const hembras = animals.filter(animal => animal.sexo === 'Hembra');
  const machos = animals.filter(animal => animal.sexo === 'Macho');

  // Calcular fecha de parto estimada cuando cambian los inputs
  useEffect(() => {
    if (tiempoGestacion && fechaConfirmacion) {
      const tiempoEnSemanas = unidadTiempo === 'meses' 
        ? Number(tiempoGestacion) * 4.33 // Promedio de semanas por mes
        : Number(tiempoGestacion);
      
      // Período de gestación promedio bovino: 40 semanas (280 días)
      // Calcular semanas restantes
      const semanasRestantes = 40 - tiempoEnSemanas;
      const fechaConfirmacionObj = new Date(fechaConfirmacion);
      const fechaParto = new Date(fechaConfirmacionObj.getTime() + (semanasRestantes * 7 * 24 * 60 * 60 * 1000));
      
      setFechaPartoEstimada(fechaParto.toISOString().split('T')[0]);
    }
  }, [tiempoGestacion, unidadTiempo, fechaConfirmacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hembraId || !tiempoGestacion || !fechaConfirmacion) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const tiempoEnSemanas = unidadTiempo === 'meses' 
        ? Number(tiempoGestacion) * 4.33
        : Number(tiempoGestacion);

      const data: DirectPregnancyData = {
        hembra_id: hembraId,
        macho_id: machoId || undefined,
        tiempo_gestacion_semanas: tiempoEnSemanas,
        fecha_confirmacion: fechaConfirmacion,
        observaciones: observaciones || undefined,
      };
      
      await onConfirm(data);
      onClose();
    } catch (error) {
      console.error('Error al registrar preñez directa:', error);
      alert('Error al registrar la preñez. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString + 'T00:00:00.000Z').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Icon name="star" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Registrar preñez directa</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Flujo 2 · Registro sin evento de monta</p>
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

        <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-4">
          <div className="flex items-start gap-3 text-sm text-blue-700">
            <Icon name="info" className="w-5 h-5 text-blue-500 mt-0.5" />
            <p>
              Para animales ya preñados sin registro previo de monta. Calculamos la fecha estimada de parto según el tiempo de gestación actual.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="cow" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Animales</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hembra preñada <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={hembraId}
                    onChange={(e) => setHembraId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    required
                  >
                    <option value="">Seleccionar hembra...</option>
                    {hembras.map((hembra) => (
                      <option key={hembra.id} value={hembra.id}>
                        {hembra.arete} {hembra.nombre ? `- ${hembra.nombre}` : ''} ({hembra.raza?.nombre})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Macho/Padre (opcional)</label>
                  <select
                    value={machoId}
                    onChange={(e) => setMachoId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  >
                    <option value="">No especificado</option>
                    {machos.map((macho) => (
                      <option key={macho.id} value={macho.id}>
                        {macho.arete} {macho.nombre ? `- ${macho.nombre}` : ''} ({macho.raza?.nombre})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="clock" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Gestación</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de gestación <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={tiempoGestacion}
                    onChange={(e) => setTiempoGestacion(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej: 6"
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                  <select
                    value={unidadTiempo}
                    onChange={(e) => setUnidadTiempo(e.target.value as 'semanas' | 'meses')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  >
                    <option value="meses">Meses</option>
                    <option value="semanas">Semanas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de confirmación <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={fechaConfirmacion}
                  onChange={(e) => setFechaConfirmacion(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {fechaPartoEstimada && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Icon name="calendar" className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Fecha estimada de parto</p>
                      <p className="text-sm text-green-600">{formatDate(fechaPartoEstimada)}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Observaciones (opcional)</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                placeholder="Notas adicionales o indicaciones del veterinario"
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
              variant="primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full sm:w-auto sm:flex-1"
            >
              {isSubmitting ? 'Guardando...' : 'Registrar preñez'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
