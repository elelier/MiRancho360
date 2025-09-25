# 🧪 CHECKLIST DE TESTING - Módulo Animales con Swipe Gestures
## MiRancho360 - Testing Sistemático (24 Sep 2025)

> **URL de Testing**: http://localhost:5173/
> **Usuario de prueba**: PIN 1234 
> **Módulo**: Animales con arquitectura swipe gestures

---

## 🚀 **FASE 1: ACCESO Y NAVEGACIÓN BÁSICA**

### ✅ **1.1 Autenticación y Acceso**
- [ ] Abrir http://localhost:5173/
- [ ] Ingresar PIN: 1234
- [ ] Verificar que ingresa al Dashboard
- [ ] Click en "Animales" desde el menú lateral
- [ ] Verificar que carga la nueva AnimalsListPage

**Resultado esperado**: Debe mostrar la lista de animales con la nueva interface de renglones altos

### ✅ **1.2 Layout y Diseño Visual**  
- [ ] **Header**: Título "🐄 Animales" visible
- [ ] **Contador**: "📊 Total: X animales | Mostrando 1-20 de X"
- [ ] **Paleta de colores**: Verificar que usa Verde Dusty y Amarillo Tierra
- [ ] **Responsive**: Probar en diferentes tamaños de pantalla
- [ ] **SideMenu**: Debe estar presente y funcional

**Comentarios esperados**: 
- "El diseño se ve profesional y natural"
- "Los colores son calmados para la vista"
- "La información está bien organizada"

---

## 📱 **FASE 2: TESTING DE SWIPE GESTURES (CRÍTICO)**

### ✅ **2.1 Renglones de Animales**
- [ ] **Altura mínima**: Cada renglón debe tener ~80px de alto
- [ ] **Información jerárquica**: 4 líneas por animal:
  - Línea 1: #Arete NOMBRE | Raza | Sexo + Icono estado
  - Línea 2: 📍 Sitio | Edad | Peso | Genealogía  
  - Línea 3: Estado de salud con contexto
  - Línea 4: Instrucciones "Swipe ← → "
- [ ] **Estados visuales**: Verificar fondos por estado:
  - Verde claro (saludables)
  - Amarillo claro (vacuna pendiente)  
  - Rojo claro (requieren atención)

### ✅ **2.2 Swipe Izquierda → VER DETALLES**
- [ ] Hacer swipe hacia la izquierda en un renglón
- [ ] Debe aparecer botón "👁️ VER DETALLES" con fondo Verde Dusty
- [ ] Click en "VER DETALLES"
- [ ] Debe abrir el AnimalDetailsModal

**Comentarios esperados**:
- "El swipe se siente natural y fluido"
- "El botón es fácil de tocar (56px mínimo)"
- "El color verde dusty se ve bien"

### ✅ **2.3 Swipe Derecha → ACCIONES**
- [ ] Hacer swipe hacia la derecha en un renglón
- [ ] Debe aparecer botón "⚡ ACCIONES" con fondo Amarillo Tierra
- [ ] Click en "ACCIONES"  
- [ ] Debe abrir el AnimalActionsModal

**Comentarios esperados**:
- "Los gestos son intuitivos"
- "El amarillo tierra contrasta bien"
- "No hay conflicto entre ambos swipes"

---

## 👁️ **FASE 3: MODAL VER DETALLES**

### ✅ **3.1 Contenido del Modal**
- [ ] **Header**: "👁️ VER DETALLES - #Arete Nombre"
- [ ] **Botón X**: Debe cerrar el modal
- [ ] **Información General**: Foto, arete, nombre, raza, sexo, edad, peso
- [ ] **Ubicación**: Sitio actual + botón "🏠 MOVER DE LUGAR"
- [ ] **Estado de Salud**: Estado actual + historial
- [ ] **Genealogía**: Padre, madre, hijos
- [ ] **Observaciones**: Si las hay
- [ ] **Footer**: Botón "✏️ EDITAR INFORMACIÓN"

### ✅ **3.2 Interacciones del Modal**
- [ ] Click en "🏠 MOVER DE LUGAR" → Debe abrir MoveAnimalModal
- [ ] Click en "✏️ EDITAR INFORMACIÓN" → Debe mostrar mensaje (pendiente)
- [ ] Click en "X" o fuera del modal → Debe cerrar
- [ ] **Scroll**: Si hay mucho contenido, debe scroll suavemente

**Comentarios esperados**:
- "Toda la información está bien organizada"
- "Es fácil encontrar lo que busco"
- "Los botones son lo suficientemente grandes"

---

## ⚡ **FASE 4: MODAL ACCIONES**

### ✅ **4.1 Lista de Acciones**
Verificar que aparezcan las 7 acciones con botones grandes (56px):
- [ ] **🏠 MOVER DE LUGAR** (Amarillo Tierra)
- [ ] **💉 REGISTRAR VACUNA** (Verde Dusty)  
- [ ] **📝 REGISTRAR OBSERVACIÓN** (Verde)
- [ ] **🏥 ATENCIÓN MÉDICA** (Rojo)
- [ ] **📊 VER HISTORIAL** (Azul)
- [ ] **⚖️ REGISTRAR PESO** (Morado)
- [ ] **📷 TOMAR FOTO** (Gris)

### ✅ **4.2 Interacciones de Acciones**
- [ ] Click en "🏠 MOVER DE LUGAR" → Debe abrir MoveAnimalModal
- [ ] Click en otras acciones → Debe mostrar mensaje "Pendiente de implementar"
- [ ] **Descripción**: Cada botón debe tener descripción clara
- [ ] **Touch**: Fácil de tocar en móvil

**Comentarios esperados**:
- "Las acciones están bien priorizadas"
- "Los colores ayudan a identificar rápidamente"
- "Perfecto para usuarios mayores"

---

## 🏠 **FASE 5: MODAL MOVER ANIMAL**

### ✅ **5.1 Información del Animal**
- [ ] **Animal a mover**: Debe mostrar info del animal seleccionado
- [ ] **Ubicación actual**: Debe mostrar sitio actual

### ✅ **5.2 Selección de Destino**  
- [ ] **Lista de sitios**: Debe mostrar sitios disponibles
- [ ] **Capacidad**: Debe mostrar espacios disponibles vs ocupados
- [ ] **Sitios llenos**: Debe aparecer en rojo con "❌ Lleno"
- [ ] **Selección**: Radio buttons grandes y fáciles de tocar
- [ ] **Validación**: No debe permitir seleccionar sitios llenos

### ✅ **5.3 Formulario Completo**
- [ ] **Motivo**: Campo opcional pre-llenado
- [ ] **Fecha/Hora**: Debe mostrar fecha actual
- [ ] **Botón Cancelar**: Debe cerrar sin cambios
- [ ] **Botón Confirmar**: Debe procesar el movimiento
- [ ] **Validación**: Debe requerir sitio seleccionado

### ✅ **5.4 Simulación de Movimiento**
- [ ] Seleccionar un sitio disponible
- [ ] Click en "✅ CONFIRMAR MOVIMIENTO"
- [ ] Debe mostrar "⏳ MOVIENDO..." por 1 segundo
- [ ] Debe mostrar alerta "Animal movido exitosamente"  
- [ ] Debe cerrar modal y recargar lista

**Comentarios esperados**:
- "El proceso es claro y sin errores"
- "La validación evita errores humanos"
- "Feedback inmediato tranquiliza"

---

## 🔍 **FASE 6: FILTROS Y BÚSQUEDA**

### ✅ **6.1 Búsqueda en Tiempo Real**
- [ ] **Campo búsqueda**: Placeholder "🔎 Buscar por arete, nombre, raza..."
- [ ] Escribir "A001" → Debe filtrar animales
- [ ] Escribir nombre parcial → Debe encontrar coincidencias
- [ ] Escribir raza → Debe filtrar por raza
- [ ] **Botón X**: Debe limpiar búsqueda
- [ ] **Sin resultados**: Debe mostrar mensaje amigable

### ✅ **6.2 Filtros por Dropdown**
- [ ] **Dropdown Sitios**: "🏠 Todos los sitios" + lista de sitios únicos
- [ ] **Dropdown Razas**: "🐄 Todas las razas" + lista de razas únicas  
- [ ] **Filtros combinados**: Búsqueda + sitio + raza deben funcionar juntos
- [ ] **Botón RESET**: Debe limpiar todos los filtros
- [ ] **Contador actualizado**: Debe mostrar "Mostrando X de Y filtrados"

**Comentarios esperados**:
- "Encuentro rápidamente lo que busco"
- "Los filtros son intuitivos"
- "No se siente lento ni pesado"

---

## 📄 **FASE 7: PAGINACIÓN Y NAVEGACIÓN**

### ✅ **7.1 Paginación Básica**  
- [ ] **20 animales por página**: Verificar límite correcto
- [ ] **Botones grandes**: "◀️ ANTERIOR" y "SIGUIENTE ▶️"
- [ ] **Números de página**: Botones [1][2][3]...[N] 
- [ ] **Página actual**: Debe destacarse en Verde Dusty
- [ ] **Botones deshabilitados**: Gris cuando no aplican

### ✅ **7.2 Navegación de Páginas**
- [ ] Click "SIGUIENTE" → Debe ir a página 2
- [ ] Click "ANTERIOR" → Debe volver a página 1  
- [ ] Click número directo → Debe ir a esa página
- [ ] **Estados**: Verificar contador "Mostrando 21-40 de X"

### ✅ **7.3 Botón Flotante**
- [ ] **Posición**: Esquina inferior derecha
- [ ] **Icono**: Plus (+) visible
- [ ] **Color**: Amarillo Tierra (accent-600)
- [ ] **Funcional**: Click debe mostrar mensaje (pendiente implementar)
- [ ] **Z-index**: Debe estar sobre todo el contenido

**Comentarios esperados**:
- "La navegación es clara y predecible"
- "Los botones grandes son perfectos para touch"
- "Nunca me pierdo en dónde estoy"

---

## ⚠️ **FASE 8: ESTADOS ESPECIALES**

### ✅ **8.1 Estado de Carga (Loading)**
- [ ] **Skeleton placeholders**: 5 renglones con animación
- [ ] **Sin bloqueo**: No debe bloquear la interfaz
- [ ] **Transición suave**: De loading a contenido

### ✅ **8.2 Estado Vacío (Empty)**
- [ ] **Sin animales**: Debe mostrar "🐄 No hay animales registrados"
- [ ] **Sin resultados**: "No se encontraron animales" con filtros aplicados
- [ ] **Botón acción**: "Agregar Primer Animal" cuando corresponde
- [ ] **Mensaje amigable**: Sugerencia de ajustar filtros

### ✅ **8.3 Estado de Error**
- [ ] **Mensaje claro**: "⚠️ Error al cargar animales"  
- [ ] **Botón reintentar**: "🔄 Reintentar" funcional
- [ ] **Sin crash**: App sigue funcionando

**Comentarios esperados**:
- "Nunca me siento perdido"
- "Los mensajes son claros y útiles" 
- "Siempre sé qué hacer si algo falla"

---

## 🎨 **FASE 9: UX Y ACCESIBILIDAD (60+)**

### ✅ **9.1 Elementos Táctiles**
- [ ] **Botones mínimo 56px**: Todos los botones principales
- [ ] **Área táctil**: Renglones completos son tocables para swipe
- [ ] **Separación**: Espacios suficientes entre elementos
- [ ] **Sin elementos pequeños**: Nada menor a 44px

### ✅ **9.2 Legibilidad**
- [ ] **Texto mínimo 18px**: Para información principal
- [ ] **Contraste**: Negro sobre fondos claros
- [ ] **Jerarquía visual**: Tamaños y pesos de fuente correctos
- [ ] **Iconos descriptivos**: Emojis + texto siempre

### ✅ **9.3 Feedback Visual**
- [ ] **Estados hover**: Botones cambian al pasar mouse
- [ ] **Estados active**: Feedback al tocar
- [ ] **Transiciones suaves**: 300ms para animaciones
- [ ] **Loading states**: Usuario sabe que algo está pasando

**Comentarios esperados**:
- "Todo es fácil de ver y tocar"
- "No necesito hacer esfuerzo para usar la app"
- "Se siente natural y familiar"

---

## 📱 **FASE 10: RESPONSIVE Y MÓVIL**

### ✅ **10.1 Diferentes Tamaños**
- [ ] **Móvil (320px)**: Todo se ve correctamente
- [ ] **Tablet (768px)**: Layout se adapta
- [ ] **Desktop (1024px+)**: Aprovecha el espacio
- [ ] **Orientación**: Funciona en vertical y horizontal

### ✅ **10.2 Touch Gestures**
- [ ] **Swipe natural**: Se siente como apps nativas
- [ ] **Scroll suave**: Lista se desplaza sin problemas  
- [ ] **Zoom**: No debe romperse con zoom de sistema
- [ ] **Selección**: No debe seleccionar texto accidentalmente

**Comentarios esperados**:
- "Funciona perfecto en mi teléfono"
- "Los gestos se sienten naturales"
- "No necesito hacer zoom para ver"

---

## 🎯 **TESTING DE INTEGRACIÓN COMPLETA**

### ✅ **11.1 Flujo Completo Usuario**
**Escenario**: Usuario quiere mover un animal de Corral-1 a Pastura-A

1. [ ] Login con PIN 1234
2. [ ] Navegar a Animales 
3. [ ] Buscar animal específico (ej: "A001")
4. [ ] Swipe derecha en el resultado
5. [ ] Click "🏠 MOVER DE LUGAR"
6. [ ] Seleccionar "Pastura-A"
7. [ ] Agregar motivo "Pastoreo rutinario"  
8. [ ] Click "✅ CONFIRMAR MOVIMIENTO"
9. [ ] Verificar mensaje exitoso
10. [ ] Verificar que se cierra modal
11. [ ] Verificar que lista se actualiza

**Tiempo esperado**: < 30 segundos
**Pasos táctiles**: < 10 toques

### ✅ **11.2 Flujo Alternativo: Ver Detalles**
**Escenario**: Usuario quiere ver información completa de un animal

1. [ ] Encontrar animal en lista
2. [ ] Swipe izquierda 
3. [ ] Click "👁️ VER DETALLES"
4. [ ] Revisar todas las secciones
5. [ ] Click "✏️ EDITAR" (debe mostrar mensaje)
6. [ ] Cerrar modal

---

## 📝 **COMENTARIOS Y FEEDBACK ESPERADOS**

### ✅ **Comentarios Positivos Esperados**
- [ ] "Los swipe gestures son muy naturales"
- [ ] "Todo está al alcance sin esfuerzo" 
- [ ] "Los colores son relajantes para la vista"
- [ ] "La información está muy bien organizada"
- [ ] "No me siento abrumado con tanta información"
- [ ] "Es fácil encontrar lo que busco rápidamente"
- [ ] "Perfecto para usar en el campo con guantes"

### ✅ **Posibles Áreas de Mejora**
- [ ] "Me gustaría ver fotos de los animales"
- [ ] "Falta conexión con datos reales"
- [ ] "Necesito más opciones de filtros avanzados"
- [ ] "Quiero poder seleccionar múltiples animales"

### ✅ **Problemas Críticos (Reportar)**
- [ ] Swipe gestures no funcionan
- [ ] Modals no se abren/cierran
- [ ] Filtros no funcionan correctamente
- [ ] Paginación rota
- [ ] Layout roto en móvil
- [ ] Botones muy pequeños para tocar
- [ ] Texto ilegible

---

## 🚀 **CHECKLIST FINAL - COMPLETADO**

### ✅ **Funcionalidades Core**
- [ ] ✅ Autenticación y navegación
- [ ] ✅ Lista de animales responsive  
- [ ] ✅ Swipe gestures izquierda/derecha
- [ ] ✅ Modal ver detalles completo
- [ ] ✅ Modal acciones con 7 opciones
- [ ] ✅ Modal mover animal funcional
- [ ] ✅ Filtros y búsqueda en tiempo real
- [ ] ✅ Paginación con botones grandes
- [ ] ✅ Estados especiales (loading/error/empty)
- [ ] ✅ UX optimizada para 60+

### ✅ **Calidad Técnica**
- [ ] ✅ Paleta Rancho Natural aplicada
- [ ] ✅ Elementos táctiles ≥ 56px
- [ ] ✅ Texto legible ≥ 18px  
- [ ] ✅ Responsive mobile-first
- [ ] ✅ Transiciones suaves
- [ ] ✅ Manejo de errores

### ✅ **Experiencia Usuario**
- [ ] ✅ Flujo intuitivo y natural
- [ ] ✅ Feedback visual constante
- [ ] ✅ Acciones rápidas ≤ 3 toques
- [ ] ✅ Sin confusión ni elementos perdidos
- [ ] ✅ Información jerárquica clara

---

## 🎯 **RESULTADO ESPERADO**

**Al completar este testing, deberías poder decir:**

> *"El módulo de animales con swipe gestures está 100% funcional. La interfaz es intuitiva, los gestos se sienten naturales, toda la información está bien organizada y es perfecto para usuarios 60+. Solo necesita conectarse con datos reales de Supabase para estar completamente operativo."*

**Tiempo total de testing**: ~45-60 minutos
**Dispositivos recomendados**: Móvil + Desktop
**Navegadores**: Chrome, Safari, Firefox

---

**¿Listo para comenzar el testing sistemático? 🧪**