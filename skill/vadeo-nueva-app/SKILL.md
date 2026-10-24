---
name: vadeo-nueva-app
description: Arranca un prototipo nuevo con la plantilla de app de Vadeo (React + Hono + Drizzle, corre local sin AWS). Usar cuando la persona quiere crear una app, prototipo o herramienta interna nueva "para llevar a Vadeo", o pide "la plantilla de Vadeo".
---

# Nueva app con la plantilla Vadeo

Hablale a la persona en lenguaje de negocio, sin jerga. Son pocos pasos; no te saltes el 1.

## 1. Preguntar qué quiere hacer (una sola ronda, máx. 4 preguntas)
1. ¿Qué problema resuelve la app y para quién? (una frase)
2. ¿Cómo sabrás que funcionó? (objetivo medible: "pasar de 2 días a 2 horas", "cero errores de digitación")
3. ¿Qué se parece más? **a)** formularios y listas (registrar, aprobar, consultar) · **b)** tablero con cifras y gráficos · **c)** un asistente que lee documentos o responde preguntas · **d)** otra cosa
4. Nombre corto de la app (minúsculas, sin tildes, p. ej. `viaticos`).

> **Servicios del catálogo (HUECO, aún no existe):** aquí la skill mostrará los servicios que el cliente ya tiene activos en Vadeo (identidad, API de datos, conectores) para conectarlos en vez de construirlos. Hoy no hay catálogo: no ofrezcas ninguno ni inventes nombres; si la persona menciona datos de otro sistema, anotalo en `NOTAS-VADEO.md` como "dato externo: <cuál>".

## 2. Bajar la plantilla
Requisitos: Node 22+ y git. Si `gh` está autenticado con acceso a la plantilla:
```bash
gh repo create <nombre> --private --template vadeo-ai/kit-inicio --clone && cd <nombre>
```
Si no hay `gh` o no tiene acceso a esa org (lo normal fuera de Vadeo), usá la copia que te entregó Vadeo:
```bash
npx degit vadeo-ai/kit-inicio <nombre>   # o descomprimí el .zip entregado
cd <nombre> && git init -b main
```
Luego: `npm install` y cambiá `"name"` en `package.json` por `<nombre>`.

## 3. Primera entrada de la bitácora
Agregá al final de `docs/decisiones.md` la entrada `#002 · negocio · N0` con el objetivo medible de la pregunta 2 (por rol, sin nombres). Hacé el primer commit.

## 4. Explicar cómo arrancar (decíselo así)
- "Escribí `npm run dev` y abrí http://localhost:5173. Ya hay un ejemplo de **tareas** que funciona: crear, cambiar estado y borrar."
- "Los datos quedan en tu computador (carpeta `.datos/`); no hace falta AWS, Docker ni claves. El login es de mentira (usuario `demo`) y Vadeo lo cambia por el real."
- "Pedime lo que necesitás en tus palabras; yo copio el patrón del ejemplo."

## 5. Según el tipo (pregunta 3)
- **a) formularios:** reemplazá `tareas` por la entidad real siguiendo `CLAUDE.md` regla 2 (esquema Zod → tabla + migración → carpeta en `api/funciones/` con rutas y `funcion.yaml` → pantalla → caso de oro).
- **b) tablero:** agregá `recharts`; las consultas son de solo lectura. Si los datos vienen de otro sistema, usá datos de muestra en `pruebas/` y anotalo en `NOTAS-VADEO.md`.
- **c) asistente/IA:** dejá el ejemplo y anotá en `NOTAS-VADEO.md` "variante agente". La función agente todavía no está en la plantilla: hacela con el SDK de Anthropic detrás de `secreto("ANTHROPIC_API_KEY")`, prompts en archivos `.md`. Si hace falta buscar en documentos, no uses servicios de embeddings en la nube: seguí "Búsqueda en documentos" del README (modelo local pequeño) y anotalo en `NOTAS-VADEO.md`.
- **d) otra:** seguí la regla 10 de `CLAUDE.md`.

Desde aquí manda `CLAUDE.md` del proyecto. Antes de cada entrega: `npm run verificar`.
