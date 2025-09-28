import React, { useState, useEffect } from 'react';
import { useHealth } from '../../hooks/useHealth';
import { supabase } from '../../services/supabase';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import Icon from '../common/Icon';
import type { EventoSaludFormData, TipoEventoSalud, ProductoSalud } from '../../types/health';

interface HealthEventModalProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
  onClose: () => void;
  onEventCreated?: () => void;
}

const TIPOS_EVENTO: { value: TipoEventoSalud; label: string; icon: string }[] = [
  { value: 'vacuna', label: 'Vacuna', icon: 'syringe' },
  { value: 'desparasitacion', label: 'Desparasitación', icon: 'beaker' },
  { value: 'tratamiento_antibiotico', label: 'Tratamiento Antibiótico', icon: 'hospital' },
  { value: 'tratamiento_hormonal', label: 'Tratamiento Hormonal', icon: 'hospital' },
  { value: 'cirugia', label: 'Cirugía', icon: 'hospital' },
  { value: 'revision_veterinaria', label: 'Revisión Veterinaria', icon: 'heart' },
  { value: 'analisis_laboratorio', label: 'Análisis de Laboratorio', icon: 'beaker' },
  { value: 'otros', label: 'Otros', icon: 'notes' }
];

const UNIDADES_DOSIS = ['ml', 'mg', 'cc', 'gramos', 'UI', 'mcg', 'comprimidos', 'gotas'];

export function HealthEventModal({ animalId, animalArete, animalNombre, onClose, onEventCreated }: HealthEventModalProps) {
  const { productos, loadProductos, createEvent, creatingEvent } = useHealth(animalId);

  // Estados del formulario
  const [formData, setFormData] = useState<EventoSaludFormData>({
    tipo_evento: 'vacuna',
    producto_utilizado: '',
    dosis: '',
    unidad_dosis: 'ml',
    fecha_aplicacion: new Date().toISOString().split('T')[0],
    veterinario: '',
    notas: '',
    costo: undefined,
    proveedor: '',
    lote_producto: '',
    fecha_vencimiento_producto: '',
    crear_recordatorio: false,
    dias_para_refuerzo: undefined,
    notas_recordatorio: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoSalud | null>(null);
  const [mostrarCamposAvanzados, setMostrarCamposAvanzados] = useState(false);

  // Cargar productos cuando cambia el tipo de evento
  useEffect(() => {
    loadProductos(formData.tipo_evento);
  }, [formData.tipo_evento, loadProductos]);

  // Auto-completar datos cuando se selecciona un producto predefinido
  useEffect(() => {
    if (productoSeleccionado) {
      setFormData(prev => ({
        ...prev,
        producto_utilizado: productoSeleccionado.nombre,
        dosis: productoSeleccionado.dosis_recomendada || prev.dosis,
        unidad_dosis: productoSeleccionado.unidad_dosis || prev.unidad_dosis,
        dias_para_refuerzo: productoSeleccionado.dias_refuerzo || prev.dias_para_refuerzo,
        crear_recordatorio: Boolean(productoSeleccionado.dias_refuerzo && productoSeleccionado.dias_refuerzo > 0)
      }));
    }
  }, [productoSeleccionado]);

  const handleInputChange = (field: keyof EventoSaludFormData, value: string | number | boolean | undefined) => {
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

  const handleProductoChange = (productoNombre: string) => {
    const producto = productos.find(p => p.nombre === productoNombre);
    setProductoSeleccionado(producto || null);
    handleInputChange('producto_utilizado', productoNombre);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipo_evento) {
      newErrors.tipo_evento = 'Selecciona el tipo de evento';
    }

    if (!formData.producto_utilizado.trim()) {
      newErrors.producto_utilizado = 'El producto utilizado es obligatorio';
    }

    if (!formData.fecha_aplicacion) {
      newErrors.fecha_aplicacion = 'La fecha de aplicación es obligatoria';
    }

    // Validar fecha no futura
    if (formData.fecha_aplicacion && formData.fecha_aplicacion > new Date().toISOString().split('T')[0]) {
      newErrors.fecha_aplicacion = 'La fecha no puede ser futura';
    }

    // Validar recordatorio
    if (formData.crear_recordatorio && (!formData.dias_para_refuerzo || formData.dias_para_refuerzo <= 0)) {
      newErrors.dias_para_refuerzo = 'Los días para refuerzo deben ser mayor a 0';
    }

    // Validar fecha de vencimiento
    if (formData.fecha_vencimiento_producto && formData.fecha_vencimiento_producto <= formData.fecha_aplicacion) {
      newErrors.fecha_vencimiento_producto = 'La fecha de vencimiento debe ser posterior a la aplicación';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Limpiar datos antes de enviar (filtrar campos vacíos)
      const cleanedData = {
        ...formData,
        // Convertir strings vacíos a undefined para fechas
        fecha_vencimiento_producto: formData.fecha_vencimiento_producto || undefined,
        // Filtrar campos numéricos vacíos
        costo: formData.costo || undefined,
        dias_para_refuerzo: formData.dias_para_refuerzo || undefined,
        // Filtrar strings vacíos
        veterinario: formData.veterinario || undefined,
        proveedor: formData.proveedor || undefined,
        lote_producto: formData.lote_producto || undefined,
        notas: formData.notas || undefined,
        notas_recordatorio: formData.notas_recordatorio || undefined
      };

      await createEvent(cleanedData);
      onEventCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creando evento de salud:', error);
      setErrors({ general: 'Error al crear el evento de salud. Intenta nuevamente.' });
    }
  };

  const tipoEventoActual = TIPOS_EVENTO.find(tipo => tipo.value === formData.tipo_evento);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center space-x-3">
            <Icon name={tipoEventoActual?.icon || 'hospital'} className="w-8 h-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Registrar Evento de Salud
              </h2>
              <p className="text-sm text-gray-600">
                {animalArete}{animalNombre && ` - ${animalNombre}`}
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

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Icon name="notes" className="w-5 h-5" />
              <span>Información Básica</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de evento */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evento *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TIPOS_EVENTO.map(tipo => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => handleInputChange('tipo_evento', tipo.value)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                        formData.tipo_evento === tipo.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={tipo.icon} className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">{tipo.label}</span>
                    </button>
                  ))}
                </div>
                {errors.tipo_evento && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipo_evento}</p>
                )}
              </div>

              {/* DEBUG: Test button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={async () => {
                    console.log('🧪 TEST: Autenticando con Supabase y consultando productos');
                    
                    // 1. Intentar autenticar
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                      email: 'admin@rancho.com',
                      password: 'admin123'
                    });
                    
                    console.log('🔐 Resultado autenticación:', { authData, authError });
                    
                    // 2. Consultar sesión actual
                    const { data: { session } } = await supabase.auth.getSession();
                    console.log('📋 Sesión actual:', session?.user?.id || 'Sin sesión');
                    
                    // 3. Probar consulta de productos
                    const { data, error } = await supabase
                      .from('productos_salud')
                      .select('*')
                      .eq('activo', true);
                    console.log('🧪 TEST Resultado productos:', { data, error });
                  }}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  🧪 TEST: Login + Consultar productos
                </button>
              </div>

              {/* Producto utilizado */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto Utilizado *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData.producto_utilizado}
                    onChange={(e) => handleProductoChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar producto...</option>
                    {productos.map(producto => (
                      <option key={producto.id} value={producto.nombre}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.producto_utilizado}
                    onChange={(e) => handleProductoChange(e.target.value)}
                    placeholder="O escribir producto personalizado"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {errors.producto_utilizado && (
                  <p className="text-red-500 text-sm mt-1">{errors.producto_utilizado}</p>
                )}
              </div>

              {/* Dosis */}
              <div>
                <Input
                  label="Dosis"
                  value={formData.dosis || ''}
                  onChange={(e) => handleInputChange('dosis', e.target.value)}
                  placeholder="Ej: 5"
                  error={errors.dosis}
                />
              </div>

              {/* Unidad de dosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad
                </label>
                <select
                  value={formData.unidad_dosis || 'ml'}
                  onChange={(e) => handleInputChange('unidad_dosis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {UNIDADES_DOSIS.map(unidad => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>

              {/* Fecha de aplicación */}
              <div>
                <Input
                  type="date"
                  label="Fecha de Aplicación *"
                  value={formData.fecha_aplicacion}
                  onChange={(e) => handleInputChange('fecha_aplicacion', e.target.value)}
                  error={errors.fecha_aplicacion}
                />
              </div>

              {/* Veterinario */}
              <div>
                <Input
                  label="Veterinario"
                  value={formData.veterinario || ''}
                  onChange={(e) => handleInputChange('veterinario', e.target.value)}
                  placeholder="Nombre del veterinario"
                  error={errors.veterinario}
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas y Observaciones
              </label>
              <textarea
                value={formData.notas || ''}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                placeholder="Observaciones adicionales sobre el tratamiento..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recordatorio programado por el usuario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Icon name="bell" className="w-5 h-5" />
              <span>Programar Recordatorio</span>
            </h3>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="crear_recordatorio"
                checked={formData.crear_recordatorio}
                onChange={(e) => handleInputChange('crear_recordatorio', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="crear_recordatorio" className="text-sm text-gray-700">
                Crear recordatorio para refuerzo o seguimiento
              </label>
            </div>

            {formData.crear_recordatorio && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <Input
                    type="number"
                    label="Días para Refuerzo *"
                    value={formData.dias_para_refuerzo || ''}
                    onChange={(e) => handleInputChange('dias_para_refuerzo', Number(e.target.value))}
                    placeholder="Ej: 30"
                    error={errors.dias_para_refuerzo}
                    min={1}
                  />
                </div>
                <div>
                  <Input
                    label="Notas del Recordatorio"
                    value={formData.notas_recordatorio || ''}
                    onChange={(e) => handleInputChange('notas_recordatorio', e.target.value)}
                    placeholder="Notas adicionales para el recordatorio"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Campos avanzados (colapsables) */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setMostrarCamposAvanzados(!mostrarCamposAvanzados)}
              className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Icon 
                name={mostrarCamposAvanzados ? 'chevron-up' : 'chevron-down'} 
                className="w-4 h-4" 
              />
              <span>Información Adicional (Opcional)</span>
            </button>

            {mostrarCamposAvanzados && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                <div>
                  <Input
                    type="number"
                    label="Costo"
                    value={formData.costo || ''}
                    onChange={(e) => handleInputChange('costo', Number(e.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                  />
                </div>

                <div>
                  <Input
                    label="Proveedor"
                    value={formData.proveedor || ''}
                    onChange={(e) => handleInputChange('proveedor', e.target.value)}
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div>
                  <Input
                    label="Lote del Producto"
                    value={formData.lote_producto || ''}
                    onChange={(e) => handleInputChange('lote_producto', e.target.value)}
                    placeholder="Número de lote"
                  />
                </div>

                <div>
                  <Input
                    type="date"
                    label="Fecha de Vencimiento"
                    value={formData.fecha_vencimiento_producto || ''}
                    onChange={(e) => handleInputChange('fecha_vencimiento_producto', e.target.value)}
                    error={errors.fecha_vencimiento_producto}
                  />
                </div>
              </div>
            )}
          </div>

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
              {creatingEvent ? 'Guardando...' : 'Registrar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}