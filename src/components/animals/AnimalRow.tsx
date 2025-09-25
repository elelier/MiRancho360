import { useState, useRef } from 'react';
import type { Animal } from '../../types/animals';
import Icon from '../common/Icon';

interface AnimalRowProps {
  animal: Animal;
  onShowDetails: () => void;
  onShowActions: () => void;
}

export function AnimalRow({ animal, onShowDetails, onShowActions }: AnimalRowProps) {
  const [swipeState, setSwipeState] = useState<'normal' | 'showing-details' | 'showing-actions'>('normal');
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef(false);
  
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

  // Sistema de swipe que respeta el scroll vertical
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchCurrentX - touchStartX.current;
    const diffY = touchCurrentY - touchStartY.current;
    
    // Determinar si es swipe horizontal o scroll vertical
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    
    // Si aún no hemos determinado la dirección
    if (!isHorizontalSwipe.current && (absX > 15 || absY > 15)) {
      // Si el movimiento horizontal es mayor que el vertical, es swipe
      isHorizontalSwipe.current = absX > absY;
      
      // Si es movimiento vertical, permitir scroll nativo
      if (!isHorizontalSwipe.current) {
        isDragging.current = false;
        return;
      }
    }
    
    // Solo procesar swipes horizontales
    if (isHorizontalSwipe.current && absX > 80) {
      // Prevenir scroll durante swipe horizontal
      e.preventDefault();
      
      // Lógica bidireccional - sigue el movimiento natural del dedo
      if (swipeState === 'normal') {
        if (diffX > 80) {
          setSwipeState('showing-details'); // Card derecha, VER izquierda
          isDragging.current = false;
        } else if (diffX < -80) {
          setSwipeState('showing-actions'); // Card izquierda, ACCIONES derecha
          isDragging.current = false;
        }
      } else if (swipeState === 'showing-details') {
        // Desde VER: solo swipe izquierda regresa
        if (diffX < -80) {
          setSwipeState('normal');
          isDragging.current = false;
        }
      } else if (swipeState === 'showing-actions') {
        // Desde ACCIONES: solo swipe derecha regresa
        if (diffX > 80) {
          setSwipeState('normal');
          isDragging.current = false;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    isHorizontalSwipe.current = false;
  };

  // Funciones para ejecutar acciones y regresar a normal
  const handleDetailsClick = () => {
    onShowDetails();
    setSwipeState('normal');
  };

  const handleActionsClick = () => {
    onShowActions();
    setSwipeState('normal');
  };

  // Tap en card para regresar a normal cuando hay opciones visibles
  const handleCardTap = () => {
    if (swipeState !== 'normal') {
      setSwipeState('normal');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gray-50 rounded-lg">
      {/* Botones de fondo - aparecen detrás de la card */}
      {/* Botón Ver Detalles (lado izquierdo) */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-primary-600 flex items-center justify-center">
        <button
          onClick={handleDetailsClick}
          className="w-full h-full flex flex-col items-center justify-center text-white font-medium"
        >
          <Icon name="eye" className="w-6 h-6 mb-1" />
          <span className="text-xs">VER</span>
        </button>
      </div>

      {/* Botón Acciones (lado derecho) */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-accent-600 flex items-center justify-center">
        <button
          onClick={handleActionsClick}
          className="w-full h-full flex flex-col items-center justify-center text-white font-medium"
        >
          <Icon name="lightning-bolt" className="w-6 h-6 mb-1" />
          <span className="text-xs">ACCIONES</span>
        </button>
      </div>

      {/* Card principal que se desliza encima */}
      <div
        className={`${healthStatus.bg} border border-gray-200 rounded-lg p-4 min-h-[80px] relative z-10 transition-transform duration-200 ease-out ${
          swipeState === 'showing-details' ? 'transform translate-x-32' : 
          swipeState === 'showing-actions' ? 'transform -translate-x-32' : 'transform translate-x-0'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardTap}
        style={{ touchAction: 'pan-y' }}
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

        {/* Indicador sutil de swipe disponible */}
        {swipeState === 'normal' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-30">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}