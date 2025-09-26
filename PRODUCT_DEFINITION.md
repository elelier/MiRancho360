# **MiRancho360 - Definición de Producto**

## **📋 Información General del Proyecto**

| Campo | Valor |
|-------|-------|
| **Nombre del Producto** | MiRancho360 |
| **Versión Actual** | v1.0.0 MVP |
| **Fecha de Inicio** | Septiembre 2025 |
| **Stack Técnico** | React 19 + TypeScript + Tailwind CS### **🟡 En Desarrollo (25%)**
- ✅ **US-1.1**: Registro y Perfil del Animal - **COMPLETADO** ⚡
  - Campos obligatorios: ID único, Raza, Sexo, Fecha nacimiento ✅
  - Campos opcionales: Foto, Peso, Notas, Genealogía ✅  
  - Estado del animal: Activo, Vendido, Muerto ✅
  - Validaciones completas del formulario ✅
- 🟡 CRUD de sitios (estructura base)
- 🟡 Conexión completa con Supabase

### **❗ Crítico Pendiente (10%)**
- **Funcionalidad Offline** - Máxima prioridad
- PWA configuration
- Service Workers
- Sincronización de datosse |
| **Estado Actual** | 70% MVP - Base sólida implementada |

---

## **🎯 Visión del Producto**

> **"Convertirnos en el asistente digital indispensable para la familia ganadera, empoderándolos con datos claros y herramientas sencillas para preservar su legado, asegurar la rentabilidad y facilitar la transición del conocimiento entre generaciones."**

### **Problema a Resolver**
Los ranchos familiares de pequeña y mediana escala dependen de registros manuales y gestión basada en la memoria, lo que genera:
- Pérdida de información crítica
- Dificultad para tomar decisiones basadas en datos
- Problemas de transferencia de conocimiento entre generaciones
- Falta de control financiero y operativo

### **Solución Propuesta**
Una plataforma digital integral (móvil y web) que centraliza toda la información del rancho en una herramienta intuitiva y fácil de usar.

---

## **👥 Usuarios Clave (Personas)**

### **🧔 Don Carlos - Dueño del Rancho (65 años)**
- **Perfil**: Propietario experimentado, tradicional, con conocimiento empírico profundo
- **Metas**:
  - Asegurar la rentabilidad y sostenibilidad del rancho
  - Simplificar la administración para reducir el estrés
  - Tener visibilidad completa de su operación
  - Dejar un negocio organizado para su familia
- **Frustraciones**:
  - Olvida fechas importantes (vacunas, partos)
  - Le cuesta llevar las cuentas al día
  - La información está dispersa en libretas y memoria
  - No puede supervisar todo eficientemente
- **Necesidades Tecnológicas**:
  - **Botones grandes y texto legible** ✅ (Implementado)
  - Flujos de trabajo muy simples ✅ (Implementado)
  - Utilidad por encima de la complejidad ✅ (Implementado)

### **👨‍🌾 Javier - Trabajador del Rancho (30 años)**
- **Perfil**: Empleado de confianza, usa smartphone básico, trabaja en el campo
- **Metas**:
  - Cumplir con sus tareas diarias de manera eficiente
  - Recibir instrucciones claras
  - Reportar problemas o eventos importantes rápidamente
- **Frustraciones**:
  - Malentendidos en instrucciones verbales
  - No tiene historial fácil de consultar sobre animales
  - Necesita registrar eventos mientras está en el campo
- **Necesidades Tecnológicas**:
  - **Funcionalidad offline** ❗ (Pendiente - Crítico)
  - Consumo mínimo de datos ⚠️ (A implementar)
  - Registro rápido de eventos ✅ (Base implementada)

---

## **🚫 No Negociables del Producto**

### **1. Usabilidad Extrema**
- Interfaz ultra-simple para usuarios no tecnológicos
- Botones grandes (mínimo 44px) ✅
- Texto legible (mínimo 16px) ✅
- Máximo 3 clics para cualquier acción común
- Flujos de trabajo lineales y predecibles

### **2. Funcionalidad Offline**
- **CRÍTICO**: La app móvil debe funcionar 100% sin internet ❗
- Sincronización automática cuando se recupere conexión
- Almacenamiento local confiable
- Indicadores claros del estado de sincronización

### **3. Multiplataforma**
- Aplicación web responsiva (tablets/computadoras) ✅
- Aplicación nativa Android (prioridad alta) ❗
- PWA como respaldo ⚠️

### **4. Seguridad y Confiabilidad**
- Autenticación segura (PIN implementado) ✅
- Copias de seguridad automáticas ✅
- Datos encriptados en tránsito y reposo
- Recuperación ante desastres

---

## **🚀 Épicas del Producto**

### **Epic 1: Núcleo de Gestión de Ganado** 
*Prioridad Alta - MVP* ⚡

**Objetivo**: Crear un inventario digital completo y un historial de vida para cada animal.

**Estado Actual**: 🟡 60% - Base implementada, falta conectar servicios

#### **User Stories**

**🐄 US-1.1: Registro y Perfil del Animal**
- **Como** dueño, **quiero** crear un perfil único para cada animal, **para** tener un inventario centralizado.
- **Estado**: ✅ **COMPLETADO** - 25 Sep 2025 🎉
- **Criterios de Aceptación**:
  - [x] ID único (arete/tatuaje/nombre) ✅
  - [x] Campos obligatorios: Raza, Sexo, Fecha de Nacimiento ✅  
  - [x] Campos opcionales: Peso, Notas, Genealogía ✅
  - [x] Estados: Activo, Vendido, Muerto ✅
  - [x] Validaciones de formulario ✅
  - [x] Migración BD ejecutada exitosamente ✅
  - [x] **PROBADO EN PRODUCCIÓN** - Creación exitosa ✅
- **Archivos Implementados**: 
  - `src/pages/AnimalFormPage.tsx` ✅
  - `src/services/animals.ts` ✅
  - `src/types/animals.ts` ✅
  - `database/migrations/001_add_estado_field.sql` ✅
- **Problemas Resueltos**:
  - ✅ Error UUID usuario temporal
  - ✅ Navegación desde UI
  - ✅ Políticas RLS de Supabase

**💉 US-1.2: Seguimiento de Salud y Tratamientos**
- **Como** encargado, **quiero** registrar tratamientos médicos, **para** mantener historial de salud.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Eventos de salud por animal
  - [ ] Tipos: Vacuna, Tratamiento, Desparasitación
  - [ ] Campos: Producto, Dosis, Fecha, Notas
  - [ ] Recordatorios automáticos para próximas dosis
  - [ ] Historial cronológico por animal
- **Archivos a Crear**: 
  - `src/components/animals/HealthEventModal.tsx`
  - `src/hooks/useHealthEvents.ts`

**🐂 US-1.3: Gestión del Ciclo Reproductivo**
- **Como** dueño, **quiero** registrar montas y calcular fechas clave, **para** optimizar la reproducción.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Registro de eventos de monta (Hembra + Macho)
  - [ ] Cálculo automático de fechas:
    - Confirmación de preñez (45 días)
    - Fecha estimada de parto (gestación por especie)
  - [ ] Vinculación madre-cría al nacer
  - [ ] Árbol genealógico automático
  - [ ] Calendario de eventos reproductivos
- **Archivos a Crear**: 
  - `src/components/animals/ReproductiveModal.tsx`
  - `src/hooks/useReproduction.ts`
  - `src/utils/pregnancyCalculator.ts`

---

### **Epic 2: Gestión de Parcelas y Pastoreo**
*Prioridad Alta - MVP* ⚡

**Objetivo**: Optimizar el uso de la tierra y controlar la ubicación del ganado.

**Estado Actual**: 🟡 40% - Estructura básica de sitios implementada

#### **User Stories**

**🗺️ US-2.1: Mapa Interactivo del Rancho**
- **Como** dueño, **quiero** un mapa visual del rancho, **para** tener referencia geográfica.
- **Estado**: 🟡 En desarrollo
- **Criterios de Aceptación**:
  - [ ] Vista esquemática simple del rancho
  - [ ] Dibujar y nombrar parcelas y corrales
  - [ ] No requiere GPS preciso - representativo
  - [ ] Vista responsive para móvil/tablet
- **Archivos Relacionados**: 
  - `src/pages/SitesPage.tsx` ✅
  - `src/services/sites.ts` ✅

**🚛 US-2.2: Asignación y Movimiento de Animales**
- **Como** encargado, **quiero** mover lotes de animales entre parcelas, **para** reflejar la operación diaria.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Selección múltiple de animales
  - [ ] Asignación a parcelas
  - [ ] Vista por parcela de animales contenidos
  - [ ] Interfaz drag & drop (versión web)
  - [ ] Historial de ubicaciones por animal
- **Archivos a Crear**: 
  - `src/components/sites/AnimalAssignmentModal.tsx`
  - `src/hooks/useAnimalMovements.ts`

**📊 US-2.3: Control de Carga y Rotación**
- **Como** dueño, **quiero** saber la carga animal por parcela, **para** gestionar el pastoreo.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Contador visual en cada parcela
  - [ ] Historial de ocupación por parcela
  - [ ] Alertas de sobrecarga (opcional)
  - [ ] Tiempo de permanencia por lote
- **Archivos a Crear**: 
  - `src/components/sites/LoadIndicator.tsx`
  - `src/hooks/usePastureRotation.ts`

---

### **Epic 3: Administración Financiera**
*Prioridad Alta - MVP* ⚡

**Objetivo**: Visión clara y sencilla de la salud financiera del rancho.

**Estado Actual**: ⚪ 0% - No iniciado

#### **User Stories**

**💰 US-3.1: Registro de Gastos Simplificado**
- **Como** dueño, **quiero** registrar gastos categorizados, **para** saber en qué se invierte el dinero.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Formulario simple: Fecha, Monto, Descripción
  - [ ] Categorías predefinidas: Alimento, Medicinas, Combustible, Salarios
  - [ ] Opción de crear categorías personalizadas
  - [ ] Foto de factura/recibo adjunta
  - [ ] Validaciones de monto y fecha
- **Archivos a Crear**: 
  - `src/pages/ExpensesPage.tsx`
  - `src/components/finances/ExpenseForm.tsx`
  - `src/services/finances.ts`
  - `src/types/finances.ts`

**📈 US-3.2: Registro de Ingresos**
- **Como** dueño, **quiero** registrar ventas, **para** control preciso de ingresos.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Registro automático al marcar animal "Vendido"
  - [ ] Otros ingresos: leche, queso, cosechas
  - [ ] Vinculación ingreso-animal cuando aplique
  - [ ] Campos: Fecha, Monto, Concepto, Notas
- **Archivos a Crear**: 
  - `src/components/finances/IncomeForm.tsx`
  - `src/hooks/useIncomes.ts`

**📊 US-3.3: Dashboard de Rentabilidad**
- **Como** dueño, **quiero** un panel de ingresos y gastos, **para** entender la rentabilidad.
- **Estado**: ⚪ Pendiente
- **Criterios de Aceptación**:
  - [ ] Resumen mensual: Ingresos vs Gastos
  - [ ] Gráfico de pastel: Gastos por categoría
  - [ ] Gráfico de barras: Rentabilidad últimos 6 meses
  - [ ] Indicadores clave: Margen, ROI básico
- **Archivos a Crear**: 
  - `src/components/finances/ProfitabilityDashboard.tsx`
  - `src/hooks/useFinancialMetrics.ts`

---

### **Epic 4: Gestión de Inventarios y Recursos**
*Prioridad Media - Post MVP* 🔄

**Estado Actual**: ⚪ 0% - Planificado para v2.0

#### **User Stories**

**📦 US-4.1: Inventario de Insumos**
- **Como** encargado, **quiero** controlar existencias de alimentos y medicinas, **para** evitar desabastecimiento.

**🔧 US-4.2: Catálogo de Herramientas y Mantenimiento**
- **Como** dueño, **quiero** registro de herramientas y mantenimiento, **para** planificar reparaciones.

---

### **Epic 5: Operaciones y Tareas**
*Prioridad Media - Post MVP* 🔄

**Estado Actual**: ⚪ 0% - Planificado para v2.0

#### **User Stories**

**✅ US-5.1: Asignador de Tareas**
- **Como** dueño, **quiero** crear y asignar tareas con fechas límite, **para** organizar el trabajo.

**📅 US-5.2: Calendario Unificado del Rancho**
- **Como** dueño, **quiero** calendario integrado de eventos y tareas, **para** visión completa de planificación.

---

## **📈 Roadmap de Desarrollo**

### **🎯 Fase 1 - MVP Core (4-6 semanas)**
- [ ] **Epic 1**: Gestión completa de ganado (3 user stories)
- [ ] **Epic 2**: Parcelas y movimientos básicos (2 user stories)  
- [ ] **Epic 3**: Finanzas básicas (2 user stories)
- [ ] **Funcionalidad Offline**: PWA + Service Workers

### **🚀 Fase 2 - App Nativa (3-4 semanas)**
- [ ] Aplicación Android nativa
- [ ] Sincronización robusta
- [ ] Notificaciones push
- [ ] Cámara integrada

### **📊 Fase 3 - Avanzado (6-8 semanas)**
- [ ] **Epic 4**: Inventarios y recursos
- [ ] **Epic 5**: Operaciones y tareas
- [ ] Reportes avanzados
- [ ] Integraciones externas

---

## **🏗️ Estado Técnico Actual**

### **✅ Implementado (70%)**
- Arquitectura React + TypeScript + Supabase ✅
- Sistema de autenticación con PIN ✅
- Base de datos completa (schema SQL) ✅
- Diseño UX optimizado para usuarios 60+ ✅
- Estructura de componentes y servicios ✅
- Routing y navegación ✅

### **🟡 En Desarrollo (20%)**
- CRUD de animales (formularios básicos)
- CRUD de sitios (estructura base)
- Conexión completa con Supabase

### **❗ Crítico Pendiente (10%)**
- **Funcionalidad Offline** - Máxima prioridad
- PWA configuration
- Service Workers
- Sincronización de datos

---

## **🎨 Design System - Paleta "Rancho Natural"**

### **Colores Base**
```css
:root {
  /* Verde Dusty - Pastizales y entornos naturales */
  --primary-500: #97B982;
  --primary-600: #7FA669;
  --primary-700: #679350;
  
  /* Amarillo Tierra - Contraste para acciones importantes */
  --accent-500: #C5A34A;
  --accent-600: #B08F3D;
  
  /* Fondo calmado y accesible */
  --background: #F0F4EF;
}
```

### **Principios de Diseño**
- **Sin gradientes** - Colores sólidos y limpios ✅
- **Paleta natural** que refleja pastizales ✅  
- **Alta legibilidad** para usuarios 60+ ✅
- **Botones grandes** mínimo 44px ✅
- **Texto legible** mínimo 16px ✅

---

## **📱 Consideraciones Técnicas**

### **Performance**
- Carga inicial < 3 segundos
- Transiciones fluidas < 300ms
- Optimización de imágenes automática

### **Accesibilidad**
- Contraste mínimo AA (4.5:1) ✅
- Navegación por teclado completa
- Screen reader friendly
- Textos alternativos en imágenes

### **Seguridad**
- Autenticación multi-factor (PIN + biometría futura)
- Encriptación end-to-end de datos sensibles
- Backup automático diario
- Logs de auditoría de cambios

### **Escalabilidad**
- Arquitectura modular para crecimiento ✅
- Base de datos normalizada ✅
- APIs REST bien documentadas ✅
- Cache inteligente para offline

---

**Última Actualización**: 25 de Septiembre de 2025  
**Próxima Revisión**: Cada sprint (2 semanas)

---

*Este documento vive y evoluciona con el producto. Todas las decisiones de desarrollo deben alinearse con esta definición.*