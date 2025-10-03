# Epic 4: Reportes Exportables

**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Media (MVP - Fase 2)

## Objetivo de la Épica

Implementar funcionalidad de exportación de reportes en formatos PDF y Excel para historial de salud y movimientos de animales. Los reportes deben ser configurables (campos a incluir, rango de fechas) y generarse de manera eficiente.

## Contexto del Negocio

**Problema que resuelve:**  
Los administradores del rancho necesitan generar reportes para compartir con veterinarios, llevar registros oficiales o realizar análisis históricos. Actualmente no existe forma de exportar datos de manera estructurada.

**Valor para el usuario:**
- Reportes profesionales para veterinarios y autoridades
- Histórico de salud y movimientos para análisis de tendencias
- Respaldo de información crítica fuera del sistema
- Cumplimiento de requisitos regulatorios o de gestión
- Compartir información con colaboradores sin acceso al sistema

## Contexto Técnico

**Nuevos componentes a crear:**
- `src/services/export.ts` (lógica de exportación)
- `src/components/reports/ExportModal.tsx` (UI de configuración)
- `src/types/export.ts` (tipos TypeScript)
- Opcional: función serverless si la generación cliente es lenta

**Stack técnico:**
- Cliente: jsPDF (PDF) y SheetJS/xlsx (Excel)
- Alternativa: función serverless para reportes complejos
- Supabase Functions para procesamiento pesado (opcional)

**Bibliotecas recomendadas:**
- `jspdf` + `jspdf-autotable` para PDFs con tablas
- `xlsx` (SheetJS) para archivos Excel
- `date-fns` para formateo de fechas

## Requisitos Funcionales (del PRD)

**FR-4: Reportes exportables**
- FR-4.1: Exportar historial de salud y movimientos por rango de fechas a PDF y Excel
- FR-4.2: Exportación configurable: campos a incluir y rango de fechas

## Criterios de Aceptación

**CA-4 (FR-4):**
- Exportar historial a PDF exitosamente
- Exportar historial a Excel exitosamente
- El archivo descargado contiene las columnas seleccionadas
- El archivo filtra por rango de fechas correctamente
- Generación de reporte < 5 segundos para conjuntos de datos típicos (< 500 registros)

## Requisitos No Funcionales

- **NFR-SEC-1:** No exponer PII en exportaciones por defecto
  - Solicitar confirmación del usuario antes de exportar datos personales
  - Opción de anonimizar datos sensibles
- **NFR-PERF-1:** Generación eficiente de reportes
  - Cliente para reportes pequeños-medianos (< 500 registros)
  - Serverless para reportes grandes o complejos
- **NFR-MNT-1:** Tests unitarios con cobertura  60%

## Historias de Usuario

### Story 4.1: Implementar servicio de exportación y UI
**Como** administrador del rancho  
**Quiero** exportar el historial de salud y movimientos  
**Para** compartirlo con veterinarios o mantener respaldos

**Tareas técnicas:**

#### Parte A: Servicio de exportación

- [ ] Instalar dependencias:
  ```bash
  npm install jspdf jspdf-autotable xlsx date-fns
  ```

- [ ] Crear `src/types/export.ts`:
  ```typescript
  export type ExportFormat = ''pdf'' | ''excel'';
  
  export type ExportConfig = {
    format: ExportFormat;
    dataType: ''health'' | ''movements'';
    dateRange: {
      from: string; // ISO date
      to: string;   // ISO date
    };
    fields: string[]; // columnas a incluir
    includePersonalData: boolean;
  };

  export type ExportData = {
    headers: string[];
    rows: any[][];
    metadata: {
      generatedAt: string;
      dateRange: string;
      totalRecords: number;
    };
  };
  ```

- [ ] Crear `src/services/export.ts`:
  ```typescript
  // Funciones principales:
  // - prepareExportData(config): fetch y formatear datos
  // - exportToPDF(data, config): generar PDF
  // - exportToExcel(data, config): generar Excel
  // - downloadFile(blob, filename): trigger descarga
  ```

- [ ] Implementar `prepareExportData()`:
  - Fetch datos de Supabase según config
  - Filtrar por rango de fechas
  - Seleccionar campos especificados
  - Formatear datos (fechas, números)
  - Anonimizar PII si `includePersonalData: false`

- [ ] Implementar `exportToPDF()`:
  - Usar jsPDF + jspdf-autotable
  - Header: logo/título del rancho
  - Tabla con datos
  - Footer: fecha generación, página
  - Estilos accesibles (contraste, tamaño fuente)

- [ ] Implementar `exportToExcel()`:
  - Usar SheetJS
  - Crear workbook con hoja "Datos"
  - Aplicar estilos básicos (header en negrita)
  - Formatear columnas (fechas, números)

- [ ] Tests unitarios:
  - prepareExportData con datos mock
  - Verificar filtrado por fechas
  - Verificar selección de campos
  - Verificar anonimización PII

#### Parte B: UI de configuración

- [ ] Crear `src/components/reports/ExportModal.tsx`:
  - Selector de formato (PDF / Excel)
  - Selector de tipo de datos (Salud / Movimientos)
  - Date range picker (desde - hasta)
  - Checklist de campos a incluir
  - Toggle "Incluir datos personales" con advertencia
  - Botones: "Cancelar" / "Exportar"

- [ ] Integrar modal en páginas relevantes:
  - `src/pages/HealthDashboardPage.tsx`  botón "Exportar"
  - Vista de movimientos  botón "Exportar"

- [ ] Implementar flujo:
  1. Usuario abre modal
  2. Configura opciones
  3. Si incluye PII, mostrar confirmación
  4. Click "Exportar"  mostrar loading
  5. Generar archivo y descargar
  6. Mostrar notificación de éxito

- [ ] Manejo de errores:
  - Datos no disponibles
  - Fallo en generación
  - Timeout (reportes muy grandes)

#### Parte C: Evaluación de enfoque serverless

- [ ] Spike de 1 día: evaluar performance cliente vs servidor
  - Probar con 100, 500, 1000 registros
  - Medir tiempo de generación
  - Medir uso de memoria/CPU
  - Decisión: cliente suficiente o serverless necesario?

- [ ] Si serverless necesario:
  - Crear función Supabase Edge Function
  - Endpoint: POST `/functions/v1/generate-report`
  - Body: ExportConfig
  - Response: blob o URL presigned

**Verificación CA-4:**
- Exportar salud a PDF con 50 registros, 1 mes  descarga exitosa
- Verificar PDF contiene campos seleccionados y fecha correcta
- Exportar movimientos a Excel con campos personalizados  descarga exitosa
- Verificar Excel contiene solo campos solicitados
- Tiempo de generación < 5s

## Dependencias

**Precedentes:**
- Epic 1 (Dashboard): datos de salud disponibles
- Sistema de movimientos existente debe ser accesible

**Bloqueantes:**
- Datos históricos de salud y movimientos en Supabase

**Relacionadas:**
- Epic 3 (Inventario): inventario podría incluirse en reportes futuros

## Estimación y Esfuerzo

- **Parte A (Servicio):** 3-4 días (implementación, tests)
- **Parte B (UI):** 2-3 días (modal, integración, UX)
- **Parte C (Evaluación serverless):** 1 día (spike)
- **Total estimado:** 6-8 días de desarrollo

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Generación lenta en dispositivos móviles | Media | Medio | Evaluar serverless, limitar registros por reporte, mostrar progress |
| Archivos grandes superan memoria disponible | Baja | Alto | Streaming/chunking, límite de registros, serverless para casos extremos |
| Formatos de exportación incorrectos | Media | Bajo | Tests exhaustivos, validación con veterinarios/usuarios |
| Exposición accidental de PII | Baja | Alto | Confirmación explícita, anonimización por defecto, auditoría |

## Definición de Hecho (DoD)

- [ ] Story 4.1 completada y revisada
- [ ] CA-4 verificado (ambos formatos funcionan)
- [ ] Tests unitarios con cobertura  60%
- [ ] Tests de integración con datos reales
- [ ] Performance aceptable (< 5s para 500 registros)
- [ ] Confirmación PII implementada
- [ ] Documentación de uso actualizada
- [ ] Sin regresiones en funcionalidad existente

## Tipos de Reportes Soportados

### Reporte de Salud

**Campos disponibles:**
- ID Animal
- Nombre Animal
- Fecha Evento
- Tipo Evento (vacunación, enfermedad, tratamiento)
- Descripción
- Veterinario
- Medicamentos aplicados
- Costo
- Próxima acción
- Notas

**Opciones de filtrado:**
- Rango de fechas
- Tipo de animal
- Tipo de evento

### Reporte de Movimientos

**Campos disponibles:**
- ID Animal
- Nombre Animal
- Fecha Movimiento
- Sitio Origen
- Sitio Destino
- Motivo
- Usuario que registró
- Notas

**Opciones de filtrado:**
- Rango de fechas
- Sitio específico
- Tipo de animal

## UI/UX del Modal de Exportación

```

  Exportar Reporte              []       

                                          
 Tipo de datos:                           
  Historial de Salud                     
  Movimientos de Animales                
                                          
 Formato:                                 
 [PDF ]                                  
                                          
 Rango de fechas:                         
 Desde: [ 01/09/2025]                   
 Hasta: [ 02/10/2025]                   
                                          
 Campos a incluir:                        
  Nombre Animal                          
  Fecha                                  
  Tipo de Evento                         
  Descripción                            
  Costo                                  
  Veterinario                            
                                          
  Datos personales:                     
  Incluir información personal           
    (requiere confirmación)               
                                          
           [Cancelar]  [Exportar]         

```

## Ejemplo de PDF Generado

```

   MiRancho360                         
  Reporte de Historial de Salud         
                                        
  Fecha: 02/10/2025                     
  Rango: 01/09/2025 - 02/10/2025        
  Total registros: 23                   

                                        
  Nombre    Fecha      Tipo    Desc.   
     
  Vaca #12  15/09/25  Vacuna  Anual    
  Toro #3   20/09/25  Revisa  Rutina   
  ...                                   
                                        

  Generado por MiRancho360    Pág 1/2  

```

## Consideraciones de Seguridad (NFR-SEC-1)

**Datos considerados PII:**
- Nombres de usuarios/veterinarios
- Datos de contacto
- Costos específicos
- Ubicaciones precisas

**Flujo de confirmación:**
1. Usuario selecciona "Incluir información personal"
2. Modal de advertencia:
   ```
    Advertencia de Privacidad
   
   El reporte incluirá información personal como nombres,
   costos y ubicaciones. Solo comparta este archivo con
   personas autorizadas.
   
   ¿Desea continuar?
   
   [No, remover datos]  [Sí, incluir]
   ```
3. Auditoría: registrar en log quién exportó datos con PII

## Referencias

- **PRD:** `docs/prd/PRD.md`
- **Requisitos Funcionales:** `docs/prd/requisitos-funcionales-fr.md`
- **Criterios de Aceptación:** `docs/prd/criterios-de-aceptacin-ca-mapeados-por-fr.md`
- **Requisitos No Funcionales:** `docs/prd/requisitos-no-funcionales-nfr.md`
- **APIs y Servicios:** `docs/prd/apis-y-servicios-a-crearmodificar.md`
- **Arquitectura:** `docs/architecture/architecture.md`
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`

## Notas Adicionales

- Considerar límite de 1000 registros por reporte en MVP
- Para reportes más grandes, sugerir filtrado adicional
- Futuras mejoras: reportes programados, envío por email
- Explorar templates personalizables en fases posteriores
