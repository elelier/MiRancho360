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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6 animate-fade-in">
      <div className="w-full h-full sm:h-auto sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-from-bottom">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Icon name="heart" className="w-7 h-7 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Registrar evento de monta</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Programa el ciclo reproductivo de tus animales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={creatingEvent}
          >
            <Icon name="x-mark" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <Icon name="x-circle" className="w-5 h-5 text-red-500 mt-1" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </div>
            )}

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="users" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Animales reproductores</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hembra *</label>
                  <select
                    value={formData.hembra_id}
                    onChange={(e) => handleInputChange('hembra_id', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  >
                    <option value="">Seleccionar hembra...</option>
                    {hembras.map((hembra) => (
                      <option key={hembra.id} value={hembra.id}>
                        {getAnimalDisplay(hembra)}
                      </option>
                    ))}
                  </select>
                  {errors.hembra_id && <p className="text-red-500 text-sm mt-1">{errors.hembra_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Macho *</label>
                  <select
                    value={formData.macho_id}
                    onChange={(e) => handleInputChange('macho_id', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  >
                    <option value="">Seleccionar macho...</option>
                    {machos.map((macho) => (
                      <option key={macho.id} value={macho.id}>
                        {getAnimalDisplay(macho)}
                      </option>
                    ))}
                  </select>
                  {errors.macho_id && <p className="text-red-500 text-sm mt-1">{errors.macho_id}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon name="calendar" className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Detalles del evento</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Fecha de monta *"
                  value={formData.fecha_monta}
                  onChange={(e) => handleInputChange('fecha_monta', e.target.value)}
                  error={errors.fecha_monta}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método de monta</label>
                  <div className="space-y-2">
                    {METODOS_MONTA.map((metodo) => (
                      <label key={metodo.value} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="metodo_monta"
                          value={metodo.value}
                          checked={formData.metodo_monta === metodo.value}
                          onChange={(e) => handleInputChange('metodo_monta', e.target.value)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <Icon name={metodo.icon} className="w-5 h-5 text-primary-500" />
                        <span className="text-sm text-gray-700">{metodo.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre la monta..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                />
              </div>
            </section>

            {fechasCalculadas && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon name="clock" className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Fechas calculadas automáticamente</h3>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <Icon name="shield-check" className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Confirmar preñez</p>
                      <p className="text-sm text-gray-600">{formatearFecha(fechasCalculadas.fechaConfirmacion)} (+45 días)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="sparkles" className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Parto estimado</p>
                      <p className="text-sm text-gray-600">{formatearFecha(fechasCalculadas.fechaParto)} (+283 días)</p>
                    </div>
                  </div>
                  <p className="text-xs text-primary-600 bg-white/70 rounded-xl px-3 py-2">
                    Estas fechas se generan automáticamente para ayudarte a dar seguimiento al ciclo reproductivo.
                  </p>
                </div>
              </section>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto sm:flex-1"
              disabled={creatingEvent}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto sm:flex-1"
              isLoading={creatingEvent}
              disabled={creatingEvent}
            >
              {creatingEvent ? 'Registrando...' : 'Registrar monta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}