import { beforeAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as esquema from "../db/esquema.ts";
import { usarDbDePrueba } from "../db/cliente.ts";
import { migrar } from "../db/migrar.ts";
import { app } from "../api/app.ts";
import oro from "./oro/tareas.json";

const pedir = (ruta: string, metodo = "GET", cuerpo?: unknown) =>
  app.request(ruta, { method: metodo, headers: { "content-type": "application/json" }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });

beforeAll(async () => {
  const db = drizzle(new PGlite(), { schema: esquema });
  await migrar(db, () => {});
  usarDbDePrueba(db);
});

describe("casos de oro", () => {
  for (const c of oro) it(c.caso, async () => {
    const r = await pedir("/api/tareas", "POST", c.entrada);
    expect(r.status).toBe(c.esperado.status);
    if ("estado" in c.esperado) expect((await r.json()).estado).toBe(c.esperado.estado);
  });
});

describe("CRUD de tareas", () => {
  it("crea, lee, cambia y borra", async () => {
    const creada = await (await pedir("/api/tareas", "POST", { titulo: "Llamar a proveedor" })).json();
    expect((await pedir(`/api/tareas/${creada.id}`)).status).toBe(200);
    const cambiada = await (await pedir(`/api/tareas/${creada.id}`, "PATCH", { estado: "hecha" })).json();
    expect(cambiada.estado).toBe("hecha");
    expect((await pedir(`/api/tareas/${creada.id}`, "DELETE")).status).toBe(204);
    expect((await pedir(`/api/tareas/${creada.id}`)).status).toBe(404);
  });
  it("health responde", async () => expect((await pedir("/health")).status).toBe(200));
});
