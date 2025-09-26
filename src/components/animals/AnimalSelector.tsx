import React, { useState, useEffect, useRef } from 'react';
import type { Animal } from '../../types/animals';

interface AnimalSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (animalId: string) => void;
  animals: Animal[];
  filterBySex?: 'Macho' | 'Hembra';
  placeholder?: string;
  excludeAnimalId?: string; // Para excluir al animal actual en edición
}

export const AnimalSelector: React.FC<AnimalSelectorProps> = ({
  label,
  value,
  onChange,
  animals,
  filterBySex,
  placeholder = "Buscar por arete, nombre o raza...",
  excludeAnimalId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar animales según criterios
  const filteredAnimals = animals
    .filter(animal => {
      // Excluir el animal actual en edición
      if (excludeAnimalId && animal.id === excludeAnimalId) return false;
      
      // Filtrar por sexo si se especifica
      if (filterBySex && animal.sexo !== filterBySex) return false;
      
      // Solo mostrar animales activos
      if (!animal.activo) return false;
      
      // Filtrar por término de búsqueda
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          animal.arete.toLowerCase().includes(term) ||
          (animal.nombre && animal.nombre.toLowerCase().includes(term)) ||
          (animal.raza && animal.raza.nombre && animal.raza.nombre.toLowerCase().includes(term))
        );
      }
      
      return true;
    })
    .slice(0, 10); // Limitar a 10 resultados para performance

  // Encontrar el animal seleccionado
  useEffect(() => {
    if (value) {
      const animal = animals.find(a => a.id === value);
      setSelectedAnimal(animal || null);
    } else {
      setSelectedAnimal(null);
    }
  }, [value, animals]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (animal: Animal) => {
    onChange(animal.id);
    setSelectedAnimal(animal);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setSelectedAnimal(null);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (selectedAnimal) {
      setSearchTerm(selectedAnimal.arete);
    }
  };

  const displayText = selectedAnimal 
    ? `${selectedAnimal.arete}${selectedAnimal.nombre ? ` - ${selectedAnimal.nombre}` : ''}`
    : '';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-lg font-semibold text-primary-800 mb-3">
        {label}
        {filterBySex && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({filterBySex === 'Macho' ? '♂️ Machos' : '♀️ Hembras'} solamente)
          </span>
        )}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayText}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={selectedAnimal ? displayText : placeholder}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
        />
        
        {/* Botón de limpiar */}
        {selectedAnimal && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar selección"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Icono de búsqueda */}
        {!selectedAnimal && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {filteredAnimals.length > 0 ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-b">
                {filteredAnimals.length} resultado{filteredAnimals.length !== 1 ? 's' : ''} encontrado{filteredAnimals.length !== 1 ? 's' : ''}
              </div>
              {filteredAnimals.map((animal) => (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => handleSelect(animal)}
                  className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0 focus:bg-primary-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-primary-800">
                        🏷️ {animal.arete}
                        {animal.nombre && (
                          <span className="font-normal text-gray-700 ml-2">- {animal.nombre}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {animal.sexo === 'Macho' ? '♂️' : '♀️'} {animal.sexo} • 
                        {animal.raza && animal.raza.nombre && ` ${animal.raza.nombre} • `}
                        {animal.fecha_nacimiento && new Date(animal.fecha_nacimiento).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="text-primary-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              {searchTerm ? (
                <>
                  <div className="text-lg mb-2">🔍 Sin resultados</div>
                  <div className="text-sm">
                    No se encontraron {filterBySex ? (filterBySex === 'Macho' ? 'machos' : 'hembras') : 'animales'} que coincidan con "{searchTerm}"
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg mb-2">📋 Lista vacía</div>
                  <div className="text-sm">
                    No hay {filterBySex ? (filterBySex === 'Macho' ? 'machos' : 'hembras') : 'animales'} registrados aún
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};