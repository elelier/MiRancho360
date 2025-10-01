import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import Icon from '../components/common/Icon';
import { SideMenu } from '../components/common/SideMenu';
import { PhotoUpload } from '../components/common/PhotoUpload';
import { PrincipalPhotoDisplay } from '../components/animals/PrincipalPhotoDisplay';
import { AnimalSelector } from '../components/animals/AnimalSelector';
import { useAnimals, useRazas, useAnimal } from '../hooks/useAnimals';
import { useSitiosConAnimales } from '../hooks/useSitiosConAnimales';
import { useAuth } from '../hooks/useAuth';
import type { AnimalFormData } from '../types';

interface FormErrors {
  [key: string]: string;
}

export function AnimalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const headerTitle = isEditing ? 'Editar Animal' : 'Nuevo Animal';
  
  // Estados principales
  const [showMenu, setShowMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Hooks
  const { usuario } = useAuth();
  const { createAnimal, updateAnimal } = useAnimals();
  const { animal, isLoading: loadingAnimal } = useAnimal(id || null);
  const { razas, isLoading: loadingRazas } = useRazas();
  const { sitios, loading: loadingSitios } = useSitiosConAnimales();

  // Estado del formulario
  const [formData, setFormData] = useState<AnimalFormData>({
    arete: '',
    nombre: '',
    raza_id: '',
    sexo: 'Hembra',
    fecha_nacimiento: '',
    peso_kg: undefined,
    sitio_inicial_id: '',
    padre_id: '',
    madre_id: '',
    observaciones: '',
    estado: 'Activo',
    foto: null
  });

  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate('/animales')}
          className="flex h-12 w-12 items-center justify-center rounded-full text-slate-900 hover:bg-gray-100 transition-colors"
          aria-label="Volver a animales"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-slate-900 truncate px-4">
          {headerTitle}
        </h1>

        <button
          onClick={() => setShowMenu(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full text-slate-900 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú principal"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );

  // Cargar datos del animal si estamos editando
  useEffect(() => {
    if (isEditing && animal) {
      setFormData({
        arete: animal.arete,
        nombre: animal.nombre || '',
        raza_id: animal.raza_id || animal.raza?.id || '',
        sexo: animal.sexo,
        fecha_nacimiento: animal.fecha_nacimiento.split('T')[0], // Solo la fecha
        peso_kg: animal.peso_kg,
        sitio_inicial_id: animal.sitio_actual_id,
        padre_id: animal.padre_id || '',
        madre_id: animal.madre_id || '',
        observaciones: animal.observaciones || '',
        estado: animal.estado || 'Activo',
        foto: animal.foto_url || null
      });
    }
  }, [isEditing, animal]);

  const handleInputChange = (field: keyof AnimalFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'peso_kg' ? (value ? parseFloat(value) : undefined) : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validaciones requeridas
    if (!formData.arete.trim()) {
      newErrors.arete = 'El arete es obligatorio';
    } else if (formData.arete.length < 1 || formData.arete.length > 20) {
      newErrors.arete = 'El arete debe tener entre 1 y 20 caracteres';
    }

    if (!formData.raza_id) {
      newErrors.raza_id = 'La raza es obligatoria';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      if (birthDate > today) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
      }
    }

    if (!formData.sitio_inicial_id) {
      newErrors.sitio_inicial_id = 'El sitio inicial es obligatorio';
    }

    if (formData.peso_kg && (formData.peso_kg < 1 || formData.peso_kg > 2000)) {
      newErrors.peso_kg = 'El peso debe estar entre 1 y 2000 kg';
    }

    if (formData.nombre && formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !usuario) return;

    setIsSubmitting(true);
    

    
    try {
      if (isEditing && id) {
        await updateAnimal(id, formData, usuario.id);
        navigate(`/animales/${id}`, { 
          state: { message: 'Animal actualizado exitosamente' }
        });
      } else {
        await createAnimal(formData, usuario.id);
        navigate('/animales', { 
          state: { message: 'Animal registrado exitosamente' }
        });
      }
    } catch (error) {
      console.error('Error al guardar animal:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Error al guardar el animal'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener todos los animales para selección de padres
  const { animals: todosLosAnimales } = useAnimals();

  if (loadingAnimal || loadingRazas || loadingSitios) {
    return (
      <div className="fixed inset-0 bg-background z-50 animate-slide-in-from-right overflow-y-auto">
        {renderHeader()}
        <SideMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          currentPage="animals"
        />
        <div className="flex items-center justify-center py-24 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-6 text-2xl text-gray-600">Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-in-from-right overflow-y-auto">
      {renderHeader()}

      {/* Menu lateral */}
      <SideMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        currentPage="animals"
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Header del formulario */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Icon name="cow-large" className="w-10 h-10 text-primary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Editar Animal' : 'Registrar Nuevo Animal'}
                </h2>
                <p className="text-gray-600 text-lg">
                  {isEditing ? 'Modifica la información del animal' : 'Completa la información del animal'}
                </p>
              </div>
            </div>

            {/* Mensaje de error general */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{errors.submit}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Básica */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <span className="text-2xl">📋</span>
                  <span>Información Básica</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Arete *"
                      value={formData.arete}
                      onChange={handleInputChange('arete')}
                      placeholder="Ej: 001, A-123"
                      error={errors.arete}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Nombre (Opcional)"
                      value={formData.nombre}
                      onChange={handleInputChange('nombre')}
                      placeholder="Ej: Bella, Toro Negro"
                      error={errors.nombre}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Raza *
                    </label>
                    <select
                      value={formData.raza_id}
                      onChange={handleInputChange('raza_id')}
                      className={`w-full px-4 py-3 border-2 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.raza_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Seleccionar raza...</option>
                      {razas.map((raza) => (
                        <option key={raza.id} value={raza.id}>
                          {raza.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.raza_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.raza_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Sexo *
                    </label>
                    <select
                      value={formData.sexo}
                      onChange={handleInputChange('sexo')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    >
                      <option value="Hembra">🐄 Hembra</option>
                      <option value="Macho">🐂 Macho</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.estado}
                      onChange={handleInputChange('estado')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    >
                      <option value="Activo">✅ Activo</option>
                      <option value="Vendido">💰 Vendido</option>
                      <option value="Muerto">💔 Muerto</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      label="Fecha de Nacimiento *"
                      type="date"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange('fecha_nacimiento')}
                      error={errors.fecha_nacimiento}
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label="Peso (kg) - Opcional"
                      type="number"
                      value={formData.peso_kg?.toString() || ''}
                      onChange={handleInputChange('peso_kg')}
                      placeholder="Ej: 350"
                      min="1"
                      max="2000"
                      step="0.1"
                      error={errors.peso_kg}
                    />
                  </div>
                </div>
              </div>

              {/* Identificación Visual */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <span className="text-2xl">📸</span>
                  <span>Identificación Visual</span>
                </h3>
                
                {isEditing && animal ? (
                  /* Foto principal con acceso al álbum completo */
                  <PrincipalPhotoDisplay
                    animalId={animal.id}
                    animalArete={animal.arete}
                    animalNombre={animal.nombre}
                  />
                ) : (
                  /* Upload simple para animales nuevos */
                  <PhotoUpload
                    label="Primera Foto del Animal (Opcional)"
                    value={formData.foto}
                    onChange={(file) => setFormData(prev => ({ ...prev, foto: file }))}
                    error={errors.foto}
                  />
                )}
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <span className="text-2xl">🏠</span>
                  <span>Ubicación</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isEditing ? 'Sitio Actual *' : 'Sitio Inicial *'}
                    </label>
                    <select
                      value={formData.sitio_inicial_id}
                      onChange={handleInputChange('sitio_inicial_id')}
                      className={`w-full px-4 py-3 border-2 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.sitio_inicial_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Seleccionar sitio...</option>
                      {sitios.map((sitio) => (
                        <option key={sitio.id} value={sitio.id}>
                          {sitio.nombre} ({sitio.tipo}) - {sitio.animales_count || 0} animales
                        </option>
                      ))}
                    </select>
                    {errors.sitio_inicial_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.sitio_inicial_id}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Genealogía (Opcional) */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <span className="text-2xl">🧬</span>
                  <span>Genealogía (Opcional)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimalSelector
                    label="🚹 Padre"
                    value={formData.padre_id}
                    onChange={(animalId) => setFormData(prev => ({ ...prev, padre_id: animalId }))}
                    animals={todosLosAnimales || []}
                    filterBySex="Macho"
                    placeholder="Buscar padre por arete, nombre o raza..."
                    excludeAnimalId={id}
                  />

                  <AnimalSelector
                    label="🚺 Madre"
                    value={formData.madre_id}
                    onChange={(animalId) => setFormData(prev => ({ ...prev, madre_id: animalId }))}
                    animals={todosLosAnimales || []}
                    filterBySex="Hembra"
                    placeholder="Buscar madre por arete, nombre o raza..."
                    excludeAnimalId={id}
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <span>Observaciones</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Notas adicionales (Opcional)
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={handleInputChange('observaciones')}
                    placeholder="Cualquier información adicional sobre el animal..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/animales')}
                  className="flex-1 py-4 text-lg"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-4 text-lg bg-primary-600 hover:bg-primary-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <>
                      <Icon name="check" className="w-5 h-5 mr-2" />
                      <span>{isEditing ? 'Actualizar Animal' : 'Registrar Animal'}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}