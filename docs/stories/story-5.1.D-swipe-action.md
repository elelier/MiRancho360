# Story 5.1.D: Crear Componente SwipeAction

**Epic:** Epic 5 - UX / Accesibilidad  
**Story ID:** 5.1.D  
**Fecha:** 2 de octubre de 2025  
**Estado:** Planificado  
**Prioridad:** Baja (Opcional para MVP)  
**Estimación:** 1 día

## Objetivo

Crear componente para acciones de deslizamiento (swipe) en listas, optimizado para táctil. Permite revelar acciones secundarias (editar, eliminar) sin ocupar espacio visual permanente.

## Valor para el Usuario

- Interfaz limpia sin botones extra en cada fila
- Gesto natural en móvil (swipe para revelar)
- Alternativa de botón para desktop/accesibilidad
- Feedback visual claro de las acciones disponibles

## Referencias

**PRD:**
- FR-3.2: Lista de animales con acciones rápidas
- FR-5.1: Gestos táctiles optimizados para 60+
- NFR-ACC-3: Alternativas no-táctiles para todas las acciones

**Arquitectura:**
- `docs/architecture/tech-stack.md` (React 18, touch events)
- Ejemplos: iOS Mail (swipe to delete), WhatsApp

## Contexto Técnico

**Componente nuevo:** No existe actualmente  
**Uso anticipado:** Listas de animales, sitios, recordatorios  
**Considera:** Biblioteca como `react-swipeable` o implementación custom

## Tareas

1. Investigar opciones: react-swipeable vs custom implementation
2. Crear componente SwipeAction con soporte para:
   - 1-3 acciones por lado (izquierda/derecha)
   - Colores por tipo de acción (editar=azul, eliminar=rojo)
   - Threshold de activación (50% del ancho)
3. Implementar fallback para desktop (botón de "" que abre menú)
4. Tests: gestos touch, navegación teclado, accesibilidad
5. Documentación con ejemplos de uso

## Criterios de Aceptación

1. **Swipe en móvil:**
   - Deslizar a la izquierda revela acciones (editar, eliminar)
   - Threshold claro (50%) para activar acción
   - Animación suave (300ms)
   - Tap fuera cierra las acciones

2. **Fallback desktop:**
   - Botón "" visible en hover
   - Abre menú con mismas acciones
   - Navegable por teclado

3. **Accesibilidad:**
   - Lectores de pantalla anuncian acciones disponibles
   - Navegación por teclado funciona
   - Alternativa a gestos siempre disponible

4. **Visual:**
   - Colores del tema Rancho Natural
   - Iconos claros ( editar,  eliminar)
   - Área táctil 44x44px por acción

## Validación

**Manual:**
- Probar en móvil real (Android/iOS)
- Probar con teclado (Tab, Enter)
- Probar con lector de pantalla

**Automatizada:**
```bash
npm test -- SwipeAction.test.tsx
npm run lighthouse
```

## Dependencias

**Opcional:** Ninguna (puede implementarse después del MVP)

## Notas

- **MVP:** Este componente es opcional, listas pueden funcionar sin él
- **Alternativa simple:** Usar botones normales si el tiempo es corto
- **Prioridad:** Si hay presión de tiempo, posponer para MVP2

---

**Creado por:** Bob (Scrum Master)  
**Listo para desarrollo:** 
