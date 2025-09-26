# 🧪 Plan de Pruebas - US-1.1: Registro y Perfil del Animal

## **Estado**: ✅ Implementación Completada - Listo para Pruebas

### **📋 Criterios de Aceptación a Validar**

#### **✅ 1. ID Único (Arete/Tatuaje/Nombre)**
**Test Case 1.1**: Crear animal con arete único
- [x] ~~Navegar a `/animales/nuevo`~~ ✅ **ARREGLADO** - Botones de navegación agregados
- [ ] Ingresar arete válido (ej: "TEST001")  
- [ ] Completar campos obligatorios
- [ ] ~~Verificar que se guarda correctamente~~ 🔧 **EN PROCESO** - Error BD solucionado

**Test Case 1.2**: Validar arete duplicado
- [x] ~~Intentar crear animal con arete existente (ej: "001")~~ ✅ **ARREGLADO** - Error UUID solucionado
- [ ] Verificar que muestra error de validación
- [ ] Confirmar que no se guarda en BD

#### **✅ 2. Campos Obligatorios: Raza, Sexo, Fecha de Nacimiento**
**Test Case 2.1**: Validar campos obligatorios
- [ ] Intentar guardar formulario vacío
- [ ] Verificar mensajes de error para:
  - [ ] Arete vacío
  - [ ] Raza no seleccionada
  - [ ] Fecha de nacimiento vacía
- [ ] Confirmar que no se envía el formulario

**Test Case 2.2**: Validar fecha de nacimiento futura
- [ ] Ingresar fecha futura
- [ ] Verificar mensaje de error
- [ ] Confirmar que no permite guardar

#### **✅ 3. Campos Opcionales: Peso, Notas, Genealogía**
**Test Case 3.1**: Crear animal solo con campos obligatorios
- [ ] Llenar solo arete, raza, sexo, fecha y sitio
- [ ] Dejar vacíos: nombre, peso, padre, madre, observaciones
- [ ] Verificar que se guarda correctamente

**Test Case 3.2**: Crear animal con todos los campos
- [ ] Llenar todos los campos incluidos opcionales
- [ ] Verificar que se guardan todos los datos

#### **✅ 4. Estados: Activo, Vendido, Muerto**
**Test Case 4.1**: Crear animal Activo
- [ ] Seleccionar estado "Activo"
- [ ] Verificar que aparece en listado de animales activos
- [ ] Verificar en BD: `estado='Activo'`, `activo=true`

**Test Case 4.2**: Crear animal Vendido
- [ ] Seleccionar estado "Vendido"
- [ ] Verificar que NO aparece en listado por defecto
- [ ] Verificar en BD: `estado='Vendido'`, `activo=false`
- [ ] Verificar movimiento registrado con motivo "Venta"

**Test Case 4.3**: Crear animal Muerto
- [ ] Seleccionar estado "Muerto"
- [ ] Verificar que NO aparece en listado por defecto
- [ ] Verificar en BD: `estado='Muerto'`, `activo=false`
- [ ] Verificar movimiento registrado con motivo "Muerte"

#### **✅ 5. Validaciones del Formulario**
**Test Case 5.1**: Validar longitud de arete
- [ ] Probar arete muy largo (>20 caracteres)
- [ ] Probar arete muy corto (vacío)
- [ ] Verificar mensajes de error apropiados

**Test Case 5.2**: Validar peso
- [ ] Probar peso negativo
- [ ] Probar peso excesivo (>2000)
- [ ] Probar peso válido (1-2000)

**Test Case 5.3**: Validar nombre
- [ ] Probar nombre muy largo (>100 caracteres)
- [ ] Verificar que se trunca o muestra error

---

## **🚀 Flujo de Prueba Rápida**

### **Scenario A: Animal Activo Completo**
```
1. Abrir http://localhost:5173/
2. Login con PIN: 1234
3. Ir a "Gestión de Animales"
4. Clic "Agregar Animal"
5. Llenar formulario:
   - Arete: "TEST001"
   - Nombre: "Prueba Test"
   - Raza: Seleccionar cualquiera
   - Sexo: Hembra
   - Estado: Activo
   - Fecha: Hoy - 1 año
   - Peso: 350
   - Sitio: Seleccionar cualquiera
   - Observaciones: "Animal de prueba"
6. Clic "Registrar Animal"
7. Verificar que aparece en la lista
```

### **Scenario B: Validaciones de Error**
```
1. Intentar crear animal con arete "001" (existente)
2. Verificar error de duplicado
3. Intentar crear con fecha futura
4. Verificar error de fecha
5. Intentar enviar formulario vacío
6. Verificar múltiples errores de validación
```

---

## **📊 Checklist de Validación Final**

### **Frontend (React)**
- [ ] Formulario renderiza correctamente
- [ ] Todos los campos están presentes
- [ ] Validaciones funcionan en tiempo real
- [ ] Mensajes de error son claros
- [ ] Loading states durante guardado
- [ ] Redirección después de guardar

### **Backend (Supabase)**
- [ ] Animales se guardan en tabla `animales`
- [ ] Campo `estado` se guarda correctamente
- [ ] Campo `activo` se actualiza según estado
- [ ] Movimiento se registra automáticamente
- [ ] Constraints de BD funcionan
- [ ] Filtros por estado funcionan

### **UX/UI**
- [ ] Botones son grandes y accesibles
- [ ] Texto es legible (16px+)
- [ ] Iconos mejoran la comprensión
- [ ] Flujo es intuitivo para usuarios 60+
- [ ] Funciona bien en móvil

---

## **🐛 Errores Conocidos a Verificar**

1. **Problema potencial**: Lista de padres/madres vacía
   - Verificar que aparezcan animales machos para padre
   - Verificar que aparezcan animales hembra para madre

2. **Problema potencial**: Razas no cargan
   - Verificar que hay razas en la BD
   - Verificar que el servicio funciona

3. **Problema potencial**: Sitios no cargan
   - Verificar que hay sitios en la BD
   - Verificar que el servicio funciona

---

**🎯 Objetivo**: Confirmar que la US-1.1 está 100% funcional antes de pasar a US-1.2

**⏱️ Tiempo estimado**: 15-20 minutos de pruebas manuales