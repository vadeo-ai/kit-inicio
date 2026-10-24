import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { tareaCambio, tareaNueva } from "@shared/esquemas/tarea.ts";
import { tareas } from "@db/esquema.ts";
import { obtenerDb } from "@db/cliente.ts";
import { auth, type Usuario } from "../../plataforma.ts";
import { validar } from "../../validar.ts";

// EJEMPLO para copiar: una función de negocio = una carpeta con sus rutas.
export const rutasTareas = new Hono<{ Variables: { usuario: Usuario } }>()
  .get("/", async (c) => {
    const db = await obtenerDb();
    return c.json(await db.select().from(tareas).orderBy(desc(tareas.creadaEn)).limit(200));
  })
  .get("/:id", async (c) => {
    const db = await obtenerDb();
    const [fila] = await db.select().from(tareas).where(eq(tareas.id, c.req.param("id")));
    return fila ? c.json(fila) : c.json({ error: "no existe" }, 404);
  })
  .post("/", validar("json", tareaNueva), async (c) => {
    const db = await obtenerDb();
    const datos = c.req.valid("json");
    const [fila] = await db.insert(tareas)
      .values({ ...datos, id: crypto.randomUUID(), creadaPor: auth(c).id })
      .returning();
    return c.json(fila, 201);
  })
  .patch("/:id", validar("json", tareaCambio), async (c) => {
    const db = await obtenerDb();
    const [fila] = await db.update(tareas)
      .set({ ...c.req.valid("json"), actualizadaEn: new Date() })
      .where(eq(tareas.id, c.req.param("id"))).returning();
    return fila ? c.json(fila) : c.json({ error: "no existe" }, 404);
  })
  .delete("/:id", async (c) => {
    const db = await obtenerDb();
    const borradas = await db.delete(tareas).where(eq(tareas.id, c.req.param("id"))).returning();
    return borradas.length ? c.body(null, 204) : c.json({ error: "no existe" }, 404);
  });
