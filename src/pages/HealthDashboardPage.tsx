import { useState, useEffect } from 'react';
import { useHealth } from '../hooks/useHealth';
import { Button } from '../components/common/Button';
import Icon from '../components/common/Icon';
import { HealthEventModal } from '../components/animals/HealthEventModal';
import type { RecordatorioSalud, TipoEventoSalud } from '../types/health';

interface ReminderWithAnimal extends RecordatorioSalud {
  animales?: {
    arete: string;
    nombre?: string;
    raza: string;
  };
}

export function HealthDashboardPage() {
  const { 
    recordatorios,
    loadRanchReminders,
    loadingRecordatorios,
    completeReminder,
    cancelReminder,
    markOverdueReminders
  } = useHealth();

  const [selectedAnimal, setSelectedAnimal] = useState<{id: string, arete: string, nombre?: string} | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<TipoEventoSalud | 'todos'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'vencidos' | 'proximos' | 'programados'>('todos');

  useEffect(() => {
    loadRanchReminders();
    markOverdueReminders(); // Actualizar recordatorios vencidos al cargar
  }, [loadRanchReminders, markOverdueReminders]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiasHasta = (fecha: string) => {
    const fechaRecordatorio = new Date(fecha);
    const hoy = new Date();
    const diferencia = Math.ceil((fechaRecordatorio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const getStatusBadge = (recordatorio: ReminderWithAnimal) => {
    const dias = getDiasHasta(recordatorio.fecha_programada);
    
    if (dias < 0) {
      return {
        className: 'bg-red-100 text-red-800 border-red-200',
        text: `Vencido hace ${Math.abs(dias)} días`,
        icon: 'x-circle'
      };
    } else if (dias === 0) {
      return {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        text: 'Hoy',
        icon: 'bell'
      };
    } else if (dias <= 7) {
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: `En ${dias} días`,
        icon: 'clock'
      };
    } else {
      return {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        text: `En ${dias} días`,
        icon: 'calendar'
      };
    }
  };

  const handleCompleteReminder = async (recordatorio: ReminderWithAnimal) => {
    if (confirm('¿Marcar este recordatorio como completado?')) {
      try {
        await completeReminder(recordatorio.id);
        await loadRanchReminders();
      } catch (error) {
        console.error('Error completando recordatorio:', error);
        alert('Error al completar el recordatorio');
      }
    }
  };

  const handleCancelReminder = async (recordatorio: ReminderWithAnimal) => {
    if (confirm('¿Cancelar este recordatorio?')) {
      try {
        await cancelReminder(recordatorio.id);
        await loadRanchReminders();
      } catch (error) {
        console.error('Error cancelando recordatorio:', error);
        alert('Error al cancelar el recordatorio');
      }
    }
  };

  const handleCreateEvent = (animalId: string, arete: string, nombre?: string) => {
    setSelectedAnimal({ id: animalId, arete, nombre });
  };

  // Filtrar recordatorios
  const recordatoriosFiltrados = recordatorios.filter(recordatorio => {
    const recordatorioTyped = recordatorio as ReminderWithAnimal;
    
    // Filtro por tipo
    if (filtroTipo !== 'todos' && recordatorioTyped.tipo_evento !== filtroTipo) {
      return false;
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      const dias = getDiasHasta(recordatorioTyped.fecha_programada);
      
      switch (filtroEstado) {
        case 'vencidos':
          return dias < 0;
        case 'proximos':
          return dias >= 0 && dias <= 7;
        case 'programados':
          return dias > 7;
        default:
          return true;
      }
    }

    return true;
  });

  // Agrupar por estado para estadísticas
  const estadisticas = recordatorios.reduce((acc, recordatorio) => {
    const dias = getDiasHasta(recordatorio.fecha_programada);
    
    if (dias < 0) acc.vencidos++;
    else if (dias <= 7) acc.proximos++;
    else acc.programados++;
    
    acc.total++;
    return acc;
  }, { total: 0, vencidos: 0, proximos: 0, programados: 0 });

  if (loadingRecordatorios) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="bell" className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard de Salud
              </h1>
              <p className="text-gray-600">
                Recordatorios y eventos de salud del rancho
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => markOverdueReminders()}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Icon name="refresh" className="w-5 h-5" />
            <span>Actualizar</span>
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recordatorios</p>
                <p className="text-2xl font-bold text-gray-800">{estadisticas.total}</p>
              </div>
              <Icon name="bell" className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-800">{estadisticas.vencidos}</p>
              </div>
              <Icon name="x-circle" className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Próximos (7 días)</p>
                <p className="text-2xl font-bold text-yellow-800">{estadisticas.proximos}</p>
              </div>
              <Icon name="clock" className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Programados</p>
                <p className="text-2xl font-bold text-blue-800">{estadisticas.programados}</p>
              </div>
              <Icon name="calendar" className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="funnel" className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="vencidos">Vencidos</option>
              <option value="proximos">Próximos (7 días)</option>
              <option value="programados">Programados</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Tipo:</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as typeof filtroTipo)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="vacuna">Vacunas</option>
              <option value="desparasitacion">Desparasitación</option>
              <option value="tratamiento_antibiotico">Tratamiento Antibiótico</option>
              <option value="revision_veterinaria">Revisión Veterinaria</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {(filtroTipo !== 'todos' || filtroEstado !== 'todos') && (
            <Button
              onClick={() => {
                setFiltroTipo('todos');
                setFiltroEstado('todos');
              }}
              variant="secondary"
              className="text-sm"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Lista de recordatorios */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recordatorios ({recordatoriosFiltrados.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recordatoriosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <Icon name="bell" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay recordatorios
              </h3>
              <p className="text-gray-500">
                {filtroTipo !== 'todos' || filtroEstado !== 'todos' 
                  ? 'No se encontraron recordatorios con los filtros seleccionados'
                  : 'No hay recordatorios de salud programados'
                }
              </p>
            </div>
          ) : (
            recordatoriosFiltrados.map(recordatorio => {
              const recordatorioTyped = recordatorio as ReminderWithAnimal;
              const status = getStatusBadge(recordatorioTyped);
              
              return (
                <div key={recordatorioTyped.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <Icon name="bell" className="w-6 h-6 text-primary-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {recordatorioTyped.titulo}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                            <Icon name={status.icon} className="w-3 h-3 inline mr-1" />
                            {status.text}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon name="cow-large" className="w-4 h-4" />
                            <span>
                              {recordatorioTyped.animales?.arete || 'Animal no encontrado'}
                              {recordatorioTyped.animales?.nombre && ` - ${recordatorioTyped.animales.nombre}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Icon name="calendar" className="w-4 h-4" />
                            <span>{formatFecha(recordatorioTyped.fecha_programada)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Icon name="beaker" className="w-4 h-4" />
                            <span className="capitalize">{recordatorioTyped.tipo_evento.replace('_', ' ')}</span>
                          </div>
                        </div>
                        
                        {recordatorioTyped.producto_recomendado && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Producto recomendado:</strong> {recordatorioTyped.producto_recomendado}
                            {recordatorioTyped.dosis_recomendada && ` - ${recordatorioTyped.dosis_recomendada}`}
                          </p>
                        )}
                        
                        {recordatorioTyped.descripcion && (
                          <p className="text-sm text-gray-600">
                            {recordatorioTyped.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        onClick={() => handleCreateEvent(
                          recordatorioTyped.animal_id,
                          recordatorioTyped.animales?.arete || '',
                          recordatorioTyped.animales?.nombre
                        )}
                        variant="primary"
                        className="text-sm"
                      >
                        <Icon name="plus" className="w-4 h-4 mr-1" />
                        Crear Evento
                      </Button>
                      
                      <Button
                        onClick={() => handleCompleteReminder(recordatorioTyped)}
                        variant="secondary"
                        className="text-sm"
                      >
                        <Icon name="check" className="w-4 h-4 mr-1" />
                        Completar
                      </Button>
                      
                      <button
                        onClick={() => handleCancelReminder(recordatorioTyped)}
                        className="text-gray-600 hover:text-red-600 p-2"
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
      </div>

      {/* Modal para crear evento */}
      {selectedAnimal && (
        <HealthEventModal
          animalId={selectedAnimal.id}
          animalArete={selectedAnimal.arete}
          animalNombre={selectedAnimal.nombre}
          onClose={() => setSelectedAnimal(null)}
          onEventCreated={() => {
            setSelectedAnimal(null);
            loadRanchReminders();
          }}
        />
      )}
    </div>
  );
}