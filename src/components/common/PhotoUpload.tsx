import React, { useState, useRef, useCallback } from 'react';

interface PhotoUploadProps {
  label: string;
  value?: string | File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  value,
  onChange,
  error
}) => {
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Generar vista previa
  React.useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string' && value) {
      setPreview(value);
    } else {
      setPreview('');
    }
  }, [value]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP)');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB permitido.');
        return;
      }
    }
    
    onChange(file);
  }, [onChange]);

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input para permitir tomar la misma foto nuevamente
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleGallerySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input para permitir seleccionar la misma foto nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    handleFileSelect(null);
    setPreview('');
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-primary-800 mb-3">
        {label}
      </label>
      
      <div className="relative">
        {/* Vista previa de la foto */}
        {preview ? (
          <div className="relative mb-4 bg-white rounded-xl border-2 border-gray-300 overflow-hidden">
            <img
              src={preview}
              alt="Vista previa del animal"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-end justify-end p-4">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
                aria-label="Eliminar foto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {/* Overlay con información */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm font-medium">
                📸 Foto del animal - Toca ✖️ para cambiar
              </p>
            </div>
          </div>
        ) : (
          /* Área de carga cuando no hay foto */
          <div className="mb-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📷</div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Botón Tomar Foto (Cámara) */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl transition-colors min-h-[64px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>📱 Tomar Foto</span>
          </button>

          {/* Botón Seleccionar de Galería */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 text-white text-lg font-semibold rounded-xl transition-colors min-h-[64px]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>🖼️ Galería</span>
          </button>
        </div>

        {/* Inputs ocultos para capturar archivos */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleGallerySelect}
          className="hidden"
        />
        
        {/* Información adicional */}
        <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">{error}</p>
        )}
      </div>
    </div>
  );
};