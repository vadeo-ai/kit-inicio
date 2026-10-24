# Kit de inicio Vadeo

Plantilla abierta para crear apps internas con Claude Code: una carpeta por función de negocio (cada una su Lambda), SQL compatible con Aurora DSQL y una bitácora de decisiones desde el primer commit.

Punto de partida para prototipos que después pasan a producción en Vadeo sin reescribirse.
**React + Vite + TypeScript + Tailwind + shadcn/ui · Hono · Zod · Drizzle · PGlite (local) / Aurora DSQL (nube).**

## Arrancar (no necesitás AWS ni claves)
```bash
npm install
npm run dev          # pantalla en http://localhost:5173 · API en http://localhost:8787
```
Los datos quedan en `.datos/` (Postgres embebido, PGlite). Para empezar de cero, borrá esa carpeta.
El login es simulado: siempre entrás como `demo`.

## Qué hay en cada carpeta
| Carpeta | Qué va |
|---|---|
| `web/` | La pantalla (React). Componentes en `web/src/componentes/ui` (estilo shadcn). |
| `api/` | Una carpeta por función de negocio en `api/funciones/<nombre>/` (rutas + ficha `funcion.yaml`); cada una se empaqueta como su propia Lambda. `api/plataforma.ts` trae login, secretos y logs: no se reescriben. |
| `shared/` | Esquemas Zod: el contrato de datos que usan la pantalla y la API. |
| `db/` | `esquema.ts` (Drizzle) y `migraciones/*.sql` (SQL compatible con DSQL). |
| `pruebas/` | Pruebas; `pruebas/oro/` = casos de negocio (entrada → salida esperada). |
| `docs/decisiones.md` | Bitácora de decisiones (la escribe Claude). |

## Comandos
`npm run verificar` (lo mismo que la CI: SQL compatible con DSQL, fichas de función completas, bitácora sin datos personales, tipos y pruebas) · `npm test` · `npm run build` (pantalla estática en `dist/web`, API para Lambda en `dist/api`: una conjunta y una por función en `dist/api/<función>/`).

## Búsqueda en documentos (opción futura, no incluida)
Si la app necesita buscar por significado en documentos, el camino previsto sin nube es un modelo pequeño de embeddings que corre en la CPU del computador (`multilingual-e5-small` o `bge-small` con `@huggingface/transformers`), guardando los vectores como texto/arreglo en la base y comparándolos en el código (DSQL no tiene pgvector). No viene en la plantilla: si lo necesitás, anotalo en `NOTAS-VADEO.md`.

## Qué pone Vadeo después
Login real, permisos, infraestructura, seguridad, pruebas de carga y el paso a producción. Vos te concentrás en la lógica de negocio; las reglas para Claude están en `CLAUDE.md`.

## Skill de Claude Code
`skill/vadeo-nueva-app/SKILL.md` arranca un proyecto nuevo desde esta plantilla. Instalarla:
`mkdir -p ~/.claude/skills && cp -r skill/vadeo-nueva-app ~/.claude/skills/` y en Claude Code decir "quiero crear una app nueva con la plantilla de Vadeo".

## Qué trae el kit
- La plantilla (este repo) con un ejemplo completo: `tareas`.
- La skill de Claude Code `skill/vadeo-nueva-app`.
- `scripts/lint-sql-dsql.mjs`: revisa que el SQL sea compatible con Aurora DSQL y con las reglas de la plantilla.
- `db/migrar.ts`: migrador que funciona en DSQL (una sentencia por transacción, sin tablas con SERIAL) y en PGlite/Postgres.

## Licencia
Apache-2.0 (ver `LICENSE`).
