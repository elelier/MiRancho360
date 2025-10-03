# Criterios de aceptación (CA) — mapeados por FR

CA-1 (FR-1)
- El Dashboard carga en < 2s en red local y muestra: 1) número de animales con alerta, 2) partos próximos (7d), 3) 3 items pendientes.
- Al pulsar CTA de tarjeta, se navega al detalle correspondiente.

CA-2 (FR-2)
- En primer inicio, el usuario recibe el tour; completar los pasos guía a las pantallas indicadas.

CA-3 (FR-3)
- Crear item de inventario y verificar saldo actualizado tras 3 operaciones consecutivas (creación, consumo, ajuste).

CA-4 (FR-4)
- Exportar historial a PDF y Excel: el archivo descargado contiene las columnas seleccionadas y filtra por rango de fechas.

CA-5 (FR-5)
- Tests de usabilidad con 3 usuarios objetivo muestran que la mayoría completa la tarea «registrar animal» en < 1 min y califica legibilidad ≥ 4/5.

CA-6 (FR-6)
- Usuarios sin rol Admin no pueden crear/editar items de inventario (respuesta 403/API o UI deshabilitada).
