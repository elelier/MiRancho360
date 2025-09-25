import { useState } from 'react';
import type { Animal } from '../../types/animals';
import Icon from '../common/Icon';

interface AnimalRowProps {
  animal: Animal;
  onShowDetails: () => void;
  onShowActions: () => void;
}

export function AnimalRow({ animal, onShowDetails, onShowActions }: AnimalRowProps) {
  const [swipeState, setSwipeState] = useState<'none' | 'left' | 'right'>('none');
  
  // Calcular edad
  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years}.${months} años`;
    } else {
      return `${months} meses`;
    }
  };

  // Determinar estado de salud (simulado por ahora)
  const getHealthStatus = () => {
    // TODO: Implementar lógica real basada en vacunas, tratamientos, etc.
    const random = Math.random();
    if (random > 0.8) return { text: 'Requiere atención', bg: 'bg-red-50' };
    if (random > 0.6) return { text: 'Vacuna pendiente', bg: 'bg-yellow-50' };
    return { text: 'Saludable', bg: 'bg-green-50' };
  };

  // Obtener símbolo y color de sexo
  const getSexInfo = (sexo: string) => {
    if (sexo === 'Macho') {
      return { icon: 'male', color: 'text-blue-600', text: 'M' };
    } else {
      return { icon: 'female', color: 'text-pink-600', text: 'H' };
    }
  };

  const healthStatus = getHealthStatus();
  const age = calculateAge(animal.fecha_nacimiento);
  const sexInfo = getSexInfo(animal.sexo);

  // Handlers de swipe mejorados
  let touchStartX = 0;
  let touchCurrentX = 0;
  let isSwiping = false;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;
    
    // Solo activar swipe si es un movimiento considerable (>50px)
    if (Math.abs(diffX) > 50) {
      if (diffX < -50 && swipeState !== 'left') {
        setSwipeState('left');
      } else if (diffX > 50 && swipeState !== 'right') {
        setSwipeState('right');
      }
    }
  };

  const handleTouchEnd = () => {
    isSwiping = false;
  };

  const resetSwipe = () => {
    setSwipeState('none');
  };

  const handleDetailsClick = () => {
    onShowDetails();
    resetSwipe();
  };

  const handleActionsClick = () => {
    onShowActions();
    resetSwipe();
  };

  // Click en área principal para resetear swipe
  const handleMainAreaClick = () => {
    if (swipeState !== 'none') {
      resetSwipe();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Renglón principal */}
      <div
        className={`${healthStatus.bg} border border-gray-200 rounded-lg p-4 min-h-[80px] transition-transform duration-300 cursor-pointer ${
          swipeState === 'left' ? 'transform -translate-x-32' : 
          swipeState === 'right' ? 'transform translate-x-32' : ''
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleMainAreaClick}
      >
        {/* Línea 1: Arete + Nombre + Raza + Sexo */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <span className="font-bold text-lg text-gray-800">
              #{animal.arete} {animal.nombre && `${animal.nombre} |`} {animal.raza.nombre}
            </span>
            <span className="ml-2">
              <Icon name={sexInfo.icon} className={`w-5 h-5 inline ${sexInfo.color}`} />
            </span>
          </div>
        </div>

        {/* Línea 2: Ubicación + Edad + Peso + Genealogía */}
        <div className="text-gray-700 mb-1 flex items-center">
          <Icon name="location" className="w-4 h-4 mr-1 text-gray-500" />
          <span>{animal.sitio_actual?.nombre || 'Sin ubicación'} | {age}</span>
          {animal.peso_kg && <span> | {animal.peso_kg}kg</span>}
          {(animal.padre || animal.madre) && (
            <span className="ml-2 text-sm text-gray-600">
              {animal.padre && `P:${animal.padre.arete}`}
              {animal.padre && animal.madre && ', '}
              {animal.madre && `M:${animal.madre.arete}`}
            </span>
          )}
        </div>

        {/* Línea 3: Estado de salud */}
        <div className="text-sm text-gray-600">
          {healthStatus.text}
        </div>
      </div>

      {/* Botón Ver Detalles (swipe izquierda) */}
      {swipeState === 'left' && (
        <button
          onClick={handleDetailsClick}
          className="absolute left-0 top-0 h-full px-6 bg-primary-600 text-white font-medium flex items-center justify-center min-w-[140px] rounded-l-lg shadow-lg"
        >
          <Icon name="eye" className="w-5 h-5 mr-2" />
          VER DETALLES
        </button>
      )}

      {/* Botón Acciones (swipe derecha) */}
      {swipeState === 'right' && (
        <button
          onClick={handleActionsClick}
          className="absolute right-0 top-0 h-full px-6 bg-accent-600 text-white font-medium flex items-center justify-center min-w-[140px] rounded-r-lg shadow-lg"
        >
          <Icon name="lightning-bolt" className="w-5 h-5 mr-2" />
          ACCIONES
        </button>
      )}
    </div>
  );
}