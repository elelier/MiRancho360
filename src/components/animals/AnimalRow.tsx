import { useState } from 'react';
import type { Animal } from '../../types/animals';

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
    if (random > 0.8) return { icon: '🏥', text: 'Requiere atención', bg: 'bg-red-50' };
    if (random > 0.6) return { icon: '💉', text: 'Vacuna pendiente', bg: 'bg-yellow-50' };
    return { icon: '✅', text: 'Saludable', bg: 'bg-green-50' };
  };

  const healthStatus = getHealthStatus();
  const age = calculateAge(animal.fecha_nacimiento);

  // Handlers de swipe (simulados por ahora)
  const handleSwipeLeft = () => {
    setSwipeState('left');
  };

  const handleSwipeRight = () => {
    setSwipeState('right');
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

  return (
    <div className="relative overflow-hidden">
      {/* Renglón principal */}
      <div
        className={`${healthStatus.bg} border border-gray-200 rounded-lg p-4 min-h-[80px] transition-transform duration-300 ${
          swipeState === 'left' ? 'transform -translate-x-32' : 
          swipeState === 'right' ? 'transform translate-x-32' : ''
        }`}
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;
          
          const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentX = moveEvent.touches[0].clientX;
            const diffX = currentX - startX;
            
            if (Math.abs(diffX) > 50) {
              if (diffX < 0) {
                handleSwipeLeft();
              } else {
                handleSwipeRight();
              }
            }
          };

          const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };

          document.addEventListener('touchmove', handleTouchMove);
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {/* Línea 1: Arete + Nombre + Raza + Sexo + Estado */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <span className="font-bold text-lg text-gray-800">
              #{animal.arete} {animal.nombre && `${animal.nombre} |`} {animal.raza.nombre} | {animal.sexo}
            </span>
          </div>
          <div className="text-2xl ml-3">
            {healthStatus.icon}
          </div>
        </div>

        {/* Línea 2: Ubicación + Edad + Peso */}
        <div className="text-gray-700 mb-1">
          📍 {animal.sitio_actual?.nombre || 'Sin ubicación'} | {age} 
          {animal.peso_kg && ` | ${animal.peso_kg}kg`}
          {(animal.padre || animal.madre) && (
            <span>
              {animal.padre && ` | Padre: ${animal.padre.arete}`}
              {animal.madre && ` | Madre: ${animal.madre.arete}`}
            </span>
          )}
        </div>

        {/* Línea 3: Estado de salud */}
        <div className="text-sm text-gray-600 mb-1">
          {healthStatus.text}
        </div>

        {/* Línea 4: Instrucciones de swipe */}
        <div className="text-xs text-gray-500">
          💬 "Swipe ← Ver detalles | Swipe → Acciones"
        </div>
      </div>

      {/* Botón Ver Detalles (swipe izquierda) */}
      {swipeState === 'left' && (
        <button
          onClick={handleDetailsClick}
          className="absolute left-0 top-0 h-full px-6 bg-primary-600 text-white font-medium flex items-center justify-center min-w-[120px] rounded-l-lg"
        >
          👁️ VER DETALLES
        </button>
      )}

      {/* Botón Acciones (swipe derecha) */}
      {swipeState === 'right' && (
        <button
          onClick={handleActionsClick}
          className="absolute right-0 top-0 h-full px-6 bg-accent-600 text-white font-medium flex items-center justify-center min-w-[120px] rounded-r-lg"
        >
          ⚡ ACCIONES
        </button>
      )}
    </div>
  );
}