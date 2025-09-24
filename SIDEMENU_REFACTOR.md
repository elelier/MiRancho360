# SideMenu Component - Documentación

## ✅ Refactorización Completada

Se ha extraído el menú lateral del `DashboardPage.tsx` y se ha creado un componente reutilizable `SideMenu` que puede ser usado en todo el proyecto.

## 🔧 Archivos Creados/Modificados

### 1. **Nuevo Componente: `SideMenu.tsx`**
- **Ubicación**: `src/components/common/SideMenu.tsx`
- **Funcionalidad**: 
  - Menú lateral con navegación entre páginas
  - Indicador de página activa
  - Gestión de logout integrada
  - Diseño responsive y accesible
  - Tema consistente con el diseño del proyecto

### 2. **DashboardPage.tsx** ✅ Refactorizado
- Se removió el código duplicado del menú lateral
- Ahora usa el componente `SideMenu`
- Código más limpio y mantenible

### 3. **AnimalsPage.tsx** ✅ Actualizada
- Se migró de `Layout` tradicional a `SideMenu`
- Header unificado con menú hamburguesa
- Navegación consistente con otras páginas

### 4. **Layout.tsx** ✅ Mejorado
- Añadida opción `useSideMenu` para páginas que quieren el menú lateral
- Mantiene compatibilidad hacia atrás
- Flexibilidad para diferentes tipos de página

### 5. **SitesPage.tsx** ✅ Ejemplo creado
- Página de ejemplo mostrando cómo usar `Layout` con `useSideMenu`
- Implementación completa con gestión de sitios
- Referencia para futuras páginas

## 🚀 Cómo Usar

### Opción 1: Uso Directo del SideMenu
```tsx
import { SideMenu } from '../components/common/SideMenu';

export function MyPage() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-4 rounded-xl hover:bg-primary-50 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
            aria-label="Abrir menú principal"
          >
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary-800">Mi Página</h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Menu lateral */}
      <SideMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        currentPage="mypage" // Para indicar página activa
      />

      <div className="p-6">
        {/* Contenido de la página */}
      </div>
    </div>
  );
}
```

### Opción 2: Uso con Layout Mejorado
```tsx
import { Layout } from '../components/common/Layout';

export function MyPage() {
  return (
    <Layout useSideMenu currentPage="mypage" title="Mi Página">
      {/* Tu contenido aquí */}
    </Layout>
  );
}
```

## 📋 Props del SideMenu

| Prop | Tipo | Descripción |
|------|------|-------------|
| `isOpen` | `boolean` | Controla si el menú está visible |
| `onClose` | `() => void` | Callback para cerrar el menú |
| `currentPage` | `string` (opcional) | ID de la página activa para resaltar |

### Páginas Disponibles para `currentPage`:
- `"dashboard"` - Página de inicio
- `"animals"` - Gestión de animales  
- `"sites"` - Gestión de sitios
- `"reports"` - Reportes

## 🎨 Características del Diseño

- **Tema Consistente**: Usa la paleta de colores Rancho Natural
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesibilidad**: Labels ARIA y navegación por teclado
- **Animaciones**: Transiciones suaves y efectos hover
- **Indicadores Visuales**: Página activa resaltada con borde y fondo
- **Iconos**: Iconos SVG profesionales para cada sección

## 🔄 Migración de Páginas Existentes

Para migrar una página existente que usa `Layout`:

1. **Si quieres menú lateral**:
```tsx
// Antes
<Layout title="Mi Página">

// Después  
<Layout useSideMenu currentPage="mypage" title="Mi Página">
```

2. **Si no quieres menú lateral** (mantiene comportamiento actual):
```tsx
// Sigue funcionando igual
<Layout title="Mi Página">
```

## ✨ Próximos Pasos Sugeridos

1. **Migrar más páginas**: Aplicar el `SideMenu` a reportes y otras secciones
2. **Añadir más opciones al menú**: Configuración, perfil, etc.
3. **Personalización**: Permitir que el usuario configure el menú
4. **Notificaciones**: Añadir badges de notificación a los items del menú
5. **Breadcrumbs**: Complementar con navegación de migas de pan

## 🚦 Estado del Proyecto

- ✅ **SideMenu** - Componente creado y funcionando
- ✅ **DashboardPage** - Migrada y funcionando
- ✅ **AnimalsPage** - Migrada y funcionando  
- ✅ **Layout** - Actualizado con nueva funcionalidad
- ✅ **SitesPage** - Ejemplo creado
- ✅ **Compilación** - Sin errores, servidor corriendo en puerto 5177

---

**El workspace está listo y el componente SideMenu puede ser reutilizado en todos los módulos del proyecto!** 🚀