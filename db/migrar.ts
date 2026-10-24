import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import type { Db } from "./cliente.ts";

// Migrador propio (no el de drizzle-kit): el de Drizzle crea su tabla con SERIAL y mete todo en una
// transacción con DDL + INSERT, y DSQL no acepta ninguna de las dos cosas. Aquí: una sentencia por
// transacción, separadas en el .sql con la línea "--- siguiente".
const dir = path.resolve(import.meta.dirname, "migraciones");

export async function migrar(db: Db, log = console.log) {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS _migraciones (nombre text PRIMARY KEY, aplicada_en timestamptz NOT NULL DEFAULT now())`);
  const hechas = new Set(((await db.execute(sql`SELECT nombre FROM _migraciones`)) as any).rows.map((r: any) => r.nombre));
  for (const archivo of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    if (hechas.has(archivo)) continue;
    const texto = await readFile(path.join(dir, archivo), "utf8");
    for (const sentencia of texto.split(/^--- siguiente\s*$/m).map((s) => s.trim()).filter(Boolean)) {
      // DSQL exige CREATE INDEX ASYNC; Postgres/PGlite no lo conocen y lo quitamos solo fuera de DSQL.
      await db.execute(sql.raw(process.env.DSQL_ENDPOINT ? sentencia : sentencia.replace(/\bINDEX\s+ASYNC\b/i, "INDEX")));
    }
    await db.execute(sql`INSERT INTO _migraciones (nombre) VALUES (${archivo})`);
    log(`migración aplicada: ${archivo}`);
  }
}
