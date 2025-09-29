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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Icon name="star" className="w-8 h-8 text-primary-600" />
            Registrar Preñez Directa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Flujo 2: Registro Directo</h3>
              <p className="text-sm text-blue-700">
                Para animales ya preñados sin registro previo de monta. El sistema calculará la fecha de parto basándose en el tiempo de gestación actual.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Hembra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hembra Preñada <span className="text-red-500">*</span>
            </label>
            <select
              value={hembraId}
              onChange={(e) => setHembraId(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar hembra...</option>
              {hembras.map(hembra => (
                <option key={hembra.id} value={hembra.id}>
                  {hembra.arete} {hembra.nombre ? `- ${hembra.nombre}` : ''} ({hembra.raza?.nombre})
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Macho (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Macho/Padre (opcional)
            </label>
            <select
              value={machoId}
              onChange={(e) => setMachoId(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No especificado</option>
              {machos.map(macho => (
                <option key={macho.id} value={macho.id}>
                  {macho.arete} {macho.nombre ? `- ${macho.nombre}` : ''} ({macho.raza?.nombre})
                </option>
              ))}
            </select>
          </div>

          {/* Tiempo de Gestación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Gestación <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad
              </label>
              <select
                value={unidadTiempo}
                onChange={(e) => setUnidadTiempo(e.target.value as 'semanas' | 'meses')}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="meses">Meses</option>
                <option value="semanas">Semanas</option>
              </select>
            </div>
          </div>

          {/* Fecha de Confirmación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Confirmación <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={fechaConfirmacion}
              onChange={(e) => setFechaConfirmacion(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Fecha de Parto Estimada (Calculada) */}
          {fechaPartoEstimada && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="calendar" className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">Fecha de Parto Estimada</h4>
              </div>
              <p className="text-green-700 font-semibold">
                {formatDate(fechaPartoEstimada)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Calculada automáticamente basándose en el tiempo de gestación ingresado
              </p>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Método de confirmación, veterinario que confirmó, etc."
              rows={3}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Botones */}
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
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting || !hembraId || !tiempoGestacion || !fechaConfirmacion}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Preñez'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}