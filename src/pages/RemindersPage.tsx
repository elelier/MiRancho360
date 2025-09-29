import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import Icon from '../components/common/Icon';
import { useReminders } from '../hooks/useReminders';
import { useAnimals } from '../hooks/useAnimals';
import type { RecordatorioSalud } from '../types/health';
import type { Animal } from '../types/animals';

// Tipos de estado con colores y labels
const ESTADOS_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'bg-blue-100 text-blue-800', icon: 'clock' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: 'check-circle' },
  vencido: { label: 'Vencido', color: 'bg-red-100 text-red-800', icon: 'alert-circle' },
  hoy: { label: 'Hoy', color: 'bg-yellow-100 text-yellow-800', icon: 'bell' }
} as const;

// Configuración de tipos de evento
const TIPOS_EVENTO = [
  { value: '', label: 'Todos los tipos' },
  { value: 'vacuna', label: 'Vacunación' },
  { value: 'desparasitacion', label: 'Desparasitación' },
  { value: 'antibiotico', label: 'Antibiótico' },
  { value: 'otros', label: 'Otros tratamientos' }
];

// Función para determinar el estado visual del recordatorio
const getEstadoVisual = (recordatorio: RecordatorioSalud): keyof typeof ESTADOS_CONFIG => {
  if (recordatorio.estado === 'completado') return 'completado';
  
  const hoy = new Date().toISOString().split('T')[0];
  if (recordatorio.fecha_programada < hoy) return 'vencido';
  if (recordatorio.fecha_programada === hoy) return 'hoy';
  
  return 'pendiente';
};

// Función para formatear fechas de manera amigable
const formatearFecha = (fecha: string): string => {
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  const diffTime = fechaObj.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const opciones: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short',
    year: fechaObj.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined
  };
  
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opciones);
  
  if (diffDays === 0) return `Hoy (${fechaFormateada})`;
  if (diffDays === 1) return `Mañana (${fechaFormateada})`;
  if (diffDays === -1) return `Ayer (${fechaFormateada})`;
  if (diffDays > 1 && diffDays <= 7) return `En ${diffDays} días (${fechaFormateada})`;
  if (diffDays < -1 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días (${fechaFormateada})`;
  
  return fechaFormateada;
};

// Componente de tarjeta de recordatorio
const ReminderCard: React.FC<{
  recordatorio: RecordatorioSalud;
  animalNombre?: string;
  animalArete?: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ recordatorio, animalNombre, animalArete, onComplete, onDelete }) => {
  const estadoVisual = getEstadoVisual(recordatorio);
  const config = ESTADOS_CONFIG[estadoVisual];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header con estado y fecha */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            <Icon name={config.icon} className="w-3 h-3 mr-1" />
            {config.label}
          </span>
          <span className="text-sm text-gray-500">
            {formatearFecha(recordatorio.fecha_programada)}
          </span>
        </div>
        
        {/* Acciones */}
        {recordatorio.estado === 'pendiente' && (
          <div className="flex items-center space-x-2">
            <Button
              size="small"
              variant="outline"
              onClick={() => onComplete(recordatorio.id)}
              className="text-green-600 hover:text-green-700"
            >
              <Icon name="check" className="w-4 h-4" />
            </Button>
            <Button
              size="small"
              variant="outline"
              onClick={() => onDelete(recordatorio.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Icon name="trash" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Información principal */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {recordatorio.titulo}
        </h3>
        
        {recordatorio.descripcion && (
          <p className="text-gray-600 text-sm">
            {recordatorio.descripcion}
          </p>
        )}

        {/* Información del animal */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Icon name="tag" className="w-4 h-4" />
          <span>
            {animalArete ? `#${animalArete}` : 'Animal'} 
            {animalNombre && ` - ${animalNombre}`}
          </span>
        </div>

        {/* Producto y dosis recomendada */}
        {recordatorio.producto_recomendado && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Icon name="package" className="w-4 h-4" />
            <span>
              {recordatorio.producto_recomendado}
              {recordatorio.dosis_recomendada && ` - ${recordatorio.dosis_recomendada}`}
            </span>
          </div>
        )}

        {/* Notas adicionales */}
        {recordatorio.notas && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <Icon name="message-circle" className="w-4 h-4 inline mr-2" />
            {recordatorio.notas}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
export const RemindersPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const {
    recordatoriosFiltrados,
    stats,
    loading,
    error,
    filtros,
    updateFiltros,
    markAsCompleted,
    deleteReminder
  } = useReminders();
  
  const { animals: animales } = useAnimals();

  // Manejar completar recordatorio
  const handleComplete = async (recordatorioId: string) => {
    try {
      await markAsCompleted(recordatorioId);
    } catch (error) {
      console.error('Error completando recordatorio:', error);
      // Aquí podrías agregar un toast de error
    }
  };

  // Manejar eliminar recordatorio
  const handleDelete = async (recordatorioId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este recordatorio?')) {
      return;
    }
    
    try {
      await deleteReminder(recordatorioId);
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
      // Aquí podrías agregar un toast de error
    }
  };

  // Filtrar por búsqueda de texto
  const recordatoriosMostrados = recordatoriosFiltrados.filter(recordatorio => {
    if (!busqueda) return true;
    
    const animal = animales.find((a: Animal) => a.id === recordatorio.animal_id);
    const textoCompleto = [
      recordatorio.titulo,
      recordatorio.descripcion,
      recordatorio.producto_recomendado,
      animal?.arete,
      animal?.nombre,
      recordatorio.notas
    ].filter(Boolean).join(' ').toLowerCase();
    
    return textoCompleto.includes(busqueda.toLowerCase());
  });

  return (
    <Layout 
      useSideMenu={true}
      currentPage="reminders"
      title="Recordatorios"
    >
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Icon name="bell" className="w-8 h-8 text-primary-600" />
                <span>Recordatorios</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona todos los recordatorios de salud y tratamientos
              </p>
            </div>

            {/* Estadísticas en badges */}
            <div className="flex flex-wrap items-center gap-3">
              {stats.vencidos > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Icon name="alert-circle" className="w-4 h-4" />
                  <span className="font-semibold">{stats.vencidos}</span>
                  <span className="text-sm">Vencidos</span>
                </div>
              )}
              
              {stats.hoy > 0 && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Icon name="bell" className="w-4 h-4" />
                  <span className="font-semibold">{stats.hoy}</span>
                  <span className="text-sm">Hoy</span>
                </div>
              )}
              
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Icon name="clock" className="w-4 h-4" />
                <span className="font-semibold">{stats.total_pendientes}</span>
                <span className="text-sm">Pendientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda de texto */}
            <div className="md:col-span-2">
              <Input
                type="search"
                placeholder="Buscar recordatorios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <select
                value={filtros.estado}
                onChange={(e) => updateFiltros({ estado: e.target.value as 'todos' | 'pendiente' | 'completado' | 'vencido' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="vencido">Vencidos</option>
                <option value="hoy">Para hoy</option>
                <option value="pendiente">Pendientes</option>
                <option value="completado">Completados</option>
              </select>
            </div>

            {/* Filtro por tipo */}
            <div>
              <select
                value={filtros.tipoEvento}
                onChange={(e) => updateFiltros({ tipoEvento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {TIPOS_EVENTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de recordatorios */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <Icon name="loader" className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
              <p className="text-gray-600">Cargando recordatorios...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <Icon name="alert-circle" className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && recordatoriosMostrados.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Icon name="bell-off" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay recordatorios
              </h3>
              <p className="text-gray-600">
                {busqueda || filtros.estado !== 'todos' || filtros.tipoEvento
                  ? 'No se encontraron recordatorios con los filtros aplicados'
                  : 'Aún no tienes recordatorios programados'}
              </p>
            </div>
          )}

          {recordatoriosMostrados.map(recordatorio => {
            const animal = animales.find((a: Animal) => a.id === recordatorio.animal_id);
            return (
              <ReminderCard
                key={recordatorio.id}
                recordatorio={recordatorio}
                animalNombre={animal?.nombre}
                animalArete={animal?.arete}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};