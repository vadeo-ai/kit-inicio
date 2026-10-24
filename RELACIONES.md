# Relaciones entre tablas
La base guarda la **forma** del dato (NOT NULL, CHECK, UNIQUE, PK). Las **relaciones** entre tablas viven en el código (DSQL no garantiza FOREIGN KEY y esta plantilla no las usa). Cada relación lleva su fila aquí y su prueba.

Para cada relación: (a) al escribir el hijo, revisar que el padre exista **en la misma transacción**; (b) al borrar el padre, borrar hijos→padre en una sola transacción o responder 409; (c) al importar o restaurar, rechazar todo el lote si una referencia no cuadra. Referencias a datos de **otra app**: no se validan aquí; las revisa un chequeo de integridad periódico.

| Relación (hijo → padre) | Se valida en (archivo:línea) | Al borrar el padre | Prueba |
|---|---|---|---|
| _(el ejemplo `tareas` no tiene relaciones; agregá la primera aquí)_ | | | |

Pruebas obligatorias por relación: "proceso cortado a mitad" y "escritura concurrente".
