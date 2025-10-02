import { useState } from 'react';
import { useHealth } from '../../hooks/useHealth';
import Icon from '../common/Icon';
import { Button } from '../common/Button';
import { HealthEventModal } from './HealthEventModal';
import type { EventoSalud, RecordatorioSalud, TipoEventoSalud } from '../../types/health';

interface HealthHistoryProps {
  animalId: string;
  animalArete: string;
  animalNombre?: string;
}

const TIPO_EVENTO_LABELS: Record<TipoEventoSalud, string> = {
  vacuna: 'Vacuna',
  desparasitacion: 'Desparasitacion',
  tratamiento_antibiotico: 'Tratamiento Antibiotico',
  tratamiento_hormonal: 'Tratamiento Hormonal',
  cirugia: 'Cirugia',
  revision_veterinaria: 'Revision Veterinaria',
  analisis_laboratorio: 'Analisis de Laboratorio',
  otros: 'Otros'
};

const TIPO_EVENTO_ICONS: Record<TipoEventoSalud, string> = {
  vacuna: 'syringe',
  desparasitacion: 'beaker',
  tratamiento_antibiotico: 'hospital',
  tratamiento_hormonal: 'hospital',
  cirugia: 'hospital',
  revision_veterinaria: 'heart',
  analisis_laboratorio: 'beaker',
  otros: 'notes'
};

const TIPO_EVENTO_COLORS: Record<TipoEventoSalud, string> = {
  vacuna: 'bg-green-100 text-green-800 border-green-200',
  desparasitacion: 'bg-blue-100 text-blue-800 border-blue-200',
  tratamiento_antibiotico: 'bg-red-100 text-red-800 border-red-200',
  tratamiento_hormonal: 'bg-purple-100 text-purple-800 border-purple-200',
  cirugia: 'bg-orange-100 text-orange-800 border-orange-200',
  revision_veterinaria: 'bg-pink-100 text-pink-800 border-pink-200',
  analisis_laboratorio: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  otros: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function HealthHistory({ animalId, animalArete, animalNombre }: HealthHistoryProps) {
  const {
    historial,
    estadisticas,
    loadingHistorial,
    loadingEstadisticas,
    getUpcomingReminders,
    getOverdueReminders,
    completeReminder,
    cancelReminder,
    loadHistorial,
    loadEstadisticas
  } = useHealth(animalId);

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventoSalud | null>(null);
  const [selectedTab, setSelectedTab] = useState<'eventos' | 'recordatorios'>('eventos');
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const handleEventCreated = (nuevoEvento: EventoSalud) => {
    loadHistorial().catch(error => console.error('Error recargando historial de salud', error));
    loadEstadisticas().catch(error => console.error('Error recargando estadisticas de salud', error));
    setExpandedEvents(prev => ({ ...prev, [nuevoEvento.id]: true }));
  };

  const toggleEventDetails = (eventoId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };

  if ((loadingHistorial || loadingEstadisticas) && (!historial || !estadisticas)) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const proximosRecordatorios = getUpcomingReminders(30); // Próximos 30 días
  const recordatoriosVencidos = getOverdueReminders();
  const todayStr = new Date().toISOString().split('T')[0];
  const confirmedEvents = (historial?.eventos ?? []).filter(evento => evento.fecha_aplicacion <= todayStr);
  const confirmedEventsCost = confirmedEvents.reduce((sum, evento) => sum + (evento.costo ?? 0), 0);


  const handleCompleteReminder = async (recordatorio: RecordatorioSalud) => {
    if (confirm('¿Marcar este recordatorio como completado?')) {
      try {
        await completeReminder(recordatorio.id);
      } catch (error) {
        console.error('Error al completar recordatorio:', error);
        alert('Error al completar el recordatorio');
      }
    }
  };

  const handleCancelReminder = async (recordatorio: RecordatorioSalud) => {
    if (confirm('¿Cancelar este recordatorio?')) {
      try {
        await cancelReminder(recordatorio.id);
      } catch (error) {
        console.error('Error al cancelar recordatorio:', error);
        alert('Error al cancelar el recordatorio');
      }
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCosto = (costo?: number | null) => {
    if (costo === undefined || costo === null) return '';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(costo);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadisticas */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="heart" className="w-8 h-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Historial de Salud
              </h2>
              <p className="text-gray-600">
                {animalArete}{animalNombre && ` - ${animalNombre}`}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowEventModal(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span>Nuevo Evento</span>
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        {estadisticas && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="chart" className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Total Eventos</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{confirmedEvents.length}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="currency-dollar" className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Costo Total</span>
              </div>
              <p className="text-xl font-semibold tracking-tight text-gray-900">{formatCosto(confirmedEventsCost)}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="bell" className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-600">Recordatorios</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{estadisticas.recordatorios_pendientes}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="calendar" className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Vencidos</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{estadisticas.recordatorios_vencidos}</p>
            </div>
          </div>
        )}
      </div>

      {/* Alertas de recordatorios */}
      {recordatoriosVencidos.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="bell" className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Recordatorios Vencidos ({recordatoriosVencidos.length})
            </h3>
          </div>
          <div className="space-y-2">
            {recordatoriosVencidos.slice(0, 3).map(recordatorio => (
              <div key={recordatorio.id} className="flex items-center justify-between bg-white rounded p-3">
                <div>
                  <p className="font-medium text-red-800">{recordatorio.titulo}</p>
                  <p className="text-sm text-red-600">
                    Vencido el {formatFecha(recordatorio.fecha_programada)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCompleteReminder(recordatorio)}
                    className="text-green-600 hover:text-green-800"
                    title="Marcar como completado"
                  >
                    <Icon name="check" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCancelReminder(recordatorio)}
                    className="text-red-600 hover:text-red-800"
                    title="Cancelar recordatorio"
                  >
                    <Icon name="x-circle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Próximos recordatorios */}
      {proximosRecordatorios.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="bell" className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Próximos Recordatorios ({proximosRecordatorios.length})
            </h3>
          </div>
          <div className="space-y-2">
            {proximosRecordatorios.slice(0, 3).map(recordatorio => (
              <div key={recordatorio.id} className="flex items-center justify-between bg-white rounded p-3">
                <div>
                  <p className="font-medium text-yellow-800">{recordatorio.titulo}</p>
                  <p className="text-sm text-yellow-600">
                    Programado para el {formatFecha(recordatorio.fecha_programada)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCompleteReminder(recordatorio)}
                    className="text-green-600 hover:text-green-800"
                    title="Marcar como completado"
                  >
                    <Icon name="check" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCancelReminder(recordatorio)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Cancelar recordatorio"
                  >
                    <Icon name="x-circle" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs para eventos y recordatorios */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('eventos')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              selectedTab === 'eventos'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="notes" className="w-4 h-4" />
              <span>Eventos de Salud ({confirmedEvents.length})</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('recordatorios')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              selectedTab === 'recordatorios'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="bell" className="w-4 h-4" />
              <span>Recordatorios ({historial?.recordatorios_pendientes.length || 0})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {selectedTab === 'eventos' && (
            <div className="space-y-4">
              {!confirmedEvents.length ? (
                <div className="text-center py-12">
                  <Icon name="notes" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Sin eventos de salud
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Este animal aún no tiene eventos de salud registrados
                  </p>
                  <Button
                    onClick={() => setShowEventModal(true)}
                    variant="primary"
                  >
                    Registrar Primer Evento
                  </Button>
                </div>
              ) : (
                confirmedEvents.map((evento, index) => {
                  const isExpanded = Boolean(expandedEvents[evento.id]);
                  const isLast = index === (confirmedEvents.length || 0) - 1;

                  return (
                    <div key={evento.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-white border border-primary-200 flex items-center justify-center shadow-sm">
                          <Icon
                            name={TIPO_EVENTO_ICONS[evento.tipo_evento]}
                            className="w-5 h-5 text-primary-600"
                          />
                        </div>
                        {!isLast && <span className="w-px flex-1 bg-gray-200 mt-2"></span>}
                      </div>

                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => toggleEventDetails(evento.id)}
                          className="w-full text-left"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 hover:border-primary-300 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  {formatFecha(evento.fecha_aplicacion)}
                                </p>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mt-1">
                                  {evento.producto_utilizado}
                                </h4>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap border ${TIPO_EVENTO_COLORS[evento.tipo_evento]}`}>
                                  {TIPO_EVENTO_LABELS[evento.tipo_evento]}
                                </span>
                                {evento.costo !== undefined && evento.costo !== null && (
                                  <span className="text-xs font-semibold text-emerald-700 tracking-tight whitespace-nowrap">
                                    {formatCosto(evento.costo)}
                                  </span>
                                )}
                                <Icon
                                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                  className="w-4 h-4 text-gray-400"
                                />
                              </div>
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-3 ml-2 sm:ml-4 border-l-2 border-primary-100 pl-4 space-y-3 text-sm text-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {evento.dosis && (
                                <div>
                                  <strong>Dosis:</strong> {evento.dosis} {evento.unidad_dosis}
                                </div>
                              )}
                              {evento.veterinario && (
                                <div>
                                  <strong>Veterinario:</strong> {evento.veterinario}
                                </div>
                              )}
                              {evento.proveedor && (
                                <div>
                                  <strong>Proveedor:</strong> {evento.proveedor}
                                </div>
                              )}
                              {evento.lote_producto && (
                                <div>
                                  <strong>Lote:</strong> {evento.lote_producto}
                                </div>
                              )}
                            </div>

                            {evento.notas && (
                              <p className="text-gray-600 leading-relaxed">{evento.notas}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              {evento.fecha_vencimiento_producto && (
                                <div className="flex items-center gap-1">
                                  <Icon name="calendar" className="w-4 h-4" />
                                  <span>Vence: {formatFecha(evento.fecha_vencimiento_producto)}</span>
                                </div>
                              )}
                              {evento.created_by && (
                                <div>
                                  <strong>Registrado por:</strong> {evento.created_by}
                                </div>
                              )}
                              <div>
                                <strong>Creado:</strong> {formatFecha(evento.created_at)}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedEvent(evento)}
                              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                            >
                              Ver ficha completa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {selectedTab === 'recordatorios' && (
            <div className="space-y-4">
              {!historial?.recordatorios_pendientes.length ? (
                <div className="text-center py-12">
                  <Icon name="bell" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Sin recordatorios pendientes
                  </h3>
                  <p className="text-gray-500">
                    Este animal no tiene recordatorios de salud programados
                  </p>
                </div>
              ) : (
                historial.recordatorios_pendientes.map(recordatorio => {
                  const isVencido = recordatorio.fecha_programada < new Date().toISOString().split('T')[0];
                  const isProximo = !isVencido && proximosRecordatorios.some(r => r.id === recordatorio.id);
                  
                  return (
                    <div 
                      key={recordatorio.id}
                      className={`border rounded-lg p-4 ${
                        isVencido 
                          ? 'border-red-300 bg-red-50' 
                          : isProximo 
                            ? 'border-yellow-300 bg-yellow-50'
                            : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Icon 
                              name={TIPO_EVENTO_ICONS[recordatorio.tipo_evento]} 
                              className={`w-6 h-6 ${
                                isVencido 
                                  ? 'text-red-600' 
                                  : isProximo 
                                    ? 'text-yellow-600'
                                    : 'text-primary-600'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-lg font-semibold mb-1 ${
                              isVencido 
                                ? 'text-red-800' 
                                : isProximo 
                                  ? 'text-yellow-800'
                                  : 'text-gray-800'
                            }`}>
                              {recordatorio.titulo}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-sm mb-2">
                              <div className="flex items-center space-x-1">
                                <Icon name="calendar" className="w-4 h-4" />
                                <span className={isVencido ? 'text-red-600' : isProximo ? 'text-yellow-600' : 'text-gray-600'}>
                                  {formatFecha(recordatorio.fecha_programada)}
                                  {isVencido && ' (Vencido)'}
                                  {isProximo && ' (Próximo)'}
                                </span>
                              </div>
                              
                              {recordatorio.producto_recomendado && (
                                <div className="flex items-center space-x-1">
                                  <Icon name="beaker" className="w-4 h-4" />
                                  <span className="text-gray-600">{recordatorio.producto_recomendado}</span>
                                </div>
                              )}
                            </div>
                            
                            {recordatorio.descripcion && (
                              <p className="text-gray-600 text-sm">
                                {recordatorio.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCompleteReminder(recordatorio)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Marcar como completado"
                          >
                            <Icon name="check" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCancelReminder(recordatorio)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Cancelar recordatorio"
                          >
                            <Icon name="x-circle" className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear nuevo evento */}
      {showEventModal && (
        <HealthEventModal
          animalId={animalId}
          animalArete={animalArete}
          animalNombre={animalNombre}
          onClose={() => setShowEventModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      {/* Modal para ver detalles de evento (futuro) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Contenido del modal de detalles */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Detalles del Evento</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              {/* Aquí iría el contenido detallado del evento */}
              <div className="space-y-4">
                <p><strong>Producto:</strong> {selectedEvent.producto_utilizado}</p>
                <p><strong>Tipo:</strong> {TIPO_EVENTO_LABELS[selectedEvent.tipo_evento]}</p>
                <p><strong>Fecha:</strong> {formatFecha(selectedEvent.fecha_aplicacion)}</p>
                {selectedEvent.dosis && (
                  <p><strong>Dosis:</strong> {selectedEvent.dosis} {selectedEvent.unidad_dosis}</p>
                )}
                {selectedEvent.veterinario && (
                  <p><strong>Veterinario:</strong> {selectedEvent.veterinario}</p>
                )}
                {selectedEvent.notas && (
                  <p><strong>Notas:</strong> {selectedEvent.notas}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
