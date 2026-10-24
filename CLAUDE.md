# Reglas para Claude en este proyecto (plantilla Vadeo)
Stack fijo: React + Vite + TS + Tailwind + shadcn (`web/`) · Hono en TS (`api/`) · Zod (`shared/`) · Drizzle sobre PGlite local / Aurora DSQL en Vadeo (`db/`). `npm run dev` levanta todo sin AWS.

1. Usá el stack de la plantilla; no agregues frameworks, servidores ni Docker.
2. Copiá el patrón del ejemplo (`api/funciones/tareas`, `web/src/App.tsx`, `shared/esquemas/tarea.ts`) para cada función nueva.
3. Todo dato que entra se valida con un esquema Zod de `shared/` (la pantalla y la API usan el mismo).
4. La base: SQL a mano en `db/migraciones/NNNN_nombre.sql` + tabla en `db/esquema.ts`. Sin FOREIGN KEY (regla de Vadeo, ver 5), sin SERIAL/secuencias (id = `crypto.randomUUID()`), índices con `CREATE INDEX ASYNC`, una sentencia DDL por bloque (`--- siguiente`), transacciones < 3.000 filas. Nunca `drizzle-kit migrate/push`. `npm run lint:sql` lo revisa.
5. **Forma en la base, relaciones en el código:** NOT NULL, CHECK, UNIQUE y PK van en el SQL; si una tabla apunta a otra, validá que el padre exista en la misma transacción, borrá hijos→padre juntos (o respondé 409) y anotá la relación en `RELACIONES.md` con su prueba.
6. Nada en disco ni en memoria entre llamadas (la función puede apagarse).
7. No escribas login, permisos ni manejo de claves: usá `auth(c)` y `secreto()` de `api/plataforma.ts`. Datos de otras apps: solo por la API de datos de Vadeo, nunca conectándote a su base.
8. Nada de claves, correos ni datos reales en el código, en `.env` subido ni en las pruebas.
9. Cuando una regla de negocio funcione, guardá un caso en `pruebas/oro/` (entrada + salida esperada) y corré `npm run verificar`.
10. Si algo no se puede hacer con estas reglas, hacelo igual y dejá una nota en `NOTAS-VADEO.md`: no te frenes.

## Por servicios: una función = una carpeta = una Lambda
Cada función de negocio vive en `api/funciones/<nombre>/` con `rutas.ts` (exporta `rutas<Nombre>`) y `funcion.yaml`: nombre, frase (qué hace, en una línea), dueno_rol, clase (`negocio` = regla del negocio · `interfaz` = pantalla/conector · `plataforma` = transversal, la pone Vadeo), nivel_propuesto (N0–N3), datos, depende_de, reutilizable (no|propuesta|aprobada), version; contrato y ejemplos son opcionales. Registrala en `api/funciones/index.ts`. Una función no importa el código de otra: si la necesita, la anota en `depende_de` y la llama por su API. `npm run lint:funciones` revisa las fichas; `npm run build` arma una Lambda por función.

## Bitácora de decisiones (obligatoria desde el primer commit)
Cuando tomes con la persona una decisión que cambia el comportamiento o cierra una opción, agregá **al final** de `docs/decisiones.md` (no lo releas entero) una entrada de máx. 5 líneas:
`#NNN · tipo (técnica|negocio|estratégica) · N0–N3` — **Decisión** · **Por qué** · **Descartada** · **Regla** (si aplica) · **Quién** (rol, nunca nombre ni correo). Si falta el porqué, preguntá una vez por sesión, en una línea y con opciones; si no contesta, escribí "por qué: sin confirmar". Sin datos personales ni cifras reales (la CI lo revisa). Si reemplaza a otra: "reemplaza a #n" y no borres la vieja.
