import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { obtenerDb } from "../db/cliente.ts";
import { migrar } from "../db/migrar.ts";

// En local las migraciones corren solas al arrancar. En Vadeo las corre la tubería.
await migrar(await obtenerDb());
const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => console.log(`API en http://localhost:${port}`));
