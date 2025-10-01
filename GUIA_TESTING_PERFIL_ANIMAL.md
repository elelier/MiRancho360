# 🧪 Guía de Testing - Perfil de Animal (Ruta Modal)

## ✅ Build Exitoso
**Fecha**: 30 de Septiembre de 2025  
**Estado**: ✅ Compilación sin errores  
**Servidor**: http://localhost:5173/

---

## 📱 Cómo Testear la Nueva Funcionalidad

### **Paso 1: Iniciar la Aplicación**

```bash
# Si no está corriendo ya:
npm run dev
```

**URL**: http://localhost:5173/

---

### **Paso 2: Login**

1. Abre http://localhost:5173/
2. Ingresa el PIN: `1234`
3. Clic en "Ingresar"

---

### **Paso 3: Navegar a Animales**

1. En el Dashboard, clic en **"Administrar Animales"**
2. O navega directamente a: http://localhost:5173/animales

---

### **Paso 4: Probar la Ruta Modal**

#### **Método 1: Swipe Gesture (Recomendado)**

1. En la lista de animales, localiza cualquier animal
2. **Swipe derecha** → en el renglón del animal
3. Aparecerá el botón **"VER"** en el lado izquierdo (color verde)
4. Haz clic en **"VER"**
5. ✨ **Observa**: La vista del perfil se desliza desde la derecha

#### **Método 2: URL Directa**

1. Copia el ID de cualquier animal (aparece en consola o puedes usar uno de prueba)
2. Navega directamente a: `http://localhost:5173/animales/[ID_DEL_ANIMAL]`
3. ✨ **Observa**: El perfil se carga directamente

---

### **Paso 5: Explorar el Perfil**

#### **Header**
- ✅ Botón **"← Volver"** (izquierda)
- ✅ Nombre del animal (centro)
- ✅ Botón **"✏️ Editar"** (derecha)

#### **Hero Image**
- ✅ Foto principal del animal (o placeholder)
- ✅ Botón flotante **"📷 Galería"** (esquina inferior derecha)

#### **Información Principal**
- ✅ Nombre grande
- ✅ Arete (#12345)
- ✅ Badge de sexo (♂️ Macho / ♀️ Hembra)

#### **Barra de Estado**
- ✅ 🏠 Ubicación
- ✅ ❤️ Estado (Activo)
- ✅ 📅 Edad
- ✅ ⚖️ Peso

#### **Botones de Acción**
- ✅ **"Ver Fotos"** (abre galería)
- ✅ **"Mover de Lugar"** (abre modal)

#### **Sistema de Pestañas**
- ✅ **Resumen** (activa por defecto)
  - Información del Animal
  - Genealogía (Padre/Madre)
  - Observaciones
- ✅ **Salud** (placeholder)
- ✅ **Reproducción** (placeholder)

---

### **Paso 6: Probar Navegación**

#### **Test 1: Volver con Botón**
1. Estando en el perfil, clic en **"← Volver"**
2. ✨ **Verifica**: La lista aparece exactamente como la dejaste
3. ✨ **Verifica**: Los filtros siguen aplicados
4. ✨ **Verifica**: El scroll está en la misma posición

#### **Test 2: Volver con Botón del Navegador**
1. Estando en el perfil, clic en el botón **"←"** del navegador
2. ✨ **Verifica**: Mismo comportamiento que Test 1

#### **Test 3: Estado Preservado**
1. En la lista, aplica un **filtro** (ej: buscar "vaca")
2. Haz **scroll** hacia abajo
3. Abre un perfil con swipe → clic "VER"
4. Regresa con "← Volver"
5. ✨ **Verifica**: El filtro "vaca" sigue activo
6. ✨ **Verifica**: El scroll está en la misma posición

#### **Test 4: URL Compartible**
1. Estando en el perfil, **copia la URL** de la barra de direcciones
2. Abre una **nueva pestaña**
3. **Pega la URL** y presiona Enter
4. ✨ **Verifica**: El perfil se abre directamente
5. Clic en "← Volver"
6. ✨ **Verifica**: Te lleva a la lista principal

---

### **Paso 7: Probar Animaciones**

#### **Animación de Entrada**
1. Desde la lista, abre un perfil
2. ✨ **Observa**: Vista se desliza desde la derecha (300ms)
3. ✨ **Verifica**: Transición suave y fluida
4. ✨ **Verifica**: No hay saltos ni parpadeos

#### **Animación de Salida** (navegación natural del navegador)
1. Estando en el perfil, clic en "← Volver"
2. ✨ **Observa**: Transición suave al regresar
3. ✨ **Verifica**: Lista aparece sin recargar

---

### **Paso 8: Probar Funcionalidades del Perfil**

#### **Test A: Ver Galería de Fotos**
1. En el perfil, clic en botón flotante **"📷"** del Hero Image
2. **O** clic en botón **"Ver Fotos"**
3. ✨ **Verifica**: Modal de galería se abre
4. ✨ **Verifica**: Puedes ver/subir fotos

#### **Test B: Mover Animal**
1. En el perfil, clic en **"Mover de Lugar"**
2. ✨ **Verifica**: Modal de mover animal se abre
3. Selecciona un nuevo sitio
4. Clic en "Confirmar"
5. ✨ **Verifica**: Animal se mueve correctamente

#### **Test C: Editar Animal**
1. En el perfil, clic en botón **"✏️ Editar"** (header)
2. ✨ **Verifica**: Navega a `/animales/:id/editar`
3. ✨ **Verifica**: Formulario de edición se abre

#### **Test D: Navegación entre Pestañas**
1. Clic en pestaña **"Salud"**
2. ✨ **Verifica**: Contenido cambia (placeholder por ahora)
3. Clic en pestaña **"Reproducción"**
4. ✨ **Verifica**: Contenido cambia
5. Clic en pestaña **"Resumen"**
6. ✨ **Verifica**: Vuelve al contenido inicial

---

## 🔍 Checklist de Testing Completo

### **Funcionalidad Básica**
- [ ] Login con PIN 1234
- [ ] Navegación al módulo de Animales
- [ ] Lista de animales se carga correctamente
- [ ] Swipe derecha revela botón "VER"
- [ ] Clic en "VER" abre el perfil
- [ ] Perfil se desliza desde la derecha
- [ ] URL cambia a /animales/:id

### **Información del Perfil**
- [ ] Header muestra nombre correcto
- [ ] Foto principal se muestra (o placeholder)
- [ ] Información básica correcta (arete, sexo, raza)
- [ ] Barra de estado con 4 métricas
- [ ] Badges de sexo con colores correctos
- [ ] Edad calculada correctamente

### **Navegación**
- [ ] Botón "← Volver" funciona
- [ ] Botón atrás del navegador funciona
- [ ] Estado de lista preservado (filtros)
- [ ] Scroll preservado al volver
- [ ] URL compartible funciona
- [ ] Deep linking funciona

### **Animaciones**
- [ ] Slide-in desde derecha (300ms)
- [ ] Transición suave sin saltos
- [ ] No hay parpadeos
- [ ] Performance fluido

### **Modales Integrados**
- [ ] "Ver Fotos" abre PhotoGalleryModal
- [ ] "Mover de Lugar" abre MoveAnimalModal
- [ ] Modales se cierran correctamente
- [ ] Datos se actualizan después de acciones

### **Sistema de Pestañas**
- [ ] Pestaña "Resumen" muestra información completa
- [ ] Pestaña "Salud" muestra placeholder
- [ ] Pestaña "Reproducción" muestra placeholder
- [ ] Cambio entre pestañas es instantáneo
- [ ] Estado reproductivo se muestra si existe

### **Responsividad**
- [ ] Funciona en pantalla desktop
- [ ] Funciona en tablet
- [ ] Funciona en móvil
- [ ] Botones táctiles son accesibles (56px)
- [ ] Texto legible (16px+)

### **Edge Cases**
- [ ] Animal sin foto muestra placeholder
- [ ] Animal sin nombre muestra solo arete
- [ ] Animal sin genealogía muestra "No especificado"
- [ ] Animal sin observaciones no muestra sección
- [ ] Error de carga muestra mensaje apropiado

---

## 📊 Testing en Diferentes Navegadores

### **Chrome/Edge (Recomendado)**
```bash
# Abrir Chrome DevTools
F12 → Toggle Device Toolbar (Ctrl+Shift+M)

# Simular móvil
Seleccionar: iPhone 12 Pro / Galaxy S20
```

### **Firefox**
```bash
# Abrir DevTools
F12 → Responsive Design Mode (Ctrl+Shift+M)
```

### **Safari (Mac)**
```bash
# Abrir Web Inspector
Cmd+Option+I → Enter Responsive Design Mode
```

---

## 🐛 Problemas Conocidos y Soluciones

### **Problema 1: Perfil no se abre**
**Causa**: Ruta no está correctamente anidada  
**Solución**: Verificar que en `App.tsx` la ruta sea:
```tsx
<Route path="/animales" element={<AnimalsListPage />}>
  <Route path=":id" element={<AnimalProfilePage />} />
</Route>
```

### **Problema 2: Lista se recarga al volver**
**Causa**: `<Outlet />` no está en `AnimalsListPage`  
**Solución**: Agregar `<Outlet />` al final del componente

### **Problema 3: Animación no funciona**
**Causa**: Tailwind no tiene las animaciones configuradas  
**Solución**: Verificar `tailwind.config.js` tiene:
```javascript
animation: {
  'slide-in-from-right': 'slideInFromRight 300ms ease-out',
}
```

### **Problema 4: No hay animales para probar**
**Causa**: Base de datos vacía  
**Solución temporal**: 
1. La app usa datos de ejemplo en algunos hooks
2. O conectar Supabase con datos reales
3. Ver `ROADMAP.md` para instrucciones de setup DB

---

## 📱 Testing en Dispositivo Real (Recomendado)

### **Método 1: Usar IP Local**
```bash
# En la terminal, ejecutar:
npm run dev -- --host

# Output mostrará:
# ➜  Network: http://192.168.1.XXX:5173/

# Desde tu móvil:
# Conectar a la misma WiFi
# Abrir navegador
# Navegar a: http://192.168.1.XXX:5173/
```

### **Método 2: Usar ngrok (Túnel)**
```bash
# Instalar ngrok
# npm install -g ngrok

# Ejecutar
ngrok http 5173

# Output:
# Forwarding: https://xxxx.ngrok.io -> http://localhost:5173

# Abrir en cualquier dispositivo:
# https://xxxx.ngrok.io
```

---

## ✨ Criterios de Éxito

### **Must Have (Obligatorio)**
- ✅ Perfil se abre con swipe → "VER"
- ✅ URL cambia a /animales/:id
- ✅ Animación slide-in funciona
- ✅ Botón "Volver" regresa a lista
- ✅ Estado de lista se preserva
- ✅ Información del animal se muestra correctamente

### **Should Have (Deseable)**
- ✅ Animación es fluida (sin lag)
- ✅ Modales integrados funcionan
- ✅ Pestañas responden al clic
- ✅ Botón atrás del navegador funciona

### **Nice to Have (Plus)**
- ⏳ Pestañas Salud y Reproducción con datos reales
- ⏳ Transición de salida mejorada
- ⏳ Prefetch de datos
- ⏳ Caché de perfiles

---

## 📝 Reporte de Testing

### **Template para reportar bugs:**

```markdown
**Título**: [Descripción breve]

**Pasos para reproducir**:
1. 
2. 
3. 

**Resultado esperado**:


**Resultado actual**:


**Navegador**: Chrome 118 / Firefox 119 / Safari 17
**Dispositivo**: Desktop / iPhone 12 / Galaxy S20
**Captura**: [adjuntar si es posible]
```

---

## 🎯 Siguiente Fase: Testing Avanzado

Una vez que la funcionalidad básica esté validada:

1. **Performance Testing**
   - Medir tiempo de carga del perfil
   - Verificar memory leaks
   - Optimizar bundle size

2. **Accessibility Testing**
   - Navegación con teclado
   - Screen readers
   - Contraste de colores

3. **User Testing**
   - Pruebas con usuarios 60+
   - Feedback sobre usabilidad
   - Ajustes basados en observaciones

---

## 🚀 Estado Actual

```
✅ Build exitoso (sin errores)
✅ Servidor de desarrollo corriendo
✅ Documentación completa
✅ Listo para testing manual

📍 Siguiente paso: Probar en navegador
```

---

**¡Ahora sí, a testear!** 🎉

Abre http://localhost:5173/ y sigue la guía paso a paso.
