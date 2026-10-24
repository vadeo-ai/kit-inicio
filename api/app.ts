import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { autenticacion, log, type Usuario } from "./plataforma.ts";
import { funciones } from "./funciones/index.ts";

type Rutas = Hono<{ Variables: { usuario: Usuario } }>;

// Arma la app con las funciones pedidas. En local van todas juntas; en la nube cada función es su propia Lambda.
export function crearApp(lista: Record<string, Rutas>) {
  const app = new Hono<{ Variables: { usuario: Usuario } }>();
  app.get("/health", (c) => c.json({ ok: true }));
  app.use("/api/*", autenticacion());
  for (const [nombre, rutas] of Object.entries(lista)) app.route(`/api/${nombre}`, rutas);
  app.onError((err, c) => {
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
    log("error", "error no controlado", { ruta: c.req.path, error: String(err) });
    return c.json({ error: "error interno" }, 500);
  });
  return app;
}

export const app = crearApp(funciones);
