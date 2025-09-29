import React, { useState, useEffect } from 'react';
import { useAnimals } from '../../hooks/useAnimals';
import { useReproductive } from '../../hooks/useReproductive';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import Icon from '../common/Icon';
import type { EventoMontaFormData, MetodoMonta } from '../../types/reproductive';
import type { Animal } from '../../types/animals';

interface MatingEventModalProps {
  onClose: () => void;
  onEventCreated?: () => void;
}

const METODOS_MONTA: { value: MetodoMonta; label: string; icon: string }[] = [
  { value: 'natural', label: 'Monta Natural', icon: 'heart' },
  { value: 'inseminacion', label: 'Inseminación Artificial', icon: 'syringe' },
  { value: 'transferencia', label: 'Transferencia de Embriones', icon: 'beaker' }
];

export function MatingEventModal({ onClose, onEventCreated }: MatingEventModalProps) {
  const { animals, reload: loadAnimals } = useAnimals();
  const { createMatingEvent, creatingEvent } = useReproductive();

  // Estados del formulario
  const [formData, setFormData] = useState<EventoMontaFormData>({
    hembra_id: '',
    macho_id: '',
    fecha_monta: new Date().toISOString().split('T')[0],
    metodo_monta: 'natural',
    observaciones: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fechasCalculadas, setFechasCalculadas] = useState<{
    fechaConfirmacion: string;
    fechaParto: string;
  } | null>(null);

  // Cargar animales al montar
  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Filtrar animales por sexo y estado activo
  const hembras = animals?.filter(animal => 
    animal.sexo === 'Hembra' && animal.estado === 'Activo'
  ) || [];

  const machos = animals?.filter(animal => 
    animal.sexo === 'Macho' && animal.estado === 'Activo'
  ) || [];

  // Calcular fechas cuando cambia la fecha de monta
  useEffect(() => {
    if (formData.fecha_monta) {
      const fechaMonta = new Date(formData.fecha_monta + 'T00:00:00.000Z');
      
      // Calcular fecha de confirmación (+45 días)
      const fechaConfirmacion = new Date(fechaMonta);
      fechaConfirmacion.setDate(fechaConfirmacion.getDate() + 45);
      
      // Calcular fecha estimada de parto (+283 días para bovinos)
      const fechaParto = new Date(fechaMonta);
      fechaParto.setDate(fechaParto.getDate() + 283);
      
      setFechasCalculadas({
        fechaConfirmacion: fechaConfirmacion.toISOString().split('T')[0],
        fechaParto: fechaParto.toISOString().split('T')[0]
      });
    }
  }, [formData.fecha_monta]);

  const handleInputChange = (field: keyof EventoMontaFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.hembra_id) {
      newErrors.hembra_id = 'Selecciona una hembra';
    }

    if (!formData.macho_id) {
      newErrors.macho_id = 'Selecciona un macho';
    }

    if (!formData.fecha_monta) {
      newErrors.fecha_monta = 'La fecha de monta es obligatoria';
    }

    // Validar que la hembra no sea la misma que el macho
    if (formData.hembra_id && formData.macho_id && formData.hembra_id === formData.macho_id) {
      newErrors.macho_id = 'El macho debe ser diferente a la hembra';
    }

    // Validar fecha no futura
    if (formData.fecha_monta && formData.fecha_monta > new Date().toISOString().split('T')[0]) {
      newErrors.fecha_monta = 'La fecha no puede ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const cleanedData = {
        ...formData,
        observaciones: formData.observaciones || undefined
      };

      await createMatingEvent(cleanedData);
      onEventCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creando evento de monta:', error);
      setErrors({ general: 'Error al registrar el evento de monta. Intenta nuevamente.' });
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00.000Z').toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAnimalDisplay = (animal: Animal) => {
    return `${animal.arete}${animal.nombre ? ` - ${animal.nombre}` : ''} (${animal.raza?.nombre || 'Sin raza'})`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center space-x-3">
            <Icon name="heart" className="w-8 h-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Registrar Evento de Monta
              </h2>
              <p className="text-sm text-gray-600">
                Programa el ciclo reproductivo de tus animales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-2 hover:bg-white rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <Icon name="x-circle" className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Selección de animales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Icon name="heart" className="w-5 h-5" />
              <span>Animales Reproductores</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hembra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚺 Hembra *
                </label>
                <select
                  value={formData.hembra_id}
                  onChange={(e) => handleInputChange('hembra_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar hembra...</option>
                  {hembras.map(hembra => (
                    <option key={hembra.id} value={hembra.id}>
                      {getAnimalDisplay(hembra)}
                    </option>
                  ))}
                </select>
                {errors.hembra_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.hembra_id}</p>
                )}
              </div>

              {/* Macho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚹 Macho *
                </label>
                <select
                  value={formData.macho_id}
                  onChange={(e) => handleInputChange('macho_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar macho...</option>
                  {machos.map(macho => (
                    <option key={macho.id} value={macho.id}>
                      {getAnimalDisplay(macho)}
                    </option>
                  ))}
                </select>
                {errors.macho_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.macho_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles del evento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Icon name="calendar" className="w-5 h-5" />
              <span>Detalles del Evento</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de monta */}
              <div>
                <Input
                  type="date"
                  label="Fecha de Monta *"
                  value={formData.fecha_monta}
                  onChange={(e) => handleInputChange('fecha_monta', e.target.value)}
                  error={errors.fecha_monta}
                />
              </div>

              {/* Método de monta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Monta
                </label>
                <div className="space-y-2">
                  {METODOS_MONTA.map(metodo => (
                    <label key={metodo.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="metodo_monta"
                        value={metodo.value}
                        checked={formData.metodo_monta === metodo.value}
                        onChange={(e) => handleInputChange('metodo_monta', e.target.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <Icon name={metodo.icon} className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{metodo.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones || ''}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre la monta..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Fechas calculadas */}
          {fechasCalculadas && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Icon name="calendar" className="w-5 h-5" />
                <span>Fechas Calculadas Automáticamente</span>
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="clock" className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Confirmar Preñez</p>
                    <p className="text-sm text-blue-600">
                      {formatearFecha(fechasCalculadas.fechaConfirmacion)} (+45 días)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="star" className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Parto Estimado</p>
                    <p className="text-sm text-blue-600">
                      {formatearFecha(fechasCalculadas.fechaParto)} (+283 días)
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 Estas fechas se calcularán automáticamente y se crearán recordatorios 
                    para ayudarte a hacer seguimiento del ciclo reproductivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={creatingEvent}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={creatingEvent}
              disabled={creatingEvent}
            >
              {creatingEvent ? 'Registrando...' : 'Registrar Monta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}