import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as esquema from "./esquema.ts";

// El motor sale del entorno; el código de negocio no cambia:
//   local (por defecto)  → PGlite en .datos/ (cero instalación)
//   DATABASE_URL         → Postgres normal (Docker, CI)
//   DSQL_ENDPOINT        → Aurora DSQL con token IAM (lo pone la tubería de Vadeo)
// Imports dinámicos: así el paquete de Lambda no arrastra PGlite y local no arrastra el SDK de AWS.
export type Db = PgliteDatabase<typeof esquema> | NodePgDatabase<typeof esquema>;

let db: Promise<Db> | undefined;
export const obtenerDb = (): Promise<Db> => (db ??= crear());

async function crear(): Promise<Db> {
  if (process.env.DSQL_ENDPOINT) {
    const { DsqlSigner } = await import("@aws-sdk/dsql-signer");
    const { Pool } = await import("pg");
    const { drizzle: drizzlePg } = await import("drizzle-orm/node-postgres");
    const host = process.env.DSQL_ENDPOINT;
    const usuario = process.env.DSQL_USUARIO ?? "admin";
    const signer = new DsqlSigner({ hostname: host, region: process.env.AWS_REGION });
    const pool = new Pool({
      host, user: usuario, database: "postgres", port: 5432, ssl: true, max: 2,
      // Token IAM de 15 min: se pide uno nuevo por conexión; DSQL corta conexiones a la hora.
      password: () => (usuario === "admin" ? signer.getDbConnectAdminAuthToken() : signer.getDbConnectAuthToken()),
      idleTimeoutMillis: 10 * 60_000, maxLifetimeSeconds: 50 * 60,
    });
    return drizzlePg(pool, { schema: esquema });
  }
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const { drizzle: drizzlePg } = await import("drizzle-orm/node-postgres");
    return drizzlePg(new Pool({ connectionString: process.env.DATABASE_URL }), { schema: esquema });
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const dir = process.env.PGLITE_DIR ?? ".datos/pglite";
  if (dir !== "memoria") (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const pg = dir === "memoria" ? new PGlite() : new PGlite(dir);
  return drizzlePglite(pg, { schema: esquema });
}

export const usarDbDePrueba = (d: Db) => { db = Promise.resolve(d); };
