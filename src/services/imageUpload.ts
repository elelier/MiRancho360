import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sube una imagen al storage de Supabase y retorna la URL pública
 */
export async function uploadAnimalPhoto(file: File, animalArete: string): Promise<UploadResult> {
  try {
    // Validar archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG y WEBP.'
      };
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'El archivo es muy grande. Máximo 5MB permitido.'
      };
    }

    // Generar nombre único para el archivo
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const extension = file.type.split('/')[1];
    const fileName = `${animalArete}_${timestamp}.${extension}`;
    const filePath = `animales/${fileName}`;

    // Subir archivo a Supabase Storage
    const { error } = await supabase.storage
      .from('animales-fotos')
      .upload(filePath, file, {
        cacheControl: '3600', // Cache por 1 hora
        upsert: false // No sobrescribir si existe
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return {
        success: false,
        error: `Error al subir la imagen: ${error.message}`
      };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('animales-fotos')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'No se pudo obtener la URL pública de la imagen.'
      };
    }

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Error en uploadAnimalPhoto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al subir la imagen.'
    };
  }
}

/**
 * Elimina una foto del storage de Supabase
 */
export async function deleteAnimalPhoto(fotoUrl: string): Promise<UploadResult> {
  try {
    if (!fotoUrl) {
      return { success: true }; // No hay nada que eliminar
    }

    // Extraer el path del archivo de la URL
    const url = new URL(fotoUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // animales/filename.jpg

    const { error } = await supabase.storage
      .from('animales-fotos')
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando archivo:', error);
      return {
        success: false,
        error: `Error al eliminar la imagen: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error en deleteAnimalPhoto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar la imagen.'
    };
  }
}

/**
 * Actualiza la foto de un animal (elimina la anterior y sube la nueva)
 */
export async function updateAnimalPhoto(
  file: File, 
  animalArete: string, 
  fotoAnteriorUrl?: string
): Promise<UploadResult> {
  try {
    // Subir nueva foto
    const uploadResult = await uploadAnimalPhoto(file, animalArete);
    
    if (!uploadResult.success) {
      return uploadResult;
    }

    // Si hay foto anterior, eliminarla
    if (fotoAnteriorUrl) {
      await deleteAnimalPhoto(fotoAnteriorUrl);
      // No fallar si no se puede eliminar la foto anterior
    }

    return uploadResult;

  } catch (error) {
    console.error('Error en updateAnimalPhoto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar la imagen.'
    };
  }
}

/**
 * Obtiene la URL optimizada de una imagen con parámetros de transformación
 */
export function getOptimizedImageUrl(fotoUrl: string, width: number = 400, quality: number = 80): string {
  if (!fotoUrl) return '';
  
  try {
    const url = new URL(fotoUrl);
    // Supabase permite transformaciones de imagen agregando parámetros
    url.searchParams.set('width', width.toString());
    url.searchParams.set('quality', quality.toString());
    return url.toString();
  } catch {
    return fotoUrl; // Retornar original si hay error
  }
}

/**
 * Verifica si una URL de imagen es válida y accesible
 */
export async function validateImageUrl(fotoUrl: string): Promise<boolean> {
  try {
    if (!fotoUrl) return false;
    
    const response = await fetch(fotoUrl, { method: 'HEAD' });
    return response.ok && (response.headers.get('content-type')?.startsWith('image/') || false);
  } catch {
    return false;
  }
}